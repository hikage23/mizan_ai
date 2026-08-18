/**
 * Mizan — decision store.
 *
 * In-memory, per-instance. That is a deliberate limitation of the prototype, not
 * an oversight: it keeps the deployment zero-config so the demo runs from a git
 * push with no database to provision.
 *
 * In production this is a Postgres table and the shape below is already the
 * schema. The properties that matter are not about storage:
 *
 *   - Decisions are append-only. A reviewer changing their mind writes a second
 *     row; nothing is updated in place. An audit trail that can be edited is not
 *     an audit trail, and zakat determinations are exactly the kind of thing
 *     someone will need to reconstruct two years later.
 *   - `reason` is mandatory and enforced at the API boundary, not the UI. A
 *     decision nobody can explain is not reviewable by the next person.
 *   - Divergence from the AI's routing is recorded at write time rather than
 *     recomputed later, because the routing logic will change and the historical
 *     record should say what the system actually recommended that day.
 */

import type { HumanDecision } from './types';

const decisions: HumanDecision[] = [];

export function recordDecision(d: Omit<HumanDecision, 'id' | 'decidedAt'>): HumanDecision {
  const row: HumanDecision = {
    ...d,
    id: `dec-${decisions.length + 1}-${Math.random().toString(36).slice(2, 8)}`,
    decidedAt: new Date().toISOString(),
  };
  decisions.push(row);
  return row;
}

/** Most recent decision for a campaign, or undefined. */
export function latestDecision(campaignId: string): HumanDecision | undefined {
  for (let i = decisions.length - 1; i >= 0; i--) {
    if (decisions[i].campaignId === campaignId) return decisions[i];
  }
  return undefined;
}

export function allDecisions(): HumanDecision[] {
  return [...decisions];
}

/**
 * Agreement rate between reviewers and the router.
 *
 * This is the number that tells you whether the system is actually helping. High
 * agreement with fast throughput means the dossiers are good. High agreement with
 * no throughput gain means reviewers are re-doing the work anyway. Low agreement
 * means the router is miscalibrated — and every divergence is a labelled example
 * for the next eval run, which is how the thing improves without retraining.
 */
export function divergenceStats() {
  const total = decisions.length;
  const diverged = decisions.filter((d) => d.divergedFromAi).length;
  return {
    total,
    diverged,
    agreementRate: total === 0 ? null : (total - diverged) / total,
  };
}
