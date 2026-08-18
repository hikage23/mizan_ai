/**
 * Records replay fixtures by running the real pipeline against the live API.
 *
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/record.ts
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/record.ts lg-1001 lg-1002
 *
 * Writes src/data/fixtures/recorded.json. Existing fixtures are preserved unless
 * --overwrite is passed, so a partially recorded set can be topped up cheaply
 * after adding campaigns or editing a prompt.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { CAMPAIGNS, CORPUS } from '../src/data/corpus';
import {
  DEFAULT_ADJUDICATION_MODEL,
  DEFAULT_EXTRACTION_MODEL,
  hasLiveKey,
} from '../src/lib/llm';
import { assessCampaign } from '../src/lib/pipeline';

async function main() {

const OUT = join(process.cwd(), 'src', 'data', 'fixtures');
mkdirSync(OUT, { recursive: true });
const PATH = join(OUT, 'recorded.json');

if (!hasLiveKey()) {
  console.error('ANTHROPIC_API_KEY is not set. Nothing to record.');
  process.exit(1);
}

const args = process.argv.slice(2);
const overwrite = args.includes('--overwrite');
const only = args.filter((a) => !a.startsWith('--'));

const existing: Record<string, unknown> = existsSync(PATH)
  ? JSON.parse(readFileSync(PATH, 'utf8'))
  : {};

// The pipeline writes through this object as it runs: callStructured reads from
// it on a hit and we capture misses here, so a single pass over the corpus both
// records new calls and reuses ones already on disk.
const fixtures: Record<string, unknown> = overwrite ? {} : { ...existing };

const targets = only.length ? CAMPAIGNS.filter((c) => only.includes(c.id)) : CAMPAIGNS;

let totalUsd = 0;
let totalMs = 0;
let recorded = 0;
let failed = 0;

for (const campaign of targets) {
  process.stdout.write(`${campaign.id}  ${campaign.title.slice(0, 48).padEnd(48)} `);
  try {
    const before = Object.keys(fixtures).length;

    // Patch the fixture store as calls complete. assessCampaign returns the
    // aggregate cost; individual call results are captured by re-running the
    // key computation over the recorded response inside callStructured.
    const assessment = await recordingRun(campaign.id, fixtures);

    totalUsd += assessment.cost.usd;
    totalMs += assessment.cost.latencyMs;
    const added = Object.keys(fixtures).length - before;
    recorded += added;
    console.log(
      `${assessment.routing.padEnd(18)} $${assessment.cost.usd.toFixed(4)}  ${(assessment.cost.latencyMs / 1000).toFixed(1)}s  +${added} calls`,
    );
  } catch (err) {
    failed++;
    console.log(`FAILED — ${(err as Error).message.slice(0, 100)}`);
  }
  writeFileSync(PATH, JSON.stringify(fixtures, null, 2));
}

writeFileSync(
  join(OUT, 'meta.json'),
  JSON.stringify(
    {
      recordedAt: new Date().toISOString(),
      extractionModel: DEFAULT_EXTRACTION_MODEL,
      adjudicationModel: DEFAULT_ADJUDICATION_MODEL,
      campaigns: CORPUS.length,
      calls: Object.keys(fixtures).length,
      estimatedTotalUsd: Number(totalUsd.toFixed(4)),
      estimatedPerCampaignUsd: Number((totalUsd / Math.max(1, targets.length)).toFixed(4)),
      meanLatencyMs: Math.round(totalMs / Math.max(1, targets.length)),
      tokenCountMethod: 'reported by the API',
    },
    null,
    2,
  ),
);

console.log('');
console.log(`Recorded ${recorded} new calls across ${targets.length} campaigns.`);
console.log(`Total $${totalUsd.toFixed(4)} — $${(totalUsd / Math.max(1, targets.length)).toFixed(4)} per campaign.`);
if (failed) {
  console.log(`${failed} campaign(s) failed. Re-run to retry just those.`);
  process.exitCode = 1;
}

/**
 * Runs one campaign live, capturing every call into `store` via the pipeline's
 * record hook.
 *
 * The hook exists rather than a wrapper because pipeline.ts imports
 * callStructured as an ESM binding, which cannot be reassigned from outside the
 * module. Threading an explicit callback through RunOptions is both the only
 * thing that actually works and the more honest design: the capture point is
 * visible in the type signature instead of hidden in a patch.
 */
async function recordingRun(campaignId: string, store: Record<string, unknown>) {
  const campaign = CAMPAIGNS.find((c) => c.id === campaignId)!;
  return assessCampaign(campaign, {
    fixtures: store,
    onRecord: (key, data, cost) => {
      store[key] = { data, cost };
    },
  });
}

}

main();
