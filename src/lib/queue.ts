/**
 * Server-side helper that assesses the whole corpus from recorded fixtures.
 *
 * Fast because it touches no network: replay is a hash lookup. Campaigns with no
 * recorded fixture come back as `pending` rather than throwing, so a partially
 * recorded deployment renders a queue that is honest about what it has not run
 * instead of a stack trace.
 */

import { CAMPAIGNS, getGold } from '@/data/corpus';
import { FIXTURES } from './fixtures';
import { assessCampaign } from './pipeline';
import type { Assessment, Campaign, GoldLabel } from './types';

export interface QueueItem {
  campaign: Campaign;
  gold: GoldLabel;
  assessment: Assessment | null;
  /** Present when the assessment could not be produced. */
  pendingReason?: string;
}

export async function buildQueue(): Promise<QueueItem[]> {
  const items = await Promise.all(
    CAMPAIGNS.map(async (campaign) => {
      const gold = getGold(campaign.id)!;
      try {
        const assessment = await assessCampaign(campaign, { fixtures: FIXTURES });
        return { campaign, gold, assessment };
      } catch (err) {
        return {
          campaign,
          gold,
          assessment: null,
          pendingReason: (err as Error).name === 'ReplayMiss' ? 'not_recorded' : 'error',
        };
      }
    }),
  );

  // Priority first, then by the router's own ordering. A reviewer opening this
  // page should be looking at the case that most needs a person.
  const PRIORITY: Record<string, number> = {
    priority_review: 0,
    scholar_board: 1,
    evidence_request: 2,
    standard_review: 3,
    fast_lane_review: 4,
    policy_excluded: 5,
  };

  return items.sort((a, b) => {
    if (!a.assessment && !b.assessment) return a.campaign.id.localeCompare(b.campaign.id);
    if (!a.assessment) return 1;
    if (!b.assessment) return -1;
    const d = PRIORITY[a.assessment.routing] - PRIORITY[b.assessment.routing];
    return d !== 0 ? d : a.campaign.id.localeCompare(b.campaign.id);
  });
}

export function queueSummary(items: QueueItem[]) {
  const counts: Record<string, number> = {};
  let recorded = 0;
  let totalCost = 0;
  for (const it of items) {
    if (!it.assessment) continue;
    recorded++;
    counts[it.assessment.routing] = (counts[it.assessment.routing] ?? 0) + 1;
    totalCost += it.assessment.cost.usd;
  }
  return {
    total: items.length,
    recorded,
    pending: items.length - recorded,
    counts,
    totalCost,
    perCampaignCost: recorded ? totalCost / recorded : 0,
  };
}
