/**
 * Renders the exact prompts the pipeline would send, one JSON file per stage per
 * campaign, each stamped with the fixture key the runtime will look for.
 *
 * Used by the offline recording path: a model is run against these prompts and
 * its outputs are assembled back into fixtures by assemble-fixtures.ts. The keys
 * are computed here with the same function the runtime uses, so a fixture
 * recorded this way is indistinguishable from one recorded over the network.
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { CORPUS } from '../src/data/corpus';
import { fixtureKey } from '../src/lib/llm';
import { DEFAULT_ADJUDICATION_MODEL, DEFAULT_EXTRACTION_MODEL } from '../src/lib/llm';
import { criteriaFor, getCategory } from '../src/lib/policy';
import {
  ASSESSMENT_SCHEMA,
  ASSESSMENT_SYSTEM,
  EXTRACTION_SCHEMA,
  EXTRACTION_SYSTEM,
  extractionUser,
} from '../src/lib/prompts';

const OUT = join(process.cwd(), 'scripts', 'prompts');
mkdirSync(OUT, { recursive: true });

const index: Record<string, unknown>[] = [];

for (const { campaign } of CORPUS) {
  // --- extraction ---
  const exCall = {
    stage: 'extract',
    subject: campaign.id,
    model: DEFAULT_EXTRACTION_MODEL,
    system: EXTRACTION_SYSTEM,
    user: extractionUser(campaign),
    schema: EXTRACTION_SCHEMA as unknown as Record<string, unknown>,
    toolName: 'record_evidence',
    toolDescription: 'Record extracted evidence and the inferred category.',
  };
  const exKey = fixtureKey(exCall);
  writeFileSync(
    join(OUT, `${campaign.id}.extract.json`),
    JSON.stringify(
      { key: exKey, model: exCall.model, system: exCall.system, user: exCall.user, schema: exCall.schema },
      null,
      2,
    ),
  );
  index.push({ campaignId: campaign.id, stage: 'extract', key: exKey });

  // --- assessment ---
  // The assessment prompt depends on which evidence survives verification, which
  // is not known until extraction has run. For the offline path the recorder is
  // given the campaign and criteria and produces both stages together; this dump
  // exists so the criteria and system prompt are exact.
  const category = getCategory(campaign.claimedCategory);
  if (category.posture !== 'not_verified') {
    writeFileSync(
      join(OUT, `${campaign.id}.assess-template.json`),
      JSON.stringify(
        {
          model: DEFAULT_ADJUDICATION_MODEL,
          system: ASSESSMENT_SYSTEM,
          userTemplateNote:
            'Final user message depends on verified evidence ids from stage 1. ' +
            'Rendered at record time by assessmentUser().',
          criteria: criteriaFor(campaign.claimedCategory).filter((c) => c.kind === 'llm'),
          schema: ASSESSMENT_SCHEMA,
        },
        null,
        2,
      ),
    );
  }
}

writeFileSync(join(OUT, '_index.json'), JSON.stringify(index, null, 2));
console.log(`Wrote prompts for ${CORPUS.length} campaigns to ${OUT}`);
console.log(`Extraction model: ${DEFAULT_EXTRACTION_MODEL}`);
console.log(`Adjudication model: ${DEFAULT_ADJUDICATION_MODEL}`);
