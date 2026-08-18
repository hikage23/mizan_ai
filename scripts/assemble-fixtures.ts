/**
 * Assembles recorded stage outputs into the fixture bundle the app replays from.
 *
 * Also computes token counts so the cost figures shown in the eval dashboard are
 * derived from actual prompt sizes rather than invented. Counts use a
 * 3.6-chars-per-token approximation; the dashboard labels them as estimates.
 *
 *   npx tsx scripts/assemble-fixtures.ts
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { CORPUS } from '../src/data/corpus';
import { DEFAULT_ADJUDICATION_MODEL, DEFAULT_EXTRACTION_MODEL, priceOf } from '../src/lib/llm';
import { getCategory } from '../src/lib/policy';

const REC = join(process.cwd(), 'scripts', 'recordings');
const PROMPTS = join(process.cwd(), 'scripts', 'prompts');
const OUT = join(process.cwd(), 'src', 'data', 'fixtures');
mkdirSync(OUT, { recursive: true });

/** Rough but consistent. Labelled as an estimate wherever it surfaces. */
const CHARS_PER_TOKEN = 3.6;
const tok = (s: string) => Math.round(s.length / CHARS_PER_TOKEN);

const fixtures: Record<string, unknown> = {};
const missing: string[] = [];
let totalUsd = 0;

for (const { campaign } of CORPUS) {
  const id = campaign.id;

  // --- stage 1 ---
  const exPromptPath = join(PROMPTS, `${id}.extract.json`);
  const exRecPath = join(REC, `${id}.extract.json`);
  if (!existsSync(exRecPath)) {
    missing.push(`${id}.extract`);
  } else {
    const prompt = JSON.parse(readFileSync(exPromptPath, 'utf8'));
    const data = JSON.parse(readFileSync(exRecPath, 'utf8'));
    const inputTokens = tok(prompt.system + prompt.user);
    const outputTokens = tok(JSON.stringify(data));
    fixtures[prompt.key] = {
      data,
      cost: {
        inputTokens,
        outputTokens,
        usd: priceOf(DEFAULT_EXTRACTION_MODEL, inputTokens, outputTokens),
        latencyMs: 0,
      },
    };
    totalUsd += priceOf(DEFAULT_EXTRACTION_MODEL, inputTokens, outputTokens);
  }

  // --- stage 2 ---
  if (getCategory(campaign.claimedCategory).posture === 'not_verified') continue;

  const asPromptPath = join(PROMPTS, `${id}.assess.json`);
  const asRecPath = join(REC, `${id}.assess.json`);
  if (!existsSync(asPromptPath) || !existsSync(asRecPath)) {
    missing.push(`${id}.assess`);
    continue;
  }
  const prompt = JSON.parse(readFileSync(asPromptPath, 'utf8'));
  const data = JSON.parse(readFileSync(asRecPath, 'utf8'));
  const inputTokens = tok(prompt.system + prompt.user);
  const outputTokens = tok(JSON.stringify(data));
  fixtures[prompt.key] = {
    data,
    cost: {
      inputTokens,
      outputTokens,
      usd: priceOf(DEFAULT_ADJUDICATION_MODEL, inputTokens, outputTokens),
      latencyMs: 0,
    },
  };
  totalUsd += priceOf(DEFAULT_ADJUDICATION_MODEL, inputTokens, outputTokens);
}

writeFileSync(join(OUT, 'recorded.json'), JSON.stringify(fixtures, null, 2));

const meta = {
  recordedAt: new Date().toISOString(),
  extractionModel: DEFAULT_EXTRACTION_MODEL,
  adjudicationModel: DEFAULT_ADJUDICATION_MODEL,
  campaigns: CORPUS.length,
  calls: Object.keys(fixtures).length,
  estimatedTotalUsd: Number(totalUsd.toFixed(4)),
  estimatedPerCampaignUsd: Number((totalUsd / CORPUS.length).toFixed(4)),
  tokenCountMethod: `approximate, ${CHARS_PER_TOKEN} chars per token`,
};
writeFileSync(join(OUT, 'meta.json'), JSON.stringify(meta, null, 2));

console.log(`Assembled ${Object.keys(fixtures).length} calls across ${CORPUS.length} campaigns.`);
console.log(`Estimated cost per campaign: $${meta.estimatedPerCampaignUsd}`);
if (missing.length) {
  console.log(`\nMISSING (${missing.length}):`);
  for (const m of missing) console.log(`  ${m}`);
  process.exitCode = 1;
}
