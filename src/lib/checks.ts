/**
 * Mizan — deterministic policy checks over structured campaign fields.
 *
 * These run without a model and their results are not overridable by one. Where
 * a number decides a question, the number decides it.
 */

import { ADMIN_OVERHEAD_CAP, getCategory } from './policy';
import type { Campaign, DeterministicCheck } from './types';
import { detectDuplicate, detectInjection } from './verify';

// ---------------------------------------------------------------------------
// Overhead classification
// ---------------------------------------------------------------------------

/**
 * Terms that indicate a budget line is overhead regardless of how the organizer
 * classified it.
 *
 * The organizer's own `declaredAsOverhead` flag is recorded but never trusted for
 * the cap computation. Mislabelling overhead as programme cost is the cheapest
 * way to clear the one-eighth ceiling, requires no forgery, and is invisible to a
 * reviewer skimming a budget table. Re-deriving from the line label closes that
 * gap without accusing anyone of anything — the check simply reports both numbers
 * and shows the reviewer where they diverge.
 */
const OVERHEAD_TERMS = [
  'admin', 'administrative', 'administration', 'overhead', 'salary', 'salaries',
  'staff', 'payroll', 'wages', 'consultant', 'consulting', 'management fee',
  'marketing', 'advertising', 'ads', 'promotion', 'promotional', 'campaign management',
  'fundraising', 'fundraiser cost', 'donor acquisition', 'platform fee', 'processing fee',
  'transaction fee', 'office', 'rent', 'utilities', 'software', 'subscription',
  'travel', 'accommodation', 'per diem', 'legal fee', 'accounting', 'audit fee',
  'video production', 'photography', 'branding', 'website', 'social media',
];

/** Terms that indicate genuine programme delivery, to break ties on mixed labels. */
const PROGRAMME_TERMS = [
  'beneficiar', 'household', 'famil', 'recipient', 'distribution', 'disburse',
  'food', 'meal', 'ration', 'medicine', 'medical', 'treatment', 'surgery',
  'tuition', 'school fee', 'scholarship', 'shelter', 'housing', 'rent assistance',
  'cash transfer', 'stipend', 'grant to', 'winter kit', 'blanket', 'water', 'well',
];

export interface OverheadAnalysis {
  totalUsd: number;
  declaredOverheadUsd: number;
  derivedOverheadUsd: number;
  declaredRatio: number;
  derivedRatio: number;
  /** Lines the organizer called programme cost that read as overhead. */
  reclassifiedLines: { label: string; amountUsd: number }[];
  withinCap: boolean;
  /** True when the two classifications disagree enough to matter. */
  classificationDisputed: boolean;
}

function looksLikeOverhead(label: string): boolean {
  const l = label.toLowerCase();
  const overheadHit = OVERHEAD_TERMS.some((t) => l.includes(t));
  if (!overheadHit) return false;
  // A line naming a programme output as well as a cost type is treated as
  // programme spend; "food distribution staff" is not the same as "staff".
  const programmeHit = PROGRAMME_TERMS.some((t) => l.includes(t));
  return !programmeHit;
}

export function analyseOverhead(campaign: Campaign): OverheadAnalysis {
  const total = campaign.budget.reduce((s, b) => s + b.amountUsd, 0);
  const declared = campaign.budget
    .filter((b) => b.declaredAsOverhead)
    .reduce((s, b) => s + b.amountUsd, 0);

  const derivedLines = campaign.budget.filter(
    (b) => b.declaredAsOverhead || looksLikeOverhead(b.label),
  );
  const derived = derivedLines.reduce((s, b) => s + b.amountUsd, 0);

  const reclassified = campaign.budget
    .filter((b) => !b.declaredAsOverhead && looksLikeOverhead(b.label))
    .map((b) => ({ label: b.label, amountUsd: b.amountUsd }));

  const declaredRatio = total > 0 ? declared / total : 0;
  const derivedRatio = total > 0 ? derived / total : 0;

  return {
    totalUsd: total,
    declaredOverheadUsd: declared,
    derivedOverheadUsd: derived,
    declaredRatio,
    derivedRatio,
    reclassifiedLines: reclassified,
    withinCap: derivedRatio <= ADMIN_OVERHEAD_CAP,
    classificationDisputed: Math.abs(derivedRatio - declaredRatio) > 0.02,
  };
}

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

// ---------------------------------------------------------------------------
// Check suite
// ---------------------------------------------------------------------------

export function runDeterministicChecks(
  campaign: Campaign,
  corpus: Campaign[],
): DeterministicCheck[] {
  const checks: DeterministicCheck[] = [];

  // --- Administrative overhead cap -----------------------------------------
  const oh = analyseOverhead(campaign);
  if (oh.totalUsd === 0) {
    checks.push({
      id: 'overhead_cap',
      label: 'Administrative overhead within one eighth',
      passed: false,
      detail: 'No itemised budget was supplied, so overhead cannot be computed.',
      severity: 'material',
    });
  } else {
    const disputeNote = oh.classificationDisputed
      ? ` Organizer declared ${pct(oh.declaredRatio)}; ${oh.reclassifiedLines.length} line(s) totalling ${usd(
          oh.reclassifiedLines.reduce((s, l) => s + l.amountUsd, 0),
        )} were reclassified as overhead from their labels (${oh.reclassifiedLines
          .map((l) => l.label)
          .join('; ')}).`
      : '';
    checks.push({
      id: 'overhead_cap',
      label: 'Administrative overhead within one eighth',
      passed: oh.withinCap,
      detail:
        `Derived overhead ${usd(oh.derivedOverheadUsd)} of ${usd(oh.totalUsd)} = ${pct(oh.derivedRatio)} ` +
        `against a ${pct(ADMIN_OVERHEAD_CAP)} ceiling.${disputeNote}`,
      severity: 'blocking',
    });
  }

  if (oh.classificationDisputed) {
    checks.push({
      id: 'overhead_classification',
      label: 'Budget classification agrees with line labels',
      passed: false,
      detail:
        `Declared ${pct(oh.declaredRatio)} vs derived ${pct(oh.derivedRatio)}. ` +
        `A reviewer should confirm how these lines are actually spent before relying on either figure.`,
      severity: 'material',
    });
  }

  // --- Category verifiability ----------------------------------------------
  const cat = getCategory(campaign.claimedCategory);
  checks.push({
    id: 'category_verifiable',
    label: 'Selected category is one the policy verifies',
    passed: cat.posture !== 'not_verified',
    detail:
      cat.posture === 'not_verified'
        ? `"${cat.label}" is outside the verified set. ${cat.postureRationale}`
        : `"${cat.label}" is ${cat.posture === 'conditional' ? 'verified under a narrow carve-out' : 'actively verified'}.`,
    severity: 'blocking',
  });

  // --- Organizer type ------------------------------------------------------
  const needsRegistration = campaign.goalUsd >= 25_000;
  const registered = campaign.organizerType === 'registered_nonprofit';
  if (needsRegistration) {
    checks.push({
      id: 'organizer_registration',
      label: 'Registration evidence present for a goal of this size',
      passed: registered && campaign.sources.some((s) => s.kind === 'org_registration'),
      detail: registered
        ? campaign.sources.some((s) => s.kind === 'org_registration')
          ? 'Registered non-profit with registration documentation on file.'
          : 'Declared as a registered non-profit but no registration document was supplied.'
        : `Organizer type is "${campaign.organizerType}" for a ${usd(campaign.goalUsd)} goal.`,
      severity: 'material',
    });
  }

  // --- Cross-border corridor ----------------------------------------------
  const crossBorder = campaign.organizerCountry !== campaign.beneficiaryCountry;
  checks.push({
    id: 'cross_border',
    label: 'Cross-border disbursement corridor',
    passed: true, // informational: never blocks
    detail: crossBorder
      ? `Funds raised in ${campaign.organizerCountry} for beneficiaries in ${campaign.beneficiaryCountry}. ` +
        `Confirm a documented delivery partner. Flagged for visibility only — cross-border ` +
        `giving is the norm on this platform and is not itself a risk signal.`
      : `Organizer and beneficiaries are both in ${campaign.beneficiaryCountry}.`,
    severity: 'supporting',
  });

  // --- Documentation completeness -----------------------------------------
  const required: { kind: string; label: string }[] = [
    { kind: 'campaign_narrative', label: 'campaign narrative' },
    { kind: 'budget_breakdown', label: 'itemised budget' },
  ];
  if (campaign.organizerType === 'registered_nonprofit') {
    required.push({ kind: 'org_registration', label: 'registration certificate' });
  }
  const missing = required.filter((r) => !campaign.sources.some((s) => s.kind === r.kind));
  checks.push({
    id: 'documentation_complete',
    label: 'Baseline documentation present',
    passed: missing.length === 0,
    detail:
      missing.length === 0
        ? `All baseline documents present (${campaign.sources.length} sources on file).`
        : `Missing: ${missing.map((m) => m.label).join(', ')}.`,
    severity: 'material',
  });

  // --- Duplicate detection -------------------------------------------------
  //
  // Two-tier, because one threshold cannot serve both cases. Moderate overlap is
  // usually an organizer reusing their own wording across seasons — common,
  // legitimate, and not worth interrupting a queue for. Overlap above
  // STRONG_DUPLICATE means whole passages are shared verbatim, which no honest
  // rewrite produces by accident.
  //
  // Neither tier decides anything. The stronger tier only moves the case to the
  // front of a human queue, because the innocent explanation still exists at 61%
  // overlap and a system that rejected on it would punish organizers for the sin
  // of reusing their own paragraphs.
  const dup = detectDuplicate(campaign, corpus);
  const STRONG_DUPLICATE = 0.6;
  const strong = dup.similarity >= STRONG_DUPLICATE;
  checks.push({
    id: 'duplicate_narrative',
    label: 'Narrative is not a near-duplicate of another campaign',
    passed: !dup.isDuplicate,
    detail: dup.isDuplicate
      ? `${(dup.similarity * 100).toFixed(0)}% 5-gram overlap with ${dup.bestMatchCampaignId}` +
        (strong
          ? `, above the ${(STRONG_DUPLICATE * 100).toFixed(0)}% strong-match threshold — whole ` +
            `passages are shared verbatim. Front of the queue, but still a human call: an organizer ` +
            `reusing their own wording across seasons looks identical to this at the text level.`
          : `. Below the strong-match threshold. Usually seasonal reuse of an organizer's own ` +
            `wording; flagged so a person can confirm.`)
      : `Highest overlap with any other campaign is ${(dup.similarity * 100).toFixed(0)}%.`,
    severity: strong ? 'blocking' : 'material',
  });

  // --- Prompt injection ----------------------------------------------------
  const inj = detectInjection(campaign.sources);
  checks.push({
    id: 'injection_scan',
    label: 'Submitted text contains no instructions aimed at the reviewing model',
    passed: !inj.detected,
    detail: inj.detected
      ? `${inj.detail}. Example: "${inj.matches[0].excerpt}". Routed to a human with the ` +
        `matched text shown; the campaign is not auto-suppressed, since suppression on ` +
        `keyword match would let anyone sabotage a rival by quoting these phrases.`
      : 'No instruction-injection patterns matched.',
    severity: 'material',
  });

  // --- Web evidence staleness ---------------------------------------------
  const captures = campaign.sources.filter((s) => s.kind === 'website_capture');
  if (captures.length > 0) {
    const submitted = new Date(campaign.submittedAt).getTime();
    const stale = captures.filter((c) => {
      const age = (submitted - new Date(c.capturedAt).getTime()) / 86_400_000;
      return age > 180;
    });
    checks.push({
      id: 'evidence_freshness',
      label: 'Web evidence is current',
      passed: stale.length === 0,
      detail:
        stale.length === 0
          ? `${captures.length} web capture(s), all within 180 days of submission.`
          : `${stale.length} capture(s) older than 180 days. An organisation's zakat posture can ` +
            `change; stale captures should be refreshed before they carry weight.`,
      severity: 'supporting',
    });
  }

  return checks;
}
