/**
 * Mizan — corpus exemplar.
 *
 * This file defines the shape every corpus slice must follow. It is the pattern
 * other data files are written against. It ships one clean-eligible case and one
 * hard negative so both poles are demonstrated.
 *
 * ALL DATA IN THE CORPUS IS SYNTHETIC. Organisation names, people, registration
 * numbers and documents are invented. Cases are constructed to exercise failure
 * *classes* that any zakat-verification process must handle; none depicts a real
 * organisation or a real decision.
 */

import type { Campaign, GoldLabel } from '@/lib/types';

export interface CorpusEntry {
  campaign: Campaign;
  gold: GoldLabel;
}

export const EXEMPLARS: CorpusEntry[] = [
  // =========================================================================
  // A clean, well-documented case in the least contested category.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1001',
      title: 'Winter cash assistance for 240 displaced families in Sindh',
      organizerName: 'Amanah Relief Trust',
      organizerType: 'registered_nonprofit',
      beneficiaryCountry: 'Pakistan',
      organizerCountry: 'United Kingdom',
      goalUsd: 96_000,
      claimedCategory: 'fuqara_masakin',
      submittedAt: '2026-07-14',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Unconditional cash transfers to 240 households', amountUsd: 84_000, declaredAsOverhead: false },
        { label: 'Local partner distribution and beneficiary verification', amountUsd: 6_000, declaredAsOverhead: false },
        { label: 'Programme staff time', amountUsd: 4_200, declaredAsOverhead: true },
        { label: 'Payment processing fees', amountUsd: 1_800, declaredAsOverhead: true },
      ],
      priorCampaignIds: ['lg-0871'],
      sources: [
        {
          id: 'lg-1001-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-07-14',
          language: 'en',
          text: `Flooding across northern Sindh in June displaced roughly 11,000 households from villages along the Indus. We are raising unconditional cash assistance for 240 of those households through the winter.

Each household receives PKR 98,000 across three monthly transfers, delivered by our local partner Sindh Rural Support Network. Cash rather than in-kind because the district markets are functioning and families consistently tell us they need different things — some school fees, some medicine, some replacing a lost livestock animal.

Households are selected by SRSN caseworkers using our standard intake assessment. To qualify, a household must have lost its primary dwelling or its main income source, and must fall below the district poverty line as measured by our means test. We prioritise households headed by widows and those with a member who has a disability. The assessment form and scoring rubric are attached.

Amanah Relief Trust holds all zakat funds in a designated account separate from general donations. Zakat is disbursed only to households confirmed eligible under our zakat screening, which is applied in addition to the poverty assessment. We do not use zakat funds for our own operating costs beyond the administrative share permitted, which we cap at one eighth in line with our published zakat policy.

This is a grant. Nothing is repaid, and no household is asked for anything in return.`,
        },
        {
          id: 'lg-1001-registration',
          kind: 'org_registration',
          title: 'Charity Commission registration extract',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-07-14',
          language: 'en',
          text: `CHARITY COMMISSION FOR ENGLAND AND WALES — REGISTER EXTRACT

Registered charity name: Amanah Relief Trust
Registration number: 1174* (synthetic)
Date of registration: 4 March 2016
Status: Registered, accounts up to date

Objects: The relief of poverty and financial hardship among persons in need, in the United Kingdom and overseas, in particular through the provision of grants, goods and services.

Latest annual return filed: 31 March 2026. Total income GBP 4.2m. Total expenditure GBP 3.9m, of which charitable activities GBP 3.5m and raising funds GBP 0.3m.`,
        },
        {
          id: 'lg-1001-website',
          kind: 'website_capture',
          title: 'amanahrelief.example.org/zakat',
          provenance: 'Web capture',
          capturedAt: '2026-07-02',
          language: 'en',
          text: `Zakat at Amanah Relief Trust

We accept zakat and we treat it as a trust, not as income.

Segregated accounting. Every pound of zakat you give is held in a designated zakat account. It is never pooled with general donations and never used to cover unrestricted costs.

Eligibility screening. Before any zakat is disbursed, the receiving household is screened against the categories of eligible recipients. Our field teams apply this screen in addition to the poverty assessment we use for all our programmes.

Administrative share. We take no more than one eighth of zakat received to cover the cost of collecting and distributing it, consistent with the majority position. In the 2025-26 year our actual figure was 9.1%.

100% policy. We do not operate a "100% of your donation" claim, because we think it is misleading. We tell you exactly what the administrative share is instead.`,
        },
        {
          id: 'lg-1001-assessment',
          kind: 'beneficiary_documentation',
          title: 'Household eligibility assessment form and scoring rubric',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-07-14',
          language: 'en',
          text: `SRSN / AMANAH RELIEF TRUST — HOUSEHOLD ELIGIBILITY ASSESSMENT

Section 1 — Displacement status. Primary dwelling destroyed or uninhabitable (Y/N). Date of displacement. Current shelter arrangement.

Section 2 — Income. Primary earner occupation before displacement. Current monthly household income (PKR). Number of dependants.

Section 3 — Assets. Livestock held before and after. Land tenure. Productive assets lost.

Section 4 — Vulnerability weighting. Widow-headed household (+2). Household member with disability (+2). Children under 5 (+1 each, max +3). No adult male earner (+1).

Scoring. Households scoring 4 or above and reporting monthly income below PKR 32,000 (district poverty line) are eligible. Caseworker signature and date required. Ten per cent of completed assessments are re-verified by a second caseworker.

Zakat screen. Applied separately. Confirms the household holds assets below nisab and is not in receipt of zakat from another distributing body in the same period.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1001',
      expectedRouting: 'fast_lane_review',
      expectedEligible: true,
      expectedCategory: 'fuqara_masakin',
      failureClass: 'clean_eligible',
      rationale:
        'Individual beneficiaries, documented means test, explicit grant with no repayment, ' +
        'segregated zakat accounting, and derived overhead of 6.25% against a 12.5% cap. Every ' +
        'criterion is satisfied by a quotable source. This is what the fast lane is for — a ' +
        'reviewer confirms rather than investigates.',
    },
  },

  // =========================================================================
  // Hard negative: the failure class where an organisation is competent and
  // well-run but does not itself accept zakat, and the category was chosen
  // because its criteria are the loosest available.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1002',
      title: 'Documentary series on civic participation in the Balkans',
      organizerName: 'Bridge Narratives Foundation',
      organizerType: 'registered_nonprofit',
      beneficiaryCountry: 'Bosnia and Herzegovina',
      organizerCountry: 'United States',
      goalUsd: 140_000,
      claimedCategory: 'muallafat_qulub',
      submittedAt: '2026-06-28',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Film production crew and equipment', amountUsd: 62_000, declaredAsOverhead: false },
        { label: 'Post-production and editing', amountUsd: 28_000, declaredAsOverhead: false },
        { label: 'Distribution and festival submissions', amountUsd: 18_000, declaredAsOverhead: false },
        { label: 'Social media promotion', amountUsd: 16_000, declaredAsOverhead: false },
        { label: 'Programme director salary', amountUsd: 12_000, declaredAsOverhead: false },
        { label: 'Administration', amountUsd: 4_000, declaredAsOverhead: true },
      ],
      priorCampaignIds: [],
      sources: [
        {
          id: 'lg-1002-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-06-28',
          language: 'en',
          text: `Bridge Narratives Foundation is producing a six-part documentary series on civic participation among young people in Bosnia and Herzegovina, thirty years after the war.

The series follows eight young people — Bosniak, Croat and Serb — as they organise across community lines in Sarajevo, Mostar and Tuzla. Our aim is to soften entrenched divisions by showing audiences that cooperation is already happening.

We believe this work reconciles hearts. Reconciliation is what our organisation exists for, and we understand that to be an eligible use of zakat.

Funds cover a production crew of eleven over fourteen months, post-production, festival distribution, and a social media campaign to reach audiences across the region and the diaspora. Our programme director will oversee delivery.

Bridge Narratives Foundation is a registered 501(c)(3) in the United States. We have produced three previous documentary series on post-conflict societies, screened at eleven festivals.`,
        },
        {
          id: 'lg-1002-registration',
          kind: 'org_registration',
          title: 'IRS determination letter',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-06-28',
          language: 'en',
          text: `INTERNAL REVENUE SERVICE — DETERMINATION LETTER

Bridge Narratives Foundation
EIN: 47-XXXXXXX (synthetic)

We have determined you are exempt from federal income tax under section 501(c)(3) of the Internal Revenue Code. You are classified as a public charity.

Purpose as stated in your application: to produce and distribute documentary film and media that promotes intercommunal understanding and civic participation in post-conflict societies.`,
        },
        {
          id: 'lg-1002-website',
          kind: 'website_capture',
          title: 'bridgenarratives.example.org/support',
          provenance: 'Web capture',
          capturedAt: '2026-06-20',
          language: 'en',
          text: `Support our work

Bridge Narratives Foundation is funded by individual donors, foundation grants and broadcast pre-sales. Donations are tax-deductible in the United States.

Ways to give: one-time gift, monthly giving circle, legacy giving, donor-advised fund transfer, appreciated securities.

Our funders include the Kellerman Family Foundation, the Open Societies Media Fund and the Nordic Documentary Initiative.

We are a secular organisation and we work with communities of all faiths and none. Our editorial independence is absolute and we accept no funding that carries editorial conditions.

Financial transparency: our most recent Form 990 and audited financials are available here. In FY2025, programme expenses were 71% of total expenditure, with management and general at 18% and fundraising at 11%.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1002',
      expectedRouting: 'priority_review',
      expectedEligible: false,
      expectedCategory: null,
      failureClass: 'org_does_not_accept_zakat',
      rationale:
        'Three independent blocking failures, any one of which is disqualifying. The organisation ' +
        'describes itself as secular and its own giving page lists no zakat pathway, segregated ' +
        'account or eligibility screen. The spend is media production and audience-building, not ' +
        'benefit reaching persons. And "softening hearts" is being read as softening the hearts ' +
        'of an *audience*, which is not the category. Derived overhead is also 22.9% once salary ' +
        'and promotion are classified from their labels, against a declared 2.9%. This is the ' +
        'exact shape of the failure that gets a platform criticised: a competent, sympathetic, ' +
        'well-documented organisation that is simply not a zakat recipient.',
    },
  },
];
