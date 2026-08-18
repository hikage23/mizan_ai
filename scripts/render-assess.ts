/**
 * Stage-2 prompt renderer for the offline recording path.
 *
 * Takes an agent-produced stage-1 output, runs it through the real span
 * verification, and renders the exact stage-2 user message the runtime would
 * build from the surviving evidence. This is what makes an offline recording
 * faithful: stage 2 is answered against verified evidence only, exactly as it
 * would be in a live run.
 *
 *   npx tsx scripts/render-assess.ts <campaignId>
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { getCampaign } from '../src/data/corpus';
import { fixtureKey, DEFAULT_ADJUDICATION_MODEL } from '../src/lib/llm';
import { criteriaFor, getCategory } from '../src/lib/policy';
import { ASSESSMENT_SCHEMA, ASSESSMENT_SYSTEM, assessmentUser } from '../src/lib/prompts';
import type { EvidenceItem } from '../src/lib/types';
import { verifyEvidence } from '../src/lib/verify';

const id = process.argv[2];
if (!id) throw new Error('usage: render-assess.ts <campaignId>');

const campaign = getCampaign(id);
if (!campaign) throw new Error(`unknown campaign ${id}`);

const REC = join(process.cwd(), 'scripts', 'recordings');
const OUT = join(process.cwd(), 'scripts', 'prompts');
mkdirSync(OUT, { recursive: true });

const extraction = JSON.parse(readFileSync(join(REC, `${id}.extract.json`), 'utf8')) as {
  evidence: {
    criterionId: string;
    claim: string;
    sourceId: string;
    quote: string;
    supportsCriterion: boolean;
    confidence: number;
  }[];
  inferredCategory: string | null;
};

const items: EvidenceItem[] = extraction.evidence.map((e, i) => ({
  id: `E${i + 1}`,
  claim: e.claim,
  confidence: e.confidence,
  span: { sourceId: e.sourceId, start: 0, end: e.quote.length, quote: e.quote },
}));

const verified = verifyEvidence(items, campaign.sources);

const polarity = new Map(extraction.evidence.map((e, i) => [`E${i + 1}`, e.supportsCriterion]));
const criterionOf = new Map(extraction.evidence.map((e, i) => [`E${i + 1}`, e.criterionId]));

const forAssessment = verified.kept.map((e) => ({
  id: e.id,
  criterionId: criterionOf.get(e.id) ?? 'unknown',
  claim: e.claim,
  quote: e.span.quote,
  supports: polarity.get(e.id) ?? true,
}));

const category = getCategory(campaign.claimedCategory);
if (category.posture === 'not_verified') {
  console.log(`${id}: category "${category.label}" is not verified — stage 2 is skipped entirely.`);
  process.exit(0);
}

const criteria = criteriaFor(campaign.claimedCategory);
const user = assessmentUser(
  campaign,
  criteria,
  forAssessment,
  extraction.inferredCategory as never,
);

const key = fixtureKey({
  stage: 'assess',
  subject: campaign.id,
  model: DEFAULT_ADJUDICATION_MODEL,
  system: ASSESSMENT_SYSTEM,
  user,
  schema: {},
  toolName: 'record_assessment',
  toolDescription: '',
});

writeFileSync(
  join(OUT, `${id}.assess.json`),
  JSON.stringify(
    { key, model: DEFAULT_ADJUDICATION_MODEL, system: ASSESSMENT_SYSTEM, user, schema: ASSESSMENT_SCHEMA },
    null,
    2,
  ),
);

const total = items.length;
const kept = verified.kept.length;
console.log(
  `${id}: ${kept}/${total} evidence items verified` +
    (verified.discardedIds.length
      ? `, DISCARDED ${verified.discardedIds.join(', ')} (quotes not found in source)`
      : '') +
    `\n  criteria to assess: ${criteria.filter((c) => c.kind === 'llm').length}` +
    `\n  wrote scripts/prompts/${id}.assess.json`,
);
