/**
 * Loads the recorded fixture bundle, tolerating its absence.
 *
 * A fresh clone has no fixtures. The app must still boot and explain itself
 * rather than crashing, so a missing bundle is an empty object and every
 * downstream call reports a clean ReplayMiss the UI can render.
 */

import recorded from '@/data/fixtures/recorded.json';
import meta from '@/data/fixtures/meta.json';

export const FIXTURES = recorded as Record<string, unknown>;

export interface FixtureMeta {
  recordedAt?: string;
  extractionModel?: string;
  adjudicationModel?: string;
  campaigns?: number;
  calls?: number;
  estimatedTotalUsd?: number;
  estimatedPerCampaignUsd?: number;
  meanLatencyMs?: number;
  tokenCountMethod?: string;
}

export const FIXTURE_META = meta as FixtureMeta;

export function fixtureCount(): number {
  return Object.keys(FIXTURES).length;
}
