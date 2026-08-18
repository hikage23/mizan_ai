/**
 * Mizan — the corpus index.
 *
 * 24 synthetic campaigns across 11 failure classes. All data is invented; no case
 * depicts a real organisation. Cases were written to exercise the failure classes
 * any zakat-verification process has to survive, and each carries a gold label
 * stating what a correct reviewer should conclude and why.
 */

import type { Campaign, GoldLabel } from '@/lib/types';
import { EXEMPLARS, type CorpusEntry } from './_exemplar';
import { SLICE_A } from './slice-a';
import { SLICE_B } from './slice-b';
import { SLICE_C } from './slice-c';

export type { CorpusEntry };

export const CORPUS: CorpusEntry[] = [...EXEMPLARS, ...SLICE_A, ...SLICE_B, ...SLICE_C];

export const CAMPAIGNS: Campaign[] = CORPUS.map((e) => e.campaign);
export const GOLD: GoldLabel[] = CORPUS.map((e) => e.gold);

export function getCampaign(id: string): Campaign | undefined {
  return CAMPAIGNS.find((c) => c.id === id);
}

export function getGold(id: string): GoldLabel | undefined {
  return GOLD.find((g) => g.campaignId === id);
}

export function getEntry(id: string): CorpusEntry | undefined {
  return CORPUS.find((e) => e.campaign.id === id);
}

/** Corpus composition, surfaced in the eval UI so coverage is legible. */
export function corpusStats() {
  const byClass: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const countries = new Set<string>();
  const languages = new Set<string>();

  for (const { campaign, gold } of CORPUS) {
    byClass[gold.failureClass] = (byClass[gold.failureClass] ?? 0) + 1;
    byCategory[campaign.claimedCategory] = (byCategory[campaign.claimedCategory] ?? 0) + 1;
    countries.add(campaign.beneficiaryCountry);
    languages.add(campaign.narrativeLanguage);
  }

  return {
    total: CORPUS.length,
    byClass,
    byCategory,
    countries: countries.size,
    languages: [...languages].sort(),
    eligible: GOLD.filter((g) => g.expectedEligible).length,
    ineligible: GOLD.filter((g) => !g.expectedEligible).length,
  };
}
