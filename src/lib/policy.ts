/**
 * Mizan — LaunchGood's published zakat policy, encoded as machine-checkable criteria.
 *
 * IMPORTANT FRAMING: this file does not invent fiqh. It is a transcription of a
 * policy LaunchGood already publishes, into a form a pipeline can check evidence
 * against. Where the policy is silent, the criterion is marked `supporting` and
 * routed to a human rather than guessed at. Where a category requires a genuinely
 * novel interpretation, routing sends it to the scholar board and the pipeline
 * stops.
 *
 * The distinction that matters: the model reasons about *whether evidence supports
 * a criterion*. It never reasons about *whether the criterion is correct*. The
 * second question belongs to scholars, and there is no code path that asks it.
 */

import type { AsnafCategory, AsnafId } from './types';

/**
 * The classical administrative share. Because `amilin` (zakat administrators) is
 * one of eight categories, the majority position permits up to one eighth of a
 * zakat pool to cover the cost of collecting and distributing it. LaunchGood's
 * policy adopts this as a hard ceiling.
 */
export const ADMIN_OVERHEAD_CAP = 0.125;

/**
 * Below this aggregate confidence the router refuses to fast-lane a case,
 * regardless of how clean the criteria look. Tuned on the gold set; see
 * /evals for the sensitivity curve.
 */
export const FAST_LANE_CONFIDENCE_FLOOR = 0.85;

export const POLICY_VERSION = '2026.08-launchgood-public';

export const ASNAF: AsnafCategory[] = [
  // -------------------------------------------------------------------------
  {
    id: 'fuqara_masakin',
    label: 'The poor and the needy',
    arabic: 'al-fuqarā’ wa al-masākīn',
    posture: 'verified',
    postureRationale:
      'The least contested category and the one most campaigns claim. Verifiable ' +
      'because need is an observable material fact rather than an interpretive question.',
    contemporaryReading:
      'Direct cash or in-kind support reaching individuals below a locally-assessed ' +
      'sufficiency threshold.',
    criteria: [
      {
        id: 'fm_individual_beneficiaries',
        text: 'Funds reach identified individuals or households, not an institution’s general operating budget.',
        kind: 'llm',
        severity: 'blocking',
        evidenceExpectation:
          'A distribution plan naming beneficiary households or a caseload count with selection criteria.',
      },
      {
        id: 'fm_need_assessment',
        text: 'Some assessment of need is applied before funds are disbursed.',
        kind: 'llm',
        severity: 'material',
        evidenceExpectation:
          'A written intake or means-test process, a partner agency referral pathway, or documented local vetting.',
      },
      {
        id: 'fm_direct_transfer',
        text: 'The transfer is a grant, not a loan, an investment, or conditional on repayment.',
        kind: 'llm',
        severity: 'blocking',
        evidenceExpectation:
          'Budget and narrative describe outright disbursement with no repayment or equity terms.',
      },
      {
        id: 'fm_overhead_within_cap',
        text: 'Administrative and fundraising overhead does not exceed one eighth of the zakat pool.',
        kind: 'deterministic',
        severity: 'blocking',
        evidenceExpectation: 'An itemised budget from which overhead can be computed.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'amilin',
    label: 'Zakat administrators',
    arabic: 'al-ʿāmilīna ʿalayhā',
    posture: 'conditional',
    postureRationale:
      'Policy verifies this only where the applicant is administering zakat on behalf ' +
      'of other eligible recipients. An organisation claiming this category for its own ' +
      'operating costs, with no downstream distribution, falls outside the carve-out.',
    criteria: [
      {
        id: 'am_collects_for_others',
        text: 'The applicant collects and distributes zakat to other eligible recipients rather than retaining it.',
        kind: 'llm',
        severity: 'blocking',
        evidenceExpectation:
          'A downstream distribution record, partner list, or disbursement policy naming recipient categories.',
      },
      {
        id: 'am_share_within_cap',
        text: 'The administrative share retained does not exceed one eighth of collections.',
        kind: 'deterministic',
        severity: 'blocking',
        evidenceExpectation: 'A budget separating retained administration from onward distribution.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'muallafat_qulub',
    label: 'Those whose hearts are to be reconciled',
    arabic: 'al-muʾallafati qulūbuhum',
    posture: 'verified',
    postureRationale:
      'Policy verifies this category, but its scope varies materially between schools ' +
      'and it is the category most vulnerable to stretched interpretation. Criteria here ' +
      'are deliberately strict and the router escalates ambiguity to the scholar board ' +
      'rather than resolving it.',
    contemporaryReading:
      'Support directed toward new Muslims, or toward those whose material circumstances ' +
      'place their connection to the community at risk.',
    criteria: [
      {
        id: 'mq_named_beneficiary_class',
        text: 'The narrative identifies a specific beneficiary class this category is understood to cover.',
        kind: 'llm',
        severity: 'blocking',
        evidenceExpectation:
          'Explicit description of the beneficiary group and why this category applies to them.',
      },
      {
        id: 'mq_not_general_advocacy',
        text: 'The campaign is not general advocacy, political activity, media production, or institutional promotion.',
        kind: 'llm',
        severity: 'blocking',
        evidenceExpectation:
          'Budget and narrative show benefit reaching persons, not audience-building or messaging spend.',
      },
      {
        id: 'mq_muslim_beneficiary_nexus',
        text: 'There is a stated nexus to Muslim individuals or communities.',
        kind: 'llm',
        severity: 'blocking',
        evidenceExpectation:
          'Description of the beneficiary community, or the organisation’s own stated constituency.',
      },
      {
        id: 'mq_interpretive_novelty',
        text: 'The interpretation applied falls within readings the policy already recognises.',
        kind: 'llm',
        severity: 'material',
        evidenceExpectation:
          'Comparison against previously decided campaigns in this category.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'riqab',
    label: 'Freeing those in bondage',
    arabic: 'fī al-riqāb',
    posture: 'not_verified',
    postureRationale:
      'Policy does not verify this category. Its classical application is historical, and ' +
      'contemporary analogues are contested enough that the platform declines to adjudicate them.',
    criteria: [],
  },

  // -------------------------------------------------------------------------
  {
    id: 'gharimin',
    label: 'Those burdened by debt',
    arabic: 'al-ghārimīn',
    posture: 'not_verified',
    postureRationale:
      'Policy does not verify this category. Confirming a third party’s debt position, ' +
      'its permissibility, and that it was not incurred in disobedience requires access to ' +
      'financial records the platform cannot obtain or validate.',
    criteria: [],
  },

  // -------------------------------------------------------------------------
  {
    id: 'fi_sabilillah',
    label: 'In the path of Allah',
    arabic: 'fī sabīlillāh',
    posture: 'verified',
    postureRationale:
      'Policy verifies this under a specific contemporary reading. Because the classical ' +
      'term is broad, the encoded criteria constrain it to the reading the policy states, ' +
      'and anything outside that reading escalates rather than being resolved in code.',
    contemporaryReading:
      'Poverty alleviation, health provision, or support for Islamic religious life in ' +
      'regions where Muslims are a minority.',
    criteria: [
      {
        id: 'fs_within_stated_reading',
        text: 'The activity falls within poverty alleviation, health provision, or religious support in a Muslim-minority context.',
        kind: 'llm',
        severity: 'blocking',
        evidenceExpectation:
          'Programme description plus the beneficiary region’s demographic context.',
      },
      {
        id: 'fs_beneficiary_reach',
        text: 'Benefit reaches people rather than terminating in the organisation.',
        kind: 'llm',
        severity: 'blocking',
        evidenceExpectation: 'Beneficiary counts, service delivery plan, or distribution record.',
      },
      {
        id: 'fs_not_capital_retention',
        text: 'Funds are not retained as institutional capital, endowment, or property acquisition.',
        kind: 'llm',
        severity: 'material',
        evidenceExpectation:
          'Budget lines show programme delivery rather than asset purchase or reserves.',
      },
      {
        id: 'fs_overhead_within_cap',
        text: 'Administrative and fundraising overhead does not exceed one eighth of the zakat pool.',
        kind: 'deterministic',
        severity: 'blocking',
        evidenceExpectation: 'An itemised budget from which overhead can be computed.',
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    id: 'ibn_sabil',
    label: 'The stranded traveller',
    arabic: 'ibn al-sabīl',
    posture: 'not_verified',
    postureRationale:
      'Policy does not verify this category. The circumstances that define it are transient ' +
      'and, in practice, cannot be evidenced through a crowdfunding intake process.',
    criteria: [],
  },
];

// ---------------------------------------------------------------------------
// Cross-cutting criteria — applied to every campaign regardless of category
// ---------------------------------------------------------------------------

/**
 * These exist because the documented failure modes at platform scale were not
 * category-reasoning errors. They were cases where nobody asked whether the
 * organisation accepts zakat at all, or whether the narrative matched the box
 * that was ticked.
 */
export const UNIVERSAL_CRITERIA = [
  {
    id: 'u_org_accepts_zakat',
    text: 'The organisation itself represents that it accepts and administers zakat.',
    kind: 'llm' as const,
    severity: 'blocking' as const,
    evidenceExpectation:
      'A zakat policy, a zakat designation on the organisation’s own site, or an explicit ' +
      'statement that zakat funds are segregated and distributed as zakat.',
  },
  {
    id: 'u_narrative_matches_claim',
    text: 'The campaign narrative describes an activity consistent with the category selected at intake.',
    kind: 'llm' as const,
    severity: 'blocking' as const,
    evidenceExpectation: 'The narrative itself, read against the selected category.',
  },
  {
    id: 'u_funds_segregated',
    text: 'Zakat funds are kept distinct from general donations rather than pooled.',
    kind: 'llm' as const,
    severity: 'material' as const,
    evidenceExpectation:
      'A statement of segregated accounting, a restricted-fund policy, or separate reporting.',
  },
  {
    id: 'u_beneficiary_eligibility_screen',
    text: 'The organisation screens beneficiaries for zakat eligibility before disbursing.',
    kind: 'llm' as const,
    severity: 'material' as const,
    evidenceExpectation: 'An eligibility screening process, intake form, or documented criteria.',
  },
];

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export function getCategory(id: AsnafId): AsnafCategory {
  const found = ASNAF.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown asnaf category: ${id}`);
  return found;
}

export function isVerifiableCategory(id: AsnafId): boolean {
  return getCategory(id).posture !== 'not_verified';
}

/** All criteria that apply to a campaign claiming `id`, universal ones included. */
export function criteriaFor(id: AsnafId) {
  return [...UNIVERSAL_CRITERIA, ...getCategory(id).criteria];
}

export function criterionById(criterionId: string) {
  const universal = UNIVERSAL_CRITERIA.find((c) => c.id === criterionId);
  if (universal) return universal;
  for (const cat of ASNAF) {
    const found = cat.criteria.find((c) => c.id === criterionId);
    if (found) return found;
  }
  return undefined;
}

/**
 * Categories where a plausible-sounding campaign most often turns out to be
 * outside policy. The router uses this to bias toward scholar escalation rather
 * than resolving borderline cases itself.
 */
export const HIGH_INTERPRETIVE_RISK: AsnafId[] = ['muallafat_qulub', 'fi_sabilillah'];
