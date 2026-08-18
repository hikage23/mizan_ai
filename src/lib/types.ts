/**
 * Mizan — core domain types.
 *
 * Design note: every AI-produced assertion in this system is required to carry a
 * `SourceSpan` pointing at the exact characters in a source document that support
 * it. Spans are verified deterministically (see lib/verify.ts) before a dossier is
 * ever shown to a human. An assertion whose span does not literally appear in the
 * cited document is treated as a hallucination and the extraction is failed —
 * not surfaced with a caveat. This is the anti-fabrication backbone of the system.
 */

// ---------------------------------------------------------------------------
// Asnaf — the eight Quranic categories of zakat recipients (Surah At-Tawbah 9:60)
// ---------------------------------------------------------------------------

export const ASNAF_IDS = [
  'fuqara_masakin', // the poor and the needy
  'amilin', // those employed to administer zakat
  'muallafat_qulub', // those whose hearts are to be reconciled
  'riqab', // freeing those in bondage/captivity
  'gharimin', // those burdened by debt
  'fi_sabilillah', // in the path of Allah
  'ibn_sabil', // the stranded traveller
] as const;

export type AsnafId = (typeof ASNAF_IDS)[number];

export type VerificationPosture =
  /** LaunchGood actively verifies campaigns in this category. */
  | 'verified'
  /** Policy excludes this category from verification — badge cannot be granted. */
  | 'not_verified'
  /** Verified only under a narrow carve-out stated in policy. */
  | 'conditional';

export interface AsnafCategory {
  id: AsnafId;
  /** English label used in the reviewer UI. */
  label: string;
  /** Transliterated Arabic term. */
  arabic: string;
  posture: VerificationPosture;
  /** Why the policy takes this posture. Shown to reviewers so the rule is legible. */
  postureRationale: string;
  /** Contemporary reading the policy applies, where the classical term needs one. */
  contemporaryReading?: string;
  criteria: Criterion[];
}

// ---------------------------------------------------------------------------
// Criteria — the machine-checkable unit of the policy
// ---------------------------------------------------------------------------

export type CriterionKind =
  /** Judged by a model against extracted evidence. */
  | 'llm'
  /** Computed in code from structured fields. No model involved, no discretion. */
  | 'deterministic';

export type CriterionSeverity =
  /** Failure means the campaign cannot carry the badge. Full stop. */
  | 'blocking'
  /** Failure is a serious concern a human must weigh. */
  | 'material'
  /** Strengthens or weakens the case but does not decide it. */
  | 'supporting';

export interface Criterion {
  id: string;
  /** The requirement, phrased as a claim that is either supported or not. */
  text: string;
  kind: CriterionKind;
  severity: CriterionSeverity;
  /**
   * What a reviewer would accept as proof. Drives the "missing evidence" list
   * and the evidence-request email draft — arguably the system's highest-value
   * output, since most real cases fail on documentation rather than substance.
   */
  evidenceExpectation: string;
}

export type CriterionStatus =
  | 'satisfied'
  | 'contradicted'
  /**
   * A first-class outcome, not a failure of the system. Most genuine cases land
   * here. The correct response is to ask the organizer for a specific document,
   * never to reject.
   */
  | 'insufficient_evidence'
  /** Criterion does not apply given the campaign's structure. */
  | 'not_applicable';

// ---------------------------------------------------------------------------
// Source documents and evidence
// ---------------------------------------------------------------------------

export type SourceKind =
  | 'campaign_narrative'
  | 'budget_breakdown'
  | 'org_registration'
  | 'organizer_profile'
  | 'website_capture'
  | 'financial_statement'
  | 'prior_campaign'
  | 'beneficiary_documentation'
  | 'correspondence';

export interface SourceDocument {
  id: string;
  kind: SourceKind;
  title: string;
  /** Full text. Spans index into this string. */
  text: string;
  /** Where this came from — a URL, an upload, a system of record. */
  provenance: string;
  /** ISO date the document was captured/uploaded. Staleness matters for web captures. */
  capturedAt: string;
  language?: string;
}

export interface SourceSpan {
  sourceId: string;
  /** Inclusive start index into SourceDocument.text. */
  start: number;
  /** Exclusive end index. */
  end: number;
  /** The quoted text. Must equal text.slice(start, end) or verification fails. */
  quote: string;
}

export interface EvidenceItem {
  id: string;
  /** A single factual assertion, stated plainly. */
  claim: string;
  span: SourceSpan;
  /** Model's confidence that the span actually supports the claim. */
  confidence: number;
  /** Set by deterministic verification, not by the model. */
  spanVerified?: boolean;
}

// ---------------------------------------------------------------------------
// Campaign
// ---------------------------------------------------------------------------

export interface BudgetLine {
  label: string;
  amountUsd: number;
  /**
   * Organizer's own classification. Deliberately untrusted — the pipeline
   * re-derives overhead classification from the label and description, because
   * mislabelling overhead as programme cost is the single easiest way to game
   * the administrative cap.
   */
  declaredAsOverhead: boolean;
}

export interface Campaign {
  id: string;
  title: string;
  organizerName: string;
  organizerType: 'individual' | 'registered_nonprofit' | 'unregistered_group' | 'business';
  /** Country the beneficiaries are in, not where the organizer banks. */
  beneficiaryCountry: string;
  organizerCountry: string;
  goalUsd: number;
  /** The asnaf category the organizer selected at intake. */
  claimedCategory: AsnafId;
  submittedAt: string;
  narrativeLanguage: string;
  budget: BudgetLine[];
  sources: SourceDocument[];
  /** IDs of prior campaigns by the same organizer, for pattern checks. */
  priorCampaignIds: string[];
}

// ---------------------------------------------------------------------------
// Assessment — what the pipeline produces
// ---------------------------------------------------------------------------

export interface CriterionAssessment {
  criterionId: string;
  status: CriterionStatus;
  /** One or two sentences. Cites evidence IDs inline. */
  reasoning: string;
  evidenceIds: string[];
  confidence: number;
  /** Populated when status is insufficient_evidence — what to actually ask for. */
  requestedDocument?: string;
}

export interface DeterministicCheck {
  id: string;
  label: string;
  passed: boolean;
  /** Plain-language result, including the numbers used. */
  detail: string;
  severity: CriterionSeverity;
}

export type RoutingDecision =
  /** Everything satisfied and documented. Still goes to a human — see ROUTING_NOTE. */
  | 'fast_lane_review'
  /** Ordinary human review. */
  | 'standard_review'
  /** A blocking criterion is contradicted. Human review, top of queue. */
  | 'priority_review'
  /** Documentation gaps dominate. Draft an evidence request for the human to send. */
  | 'evidence_request'
  /** Category interpretation is genuinely novel. Goes to the scholar board. */
  | 'scholar_board'
  /** Policy excludes this category from verification altogether. */
  | 'policy_excluded';

export interface Assessment {
  campaignId: string;
  /** Category the pipeline believes fits, which may differ from the claimed one. */
  inferredCategory: AsnafId | null;
  categoryMatchesClaim: boolean;
  evidence: EvidenceItem[];
  criteria: CriterionAssessment[];
  checks: DeterministicCheck[];
  routing: RoutingDecision;
  /** Why the router landed where it did, in code-traceable terms. */
  routingRationale: string[];
  /** Aggregate confidence. Deliberately conservative: the minimum, not the mean. */
  confidence: number;
  /** Populated for evidence_request routing. Never sent without human approval. */
  draftEvidenceRequest?: string;
  integrity: IntegrityReport;
  cost: RunCost;
  modelId: string;
  /** 'live' if the model was called, 'replay' if served from recorded fixtures. */
  mode: 'live' | 'replay';
  generatedAt: string;
}

export interface IntegrityReport {
  /** Spans that did not match their source text. Non-empty means something failed. */
  hallucinatedSpans: SourceSpan[];
  /** Evidence discarded because its span could not be verified. */
  discardedEvidenceIds: string[];
  /** Set when the campaign text tried to instruct the model. */
  injectionDetected: boolean;
  injectionDetail?: string;
  /** Retries consumed recovering from failed verification. */
  extractionRetries: number;
}

export interface RunCost {
  inputTokens: number;
  outputTokens: number;
  usd: number;
  latencyMs: number;
}

// ---------------------------------------------------------------------------
// Human decisions
// ---------------------------------------------------------------------------

export type HumanAction =
  | 'approve'
  | 'reject'
  | 'request_evidence'
  | 'escalate_scholar'
  | 'defer';

export interface HumanDecision {
  id: string;
  campaignId: string;
  reviewer: string;
  action: HumanAction;
  /** Mandatory. An unexplained decision is not auditable and is refused at the API. */
  reason: string;
  /** True when the human landed somewhere the AI did not recommend. */
  divergedFromAi: boolean;
  aiRouting: RoutingDecision;
  decidedAt: string;
  /** Seconds the reviewer spent, for the time-saved measurement. */
  reviewSeconds?: number;
}

// ---------------------------------------------------------------------------
// Evaluation
// ---------------------------------------------------------------------------

export interface GoldLabel {
  campaignId: string;
  /** What a correct reviewer should conclude. */
  expectedRouting: RoutingDecision;
  /** Whether the badge should ultimately be granted. */
  expectedEligible: boolean;
  expectedCategory: AsnafId | null;
  /** Which failure class this case exercises. Groups the eval report. */
  failureClass: FailureClass;
  /** Why this is the right answer. Shown in the eval UI so the bar is legible. */
  rationale: string;
}

export type FailureClass =
  | 'clean_eligible'
  | 'clean_ineligible'
  | 'category_mismatch'
  | 'org_does_not_accept_zakat'
  | 'admin_cap_boundary'
  | 'underdocumented_but_genuine'
  | 'policy_excluded_category'
  | 'non_english'
  | 'prompt_injection'
  | 'duplicate_recycled'
  | 'contradictory_sources';

export interface EvalResult {
  campaignId: string;
  failureClass: FailureClass;
  expected: GoldLabel;
  actual: Assessment;
  routingCorrect: boolean;
  categoryCorrect: boolean;
  /** The catastrophic error: badge granted when it should not have been. */
  falseApprove: boolean;
  /** The costly error: a genuine case pushed toward rejection. */
  falseReject: boolean;
  citationsValid: boolean;
}

export interface EvalRun {
  id: string;
  modelId: string;
  startedAt: string;
  results: EvalResult[];
  summary: EvalSummary;
}

export interface EvalSummary {
  total: number;
  routingAccuracy: number;
  categoryAccuracy: number;
  falseApproveRate: number;
  falseRejectRate: number;
  citationValidityRate: number;
  injectionsCaught: number;
  injectionsTotal: number;
  totalCostUsd: number;
  meanLatencyMs: number;
  byFailureClass: Record<string, { total: number; routingCorrect: number }>;
  /** Cases that could not be run (no fixture, no key). Never scored either way. */
  skipped?: number;
}
