import { recordDecision } from '@/lib/store';
import type { HumanAction, RoutingDecision } from '@/lib/types';

const ACTIONS: HumanAction[] = ['approve', 'reject', 'request_evidence', 'escalate_scholar', 'defer'];

/**
 * Record a reviewer's decision.
 *
 * The mandatory-reason rule is enforced here rather than in the form, because a
 * validation that only exists in the UI is not a rule — it is a suggestion that
 * any other client can skip. A zakat determination nobody wrote a reason for is
 * not reviewable by the next person who has to defend it.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const campaignId = String(body.campaignId ?? '');
  const action = String(body.action ?? '') as HumanAction;
  const reason = String(body.reason ?? '').trim();
  const aiRouting = String(body.aiRouting ?? '') as RoutingDecision;
  const reviewer = String(body.reviewer ?? 'demo.reviewer');

  if (!campaignId) return Response.json({ error: 'campaignId required' }, { status: 400 });
  if (!ACTIONS.includes(action)) return Response.json({ error: 'invalid action' }, { status: 400 });
  if (reason.length < 8) {
    return Response.json(
      { error: 'reason_required', detail: 'A decision needs a reason of at least 8 characters.' },
      { status: 400 },
    );
  }

  // What counts as agreement is a judgement, so it is stated once here rather
  // than scattered across the UI: the reviewer agreed if their action is the one
  // the routing was steering toward.
  const IMPLIED: Partial<Record<RoutingDecision, HumanAction[]>> = {
    fast_lane_review: ['approve'],
    standard_review: ['approve', 'reject'],
    priority_review: ['reject', 'escalate_scholar'],
    evidence_request: ['request_evidence'],
    scholar_board: ['escalate_scholar'],
    policy_excluded: ['reject'],
  };
  const divergedFromAi = !(IMPLIED[aiRouting] ?? []).includes(action);

  const decision = recordDecision({
    campaignId,
    reviewer,
    action,
    reason,
    divergedFromAi,
    aiRouting,
    reviewSeconds: typeof body.reviewSeconds === 'number' ? body.reviewSeconds : undefined,
  });

  return Response.json({ decision });
}
