/**
 * Mizan — the human/AI boundary.
 *
 * This file is the boundary. Not a prompt, not a guideline in a system message —
 * a pure function whose behaviour can be read, tested, and audited without
 * running a model.
 *
 * Two properties hold by construction:
 *
 *   1. There is no code path that grants a zakat badge. `RoutingDecision` has no
 *      "approve" member. Every branch terminates at a human. The model's output
 *      changes *which* human, *how urgently*, and *what they see first* — never
 *      *whether* a human is involved.
 *
 *   2. Low confidence can only ever route a case toward more scrutiny, never less.
 *      Every branch that lowers scrutiny is gated on high confidence AND clean
 *      deterministic checks; every branch that raises it fires on either signal
 *      alone.
 *
 * WHY NO AUTO-APPROVE. Automating away a human is normally the whole point, and
 * on most review queues a high-confidence fast path is correct. Zakat is a case
 * where it is not, for a reason specific to what zakat is: it is an obligation
 * discharged, not a payment made. If a donor's zakat reaches an ineligible
 * recipient, the donor's obligation is not fulfilled — and they will not find out.
 * There is no chargeback, no refund, no complaint that surfaces the error. The
 * loss is silent, unrecoverable, and borne by someone who trusted the badge.
 *
 * A system whose errors are invisible to the people they harm cannot be permitted
 * to write them at machine speed. So the win here is not removing the reviewer;
 * it is making the reviewer fast, consistent, and auditable. Ten minutes instead
 * of ninety, with two reviewers reaching the same answer.
 */

import { FAST_LANE_CONFIDENCE_FLOOR, HIGH_INTERPRETIVE_RISK, getCategory } from './policy';
import type {
  AsnafId,
  CriterionAssessment,
  DeterministicCheck,
  RoutingDecision,
} from './types';
import { criterionById } from './policy';

export interface RoutingInput {
  claimedCategory: AsnafId;
  inferredCategory: AsnafId | null;
  criteria: CriterionAssessment[];
  checks: DeterministicCheck[];
  injectionDetected: boolean;
  discardedEvidenceCount: number;
  /** Lowest per-criterion confidence, computed upstream. */
  confidence: number;
}

export interface RoutingOutput {
  routing: RoutingDecision;
  rationale: string[];
  /** Lower sorts earlier in the reviewer queue. */
  priority: number;
}

function severityOf(criterionId: string) {
  return criterionById(criterionId)?.severity ?? 'supporting';
}

export function route(input: RoutingInput): RoutingOutput {
  const rationale: string[] = [];

  const category = getCategory(input.claimedCategory);
  const blockingContradicted = input.criteria.filter(
    (c) => c.status === 'contradicted' && severityOf(c.criterionId) === 'blocking',
  );
  const materialContradicted = input.criteria.filter(
    (c) => c.status === 'contradicted' && severityOf(c.criterionId) === 'material',
  );
  const insufficient = input.criteria.filter((c) => c.status === 'insufficient_evidence');
  const failedBlockingChecks = input.checks.filter((c) => !c.passed && c.severity === 'blocking');
  const failedMaterialChecks = input.checks.filter((c) => !c.passed && c.severity === 'material');

  // -- 1. Category is outside the verified set ------------------------------
  // Decided before anything else, because no amount of evidence quality changes
  // it. The badge is unavailable by policy, and that is a policy question rather
  // than an evidence question.
  if (category.posture === 'not_verified') {
    rationale.push(
      `Policy does not verify "${category.label}". ${category.postureRationale}`,
    );
    rationale.push(
      'The campaign may still fundraise; only the zakat designation is unavailable.',
    );
    return { routing: 'policy_excluded', rationale, priority: 50 };
  }

  // -- 2. Integrity events --------------------------------------------------
  // These describe a problem with the *review*, not with the campaign, so they
  // escalate without prejudicing the organizer.
  if (input.injectionDetected) {
    rationale.push(
      'Submitted text contains instructions addressed to the reviewing model. Escalated ' +
        'for human reading of the raw source; no automated conclusion drawn from the ' +
        'affected documents.',
    );
    return { routing: 'priority_review', rationale, priority: 0 };
  }

  if (input.discardedEvidenceCount > 0) {
    rationale.push(
      `${input.discardedEvidenceCount} extracted claim(s) failed span verification and were ` +
        'discarded. The dossier below is built only from verified quotes, but the gap means ' +
        'it may be incomplete rather than merely conservative.',
    );
    // Falls through — a degraded dossier is still useful, it just cannot fast-lane.
  }

  // -- 3. Blocking failures -------------------------------------------------
  if (blockingContradicted.length > 0 || failedBlockingChecks.length > 0) {
    for (const c of blockingContradicted) {
      rationale.push(`Blocking criterion contradicted: ${c.reasoning}`);
    }
    for (const c of failedBlockingChecks) {
      rationale.push(`Blocking check failed — ${c.label}: ${c.detail}`);
    }
    rationale.push(
      'Routed to the top of the human queue. The system does not reject; it presents the ' +
        'contradiction and the evidence behind it for a person to weigh.',
    );
    return { routing: 'priority_review', rationale, priority: 1 };
  }

  // -- 4. Category mismatch -------------------------------------------------
  // The failure class that produced the platform's most-criticised outcomes: a
  // campaign whose substance sits in one category, submitted under another where
  // the criteria happen to be looser.
  if (input.inferredCategory && input.inferredCategory !== input.claimedCategory) {
    rationale.push(
      `Narrative reads as "${getCategory(input.inferredCategory).label}" but was submitted under ` +
        `"${category.label}". Category selection is where loose fits become badge grants, so ` +
        'this always goes to a person.',
    );
    return { routing: 'priority_review', rationale, priority: 2 };
  }

  // -- 5. Novel interpretation ---------------------------------------------
  // The one branch that leaves the ops queue entirely. A question about what a
  // category *means* is not an ops question and the pipeline does not attempt it.
  const noveltyFlag = input.criteria.find(
    (c) => c.criterionId === 'mq_interpretive_novelty' && c.status !== 'satisfied',
  );
  const highRisk = HIGH_INTERPRETIVE_RISK.includes(input.claimedCategory);
  if (noveltyFlag || (highRisk && input.confidence < 0.7)) {
    rationale.push(
      `"${category.label}" is a high-interpretive-risk category and this case does not match a ` +
        'reading already recognised in policy.',
    );
    rationale.push(
      'Escalated to the scholar board with a one-page brief. Deciding what the category covers ' +
        'is a scholarly question; the system prepares the case and stops.',
    );
    return { routing: 'scholar_board', rationale, priority: 10 };
  }

  // -- 6. Documentation gaps dominate --------------------------------------
  // Deliberately distinct from rejection. Most genuine applicants fail here, and
  // treating a documentation gap as a negative verdict is how a real family in
  // need gets turned away by a system that was merely under-informed.
  if (insufficient.length > 0 && blockingContradicted.length === 0) {
    const blockingGaps = insufficient.filter(
      (c) => severityOf(c.criterionId) === 'blocking',
    );
    if (blockingGaps.length > 0 || insufficient.length >= 2) {
      rationale.push(
        `${insufficient.length} criterion/criteria lack sufficient evidence: ` +
          insufficient.map((c) => c.criterionId).join(', ') + '.',
      );
      rationale.push(
        'An evidence request has been drafted naming the specific documents needed. It is queued ' +
          'for a reviewer to approve — nothing is sent to the organizer without a person clicking send.',
      );
      return { routing: 'evidence_request', rationale, priority: 20 };
    }
  }

  // -- 7. Material concerns -------------------------------------------------
  if (materialContradicted.length > 0 || failedMaterialChecks.length > 0) {
    for (const c of materialContradicted) rationale.push(`Material concern: ${c.reasoning}`);
    for (const c of failedMaterialChecks) rationale.push(`${c.label}: ${c.detail}`);
    return { routing: 'standard_review', rationale, priority: 25 };
  }

  // -- 8. Fast lane ---------------------------------------------------------
  // Still a human. "Fast lane" means the dossier is complete enough that the
  // reviewer is confirming rather than investigating.
  if (input.confidence >= FAST_LANE_CONFIDENCE_FLOOR) {
    rationale.push(
      `All criteria satisfied with verified evidence at ${(input.confidence * 100).toFixed(0)}% ` +
        `confidence, above the ${(FAST_LANE_CONFIDENCE_FLOOR * 100).toFixed(0)}% floor.`,
    );
    rationale.push(
      'Fast-lane review: a person still signs off, but the dossier is complete enough that they ' +
        'are confirming rather than investigating. This is where the hours are saved.',
    );
    return { routing: 'fast_lane_review', rationale, priority: 40 };
  }

  // -- 9. Default ----------------------------------------------------------
  // Reached when nothing is wrong but confidence is soft. Ambiguity resolves
  // toward more human attention, never less.
  rationale.push(
    `No criterion failed, but aggregate confidence is ${(input.confidence * 100).toFixed(0)}%, ` +
      `below the ${(FAST_LANE_CONFIDENCE_FLOOR * 100).toFixed(0)}% fast-lane floor.`,
  );
  rationale.push('Ambiguity routes toward more human attention, never less.');
  return { routing: 'standard_review', rationale, priority: 30 };
}

// ---------------------------------------------------------------------------
// Presentation helpers
// ---------------------------------------------------------------------------

export const ROUTING_LABEL: Record<RoutingDecision, string> = {
  fast_lane_review: 'Fast-lane review',
  standard_review: 'Standard review',
  priority_review: 'Priority review',
  evidence_request: 'Evidence request',
  scholar_board: 'Scholar board',
  policy_excluded: 'Outside verified categories',
};

export const ROUTING_BLURB: Record<RoutingDecision, string> = {
  fast_lane_review: 'Complete and consistent. A reviewer confirms rather than investigates.',
  standard_review: 'Nothing disqualifying, but something needs a person to weigh it.',
  priority_review: 'A blocking criterion is contradicted. Top of the queue.',
  evidence_request: 'Substantively plausible, materially under-documented. Ask, do not reject.',
  scholar_board: 'Turns on what the category means. Not an ops decision.',
  policy_excluded: 'Policy does not verify this category. Fundraising is unaffected.',
};

/** Every routing outcome that still requires a person. Currently: all of them. */
export const ALL_ROUTINGS_REQUIRE_HUMAN = true;
