/**
 * Mizan — pipeline orchestration.
 *
 * extract → verify → assess → check → route
 *
 * The ordering is the design. Verification sits between the two model calls so
 * the adjudicating model never sees an unverified quote: a fabricated span is
 * gone before anything reasons over it. Deterministic checks run independently of
 * both models and cannot be overridden by either. Routing runs last, over
 * finished inputs, as a pure function.
 */

import { CAMPAIGNS } from '@/data/corpus';
import { runDeterministicChecks } from './checks';
import {
  DEFAULT_ADJUDICATION_MODEL,
  DEFAULT_EXTRACTION_MODEL,
  addCost,
  callStructured,
  emptyCost,
} from './llm';
import { criteriaFor, getCategory } from './policy';
import {
  ASSESSMENT_SCHEMA,
  ASSESSMENT_SYSTEM,
  AssessmentOutput,
  EXTRACTION_SCHEMA,
  EXTRACTION_SYSTEM,
  ExtractionOutput,
  assessmentUser,
  draftEvidenceRequest,
  extractionUser,
} from './prompts';
import { route } from './routing';
import type {
  Assessment,
  Campaign,
  CriterionAssessment,
  EvidenceItem,
  IntegrityReport,
  RunCost,
} from './types';
import { detectInjection, verifyEvidence } from './verify';

export interface RunOptions {
  extractionModel?: string;
  adjudicationModel?: string;
  fixtures?: Record<string, unknown>;
  forceLive?: boolean;
  /** Campaigns to compare against for duplicate detection. Defaults to the corpus. */
  corpus?: Campaign[];
  /** Capture hook used by scripts/record.ts. Unset in the deployed app. */
  onRecord?: (key: string, data: unknown, cost: RunCost) => void;
}

/** Extraction retries on verification failure before giving up and degrading. */
const MAX_EXTRACTION_RETRIES = 1;

/**
 * Proportion of extracted evidence that must survive span verification for the
 * extraction to be accepted. Below this, something is wrong with the run rather
 * than with one quote, and a retry is cheaper than a bad dossier.
 */
const VERIFICATION_PASS_THRESHOLD = 0.7;

export async function assessCampaign(
  campaign: Campaign,
  opts: RunOptions = {},
): Promise<Assessment> {
  const extractionModel = opts.extractionModel ?? DEFAULT_EXTRACTION_MODEL;
  const adjudicationModel = opts.adjudicationModel ?? DEFAULT_ADJUDICATION_MODEL;
  const fixtures = opts.fixtures ?? {};
  const corpus = opts.corpus ?? CAMPAIGNS;

  let cost: RunCost = emptyCost();
  let mode: 'live' | 'replay' = 'replay';

  // -- Injection scan, before any model sees the text -----------------------
  // Runs first so that a positive result is a fact about the submission,
  // established independently, rather than something inferred from a model that
  // may already have been influenced by the injected text.
  const injection = detectInjection(campaign.sources);

  // -- Stage 1: extraction, with verification-driven retry ------------------
  let extraction: ExtractionOutput = {
    evidence: [],
    inferredCategory: null,
    inferredCategoryReasoning: '',
  };
  let verified: ReturnType<typeof verifyEvidence> = {
    kept: [],
    discardedIds: [],
    hallucinated: [],
  };
  let retries = 0;

  for (let attempt = 0; attempt <= MAX_EXTRACTION_RETRIES; attempt++) {
    const result = await callStructured<ExtractionOutput>(
      {
        stage: attempt === 0 ? 'extract' : `extract_retry${attempt}`,
        subject: campaign.id,
        model: extractionModel,
        system:
          attempt === 0
            ? EXTRACTION_SYSTEM
            : EXTRACTION_SYSTEM +
              '\n\nRETRY: a previous attempt produced quotes that did not occur in the source ' +
              'documents. Copy quotes directly. If you cannot find a supporting sentence for a ' +
              'criterion, emit nothing for it.',
        user: extractionUser(campaign),
        schema: EXTRACTION_SCHEMA as unknown as Record<string, unknown>,
        toolName: 'record_evidence',
        toolDescription: 'Record extracted evidence and the inferred category.',
        maxTokens: 8192,
      },
      fixtures,
      { forceLive: opts.forceLive, onRecord: opts.onRecord },
    );

    cost = addCost(cost, result.cost);
    if (result.mode === 'live') mode = 'live';
    extraction = result.data;

    const items: EvidenceItem[] = (extraction.evidence ?? []).map((e, i) => ({
      id: `E${i + 1}`,
      claim: e.claim,
      confidence: e.confidence,
      span: {
        sourceId: e.sourceId,
        start: 0,
        end: e.quote.length,
        quote: e.quote,
      },
    }));

    verified = verifyEvidence(items, campaign.sources);

    const passRate = items.length === 0 ? 1 : verified.kept.length / items.length;
    if (passRate >= VERIFICATION_PASS_THRESHOLD) break;

    retries = attempt + 1;
    if (attempt === MAX_EXTRACTION_RETRIES) break;
  }

  // Carry the supports/cuts-against polarity through, since it changes how the
  // adjudicating model should read each quote.
  const polarity = new Map<string, boolean>();
  const criterionOf = new Map<string, string>();
  (extraction.evidence ?? []).forEach((e, i) => {
    polarity.set(`E${i + 1}`, e.supportsCriterion);
    criterionOf.set(`E${i + 1}`, e.criterionId);
  });

  const evidenceForAssessment = verified.kept.map((e) => ({
    id: e.id,
    criterionId: criterionOf.get(e.id) ?? 'unknown',
    claim: e.claim,
    quote: e.span.quote,
    supports: polarity.get(e.id) ?? true,
  }));

  // -- Stage 2: assessment --------------------------------------------------
  const category = getCategory(campaign.claimedCategory);
  const criteria = criteriaFor(campaign.claimedCategory);
  const llmCriteria = criteria.filter((c) => c.kind === 'llm');

  let assessments: CriterionAssessment[] = [];

  if (category.posture === 'not_verified') {
    // Skip the model entirely. The badge is unavailable as a policy matter, and
    // spending tokens assessing evidence for a determination that cannot be made
    // either way would be theatre — and would produce a dossier implying the
    // question was open.
    assessments = [];
  } else {
    const result = await callStructured<AssessmentOutput>(
      {
        stage: 'assess',
        subject: campaign.id,
        model: adjudicationModel,
        system: ASSESSMENT_SYSTEM,
        user: assessmentUser(
          campaign,
          criteria,
          evidenceForAssessment,
          extraction.inferredCategory,
        ),
        schema: ASSESSMENT_SCHEMA as unknown as Record<string, unknown>,
        toolName: 'record_assessment',
        toolDescription: 'Record a status for every criterion.',
        maxTokens: 8192,
      },
      fixtures,
      { forceLive: opts.forceLive, onRecord: opts.onRecord },
    );

    cost = addCost(cost, result.cost);
    if (result.mode === 'live') mode = 'live';

    const returned = new Map(result.data.assessments.map((a) => [a.criterionId, a]));

    // Any criterion the model failed to return is insufficient_evidence, not
    // absent. A missing criterion must never silently disappear from a dossier —
    // that would read to a reviewer as "nothing to see here".
    assessments = llmCriteria.map((c) => {
      const a = returned.get(c.id);
      if (!a) {
        return {
          criterionId: c.id,
          status: 'insufficient_evidence' as const,
          reasoning:
            'The assessment stage returned no status for this criterion. Recorded as ' +
            'insufficient evidence so it stays visible rather than dropping out of the dossier.',
          evidenceIds: [],
          confidence: 0.3,
          requestedDocument: c.evidenceExpectation,
        };
      }
      return {
        criterionId: a.criterionId,
        status: a.status,
        reasoning: a.reasoning,
        evidenceIds: a.evidenceIds.filter((id) => verified.kept.some((e) => e.id === id)),
        confidence: a.confidence,
        requestedDocument: a.requestedDocument,
      };
    });
  }

  // -- Deterministic checks -------------------------------------------------
  const checks = runDeterministicChecks(campaign, corpus);

  // -- Confidence -----------------------------------------------------------
  // The minimum, not the mean. A dossier is only as trustworthy as its weakest
  // criterion, and averaging lets nine easy satisfactions bury one shaky
  // blocking judgement — which is exactly the case where a human is needed.
  const confidences = assessments.map((a) => a.confidence);
  const confidence = confidences.length > 0 ? Math.min(...confidences) : 0.5;

  // -- Routing --------------------------------------------------------------
  const routed = route({
    claimedCategory: campaign.claimedCategory,
    inferredCategory: extraction.inferredCategory,
    criteria: assessments,
    checks,
    injectionDetected: injection.detected,
    discardedEvidenceCount: verified.discardedIds.length,
    confidence,
  });

  // -- Evidence request draft ----------------------------------------------
  const gaps = assessments.filter((a) => a.status === 'insufficient_evidence');
  const draftRequest =
    routed.routing === 'evidence_request'
      ? draftEvidenceRequest(
          campaign,
          gaps.map((g) => ({ criterionId: g.criterionId, requestedDocument: g.requestedDocument })),
        )
      : undefined;

  const integrity: IntegrityReport = {
    hallucinatedSpans: verified.hallucinated,
    discardedEvidenceIds: verified.discardedIds,
    injectionDetected: injection.detected,
    injectionDetail: injection.detail,
    extractionRetries: retries,
  };

  return {
    campaignId: campaign.id,
    inferredCategory: extraction.inferredCategory,
    categoryMatchesClaim:
      extraction.inferredCategory === null ||
      extraction.inferredCategory === campaign.claimedCategory,
    evidence: verified.kept,
    criteria: assessments,
    checks,
    routing: routed.routing,
    routingRationale: routed.rationale,
    confidence,
    draftEvidenceRequest: draftRequest,
    integrity,
    cost,
    modelId: adjudicationModel,
    mode,
    generatedAt: new Date().toISOString(),
  };
}
