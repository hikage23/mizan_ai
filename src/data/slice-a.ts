/**
 * Mizan — corpus slice A: category mismatch, the administrative cap boundary,
 * and honest ineligibility.
 *
 * Three failure classes, chosen because they are the ones where a competent
 * reviewer and a careless one reach different answers on the same paperwork:
 *
 *   category_mismatch   — the narrative sits in one asnaf category and was filed
 *                         under another. Sometimes an honest intake error,
 *                         sometimes the cheapest available route around the
 *                         criteria that would actually test the case.
 *   admin_cap_boundary  — the one-eighth ceiling, approached from under, breached
 *                         only after labels are re-derived, and genuinely
 *                         contested at the line. Every percentage asserted in a
 *                         rationale below is the figure `analyseOverhead` produces
 *                         from the budget as written.
 *   clean_ineligible    — well-run organisations, complete documentation, real
 *                         need, and no zakat basis. Documentation quality and
 *                         eligibility are orthogonal, and a system that conflates
 *                         them will grant badges to whoever files most neatly.
 *
 * ALL DATA IN THE CORPUS IS SYNTHETIC. Organisation names, people, registration
 * numbers, hospital accounts and documents are invented; registration numbers are
 * marked (synthetic) and all domains are example.org. Places, demographics and
 * programme mechanics are realistic because a case that turns on an implausible
 * fact does not measure anything. No entry depicts a real organisation or a real
 * decision.
 */

import type { CorpusEntry } from './_exemplar';

export const SLICE_A: CorpusEntry[] = [
  // =========================================================================
  // lg-1010 — category_mismatch
  // Orphan sponsorship, substantively sound, filed under the broadest category
  // available. The interesting property: re-classification does not sink it.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1010',
      title: 'Sponsor 180 orphaned children in the Mopti region for the 2026-27 school year',
      organizerName: 'Ansar Sahel Foundation',
      organizerType: 'registered_nonprofit',
      beneficiaryCountry: 'Mali',
      organizerCountry: 'France',
      goalUsd: 62_000,
      claimedCategory: 'fi_sabilillah',
      submittedAt: '2026-05-19',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Monthly stipends to 180 orphan households', amountUsd: 44_000, declaredAsOverhead: false },
        { label: 'School fees, uniforms and books for 180 children', amountUsd: 9_600, declaredAsOverhead: false },
        { label: 'Annual medical check-ups and treatment fund', amountUsd: 3_200, declaredAsOverhead: false },
        { label: 'Local caseworker salaries', amountUsd: 3_400, declaredAsOverhead: true },
        { label: 'Money transfer and processing fees', amountUsd: 1_800, declaredAsOverhead: true },
      ],
      priorCampaignIds: ['lg-0742'],
      sources: [
        {
          id: 'lg-1010-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-05-19',
          language: 'en',
          text: `Ansar Sahel Foundation has run an orphan sponsorship programme in the communes around Sevare and Konna, in the Mopti region of central Mali, since 2019. This campaign funds 180 children for the 2026-27 school year. All 180 are children who have lost their father, their mother, or both, and who are living with an extended-family guardian rather than in an institution. We do not build orphanages and we do not intend to.

Each child's guardian household receives 22,000 CFA francs a month, roughly 36 dollars, for twelve months. Payment goes out through Orange Money to a phone number registered in the guardian's name, and where the guardian has no handset our caseworker in Sevare pays in cash against a signed receipt at the commune hall. School fees, a uniform and a book set are paid once a year directly to whichever of the eleven partner schools the child attends, itemised per child. A small medical fund covers an annual check-up and treatment for the ordinary things — malaria, respiratory infections, a broken arm.

Children enter the programme through a two-stage assessment. First, orphan status is confirmed against the commune civil registry, using the acte de deces where one was issued and, where none was, a written attestation from the commune secretary and two witnesses. Second, our caseworkers complete a guardian household income survey: monthly income, number of dependants, livestock held, land tenure and whether any other agency is already supporting the child. Households above 85,000 CFA francs a month are not enrolled. Widow-headed and grandparent-headed households are ranked first, and there is a waiting list of 240 children we cannot yet fund.

The stipend is a grant. Guardians repay nothing, own nothing to us, and are asked for nothing in return except that the child stays enrolled and the caseworker is allowed to visit twice a year. If a child leaves school the sponsorship pauses and the caseworker investigates why; in 2025 that happened eleven times and in nine of those cases the child returned.

Ansar Sahel Foundation accepts zakat and holds it in a dedicated account at our bank in Lyon, separate from our general funds and from our institutional grants. Before any zakat is disbursed we apply a zakat eligibility screen to the guardian household in addition to the income survey: the household must hold assets below nisab and must not be receiving zakat from another distributing body in the same period. Our administrative share of zakat received is capped at one eighth and was 8.4% on this appeal.

At intake we selected "In the path of Allah" because it is the broadest of the eight categories and because our sponsorship work sits alongside masjid and madrasa partnerships in the same communes. We are happy to be told a different category fits better.

Sixty-two thousand dollars keeps 180 children in school for a year, in their own families, in their own villages.`,
        },
        {
          id: 'lg-1010-budget',
          kind: 'budget_breakdown',
          title: 'Itemised budget, 2026-27 sponsorship year',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-05-19',
          language: 'en',
          text: `ANSAR SAHEL FOUNDATION — SPONSORSHIP APPEAL 2026-27
Total appeal: USD 62,000

1. Monthly stipends to 180 orphan households — USD 44,000
   180 households x 22,000 CFA x 12 months, converted at 605 CFA to the dollar. Paid to the guardian, not to the school and not to us.

2. School fees, uniforms and books for 180 children — USD 9,600
   Paid annually to eleven partner schools against a per-child invoice. Average 53 dollars per child.

3. Annual medical check-ups and treatment fund — USD 3,200
   One check-up per child at the Sevare health centre plus a pooled treatment fund drawn down on presentation of a prescription.

4. Local caseworker salaries — USD 3,400
   Two part-time caseworkers based in Sevare and Konna. Classified by us as administrative cost.

5. Money transfer and processing fees — USD 1,800
   Orange Money charges and international remittance costs. Classified by us as administrative cost.

Administrative total: USD 5,200 of USD 62,000, or 8.4%. Our ceiling is one eighth.`,
        },
        {
          id: 'lg-1010-registration',
          kind: 'org_registration',
          title: 'Journal Officiel association declaration extract',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-05-19',
          language: 'en',
          text: `REPUBLIQUE FRANCAISE — ASSOCIATION DECLARATION EXTRACT (translated)

Name: Ansar Sahel Foundation (Fondation Ansar Sahel)
RNA number: W691* (synthetic)
Declared: 12 September 2018, Prefecture of the Rhone
Status: Active, annual accounts filed to 31 December 2025

Declared object: The relief of poverty among children who have lost one or both parents, and among the households caring for them, in the Sahel region; the payment of school fees, subsistence support and medical costs for such children.

Latest accounts: total resources EUR 1.36m, total charges EUR 1.29m, of which programme charges EUR 1.18m and running costs EUR 0.11m.`,
        },
        {
          id: 'lg-1010-assessment',
          kind: 'beneficiary_documentation',
          title: 'Guardian household income survey and orphan status verification form',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-05-19',
          language: 'en',
          text: `ANSAR SAHEL FOUNDATION — ENROLMENT ASSESSMENT (translated from French)

Part A — Orphan status. Name of child. Date of birth. Name of deceased parent or parents. Acte de deces reference, or, where no death certificate was issued, attestation by the commune secretary plus two named witnesses. Caseworker confirms the child is living with a named guardian and is not resident in an institution.

Part B — Guardian household income. Guardian name and relationship to child. Monthly household income in CFA. Number of dependants. Livestock held. Land tenure. Other agency support received for this child, if any.

Part C — Ranking. Widow-headed household (+3). Grandparent-headed household (+3). Four or more dependants (+2). No adult in paid work (+2). Child previously withdrawn from school for fees (+2).

Threshold. A household reporting monthly income above 85,000 CFA francs is not enrolled regardless of score. Caseworker signature and date required on every form.

Part D — Zakat screen. Applied separately before any zakat funds are released to the household. Confirms the guardian household holds assets below nisab and is not receiving zakat from another distributing body in the same period. A household that fails the zakat screen may still be sponsored from our general funds.`,
        },
        {
          id: 'lg-1010-prior',
          kind: 'prior_campaign',
          title: 'Prior campaign record: lg-0742',
          provenance: 'Platform system of record',
          capturedAt: '2026-05-19',
          language: 'en',
          text: `PLATFORM RECORD — PRIOR CAMPAIGN BY THIS ORGANIZER

Campaign lg-0742: "Sponsor 120 orphaned children in the Mopti region for the 2025-26 school year"
Organizer: Ansar Sahel Foundation
Raised: USD 41,300 of a USD 44,000 goal
Category at intake: The poor and the needy (fuqara_masakin)
Zakat designation: granted, 14 March 2025
Reviewer note on file: "Same programme design as their 2024 appeal. Stipends to guardian households, means-tested, grant not loan. Sits squarely in the poor and needy category. Administrative share 8.1%."

No complaints, chargebacks or reporting failures recorded against this organizer.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1010',
      expectedRouting: 'priority_review',
      expectedEligible: true,
      expectedCategory: 'fuqara_masakin',
      failureClass: 'category_mismatch',
      rationale:
        'The narrative describes means-tested stipends to identified guardian households — the ' +
        'least contested category there is — and the organizer\'s own prior campaign was verified ' +
        'under it. Filing under "In the path of Allah" is what makes this a priority case, because ' +
        'that category has no need-assessment criterion, so the box ticked at intake routes around ' +
        'the only test that would have interrogated this programme. Substance survives ' +
        're-classification: individual beneficiaries, a documented income survey, an explicit grant, ' +
        'segregated zakat accounting and derived overhead of 8.4% against the 12.5% cap. The ' +
        'measured distinction is between a wrong box and a wrong campaign, and a reviewer who ' +
        'rejects this one has failed the case as badly as one who fast-lanes it.',
    },
  },

  // =========================================================================
  // lg-1011 — category_mismatch
  // Debt settlement filed as poverty relief. Re-classification moves the case
  // out of the verifiable set entirely, which is why the mismatch matters.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1011',
      title: 'Clear the hospital debts of four families in Tripoli',
      organizerName: 'Abu Samra Mutual Aid Circle',
      organizerType: 'unregistered_group',
      beneficiaryCountry: 'Lebanon',
      organizerCountry: 'Germany',
      goalUsd: 8_500,
      claimedCategory: 'fuqara_masakin',
      submittedAt: '2026-04-06',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Settlement of outstanding hospital accounts for four households', amountUsd: 7_600, declaredAsOverhead: false },
        { label: 'Pharmacy arrears for chronic medicines', amountUsd: 600, declaredAsOverhead: false },
        { label: 'Bank transfer and processing fees', amountUsd: 300, declaredAsOverhead: true },
      ],
      priorCampaignIds: [],
      sources: [
        {
          id: 'lg-1011-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-04-06',
          language: 'en',
          text: `We are a group of eleven people from Tripoli now living in Berlin, Dortmund and Bremen. Twice a year we raise money for households in the Abu Samra and Qobbeh neighbourhoods we grew up in. This appeal is for four families who cannot get out from under hospital bills.

All four debts were incurred at Al Rawda Private Hospital in Tripoli between late 2024 and October 2025, during the worst of the currency collapse, when the hospital moved to billing in dollars while these families were still earning in lira. The H. household owes 3,150 dollars for a caesarean section and eight days in the neonatal unit. The S. household owes 2,240 dollars for the father's cardiac stenting. The A. household owes 1,410 dollars for their daughter's appendectomy and the ward stay after it. The M. household owes 800 dollars for two rounds of dialysis taken before the father's file transferred to the public hospital. Nothing here is elective and nothing here is old.

The hospital's billing department has issued a statement of account for each family, and each account is now with the hospital's collections desk. Under our arrangement the transfer is made directly to the hospital's billing office against each family's account number, not to the family, and the hospital signs off that the balance is cleared and the file is closed. Two of the four families have been told they cannot book further appointments until the balance is settled, which is why the dialysis case matters most.

None of the four can pay. The H. household's income is one father driving a delivery motorbike, about 240 dollars a month for six people. The S. household lives on a grandmother's pension and remittances from a son in Erbil. The A. household's father is a day labourer in construction and worked nineteen days in February. The M. household has no earner at all since the father started dialysis. We have written household income notes for all four, prepared by our cousin who visits each of them.

Our circle collects zakat every Ramadan and again in Dhul Hijjah. Zakat contributions are held in a separate account at Sparkasse in the treasurer's name and are never mixed with our general fund, and we report to contributors afterwards on exactly which households received what. We do not take anything for ourselves — the only cost is the bank's transfer charge.

We ticked "The poor and the needy" because these four families are poor. If that is the wrong box we will change it, but the money is needed either way.`,
        },
        {
          id: 'lg-1011-budget',
          kind: 'budget_breakdown',
          title: 'Itemised budget',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-04-06',
          language: 'en',
          text: `ABU SAMRA MUTUAL AID CIRCLE — SPRING 2026 APPEAL
Total: USD 8,500

1. Settlement of outstanding hospital accounts for four households — USD 7,600
   H. household 3,150. S. household 2,240. A. household 1,410. M. household 800. Paid directly to Al Rawda Private Hospital billing against each account number. Receipts and closure letters to be uploaded after payment.

2. Pharmacy arrears for chronic medicines — USD 600
   Standing balances at two pharmacies on Bulevar Street for blood pressure and diabetes medicines already dispensed on credit to the S. and M. households.

3. Bank transfer and processing fees — USD 300
   International transfer charges and the exchange spread. Classified by us as administrative cost.

Administrative total: USD 300 of USD 8,500, or 3.5%.

Note: every line above settles a balance already owed. None of it is forward-looking treatment cost.`,
        },
        {
          id: 'lg-1011-statements',
          kind: 'beneficiary_documentation',
          title: 'Hospital statements of account (four households)',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-03-28',
          language: 'en',
          text: `AL RAWDA PRIVATE HOSPITAL — TRIPOLI, LEBANON
STATEMENT OF ACCOUNT (translated from Arabic, names redacted by organizer)

Account 24-3318 — Patient: H., female, 29. Admission 14 November 2024. Caesarean section, neonatal unit 8 days. Charges USD 4,150. Payments received USD 1,000. OUTSTANDING BALANCE USD 3,150. Status: referred to collections 2 February 2025.

Account 25-0871 — Patient: S., male, 61. Admission 3 March 2025. Coronary angioplasty, two stents. Charges USD 3,940. Payments received USD 1,700. OUTSTANDING BALANCE USD 2,240. Status: referred to collections 9 August 2025.

Account 25-1902 — Patient: A., female, 12. Admission 21 June 2025. Appendectomy, ward 4 days. Charges USD 1,610. Payments received USD 200. OUTSTANDING BALANCE USD 1,410. Status: referred to collections 4 November 2025. Note on file: further appointments suspended pending settlement.

Account 25-2440 — Patient: M., male, 54. Haemodialysis, two sessions, 6 and 13 October 2025. Charges USD 800. Payments received nil. OUTSTANDING BALANCE USD 800. Status: referred to collections 1 December 2025. Note on file: further appointments suspended pending settlement.

Settlement of an outstanding balance closes the account. The hospital issues a closure letter to the payer on receipt of cleared funds.`,
        },
        {
          id: 'lg-1011-correspondence',
          kind: 'correspondence',
          title: 'Email from circle treasurer on zakat handling',
          provenance: 'Reviewer request, organizer reply',
          capturedAt: '2026-04-06',
          language: 'en',
          text: `From: treasurer@abusamracircle.example.org
Subject: Re: how do you handle zakat

Thank you for asking, most people don't.

We collect zakat every Ramadan and again in Dhul Hijjah. Zakat contributions are held in a separate account at Sparkasse in the treasurer's name and are never mixed with our general fund. We keep a one-page ledger showing which household received which amount from which pot, and we send it to contributors after each distribution.

Before we release zakat to a household we check three things: that their assets are below nisab, that no other group is already covering the same bill, and that the household is Muslim. All four households in this appeal pass.

We are not a registered charity. We are eleven people with jobs, and we have been doing this since 2019. We understand that limits what the platform can verify about us and we would rather say so than pretend otherwise.

One thing we should be straight about: every dollar in this appeal goes to a bill that has already come due. We are not paying for anyone's future treatment. We are clearing what four families already owe.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1011',
      expectedRouting: 'priority_review',
      expectedEligible: false,
      expectedCategory: 'gharimin',
      failureClass: 'category_mismatch',
      rationale:
        'Every dollar settles a balance already owed to a named creditor, paid to the hospital ' +
        'against an account number rather than to the household — the organizer says so twice and ' +
        'the statements of account confirm it. That is debt relief, which is gharimin, and policy ' +
        'does not verify gharimin because a third party\'s debt position cannot be validated from ' +
        'a crowdfunding intake. The claimed category is one the policy does verify, so the ' +
        'category-verifiability check passes and nothing stops this case except a reviewer noticing ' +
        'the mismatch; filed under its own category it would have been excluded at the first branch ' +
        'of the router. Ineligible for the badge, and the reason is the shape of the transaction, ' +
        'not any doubt about the need.',
    },
  },

  // =========================================================================
  // lg-1012 — admin_cap_boundary, comfortably under
  // The cap check has to be measured from both sides. Declared and derived
  // overhead agree at 11.2%; nothing is reclassified; the case fast-lanes.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1012',
      title: 'Six months of cash and food support for 310 farming households in Maguindanao del Sur',
      organizerName: 'Nusantara Zakat Trust',
      organizerType: 'registered_nonprofit',
      beneficiaryCountry: 'Philippines',
      organizerCountry: 'Malaysia',
      goalUsd: 125_000,
      claimedCategory: 'fuqara_masakin',
      submittedAt: '2026-03-11',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Unconditional cash transfers to 310 households, six monthly rounds', amountUsd: 78_000, declaredAsOverhead: false },
        { label: 'Food parcels for 310 households', amountUsd: 21_000, declaredAsOverhead: false },
        { label: 'Medicines for the mobile clinic rounds', amountUsd: 12_000, declaredAsOverhead: false },
        { label: 'Programme staff time and field office costs', amountUsd: 9_500, declaredAsOverhead: true },
        { label: 'Payment processing fees and bank charges', amountUsd: 3_000, declaredAsOverhead: true },
        { label: 'External audit fee and annual accounting', amountUsd: 1_500, declaredAsOverhead: true },
      ],
      priorCampaignIds: ['lg-0688', 'lg-0955'],
      sources: [
        {
          id: 'lg-1012-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-03-11',
          language: 'en',
          text: `The Liguasan Marsh flooded again in December. In Datu Piang and Shariff Aguak, in Maguindanao del Sur, the second planting of the year went under and did not come back. Nusantara Zakat Trust is funding six months of cash and food support for 310 farming households across nine barangays while they wait for the March-to-August cycle.

Each household receives PHP 4,200 a month for six months, sent through GCash to a number registered in the name of the household head. Where a household has no mobile wallet, our partner the Rajah Buayan Community Development Council pays cash at the barangay hall against a signed and thumb-printed receipt. Alongside the cash, each household receives a monthly food parcel of rice, cooking oil, dried fish and salt, procured in Cotabato City so the money stays in the regional economy. A mobile clinic runs one day a month in each cluster of three barangays, and the medicines line covers what it dispenses.

Cash rather than in-kind for the bulk of it, because we have run this three times now and the pattern is consistent: households spend the first month on debt at the sari-sari store, the second on school costs, and from the third month on seed and fertiliser for the next planting. Handing out seed in month one would have been the wrong call and we only learned that by asking.

Selection was done by RBCDC field officers in January using our standard means test, then validated at a barangay assembly where the list is read aloud and can be challenged. To qualify a household must farm less than two hectares or be landless tenant farmers, must report monthly income below PHP 9,000, and must have lost a standing crop in the December flooding. We cross-check the list against the municipal social welfare office register so we are not duplicating national cash assistance. Fourteen households were removed at the barangay assembly stage and four were added.

Nusantara Zakat Trust accepts zakat and administers it as a trust. Zakat is held in a designated account at our bank in Kuala Lumpur, is never pooled with our general donations, and is never used to cover unrestricted costs. Every household is screened against the eight categories of eligible recipients before zakat is released to it, in addition to the means test, and the screening form is attached to this submission. Our administrative share on this appeal is 11.2%, against the ceiling of one eighth that our published policy sets.

The transfers are grants. No household repays anything, no household is asked for labour or produce in return, and there is no equity, loan or matching requirement anywhere in this programme.

This is the third time we have worked with RBCDC in this corridor. Our two previous appeals in Maguindanao are on the platform and both reported on time.`,
        },
        {
          id: 'lg-1012-budget',
          kind: 'budget_breakdown',
          title: 'Itemised budget with administrative share calculation',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-03-11',
          language: 'en',
          text: `NUSANTARA ZAKAT TRUST — MAGUINDANAO APPEAL, MARCH 2026
Total appeal: USD 125,000

PROGRAMME
1. Unconditional cash transfers to 310 households, six monthly rounds — USD 78,000
   310 households x PHP 4,200 x 6 months at PHP 58 to the dollar, plus a 3% contingency held for households added at barangay validation.
2. Food parcels for 310 households — USD 21,000
   Six parcels per household. Rice 10kg, cooking oil 2L, dried fish 1kg, salt. Procured in Cotabato City.
3. Medicines for the mobile clinic rounds — USD 12,000
   Antimalarials, oral rehydration salts, antibiotics, wound care, prenatal supplements. Dispensed free at point of care.
   Programme subtotal: USD 111,000

ADMINISTRATIVE
4. Programme staff time and field office costs — USD 9,500
   Two Kuala Lumpur programme staff at 30% of time for six months, and RBCDC's field office costs in Datu Piang.
5. Payment processing fees and bank charges — USD 3,000
   GCash disbursement charges, correspondent bank fees, foreign exchange spread.
6. External audit fee and annual accounting — USD 1,500
   Share of our statutory audit attributable to this appeal.
   Administrative subtotal: USD 14,000

ADMINISTRATIVE SHARE: 14,000 / 125,000 = 11.2%. Ceiling under our zakat policy: 12.5%.

We classify staff time and field office costs as administrative even though most of that time is spent on beneficiary selection, because we would rather over-state our overhead than argue about it.`,
        },
        {
          id: 'lg-1012-registration',
          kind: 'org_registration',
          title: 'Registrar of Societies Malaysia — registration extract',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-03-11',
          language: 'en',
          text: `JABATAN PENDAFTARAN PERTUBUHAN MALAYSIA — REGISTRATION EXTRACT (translated)

Registered name: Nusantara Zakat Trust (Amanah Zakat Nusantara)
Registration number: PPM-014-10-2201* (synthetic)
Date of registration: 22 January 2014
Status: Registered and in good standing. Annual returns filed to 31 December 2025.

Objects: To collect, administer and distribute zakat and sadaqah to eligible recipients in Malaysia and abroad, in accordance with the eight categories of recipients; to provide relief of poverty, food security and health provision to poor households.

Latest annual return: total receipts MYR 18.4m, of which zakat MYR 11.9m held in designated accounts. Total distributions MYR 17.1m. Administration and fundraising MYR 1.4m, being 7.6% of receipts.`,
        },
        {
          id: 'lg-1012-website',
          kind: 'website_capture',
          title: 'nusantarazakat.example.org/our-zakat-policy',
          provenance: 'Web capture',
          capturedAt: '2026-02-27',
          language: 'en',
          text: `Our zakat policy

We accept zakat. We treat it as an obligation you are discharging through us, not as income we have earned.

Designated accounts. Zakat is held in designated accounts at Bank Islam and is never pooled with general donations. Our auditors test the segregation every year and the test result is printed in our annual report.

Recipient screening. Every household is screened against the eight categories of eligible recipients before zakat is released to it. The screen is separate from, and additional to, the poverty means test we apply to all our programmes. A household that fails the zakat screen may still receive support from our general funds.

Administrative share. We retain no more than one eighth of zakat received to cover the cost of collecting and distributing it. Across the 2025 financial year our actual figure was 7.6%. On individual appeals it runs between 6% and 12%, and we publish the figure on every appeal page before it opens.

No hundred-per-cent claim. We do not tell donors that 100% of their gift reaches a family, because it does not and no organisation's does. We tell them the number instead.

Reporting. Every appeal closes with a distribution report naming the barangay or village, the number of households, the amount per household and the date paid.`,
        },
        {
          id: 'lg-1012-screening',
          kind: 'beneficiary_documentation',
          title: 'Household means test and zakat recipient screening form',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-03-11',
          language: 'en',
          text: `NUSANTARA ZAKAT TRUST / RBCDC — HOUSEHOLD ASSESSMENT, MAGUINDANAO 2026

SECTION 1 — MEANS TEST
Landholding: owned hectares / tenanted hectares / landless. Threshold: under two hectares owned, or landless tenant.
Monthly household income (PHP), all sources including remittances. Threshold: below PHP 9,000.
Standing crop lost in December 2025 flooding: yes / no / partial. Barangay agricultural technician countersigns.
Household size and number of dependants under 15.
Cross-check: household appears on municipal social welfare office register for national cash assistance? If yes, household is recorded and the transfer is reduced, not withdrawn.

SECTION 2 — ZAKAT RECIPIENT SCREENING
Applied before zakat funds are released to the household, in addition to Section 1.
2.1 Household assets valued below nisab (gold equivalent, assessed at current Cotabato City rate)? Y/N
2.2 Which of the eight categories applies? Tick one: poor and needy / debt-burdened / other, specify.
2.3 Is the household receiving zakat from another distributing body this period? Y/N
2.4 Screener name, signature, date.
A household answering N to 2.1 or Y to 2.3 is not paid from zakat funds. It may be paid from general funds and is recorded separately.

SECTION 3 — VALIDATION
Draft list read aloud at barangay assembly. Challenges recorded with reason. Final list signed by barangay chair and RBCDC field supervisor. January 2026: 14 households removed, 4 added.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1012',
      expectedRouting: 'fast_lane_review',
      expectedEligible: true,
      expectedCategory: 'fuqara_masakin',
      failureClass: 'admin_cap_boundary',
      rationale:
        'Derived overhead is $14,000 of $125,000, or 11.2%, and it agrees with the declared figure ' +
        'to the cent because the organizer classified staff time and field office costs as ' +
        'administrative even where they could have argued otherwise. No line is reclassified, so ' +
        'the classification-dispute check does not fire, and 1.3 points of headroom is close enough ' +
        'to the ceiling to be a real test rather than a trivial pass. Every other criterion is ' +
        'satisfied by a quotable sentence: means test with barangay validation, an asnaf screen ' +
        'applied separately from the poverty test, segregated designated accounts, and an explicit ' +
        'statement that the transfers are grants. The cap boundary has to be measured from under ' +
        'as well as over, or the eval only rewards suspicion.',
    },
  },

  // =========================================================================
  // lg-1013 — admin_cap_boundary, breached only on re-derivation
  // Declared 4.0%. Derived 19.0%. The gap is three lines the organizer called
  // programme cost and described, in their own budget document, as overhead.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1013',
      title: 'Emergency food, water and medical outreach for 1,400 households in Tillaberi',
      organizerName: 'Sahel Horizon Aid',
      organizerType: 'registered_nonprofit',
      beneficiaryCountry: 'Niger',
      organizerCountry: 'United States',
      goalUsd: 200_000,
      claimedCategory: 'fuqara_masakin',
      submittedAt: '2026-06-02',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Emergency food baskets for 1,400 families', amountUsd: 96_000, declaredAsOverhead: false },
        { label: 'Clean water delivery by tanker to 1,400 households', amountUsd: 42_000, declaredAsOverhead: false },
        { label: 'Mobile medical clinic days and medicines', amountUsd: 24_000, declaredAsOverhead: false },
        { label: 'Programme delivery consultant', amountUsd: 14_000, declaredAsOverhead: false },
        { label: 'Donor stewardship and fundraising communications', amountUsd: 10_000, declaredAsOverhead: false },
        { label: 'Branding refresh and new website', amountUsd: 6_000, declaredAsOverhead: false },
        { label: 'Administration', amountUsd: 8_000, declaredAsOverhead: true },
      ],
      priorCampaignIds: ['lg-0812'],
      sources: [
        {
          id: 'lg-1013-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-06-02',
          language: 'en',
          text: `The lean season in Tillaberi started early this year. Millet stocks in the villages along the Niger river south of Tera ran out in April, six weeks ahead of the usual hungry gap, and the boreholes at two of the four sites we work in are dry. Sahel Horizon Aid is raising 200,000 dollars to reach 1,400 households with food, water and basic medical care through to the October harvest.

Fourteen hundred households, roughly 9,800 people, across eleven villages in the Tera and Gothaye departments. Each household receives a monthly food basket of millet, cowpeas, oil and fortified flour, sized for six people and calibrated to about 1,800 kilocalories per person per day. Where boreholes have failed we are trucking potable water to household-level collection points, twenty litres per person per day, on a schedule agreed with each village chief. A mobile clinic runs six days a month across the eleven villages, treating malaria, diarrhoeal disease and acute malnutrition, and referring severe cases to the district health centre in Tera.

Households were selected in May by our field team using the standard household economy assessment: cereal stocks remaining, livestock holdings and sales in the last ninety days, number of dependants, and whether a member has migrated for work. We rank the list, cut it at the funding line, and read it back at a village assembly. The register is signed by the village chief and held by our country office in Niamey.

Sahel Horizon Aid accepts zakat and holds it separately. Zakat gifts go into a restricted zakat fund that is never pooled with our unrestricted giving, and each household is screened for zakat eligibility before zakat money is released to it. Everything in this appeal is a grant. Nothing is lent, nothing is repaid, and no household is asked for anything in return.

We want to be honest about something else. Two years ago we were a volunteer operation running one truck. We are now working in four countries, and getting there meant investing in ourselves: this year we retained a delivery consultant to professionalise our field operations, hired a part-time fundraising officer, and rebuilt our brand and website so that donors can find us. Those investments are why we can reach 1,400 households this season instead of 400.

Ninety-six cents of every dollar you give goes straight to the field. Our administration is 4% and we are proud of that number.

Two hundred thousand dollars feeds 1,400 households for five months. Nothing about this is complicated. The harvest is in October and the gap is now.`,
        },
        {
          id: 'lg-1013-budget',
          kind: 'budget_breakdown',
          title: 'Itemised budget with line notes',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-06-02',
          language: 'en',
          text: `SAHEL HORIZON AID — TILLABERI LEAN SEASON APPEAL 2026
Total appeal: USD 200,000

PROGRAMME COSTS
1. Emergency food baskets for 1,400 families — USD 96,000
   Five monthly baskets per household. Millet 25kg, cowpeas 5kg, oil 4L, fortified flour 5kg. Procured in Niamey and Tera.
2. Clean water delivery by tanker to 1,400 households — USD 42,000
   Two contracted tankers, twenty litres per person per day, to household-level collection points at nine of eleven villages.
3. Mobile medical clinic days and medicines — USD 24,000
   Six clinic days a month, two clinical staff seconded from the district health centre, plus consumables and referral transport.
4. Programme delivery consultant — USD 14,000
   A full-time external consultant retained through Hartwell Advisory LLC for nine months to redesign our field operating model, write our procurement manual and train country staff. Classified as programme cost because the work is about programme quality.
5. Donor stewardship and fundraising communications — USD 10,000
   A part-time fundraising officer at 0.4 FTE, four donor mailings, the year-end appeal and our monthly supporter email. Classified as programme cost because it funds the growth that makes programmes possible.
6. Branding refresh and new website — USD 6,000
   New visual identity, logo, and a rebuilt website with an integrated donation page and campaign landing pages. Classified as programme cost because it is how beneficiaries' stories reach donors.

ADMINISTRATION
7. Administration — USD 8,000
   Country office rent in Niamey, insurance, bank charges, share of the annual audit.

ADMINISTRATIVE SHARE: 8,000 / 200,000 = 4.0%.

We hold ourselves to a hard ceiling of one eighth on zakat gifts and we are comfortably inside it.`,
        },
        {
          id: 'lg-1013-registration',
          kind: 'org_registration',
          title: 'IRS determination letter',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-06-02',
          language: 'en',
          text: `INTERNAL REVENUE SERVICE — DETERMINATION LETTER

Sahel Horizon Aid, Inc.
EIN: 86-XXXXXXX (synthetic)

We have determined you are exempt from federal income tax under section 501(c)(3) of the Internal Revenue Code. You are classified as a public charity under sections 509(a)(1) and 170(b)(1)(A)(vi).

Purpose as stated in your application: to relieve hunger, provide potable water and deliver primary health care to poor households in the Sahel region of West Africa, and to distribute zakat and sadaqah entrusted to the organisation to eligible recipients.

Accounting period ending: December 31. Form 990 required annually.`,
        },
        {
          id: 'lg-1013-website',
          kind: 'website_capture',
          title: 'sahelhorizon.example.org/zakat',
          provenance: 'Web capture',
          capturedAt: '2026-05-21',
          language: 'en',
          text: `Zakat with Sahel Horizon Aid

Give your zakat where the need is sharpest. Ninety-six cents of every dollar reaches the field.

Restricted zakat fund. Zakat gifts go into a restricted zakat fund. They are never pooled with our unrestricted giving and never spent on anything but eligible distribution.

Eligibility screening. Each household is screened for zakat eligibility before zakat money is released to it. Our field teams apply the screen at registration and record the category on the household file.

Our overhead promise. We keep administration to 4% or less. We think the sector's average of 15 to 20% is indefensible and we have built our organisation to beat it.

Where we work. Niger, Burkina Faso, Chad and northern Nigeria. 41,000 people reached in 2025, up from 9,000 in 2024.

Growth. We have tripled our reach in two years by investing in systems, people and storytelling. Donors who fund our growth fund everything downstream of it.`,
        },
        {
          id: 'lg-1013-financials',
          kind: 'financial_statement',
          title: 'Form 990 functional expense summary, FY2025',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-06-02',
          language: 'en',
          text: `SAHEL HORIZON AID, INC. — STATEMENT OF FUNCTIONAL EXPENSES, YEAR ENDED 31 DECEMBER 2025 (summary)

Total expenses: USD 3,118,000

Programme services: USD 2,447,000 (78.5%)
Management and general: USD 372,000 (11.9%)
Fundraising: USD 299,000 (9.6%)

Note 7 — Allocation of shared costs. The organisation allocates the cost of its programme delivery consultants, its communications staff and its digital platform across programme services on the basis that these functions exist to improve and extend programme delivery. In the prior year these costs were reported within management and general. The change in allocation basis moved USD 214,000 from management and general into programme services and is the principal reason for the year-on-year improvement in the programme expense ratio.

Note 9 — Restricted funds. Zakat gifts totalling USD 611,000 were received in the year and held in a restricted fund. USD 588,000 was distributed. USD 23,000 remained restricted at year end.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1013',
      expectedRouting: 'priority_review',
      expectedEligible: false,
      expectedCategory: 'fuqara_masakin',
      failureClass: 'admin_cap_boundary',
      rationale:
        'The organizer declares 4.0% overhead. Re-deriving classification from the line labels moves ' +
        'three lines totalling $30,000 — programme delivery consultant, donor stewardship and ' +
        'fundraising communications, and branding refresh and new website — into overhead, taking ' +
        'the derived figure to $38,000 of $200,000, or 19.0%, against a 12.5% ceiling. Nothing here ' +
        'is forged: the budget document describes each of those lines accurately and then classifies ' +
        'it as programme cost on a rationale ("it funds the growth that makes programmes possible") ' +
        'that would absorb any expense whatsoever, and Note 7 of the financial statement shows the ' +
        'same reallocation applied at entity level. The category is right and the field programme ' +
        'looks real, which is why expectedCategory stays fuqara_masakin — this fails on arithmetic, ' +
        'and the fix is a re-cut budget rather than a better argument.',
    },
  },

  // =========================================================================
  // lg-1014 — admin_cap_boundary, genuinely contested at the line
  // Derived 12.8% against a 12.5% ceiling. The whole breach is one $6,800 line
  // that a reasonable reviewer could classify either way.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1014',
      title: 'Keep 620 children of haor basin families in school in Sunamganj for one year',
      organizerName: 'Jamuna Learning Trust',
      organizerType: 'registered_nonprofit',
      beneficiaryCountry: 'Bangladesh',
      organizerCountry: 'Australia',
      goalUsd: 100_000,
      claimedCategory: 'fuqara_masakin',
      submittedAt: '2026-07-08',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Tuition and examination fees for 620 pupils', amountUsd: 58_000, declaredAsOverhead: false },
        { label: 'Uniforms, textbooks and exam materials for 620 pupils', amountUsd: 17_200, declaredAsOverhead: false },
        { label: 'Monthly stipends to 140 households to offset lost income', amountUsd: 12_000, declaredAsOverhead: false },
        { label: 'Field staff salaries for eligibility verification visits', amountUsd: 6_800, declaredAsOverhead: false },
        { label: 'Head office rent and utilities', amountUsd: 3_800, declaredAsOverhead: true },
        { label: 'Payment processing fees', amountUsd: 2_200, declaredAsOverhead: true },
      ],
      priorCampaignIds: ['lg-0790', 'lg-0991'],
      sources: [
        {
          id: 'lg-1014-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-07-08',
          language: 'en',
          text: `In the haor basin of Sunamganj, in north-eastern Bangladesh, the flash floods come in April and May, before the boro rice is in. When a family loses that crop, the first thing that goes is school. A child who is out for a full year usually does not come back, and in the villages around Tahirpur and Bishwamvarpur we watched that happen to an entire cohort after the 2022 floods.

Jamuna Learning Trust is funding a full academic year for 620 children from 410 families across fourteen schools in Tahirpur, Bishwamvarpur and Dowarabazar upazilas. We pay the fees, we buy the uniform and the books, and for the poorest 140 households we pay a monthly stipend so the family is not choosing between a child's schooling and the income that child could bring in from fishing or day labour.

The money does not go to the schools as a block grant. Fees are paid per pupil, against a named-pupil ledger that the school countersigns each term, and a copy of that ledger comes to us and to the family. Our field officers hold a receipt for every child. If a child transfers or drops out, the remaining fees for that child are recovered from the school and reallocated, and this happened for nineteen children last year.

Household selection uses our means test, applied at the family's home rather than at the school. To qualify a household must report monthly income below BDT 11,000, must be landless or hold under 0.2 acres of homestead land, and must have a school-aged child either withdrawn from school in the previous eighteen months or at risk of withdrawal on the school's own register. Female-headed households and households with a member who has a disability are ranked first. Two field staff then visit each enrolled household twice a year to confirm the family still meets the criteria and the child is actually attending — this is how the means test stops being a piece of paper.

Jamuna Learning Trust accepts zakat and holds it in a designated zakat account with our bank in Melbourne, separate from our general donations and from our DGR-restricted funds. Zakat is released only to households that pass a zakat eligibility screen applied in addition to the means test: assets below nisab, no zakat received from another distributing body in the same period. The stipends and fee payments are grants and no family repays anything.

Our administrative costs on this appeal are 6% of the total, well inside the one-eighth ceiling. We classify our field verification staff as programme cost, because visiting 410 households twice a year is the programme — without those visits we would be handing money to a list we had not checked since January.

One hundred thousand dollars keeps 620 children in school for a year in a district where the water comes every spring and the schooling, once lost, does not come back.`,
        },
        {
          id: 'lg-1014-budget',
          kind: 'budget_breakdown',
          title: 'Itemised budget with classification notes',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-07-08',
          language: 'en',
          text: `JAMUNA LEARNING TRUST — SUNAMGANJ SCHOOL YEAR APPEAL 2026-27
Total appeal: USD 100,000

1. Tuition and examination fees for 620 pupils — USD 58,000
   Paid per pupil to fourteen schools against a named-pupil ledger countersigned each term. Average USD 93.55 per child per year. Board examination fees for the 88 pupils sitting SSC are included.

2. Uniforms, textbooks and exam materials for 620 pupils — USD 17,200
   Two uniform sets, shoes, the national textbook set where the school cannot supply it, exercise books and geometry sets. Average USD 27.74 per child.

3. Monthly stipends to 140 households to offset lost income — USD 12,000
   BDT 850 per month for twelve months to the 140 lowest-income households, paid by bKash to the mother where there is one in the household. Compensates for the day-labour or fishing income the child would otherwise contribute.

4. Field staff salaries for eligibility verification visits — USD 6,800
   Two full-time field staff based in Sunamganj town. They administer the means test at enrolment, visit each of the 410 enrolled households twice a year to confirm continuing eligibility and attendance, hold the per-child receipts, and reconcile the school ledgers each term. They do no fundraising and no head office administration. We classify this line as programme cost.

5. Head office rent and utilities — USD 3,800
   Share of our Melbourne office attributable to this appeal. Classified as administrative cost.

6. Payment processing fees — USD 2,200
   bKash disbursement charges, international transfer fees, foreign exchange spread. Classified as administrative cost.

ADMINISTRATIVE SHARE AS WE CLASSIFY IT: 6,000 / 100,000 = 6.0%.

We note that a stricter reading would treat line 4 as administrative, which would put the figure at 12.8%. We do not think that reading is right, but we would rather flag it than have it found.`,
        },
        {
          id: 'lg-1014-registration',
          kind: 'org_registration',
          title: 'ACNC registered charity extract',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-07-08',
          language: 'en',
          text: `AUSTRALIAN CHARITIES AND NOT-FOR-PROFITS COMMISSION — CHARITY REGISTER EXTRACT

Charity name: Jamuna Learning Trust Ltd
ABN: 41 XXX XXX XXX (synthetic)
Registration date: 8 August 2017
Charity size: Medium
Status: Registered. Annual Information Statement lodged for FY2025.

Charitable purpose: Advancing education; relieving poverty, distress or disadvantage of individuals or families.

Beneficiaries: Children and young people; families; people in rural or remote communities. Countries of operation: Bangladesh.

FY2025 financials: total revenue AUD 2,910,000. Total expenses AUD 2,764,000. Employee expenses AUD 318,000. Grants and donations made for use outside Australia AUD 2,180,000.`,
        },
        {
          id: 'lg-1014-ledger',
          kind: 'beneficiary_documentation',
          title: 'Household means test and named-pupil fee ledger (extract)',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-07-08',
          language: 'en',
          text: `JAMUNA LEARNING TRUST — SUNAMGANJ ENROLMENT PACK (extract, names redacted)

PART 1 — HOUSEHOLD MEANS TEST
Administered at the household by a Jamuna field officer, not at the school.
1.1 Monthly household income, all sources, BDT. Threshold: below BDT 11,000.
1.2 Land: homestead acres owned, agricultural acres owned or sharecropped. Threshold: landless or under 0.2 acres homestead.
1.3 Child withdrawn from school in previous 18 months (Y/N), or listed at risk of withdrawal on the school register (Y/N). One of the two is required.
1.4 Ranking additions: female-headed household (+3), household member with a disability (+2), three or more school-aged children (+2), boro crop lost in the most recent flood (+2).
1.5 Field officer signature, date, GPS point of visit.

PART 2 — ZAKAT ELIGIBILITY SCREEN
Applied in addition to Part 1, before zakat funds are released to the household.
2.1 Household assets below nisab? Y/N. 2.2 Receiving zakat from another distributing body this period? Y/N. 2.3 Screener signature and date.
A household failing 2.1 or answering Y to 2.2 is funded from general donations and recorded separately.

PART 3 — NAMED-PUPIL FEE LEDGER (extract, Tahirpur cluster, term 1)
Pupil ref TAH-0112, class 7, school D — fees BDT 4,200 paid 12 January, school countersign present, attendance 91%.
Pupil ref TAH-0113, class 9, school D — fees BDT 5,600 paid 12 January, school countersign present, attendance 86%.
Pupil ref TAH-0118, class 4, school F — fees BDT 3,100 paid 14 January, school countersign present, WITHDRAWN 3 March, BDT 1,860 recovered from school and reallocated to pupil ref TAH-0161.

PART 4 — SEMI-ANNUAL VERIFICATION VISIT
Conducted twice yearly at every enrolled household by field staff. Confirms: household still below income threshold; child still enrolled and attending; per-child receipt held; no duplicate support from another agency. Visit outcome recorded as continue / suspend / investigate. Round 1 of 2026: 410 households visited, 396 continue, 9 suspend, 5 investigate.`,
        },
        {
          id: 'lg-1014-website',
          kind: 'website_capture',
          title: 'jamunalearning.example.org/zakat-and-your-gift',
          provenance: 'Web capture',
          capturedAt: '2026-06-30',
          language: 'en',
          text: `Zakat and your gift

Jamuna Learning Trust accepts zakat. We hold it in a designated zakat account with our bank in Melbourne, separate from our general donations and from our DGR-restricted funds. It is not pooled and it is not used for unrestricted costs.

Eligibility. Zakat is released only to households that pass a zakat eligibility screen applied in addition to our means test. Assets below nisab, and no zakat received from another distributing body in the same period.

Fees, not block grants. We pay school fees per named pupil, never as a block grant to an institution. The pupil ledger is countersigned by the school and copied to the family, and unspent fees for a child who leaves are recovered and reallocated.

Our administrative share. We hold to a ceiling of one eighth of zakat received. On our current appeals the figure runs between 5% and 7% as we classify it. We classify our field verification staff as programme cost and we say so on every appeal, because a donor deserves to know where the line was drawn rather than just the number that came out of it.

Independent review. Our Bangladesh programme was reviewed by an external evaluator in 2025 and the report, including the two findings we did not like, is published here in full.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1014',
      expectedRouting: 'priority_review',
      expectedEligible: false,
      expectedCategory: 'fuqara_masakin',
      failureClass: 'admin_cap_boundary',
      rationale:
        'Derived overhead is $12,800 of $100,000, or 12.8%, against a 12.5% ceiling — a breach of ' +
        'three tenths of a point, and the entire breach is the $6,800 line for field staff salaries ' +
        'on eligibility verification visits, which the organizer classifies as programme cost and ' +
        'the label-based derivation reads as overhead. Both readings are defensible and the ' +
        'organizer flags the conflict themselves: visiting 410 households twice a year is how the ' +
        'means test is actually applied, and it is also two salaried staff. The label records the ' +
        'number the deterministic check produces on the budget as submitted, which is a blocking ' +
        'failure, so the correct outcome is priority review with the disputed line surfaced and the ' +
        'badge withheld pending a person\'s judgement. A pipeline that quietly resolved this in ' +
        'either direction would be substituting itself for the reviewer at exactly the point where ' +
        'the reviewer is the whole value of the system.',
    },
  },

  // =========================================================================
  // lg-1015 — clean_ineligible
  // Complete documentation, real need, competent organisation that genuinely
  // does administer zakat. The money still terminates in a building.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1015',
      title: 'Replace the failed heating and ventilation system at Lee Valley Islamic Centre, Cork',
      organizerName: 'Lee Valley Islamic Centre',
      organizerType: 'registered_nonprofit',
      beneficiaryCountry: 'Ireland',
      organizerCountry: 'Ireland',
      goalUsd: 86_000,
      claimedCategory: 'fi_sabilillah',
      submittedAt: '2026-02-24',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Two rooftop air handling units, supply and install', amountUsd: 48_000, declaredAsOverhead: false },
        { label: 'Ductwork replacement and asbestos removal', amountUsd: 16_000, declaredAsOverhead: false },
        { label: 'Electrical upgrade and building controls', amountUsd: 9_000, declaredAsOverhead: false },
        { label: "Structural engineer's report and planning fees", amountUsd: 6_000, declaredAsOverhead: false },
        { label: 'Contingency', amountUsd: 4_000, declaredAsOverhead: false },
        { label: 'Project management fee', amountUsd: 3_000, declaredAsOverhead: true },
      ],
      priorCampaignIds: [],
      sources: [
        {
          id: 'lg-1015-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-02-24',
          language: 'en',
          text: `Lee Valley Islamic Centre is a converted furniture warehouse off the Kinsale Road in Cork. About 1,100 people pray here on a Friday, drawn from the city, from Ballincollig and from the food-processing towns out towards Midleton. It is the only purpose-adapted prayer space within forty kilometres and it has been open since 1997.

On 11 January the older of our two air handling units failed for the last time. The engineer who came out found a cracked heat exchanger and corrosion through the supply plenum, and told us plainly that the unit is at end of life and the second one is eighteen months behind it. Since then the main hall has been sitting at nine to eleven degrees on winter mornings. We have suspended the Saturday and Sunday madrasa, which 210 children attend, because we cannot ask them to sit still for two hours in that. Friday prayer continues with the doors shut and two hired propane heaters, which the fire officer has told us is a temporary arrangement and not a solution.

We are raising 86,000 dollars to replace both units, the ductwork behind them and the electrical supply they run on. The ducting cannot be reused: it dates from the warehouse conversion and there is bonded asbestos in two of the runs which has to be removed under licence. We have three quotations from mechanical contractors in Cork and Limerick and we are going with the middle one; all three are attached. The engineer's report, the asbestos survey and the planning enquiry response are attached as well.

What we lose when the hall is cold is not only the prayer. The Thursday evening hot meal service, which fed 61 people the week before the unit failed, runs out of the same hall and is suspended. The Tuesday women's health clinic, staffed by two volunteer GPs from the Mercy University Hospital, has moved to a room that takes eight people instead of thirty. The funeral washing facility is unaffected because it has its own boiler, and that is the one thing that has kept running.

We should be straightforward about what the money buys. It buys plant. The new system becomes part of the centre's fixed assets, will be capitalised in our accounts and depreciated over fifteen years, and it stays with the building. Our insurers have already been notified of the intended replacement value. No part of this appeal is passed on to an individual or a household.

We have selected "In the path of Allah" as the category. Muslims are roughly 1.3% of the population of Ireland, there is no other adapted prayer space in this part of Munster, and we understand that category to cover support for Islamic religious life where Muslims are a minority. We recognise that a heating system is not an obvious use of zakat and we are content for that to be examined. If the answer is that this is not a zakat matter, we will run the appeal as an ordinary sadaqah appeal and say so on the page.`,
        },
        {
          id: 'lg-1015-budget',
          kind: 'budget_breakdown',
          title: 'Itemised capital works budget (middle of three quotations)',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-02-24',
          language: 'en',
          text: `LEE VALLEY ISLAMIC CENTRE — HVAC REPLACEMENT, CAPITAL WORKS BUDGET
Total: USD 86,000 (EUR 79,400 at 1.083)

1. Two rooftop air handling units, supply and install — USD 48,000
   Two 40kW gas-fired units with heat recovery, craned to roof level, commissioned and certified. Fifteen-year expected life, five-year parts warranty.

2. Ductwork replacement and asbestos removal — USD 16,000
   Full replacement of supply and return ducting in the main hall. Licensed removal and disposal of bonded asbestos in two runs, with air clearance certificate.

3. Electrical upgrade and building controls — USD 9,000
   Three-phase supply upgrade, new distribution board, zone controls and timers for the hall, madrasa rooms and the kitchen.

4. Structural engineer's report and planning fees — USD 6,000
   Roof loading assessment for the new units, planning enquiry and fire safety certificate amendment.

5. Contingency — USD 4,000
   Approximately 5%. Held against unforeseen roof works and asbestos overrun.

6. Project management fee — USD 3,000
   Contract administration by the consulting engineer. Classified as administrative cost.

Administrative share: 3,000 / 86,000 = 3.5%.

Asset treatment: all of items 1 to 4 will be capitalised as tangible fixed assets of the centre and depreciated over fifteen years. None of this expenditure is disbursed to individuals.`,
        },
        {
          id: 'lg-1015-registration',
          kind: 'org_registration',
          title: 'Charities Regulator (Ireland) register extract',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-02-24',
          language: 'en',
          text: `CHARITIES REGULATOR — REGISTER OF CHARITIES EXTRACT

Registered charity name: Lee Valley Islamic Centre Company Limited by Guarantee
Registered Charity Number: 200* (synthetic)
CRO number: 2* (synthetic)
Date of registration: 3 May 1998
Status: Registered. Annual report and accounts filed for the year ended 31 December 2025.

Charitable purpose: The advancement of religion; the prevention or relief of poverty or economic hardship; the advancement of education.

Activities as declared: Provision and maintenance of a place of worship and community centre; weekend religious education for children; a weekly hot meal service; a hardship fund for individuals and families in the Cork area; funeral and burial support.

Trustees: 7. Employees: 2. Volunteers: 64.`,
        },
        {
          id: 'lg-1015-financials',
          kind: 'financial_statement',
          title: 'Statement of financial activities and fixed assets note, YE 31 December 2025',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-02-24',
          language: 'en',
          text: `LEE VALLEY ISLAMIC CENTRE CLG — ABRIDGED FINANCIAL STATEMENTS, YEAR ENDED 31 DECEMBER 2025

INCOME
Donations and collections: EUR 341,000
Zakat received (restricted): EUR 88,000
Room hire and functions: EUR 24,000
Total income: EUR 453,000

EXPENDITURE
Hardship grants to individuals and families (from restricted zakat fund): EUR 81,000
Religious education and imam costs: EUR 129,000
Premises: heat, light, insurance, repairs: EUR 96,000
Hot meal service and community activities: EUR 38,000
Governance and administration: EUR 21,000
Total expenditure: EUR 365,000

NOTE 4 — TANGIBLE FIXED ASSETS
Land and buildings: cost EUR 1,240,000, accumulated depreciation EUR 372,000, net book value EUR 868,000.
Plant and machinery: cost EUR 118,000, accumulated depreciation EUR 101,000, net book value EUR 17,000. Plant and machinery comprises the heating and ventilation installation, kitchen equipment and the funeral washing facility. Plant is capitalised and depreciated over fifteen years on a straight-line basis. The heating and ventilation installation is fully depreciated as at the balance sheet date.

NOTE 6 — RESTRICTED FUNDS
The zakat fund is a restricted fund. Zakat received is credited to it and is applied only to hardship grants to individuals and families assessed as eligible. No zakat has been applied to premises, plant or governance costs in the current or preceding year. Closing balance EUR 7,000.`,
        },
        {
          id: 'lg-1015-website',
          kind: 'website_capture',
          title: 'leevalleyislamiccentre.example.org/zakat-and-hardship',
          provenance: 'Web capture',
          capturedAt: '2026-02-11',
          language: 'en',
          text: `Zakat and the hardship fund

The centre accepts zakat and administers it as a restricted fund. Zakat received is credited to the hardship fund and is applied only to grants to individuals and families who have been assessed as eligible.

How the hardship fund works. A family or an individual applies to the imam or to any trustee. Two trustees assess the application against our written criteria: household income, savings and assets, rent or mortgage arrears, dependants, and whether statutory support has been claimed. Grants are paid directly to the household or, at the household's request, to a landlord or utility on their behalf. In 2025 we made 147 grants averaging EUR 551.

Zakat eligibility. Before a grant is paid from the zakat fund the assessors confirm that the applicant's assets are below nisab and record which of the eight categories applies. Applicants who do not meet the zakat test are considered for a grant from general collections instead.

What the zakat fund does not pay for. The zakat fund does not pay for the building, the plant, the staff or the running of the centre. Those come from general collections, room hire and the annual dinner.

Our accounts. Full statutory accounts for the last six years are on this page, along with the trustees' annual report.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1015',
      expectedRouting: 'priority_review',
      expectedEligible: false,
      expectedCategory: null,
      failureClass: 'clean_ineligible',
      rationale:
        'This is the best-documented case in the slice and it is not zakat. The organisation ' +
        'genuinely accepts and segregates zakat, so the universal criterion on zakat posture is ' +
        'satisfied; what fails is beneficiary reach, and the organizer establishes the failure ' +
        'themselves — the expenditure is capitalised as tangible fixed assets and depreciated over ' +
        'fifteen years, and no part of it is disbursed to a person. The knock-on human losses are ' +
        'real, and a suspended hot meal service is a genuine argument that the pipeline should ' +
        'surface rather than suppress, but benefit that reaches people only by way of a warmer ' +
        'building is benefit terminating in the institution. Derived overhead is 3.5% and every ' +
        'requested document is present, which is the point of including the case: documentation ' +
        'quality and eligibility are independent axes, and a reviewer who reads neatness as ' +
        'entitlement will approve exactly this campaign.',
    },
  },

  // =========================================================================
  // lg-1016 — clean_ineligible
  // An endowment. Sympathetic intent, immaculate governance, and a mechanism
  // designed so that the money never transfers to anybody.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1016',
      title: 'The Sakina Fund: a permanent endowment for tuition assistance at Cedar Grove Islamic Academy',
      organizerName: 'Cedar Grove Islamic Academy',
      organizerType: 'registered_nonprofit',
      beneficiaryCountry: 'United States',
      organizerCountry: 'United States',
      goalUsd: 400_000,
      claimedCategory: 'fuqara_masakin',
      submittedAt: '2026-01-27',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Permanent endowment corpus, invested and non-expendable', amountUsd: 352_000, declaredAsOverhead: false },
        { label: 'Tuition assistance awards, first three academic years', amountUsd: 30_000, declaredAsOverhead: false },
        { label: 'Investment management fee and custodian costs', amountUsd: 10_000, declaredAsOverhead: true },
        { label: 'Fundraising counsel and donor event costs', amountUsd: 8_000, declaredAsOverhead: true },
      ],
      priorCampaignIds: ['lg-0605'],
      sources: [
        {
          id: 'lg-1016-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-01-27',
          language: 'en',
          text: `Cedar Grove Islamic Academy has taught in south-west Houston since 2004. We have 430 students from pre-kindergarten through eighth grade, twenty-nine teachers, and a waiting list every year for the lower grades. Tuition is 9,400 dollars. That number is the reason for this campaign.

Every spring we turn families away. Not for lack of seats — for lack of aid. This year 61 families applied for tuition assistance and we could fund 38 of them. The 23 we could not fund are, on our own scoring, the families closest to the line: a single mother nursing at Memorial Hermann, a father who lost a contract at a refinery in Deer Park, a family of six on one income out in Alief. Our assistance budget is set each year from whatever is left after payroll, and in a year when enrolment softens it is the first thing cut. That is not a system. It is an accident that happens to families.

The Sakina Fund is our answer. We are raising 400,000 dollars to establish a permanent endowment whose annual distribution funds tuition assistance in perpetuity. The board resolution, passed on 14 December 2025, sets the spending rate at 4.25% of a three-year rolling average of the fund's market value. On a fully funded corpus that is about 15,000 dollars a year, every year, that cannot be cut when enrolment softens because it does not sit in the operating budget. The principal is never spent. That is the entire design and it is the reason the fund is worth building.

Awards work the way our existing assistance works. A family completes a financial aid application through our third-party verifier, which pulls tax transcripts and computes an expected family contribution. Our aid committee — two trustees, the principal and the business manager, none of whom sees the family's name — awards against a published scale. Awards are applied as a credit to the family's tuition account. No funds leave the Academy, and no family receives a payment; the credit reduces what they owe us.

We are including 30,000 dollars in this campaign to fund awards in the first three academic years directly from campaign proceeds, so that families benefit while the corpus is still building. Those awards work the same way — a credit against the family's account, not a transfer to the family.

Cedar Grove accepts zakat. Zakat gifts are held in a separate restricted account and applied only to tuition assistance for families below the threshold on our published aid scale, and we report annually to zakat donors on the number of families assisted. We have never applied zakat to salaries, to the building, or to our operating deficit. Our audited financials for the last five years are attached, along with the board resolution establishing the fund and our gift acceptance policy.

A gift to the Sakina Fund helps a family this year and every year after. That permanence is exactly what we are asking donors to buy.`,
        },
        {
          id: 'lg-1016-budget',
          kind: 'budget_breakdown',
          title: 'Use of campaign proceeds',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-01-27',
          language: 'en',
          text: `CEDAR GROVE ISLAMIC ACADEMY — THE SAKINA FUND, USE OF PROCEEDS
Total campaign goal: USD 400,000

1. Permanent endowment corpus, invested and non-expendable — USD 352,000
   Transferred to the Academy's endowment portfolio on receipt and held as a permanent restricted net asset. Invested per the board's investment policy statement: 60% global equity, 30% sukuk and Islamic fixed income, 10% cash. The principal is never spent. Only the annual distribution set by board resolution, currently 4.25% of a three-year rolling average of market value, is available to award.

2. Tuition assistance awards, first three academic years — USD 30,000
   USD 10,000 per year for three years, awarded from campaign proceeds while the corpus builds, so that families see a benefit before the distribution stream matures. Applied as a credit to the awarded family's tuition account.

3. Investment management fee and custodian costs — USD 10,000
   Three years of investment advisory and custody at 0.85% of assets. Classified as administrative cost.

4. Fundraising counsel and donor event costs — USD 8,000
   Campaign counsel retained for the eight-month quiet phase, case statement design, and two donor dinners. Classified as administrative cost.

Administrative share: 18,000 / 400,000 = 4.5%.

Note on mechanics: no cash is disbursed to any family under this campaign. All assistance, whether funded from item 1's future distributions or from item 2 directly, is recorded as a credit against tuition owed to the Academy.`,
        },
        {
          id: 'lg-1016-registration',
          kind: 'org_registration',
          title: 'IRS determination letter and board resolution establishing the fund',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-01-27',
          language: 'en',
          text: `INTERNAL REVENUE SERVICE — DETERMINATION LETTER

Cedar Grove Islamic Academy
EIN: 76-XXXXXXX (synthetic)

We have determined you are exempt from federal income tax under section 501(c)(3) of the Internal Revenue Code. You are classified as a school under section 170(b)(1)(A)(ii).

---

BOARD RESOLUTION 2025-11 — ESTABLISHMENT OF THE SAKINA FUND
Adopted 14 December 2025

RESOLVED, that the Board establishes the Sakina Fund as a permanent endowment of the Academy, to be held and invested as a fund of donor-restricted permanently non-expendable net assets under the Texas Uniform Prudent Management of Institutional Funds Act.

RESOLVED FURTHER, that the principal of the Fund shall not be expended. The Board shall each year make available for tuition assistance an amount equal to 4.25% of the trailing three-year average market value of the Fund, and no more.

RESOLVED FURTHER, that awards from the Fund shall be made by the Aid Committee under the Academy's published tuition assistance scale, and shall be applied as a credit to the awarded student's tuition account.

RESOLVED FURTHER, that the Fund shall not be used to fund operating deficits, capital projects, or debt service, and that no borrowing shall be secured against it.`,
        },
        {
          id: 'lg-1016-financials',
          kind: 'financial_statement',
          title: 'Audited financial statements, net assets note, YE 30 June 2025',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-01-27',
          language: 'en',
          text: `CEDAR GROVE ISLAMIC ACADEMY — AUDITED FINANCIAL STATEMENTS, YEAR ENDED 30 JUNE 2025 (extracts)

INDEPENDENT AUDITOR'S REPORT: unmodified opinion issued 14 October 2025 by Whitfield & Amari LLP.

STATEMENT OF ACTIVITIES (summary)
Tuition and fees, net of assistance: USD 3,412,000
Contributions: USD 486,000
Zakat contributions (restricted for tuition assistance): USD 74,000
Total revenue and support: USD 3,972,000
Total expenses: USD 3,904,000, of which instruction USD 2,706,000, plant USD 431,000, administration USD 468,000, fundraising USD 91,000, tuition assistance USD 208,000.

NOTE 9 — NET ASSETS
Net assets without donor restrictions: USD 612,000.
Net assets with donor restrictions — expendable: USD 96,000. Comprises the restricted zakat account (USD 41,000) and named annual scholarships (USD 55,000).
Net assets with donor restrictions — endowment corpus, non-expendable: USD 214,000. The Academy's donor-restricted endowment consists of individual funds established for tuition assistance. As required by UPMIFA, the Academy classifies as permanently restricted the original value of gifts donated to the endowment. The corpus is not available for expenditure.

NOTE 11 — TUITION ASSISTANCE
Tuition assistance of USD 208,000 was awarded to 38 families in the year (prior year USD 187,000, 34 families). Assistance is recorded as a reduction of tuition revenue and is applied as a credit to the student's account. No cash is disbursed to families. Zakat contributions of USD 74,000 were applied in full to tuition assistance for families assessed below the aid scale threshold.`,
        },
        {
          id: 'lg-1016-website',
          kind: 'website_capture',
          title: 'cedargroveacademy.example.org/giving/zakat',
          provenance: 'Web capture',
          capturedAt: '2026-01-15',
          language: 'en',
          text: `Zakat at Cedar Grove

Cedar Grove accepts zakat. Zakat gifts are held in a separate restricted account and applied only to tuition assistance for families below the threshold on our published aid scale.

What we do with it. Zakat funds tuition assistance and nothing else. It has never been applied to salaries, to the building, or to our operating deficit, and the restriction is tested by our auditors each year. In 2024-25 we received 74,000 dollars in zakat and applied all of it to assistance for families assessed below the threshold.

How assistance reaches a family. Families apply through our third-party verifier. Our Aid Committee reviews applications without names attached and awards against the published scale. An award is applied as a credit to the family's tuition account.

Reporting. Zakat donors receive an annual statement showing the number of families assisted, the average award and the aggregate amount, without identifying details.

The Sakina Fund. Our endowment campaign is now open. An endowed gift is invested permanently and its annual distribution funds assistance every year, in perpetuity. If you would rather your gift be spent this year, give to the annual assistance fund instead and we will apply it in full this academic year.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1016',
      expectedRouting: 'priority_review',
      expectedEligible: false,
      expectedCategory: null,
      failureClass: 'clean_ineligible',
      rationale:
        'Eighty-eight per cent of the raise is a corpus the board has resolved will never be spent, ' +
        'and the mechanism for the part that is spent is a credit against tuition owed to the ' +
        'Academy — the narrative, the use-of-proceeds note and Note 11 of the audit all state that ' +
        'no cash is disbursed to any family, and ' +
        'the audited net assets note confirms the corpus is not available for expenditure. Zakat ' +
        'requires the transfer to reach the eligible person; an endowment is designed so that it ' +
        'never does, and an internal fee credit transfers nothing. The governance here is better ' +
        'than most of the corpus — unmodified audit opinion, UPMIFA classification, blind aid ' +
        'committee, 4.5% derived overhead, zakat genuinely segregated and never touched for ' +
        'salaries — which is exactly why it belongs in the eval: the failure is structural, it is ' +
        'visible only in the mechanics, and no amount of documentation moves it.',
    },
  },
];
