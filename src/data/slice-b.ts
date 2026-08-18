/**
 * Mizan — corpus slice B.
 *
 * Three failure classes, seven cases:
 *
 *   underdocumented_but_genuine (3) — the class the whole system exists for. Real
 *     need, thin paperwork. Every one of these must route to `evidence_request`.
 *     If any of them routes to a negative verdict, the pipeline has learned to
 *     read "we do not have this document" as "this person is not eligible", and
 *     the cost of that error lands on the people least able to argue with it.
 *
 *   policy_excluded_category (2) — categories LaunchGood's published policy does
 *     not verify. Both campaigns here are well-governed and would satisfy every
 *     universal criterion if they were asked to. They are excluded before the
 *     evidence is weighed, because the exclusion is a policy fact about the
 *     category and not a finding about the campaign. Both can still fundraise.
 *
 *   contradictory_sources (2) — two documents in the same file disagree on a fact
 *     that decides a criterion. The measured behaviour is not "pick the right one".
 *     It is "put both quotes in front of a person, with their provenance and dates,
 *     and let them decide which document the organisation actually lives by".
 *
 * ALL DATA IN THIS FILE IS SYNTHETIC. Organisations, people, hospitals,
 * registration numbers, letters and financial statements are invented. Place
 * names and government programmes are real so the cases read as they would in
 * production; nothing here depicts a real organisation, a real family, or a real
 * decision.
 */

import type { CorpusEntry } from './_exemplar';

export const SLICE_B: CorpusEntry[] = [
  // =========================================================================
  // lg-1020 — underdocumented_but_genuine
  // A widow, two children with a chronic condition, a hospital letter, and a
  // state aid award that proves a means test happened without disclosing what
  // it found. The missing document is one email away.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1020',
      title: 'Six months of transfusions and iron chelation for Rand and Sanad',
      organizerName: 'Manal Abu Shaar',
      organizerType: 'individual',
      beneficiaryCountry: 'Jordan',
      organizerCountry: 'Jordan',
      goalUsd: 3_400,
      claimedCategory: 'fuqara_masakin',
      submittedAt: '2026-05-19',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Blood transfusions and day-unit charges, 12 sessions for two children', amountUsd: 1_660, declaredAsOverhead: false },
        { label: 'Deferasirox iron chelation, six months for two children', amountUsd: 1_090, declaredAsOverhead: false },
        { label: 'Transport, Zarqa to Amman, 12 round trips', amountUsd: 320, declaredAsOverhead: false },
        { label: 'Hepatitis B and pneumococcal vaccination series', amountUsd: 160, declaredAsOverhead: false },
        { label: 'Platform and payment processing fees', amountUsd: 170, declaredAsOverhead: true },
      ],
      priorCampaignIds: [],
      sources: [
        {
          id: 'lg-1020-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-05-19',
          language: 'en',
          text: `My name is Manal. I live in Zarqa with my four children. My husband Bassam worked for the municipality doing maintenance on the water network for nineteen years. He died in February of a heart attack. He was forty-four.

Two of our children have beta thalassemia major. Rand is nine and Sanad is six. This means their bodies do not make enough haemoglobin and they need a blood transfusion every three to four weeks, at the haematology day unit at Al-Manara Public Hospital in Amman. Transfusions keep them alive but they leave iron behind in the body, and iron that is not removed collects in the heart and the liver. The medicine that removes it is called deferasirox and it has to be taken every day. Rand has been on it since she was four. Sanad started last year. Their last ferritin readings were 1,840 and 1,510, which their doctor says is manageable if nothing is interrupted.

Something was interrupted. Our health insurance came through Bassam's employment. It ended ninety days after he died. Since then I have been paying at the uninsured rate. One transfusion cycle for both children, with the day-unit charge, is about 98 dinars. A month of deferasirox for both is about 129 dinars. I receive 90 dinars a month from the National Aid Fund and I earn between 130 and 150 dinars a month sewing at home for a workshop in Al-Zarqa Al-Jadida, depending on the season. The rent is 175 dinars. I have sold my gold. I have not missed a transfusion yet but in April I split Sanad's chelation dose to make the box last, and I know that is not something I can keep doing.

I want to be honest about what I have and what I do not have. I have the hospital's letter, which states the diagnosis, the schedule and what the charges are. I have the pharmacy prescriptions. I have the National Aid Fund award letter. I do not have an organisation behind me. Nobody has done a means test on my household except the National Aid Fund, and their letter tells you the amount they decided on but not the numbers they used to decide it. I have never been through a zakat committee. The committee at our mosque distributes at Ramadan from a list, and I was not on the list this year. I am not saying that to complain about them. I am saying it because I understand you may need proof of these things and I would rather tell you now than have you find out.

If it helps, I am asking that the money be paid to the hospital account and to the pharmacy directly rather than to me. The hospital's finance office confirmed to me that they can accept payment against a patient file number. My brother-in-law Nayef and the imam at our mosque, Sheikh Anwar, have both said they will speak to anyone who calls. I can send the National Aid Fund determination sheet if you tell me it is needed. I did not attach it because I did not know it mattered.

I am asking for zakat because I believe my children and I are among the people it is for. If I have misunderstood something, please tell me what it is and I will try to fix it.`,
        },
        {
          id: 'lg-1020-hospital',
          kind: 'beneficiary_documentation',
          title: 'Al-Manara Public Hospital — haematology day unit treatment letter',
          provenance: 'Uploaded by organizer (photograph of original, stamped)',
          capturedAt: '2026-05-19',
          language: 'en',
          text: `AL-MANARA PUBLIC HOSPITAL, AMMAN — DEPARTMENT OF PAEDIATRIC HAEMATOLOGY
Facility licence 4471/2 (synthetic)
Date: 6 May 2026

TO WHOM IT MAY CONCERN

This letter is issued at the request of the mother of the below-named patients.

Patient 1: Rand B. Abu Shaar, female, date of birth 11 March 2017. File 2019-08841 (synthetic).
Patient 2: Sanad B. Abu Shaar, male, date of birth 2 September 2019. File 2021-11376 (synthetic).

Both patients carry a confirmed diagnosis of beta thalassemia major, established by haemoglobin electrophoresis and confirmed genetically. Both are transfusion-dependent and attend this day unit on a three to four week cycle. Most recent serum ferritin: Rand 1,840 ng/mL, Sanad 1,510 ng/mL, both on 28 April 2026.

Prescribed maintenance: packed red cell transfusion to maintain pre-transfusion haemoglobin above 9.5 g/dL, with oral deferasirox chelation at 20 mg/kg/day, taken daily and without interruption. Interruption of chelation in a transfusion-dependent patient leads to iron accumulation in cardiac and hepatic tissue and is associated with serious avoidable morbidity.

Neither child is covered by any active health insurance scheme; charges are billed to the family at the uninsured rate. Combined charge per transfusion cycle for both patients, inclusive of day-unit fee, cross-match and consumables: JOD 98. Combined monthly cost of prescribed deferasirox at current dispensary prices: JOD 129.

The department is willing to receive payment directly against the patient file numbers above through the hospital finance office.

Dr. Iman Q. Haddadin, MD
Consultant Paediatric Haematologist`,
        },
        {
          id: 'lg-1020-naf',
          kind: 'correspondence',
          title: 'National Aid Fund — monthly assistance award letter',
          provenance: 'Uploaded by organizer (photograph of original)',
          capturedAt: '2026-05-19',
          language: 'en',
          text: `NATIONAL AID FUND — RECURRENT ASSISTANCE AWARD
Reference: RA/2026/ZQ/03812 (synthetic)
Date: 30 March 2026

Beneficiary: Manal A. Abu Shaar, Zarqa Governorate
Household size recorded: 5 (applicant and four dependants)

Following assessment of your application, the Fund has approved recurrent monthly assistance of JOD 90, payable from April 2026. Payment will be made to the account registered against your national number.

This assistance is a subsistence payment and does not include coverage of medical treatment, medicines or hospital charges. Applicants requiring assistance with medical costs should apply separately to the Royal Medical Services exemption programme; approval is not automatic and is subject to available allocation.

Your eligibility was determined under the Fund's household assessment and is subject to annual review. The detailed determination sheet setting out the household income and asset figures used is retained on your file and may be obtained on written request at any Fund service point.

This award does not constitute a certificate of poverty for third-party purposes.`,
        },
        {
          id: 'lg-1020-budget',
          kind: 'budget_breakdown',
          title: 'Six-month costing prepared by the organizer',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-05-19',
          language: 'en',
          text: `SIX MONTHS OF TREATMENT — WHAT I HAVE CALCULATED

I used the hospital's figures and today's exchange rate of 1 JOD to 1.41 USD.

Transfusions. Both children, one cycle every three to four weeks, six cycles each over six months. JOD 98 per cycle for the two of them. Twelve sessions in total across the two children. USD 1,660.

Chelation. Deferasirox for both children, JOD 129 per month, six months. USD 1,090.

Transport. Zarqa to Amman and back, twelve round trips, shared taxi because Sanad cannot manage the bus on transfusion days. USD 320.

Vaccinations. Hepatitis B and pneumococcal series, which the haematology unit says both children should complete because of the transfusions. USD 160.

Platform and payment processing fees. USD 170. This is the only amount that is not treatment. It is five per cent of the total and I would rather show it than pretend it is not there.

Total: USD 3,400.

I am not asking for rent, food, school or anything else. If the campaign raises more than this I would like it to go to another family on the day unit and I will say so publicly.`,
        },
        {
          id: 'lg-1020-support-thread',
          kind: 'correspondence',
          title: 'Organizer reply to campaign support intake queries',
          provenance: 'LaunchGood campaign support inbox',
          capturedAt: '2026-05-21',
          language: 'en',
          text: `SUPPORT THREAD — CAMPAIGN lg-1020

Support, 20 May 2026: Thank you for submitting. To progress the zakat review we usually need (1) evidence of a needs assessment applied to the household, (2) confirmation that funds will be kept separate from other money, and (3) an eligibility screen against zakat criteria. Can you provide these?

Organizer, 21 May 2026: I will answer each one honestly.

On the first. The National Aid Fund assessed my household in March and awarded 90 dinars a month. Their letter says the determination sheet with the income and asset figures is on my file and I can request it in writing at a service point. I can go to the Zarqa office this week and ask for it. Nobody told me it would be needed, so I did not bring it.

On the second. I do not have a separate account. I have one bank account, the one the Fund pays into. If it is a condition, I would prefer the money is not paid to me at all. The hospital finance office told me they can take payment against the children's file numbers, and the pharmacy will invoice against the prescriptions. Then there is nothing to keep separate because it never passes through my hands.

On the third. No one has screened us against zakat criteria. I know what nisab means and I know we are below it, because I have nothing left to sell, but I understand that me saying so is not the same as someone checking. Sheikh Anwar at our mosque has known this family for eleven years and said he will put in writing whatever he is asked to put in writing. I do not know if that is the kind of document you mean. If you tell me the exact paper you need I will get it.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1020',
      expectedRouting: 'evidence_request',
      expectedEligible: true,
      expectedCategory: 'fuqara_masakin',
      failureClass: 'underdocumented_but_genuine',
      rationale:
        'Two named children, a stamped hospital letter establishing diagnosis, schedule and uninsured ' +
        'status, an outright grant paid to the hospital rather than the household, and derived overhead ' +
        'of 5.0% against a 12.5% cap. Nothing is contradicted; what is absent is paper — the needs ' +
        'assessment exists, the National Aid Fund letter says so, and the determination sheet is ' +
        'obtainable on written request, which the organizer has already offered to do. Scoring "no ' +
        'means test on file" as a negative here would record the system’s failure to ask as the ' +
        'family’s failure to qualify, and a widow with no organisation behind her would be turned ' +
        'away by a reviewer who was merely under-informed. The gap is in the file, not in the case: ' +
        'draft the request, name the two documents, and let a person send it.',
    },
  },

  // =========================================================================
  // lg-1021 — underdocumented_but_genuine
  // An unregistered mutual-aid committee in a country where registration is not
  // merely absent but unavailable, and where documenting beneficiaries by name
  // would endanger them.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1021',
      title: 'Sixteen community kitchens in Omdurman: forty days of hot meals',
      organizerName: 'Karama Neighbourhood Kitchens Committee',
      organizerType: 'unregistered_group',
      beneficiaryCountry: 'Sudan',
      organizerCountry: 'Sudan',
      goalUsd: 24_000,
      claimedCategory: 'fuqara_masakin',
      submittedAt: '2026-04-08',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Sorghum, lentils, cooking oil and salt — 40 days across 16 kitchens', amountUsd: 14_400, declaredAsOverhead: false },
        { label: 'Charcoal and cooking gas', amountUsd: 3_360, declaredAsOverhead: false },
        { label: 'Water tanker deliveries, three per kitchen per week', amountUsd: 3_000, declaredAsOverhead: false },
        { label: 'Replacement pots, utensils and food-grade containers', amountUsd: 1_200, declaredAsOverhead: false },
        { label: 'Hawala transfer commission on remittances into Sudan', amountUsd: 1_440, declaredAsOverhead: true },
        { label: 'Platform and payment processing fees', amountUsd: 600, declaredAsOverhead: true },
      ],
      priorCampaignIds: [],
      sources: [
        {
          id: 'lg-1021-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-04-08',
          language: 'en',
          text: `We are thirty-four volunteers running sixteen community kitchens in Omdurman. This page was written in English by Hisham, who is one of us and who left for Cairo in 2024 and handles the transfers from there. Everything in it was agreed with the kitchen supervisors over three days on WhatsApp.

We started in November 2024 with three kitchens in Al-Thawra, cooking on two fires behind a closed pharmacy. We are now sixteen kitchens across Al-Thawra, Ombada, Al-Muhandiseen and Wad Nubawi, and on a normal day we serve about 4,800 meals. The meal is asida or kisra with a lentil or bean stew, and on the days a supplier can reach us, with onion and tomato. It is one meal a day, cooked in the morning and distributed between eleven and one. It is not enough and we know it is not enough. It is what stands between a household and nothing.

Who eats. Three kinds of households. People who never left, who are living in their own houses with no income because the market they worked in is gone. Families who were displaced from Khartoum and Bahri and are in unfinished buildings and school compounds. And elderly people living alone, who we deliver to, because they will not queue. Each household on our list has a card with a number on it. The card has no name and no ID number. This is deliberate. Written lists of who is receiving aid, in which neighbourhood, have been used to identify people, and we will not produce one. We understand this makes our paperwork worse. We are not going to change it.

Why we are not registered. We are not registered and we cannot register. Registration for a body like ours runs through the Humanitarian Aid Commission and requires a letter of no objection from the locality office, a founding assembly with attested signatures, and a physical address that can be inspected. The locality office for our area has not been functioning since 2023. Attested signatures would mean thirty-four volunteers putting their names and national numbers on a document that then sits in a government file. Nobody here is willing to ask that of them, and if we asked, we would lose the volunteers. So when the form says organisation type, we have to say what we are, which is a committee of neighbours.

How the money moves. Donations reach Hisham in Cairo. He sends through a hawala office we have used since the beginning, and the commission runs about six per cent, which we have shown in the budget rather than burying it. Cash arrives with a named supervisor in each neighbourhood, who buys from the market that morning because prices move daily and nothing can be stored. Every transfer is receipted and the receipt is photographed and posted to our donor group within forty-eight hours. That group has about three hundred people in it and has been running for seventeen months. We also post the market prices we paid, because people ask.

Zakat. We keep a separate column in the ledger for money that donors tell us is zakat, and the supervisors know that zakat money buys food and nothing else — not fuel for the van, not the phone credit, not the commission. But we do not have a bank account and we cannot show you a separate account statement, because there is no account. We also do not run an eligibility screen the way a charity would. The supervisor and two elders agree the card list at the start of each week based on what they know about who is in the neighbourhood. It is real knowledge and it is better than a form, but it is not written down and we cannot hand it to you.

We are asking for forty days. We will send you the ledger, the transfer receipts, photographs, and the phone numbers of three people in Omdurman who will answer if you call — a pharmacist, a schoolteacher and the imam of the mosque next to the Ombada kitchen. If there is a document you need that we have not thought of, tell us what it is and we will tell you honestly whether we can get it.`,
        },
        {
          id: 'lg-1021-budget',
          kind: 'budget_breakdown',
          title: 'Forty-day costing, sixteen kitchens',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-04-08',
          language: 'en',
          text: `FORTY-DAY COSTING — SIXTEEN KITCHENS, OMDURMAN
Prepared 4 April 2026. Converted at the parallel market rate in use for our transfers, which is the rate we actually receive, not the official one.

Food. Sorghum, lentils, oil and salt. Per kitchen per day: USD 22.50. Sixteen kitchens, forty days. Total USD 14,400. This is the line zakat money is spent against.

Fuel. Charcoal and cooking gas. Per kitchen per day: USD 5.25. Total USD 3,360.

Water. Tanker delivery three times a week per kitchen. The mains have not run in Ombada since last year. Total USD 3,000.

Equipment. Replacement pots, ladles, and food-grade containers for the delivery rounds to elderly households. Pots do not survive a season of daily use over charcoal. Total USD 1,200.

Hawala commission. Approximately six per cent on funds transferred into Sudan. Total USD 1,440. We class this as overhead even though it is unavoidable, because it is not food.

Platform and payment processing. USD 600.

TOTAL USD 24,000. Of this, USD 2,040 is commission and fees, which is eight and a half per cent. Nobody on this committee is paid. There is no salary line because there are no salaries.`,
        },
        {
          id: 'lg-1021-ledger',
          kind: 'correspondence',
          title: 'Weekly ledger post to donor group (export)',
          provenance: 'Uploaded by organizer — export of messaging group, 22 to 29 March 2026',
          capturedAt: '2026-04-08',
          language: 'en',
          text: `KARAMA KITCHENS — WEEK 71 LEDGER POST (export, translated by organizer)

Received this week: USD 1,910 from the campaign page, USD 640 direct to Hisham. Of this, USD 880 was marked zakat by the donor.

Transferred: USD 2,400 in two transfers. Commission USD 148. Receipts 4471 and 4472 photographed and posted above this message.

Delivered to supervisors: Al-Thawra USD 690, Ombada USD 720, Al-Muhandiseen USD 480, Wad Nubawi USD 362.

Spent on food: USD 1,806. Spent on charcoal: USD 305. Water tankers: USD 141.

The zakat column this week: USD 880 received, USD 880 spent on sorghum and lentils only. Fuel, water and the commission were paid from the general column.

Meals served, counted by cards presented: Saturday 4,610. Sunday 4,880. Monday 4,940. Tuesday 4,760. Wednesday 4,830. Thursday 5,010. Friday 4,120, lower because two kitchens closed at midday.

Prices paid: sorghum 1 malwa at 9,200 SDG, up from 8,600 last week. Lentils up. Oil steady. Onions were available Tuesday and Wednesday only.

Note from Ombada: the card list grew by nine households, all newly arrived from Bahri. Supervisor asked for an extra sack. Approved.`,
        },
        {
          id: 'lg-1021-intake',
          kind: 'beneficiary_documentation',
          title: 'Kitchen card-list procedure, as written down at reviewer request',
          provenance: 'Uploaded by organizer after intake query',
          capturedAt: '2026-04-11',
          language: 'en',
          text: `HOW HOUSEHOLDS GET ON THE CARD LIST — written down for the first time, 11 April 2026, at your request

There is no form. This is the practice, described exactly as it happens.

Every Saturday morning before cooking, the kitchen supervisor sits with two neighbourhood elders. They go through requests that came in during the week — someone knocks, or a neighbour speaks for them, or a supervisor notices a household that has stopped coming out.

What they weigh, in the order they weigh it: whether anyone in the household is earning anything at all; whether the household is displaced and arrived with nothing; whether there is an elderly person or someone sick who cannot queue; how many children; whether the household is already getting food from another kitchen or from relatives abroad.

If they agree, the household gets a card with a number. The card has no name and no national number on it. We keep only the count of cards per kitchen and the number sequence. There are currently 1,180 active cards.

Cards are reviewed monthly. Households that start earning give the card back, and this does happen — eleven cards came back in March when the Souq Libya traders reopened.

We know this is not a means test and we are not going to call it one. Three people who have lived in that neighbourhood their whole lives decide who is in trouble. We think that is more accurate than a form. We accept that you cannot audit it, and if you need something you can audit, tell us what it would look like and we will consider whether we can produce it without putting names on paper.`,
        },
        {
          id: 'lg-1021-treasurer',
          kind: 'correspondence',
          title: 'Message from diaspora treasurer regarding transfer route',
          provenance: 'LaunchGood campaign support inbox',
          capturedAt: '2026-04-12',
          language: 'en',
          text: `From: Hisham (treasurer, Cairo)
To: LaunchGood campaign support
Date: 12 April 2026

I handle the money for this committee and I want to set out what I can and cannot document, so nobody discovers it later.

What I can give you. My Egyptian bank statements for the account the campaign pays into, going back to when we opened the page. Photographs of every hawala receipt, numbered in sequence, with no gaps. The WhatsApp ledger export for all seventy-one weeks. My own passport and residence card.

What I cannot give you. A Sudanese bank account, because the committee does not have one and could not open one without being registered. An audited financial statement, because there is nothing to audit in the sense you mean. A list of who received food, for the reason set out in the campaign page, which is not a preference.

One thing I want to be clear about because I would rather you hear it from me. I am not a charity and this committee is not a charity. We are people sending money to our own neighbourhood. If your policy requires a registered entity then that is your policy and I understand it. But if the requirement is that the money reaches poor people and can be traced, I can trace every dollar from the card on your platform to the sack of sorghum, and I have been doing it publicly every week for a year and a half.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1021',
      expectedRouting: 'evidence_request',
      expectedEligible: true,
      expectedCategory: 'fuqara_masakin',
      failureClass: 'underdocumented_but_genuine',
      rationale:
        'In-kind relief reaching identified households through a card list, no repayment term, ' +
        'seventeen months of publicly posted transfer receipts, and derived overhead of 8.5% against ' +
        'a 12.5% cap — against gaps that are real and several: no registration, no bank account, no ' +
        'written means test, no zakat eligibility screen. Each gap has a stated reason that is ' +
        'about the operating environment rather than about the committee — registration requires a ' +
        'functioning locality office and thirty-four attested signatures, and a named beneficiary ' +
        'list is a document the organizers refuse to create because of what such lists have been used ' +
        'for. Reading unavailable paperwork as a negative verdict would mean the badge is reachable ' +
        'only from countries where paperwork is reachable, which inverts where zakat is most needed. ' +
        'Ask for what is obtainable — the bank statements, the receipt series, the ledger export the ' +
        'treasurer has already offered — and let a human weigh what remains.',
    },
  },

  // =========================================================================
  // lg-1022 — underdocumented_but_genuine
  // The purest form of the class: the decisive document exists, costs nothing,
  // takes a week, and nobody asked for it.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1022',
      title: 'Six cycles of chemotherapy for our mother, Norhata Sarip',
      organizerName: 'Abdulnasser Sarip',
      organizerType: 'individual',
      beneficiaryCountry: 'Philippines',
      organizerCountry: 'Philippines',
      goalUsd: 11_600,
      claimedCategory: 'fuqara_masakin',
      submittedAt: '2026-06-02',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Six cycles of adjuvant chemotherapy — drugs and day-ward charges', amountUsd: 7_200, declaredAsOverhead: false },
        { label: 'Pre-cycle laboratory work and CT restaging', amountUsd: 1_450, declaredAsOverhead: false },
        { label: 'Anti-emetics and supportive medication', amountUsd: 780, declaredAsOverhead: false },
        { label: 'Travel and lodging, Datu Piang to Cotabato City, six round trips for patient and companion', amountUsd: 1_120, declaredAsOverhead: false },
        { label: 'Nutritional support during treatment', amountUsd: 620, declaredAsOverhead: false },
        { label: 'Platform and payment processing fees', amountUsd: 430, declaredAsOverhead: true },
      ],
      priorCampaignIds: [],
      sources: [
        {
          id: 'lg-1022-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-06-02',
          language: 'en',
          text: `Our mother, Norhata Sarip, is fifty-eight. She lives in Datu Piang, Maguindanao del Sur, in the house our father built, and she has never lived anywhere else. She was diagnosed in April with stage III colon cancer at Rio Grande Medical Centre in Cotabato City. She had been unwell since around September. The health station treated her for amoebiasis twice.

She had surgery on 2 May and it went well. The surgeon removed the tumour and eleven lymph nodes, four of which had disease in them. That is why she now needs chemotherapy. It is six cycles, fourteen days apart, and the oncologist was clear that this is the part that decides whether the cancer comes back. Not the operation. This part.

PhilHealth covered a portion of the surgery through the case rate, and the Malasakit Center at the hospital helped us with the first cycle, which we are grateful for. But the chemotherapy drugs themselves are bought by us, cycle by cycle, from the hospital pharmacy, and paid before the infusion starts. The first cycle cost us PHP 62,400 all in, with the laboratory work and the travel. The Malasakit assistance is not renewable at the same level for every cycle. That leaves five cycles, and the next one is due on 14 June.

What we have. I drive a habal-habal and farm 1.2 hectares of corn with my uncle; in a good quarter I clear about PHP 9,000 a month and this was not a good quarter. My sister Bainot works as a saleswoman in a store in Cotabato City and sends home PHP 4,000 to PHP 5,000 a month. We sold the carabao in May for PHP 34,000, which paid for the surgery deposit and the first cycle. Our mother's gold is gone. The corn is not harvested until August and I have already borrowed against it, from a trader, at terms I would rather not put on this page.

I want to be straight with you about the paperwork, because I read the requirements page. We have the hospital's letter with the diagnosis and the treatment plan and the costs. We have the statement of account for the first cycle. We do not have anything that proves we are poor. Our barangay can issue a Certificate of Indigency. I can get it in a week if it is needed. Nobody has asked me for one. I did not attach it because the form did not have a place for it and I did not want to slow down the review by sending things nobody wanted.

On zakat. Our masjid's zakat committee collects and distributes at Ramadan from a list the imam keeps, and we were not on it this year because in Ramadan our mother had not been diagnosed yet and we were not in trouble yet. I have spoken to the imam and he said the committee does not meet again until next Ramadan but that he would attest to our situation in writing to anyone who asks. I am not an organisation and I do not have a separate account for this. If you prefer, the hospital pharmacy can be paid directly for each cycle. They do this for other families and they gave me the procedure.

The next cycle is on 14 June. That is the reason for the urgency and it is the only reason. If we miss the schedule the oncologist has to reassess whether to continue.`,
        },
        {
          id: 'lg-1022-oncology',
          kind: 'beneficiary_documentation',
          title: 'Rio Grande Medical Centre — medical oncology treatment plan and certification',
          provenance: 'Uploaded by organizer (scan of original, stamped)',
          capturedAt: '2026-06-02',
          language: 'en',
          text: `RIO GRANDE MEDICAL CENTRE, COTABATO CITY
SECTION OF MEDICAL ONCOLOGY
DOH facility code 12-9908 (synthetic)
Date: 28 May 2026

MEDICAL CERTIFICATION AND TREATMENT PLAN

Patient: Norhata M. Sarip, 58 years old, female, of Datu Piang, Maguindanao del Sur.
Hospital number: 26-004871 (synthetic).

Diagnosis: Adenocarcinoma of the sigmoid colon, moderately differentiated. Post open sigmoidectomy with primary anastomosis, 2 May 2026. Final histopathology pT3 pN2a M0, Stage IIIB. Four of eleven regional nodes positive.

Plan: Adjuvant chemotherapy, FOLFOX regimen, six cycles at fourteen-day intervals commencing 31 May 2026. Cycle one administered 31 May 2026. Pre-cycle complete blood count and chemistry required before each administration. CT restaging after cycle four.

Prognostic note: adjuvant chemotherapy following node-positive resection materially reduces the risk of recurrence. Interruption or non-completion of the planned cycles reduces that benefit, and the schedule should not be broken for non-clinical reasons.

Cost note for the family: the patient has no private health insurance. Chemotherapeutic agents are procured by the family from the hospital pharmacy prior to each administration and are not covered by the PhilHealth case rate applicable to this admission. Estimated cost per cycle, drugs and day-ward charge inclusive, PHP 48,000 to PHP 52,000 at current pharmacy prices, exclusive of laboratory work.

The hospital pharmacy accepts third-party settlement against the hospital number above; the family should coordinate with the billing section.

Dr. Rowena L. Baguio, MD, FPCP
Medical Oncology`,
        },
        {
          id: 'lg-1022-soa',
          kind: 'financial_statement',
          title: 'Statement of account — cycle one, 31 May 2026',
          provenance: 'Uploaded by organizer (scan of original)',
          capturedAt: '2026-06-02',
          language: 'en',
          text: `RIO GRANDE MEDICAL CENTRE — BILLING SECTION
STATEMENT OF ACCOUNT

Patient: SARIP, NORHATA M. Hospital number 26-004871 (synthetic).
Service date: 31 May 2026. Chemotherapy day ward.

Oxaliplatin 100 mg vial x 2 .................. PHP 27,600
Fluorouracil 500 mg vial x 4 ................. PHP  6,240
Leucovorin 300 mg vial x 2 ................... PHP  4,180
Ondansetron, dexamethasone, IV sets .......... PHP  3,110
Day ward charge, 6 hours ..................... PHP  4,500
Nursing and administration ................... PHP  2,200
Pre-cycle CBC and chemistry .................. PHP  3,850
Sub-total .................................... PHP 51,680

Less: Malasakit Center assistance, one-time .. PHP 25,000
Less: PhilHealth outpatient benefit .......... PHP  0
NET PAYABLE BY PATIENT ....................... PHP 26,680

Settled in full, cash, 31 May 2026. OR 884213 (synthetic).

Note printed on statement: Malasakit Center assistance is granted per application and is subject to remaining fund allocation. Patients should not assume assistance at the same level for subsequent cycles.`,
        },
        {
          id: 'lg-1022-budget',
          kind: 'budget_breakdown',
          title: 'Cycle-by-cycle costing prepared by the family',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-06-02',
          language: 'en',
          text: `WHAT FIVE MORE CYCLES COSTS
Prepared 1 June 2026 from the hospital's estimate. Converted at PHP 58 to USD 1.

Chemotherapy drugs and day-ward charges. The hospital estimates PHP 48,000 to PHP 52,000 per cycle. I have used PHP 50,000 and included cycle one, which we have already paid for by selling the carabao, because if the campaign covers it we can repay my uncle. Six cycles, USD 7,200.

Laboratory and CT restaging. CBC and chemistry before each of six cycles, plus the CT scan after cycle four. USD 1,450.

Anti-emetics and supportive medication taken at home between cycles. USD 780.

Travel and lodging. Datu Piang to Cotabato City is about three hours. She cannot travel back the same day after an infusion. Six round trips for her and one companion, with two nights in a lodging house each time. USD 1,120.

Nutritional support. The oncologist said she must not lose more weight. USD 620.

Platform and payment processing fees. USD 430, which is under four per cent of the total.

TOTAL USD 11,600.

There is no allowance in here for our household. My sister and I will manage that ourselves.`,
        },
        {
          id: 'lg-1022-support-thread',
          kind: 'correspondence',
          title: 'Organizer reply to campaign support intake queries',
          provenance: 'LaunchGood campaign support inbox',
          capturedAt: '2026-06-04',
          language: 'en',
          text: `SUPPORT THREAD — CAMPAIGN lg-1022

Support, 3 June 2026: For zakat designation we generally look for a documented assessment of financial need, and confirmation that funds are screened for zakat eligibility before disbursement. Do you have either?

Organizer, 4 June 2026: No, and I want to explain rather than leave you guessing.

There is no assessment because nobody has ever assessed us. Our barangay can issue a Certificate of Indigency, which is the standard document here — the barangay captain signs it and it states that the household is indigent based on the barangay's own records. I can get it in a week if it is needed. Nobody has asked me for one. I can also get a certification from the Municipal Social Welfare and Development Office, which takes longer, maybe three weeks, and involves a social worker visiting the house. If you need the MSWDO one instead of the barangay one, tell me now and I will start it today, but the next cycle is on 14 June.

There is no zakat eligibility screen because there is no organisation here to run one. The imam of our masjid, Ustadz Kasim, said he would attest in writing that our household is below nisab, and he has known our family for twenty years. Whether that counts I do not know.

On keeping funds separate. I opened the account for this campaign in May and nothing else goes through it. But the cleanest thing is what I already suggested: the hospital pharmacy takes third-party payment against the hospital number, and then the money goes from you to them without touching us at all. The billing section gave me the procedure in writing and I can forward it.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1022',
      expectedRouting: 'evidence_request',
      expectedEligible: true,
      expectedCategory: 'fuqara_masakin',
      failureClass: 'underdocumented_but_genuine',
      rationale:
        'One named beneficiary, a stamped oncology treatment plan stating both the regimen and that the ' +
        'drugs fall outside the PhilHealth case rate, a settled statement of account corroborating the ' +
        'per-cycle cost, an outright grant settleable directly to the hospital pharmacy, and derived ' +
        'overhead of 3.7% against a 12.5% cap. The only unmet criteria are the needs assessment and the ' +
        'eligibility screen, and the organizer has already named the document that resolves the first: ' +
        'a barangay Certificate of Indigency, free, obtainable in a week, unrequested. This is the ' +
        'clearest case in the corpus for why a documentation gap is not a verdict — the file is thin ' +
        'because of what the intake form asked for, not because of anything about the family, and a ' +
        'system that converted its own unasked question into a negative finding would be turning down ' +
        'a case it had never actually examined. The correct output is a drafted request naming the ' +
        'certificate, flagged against a 14 June treatment date.',
    },
  },

  // =========================================================================
  // lg-1023 — policy_excluded_category (gharimin)
  // Deliberately excellent. Audited, segregated, screened, 6.4% overhead. It
  // fails on nothing except the posture of the category it correctly claims.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1023',
      title: 'Abolishing USD 18.4 million in medical debt across eleven Michigan counties',
      organizerName: 'Maysarah Medical Debt Relief Fund',
      organizerType: 'registered_nonprofit',
      beneficiaryCountry: 'United States',
      organizerCountry: 'United States',
      goalUsd: 250_000,
      claimedCategory: 'gharimin',
      submittedAt: '2026-03-11',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Purchase of charity-care-eligible medical debt portfolios (face value USD 18.4m)', amountUsd: 196_000, declaredAsOverhead: false },
        { label: 'Portfolio due diligence and debt servicer fees', amountUsd: 22_000, declaredAsOverhead: false },
        { label: 'Abolition notification mailing to 14,200 households', amountUsd: 9_500, declaredAsOverhead: false },
        { label: 'Legal review and state compliance filings', amountUsd: 6_500, declaredAsOverhead: false },
        { label: 'Programme staff', amountUsd: 11_000, declaredAsOverhead: true },
        { label: 'Administration and payment processing', amountUsd: 5_000, declaredAsOverhead: true },
      ],
      priorCampaignIds: ['lg-0742', 'lg-0955'],
      sources: [
        {
          id: 'lg-1023-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-03-11',
          language: 'en',
          text: `Maysarah Medical Debt Relief Fund buys unpaid medical debt on the secondary market and extinguishes it. We do not collect on it, we do not resell it, and the household never repays anything. At the prices these portfolios trade at, one dollar abolishes roughly seventy-four dollars of debt.

This campaign covers eleven counties in Michigan — Wayne, Genesee, Saginaw, Muskegon, Calhoun, Berrien, Bay, Jackson, Kalamazoo, Ingham and Kent. We have agreements in principle with three hospital systems and one debt buyer to acquire portfolios with a combined face value of USD 18.4 million, covering approximately 14,200 households with an average balance of USD 1,295.

We do not choose which households benefit; the filter does. Portfolios are screened before purchase by our servicer against two criteria, and any account failing both is excluded from the purchase: household income at or below four hundred per cent of the federal poverty guideline, or medical debt equal to or greater than five per cent of annual household income. In practice the majority of what we buy is debt that the hospital's own charity care policy should have written off at the point of service. Michigan non-profit hospitals are required to maintain charity care policies and to screen patients against them, and the reason this debt exists is that thousands of people who qualified were never told they qualified.

Each household receives a single letter. It states that the debt is gone, that it was a gift with no strings, that there is no tax consequence, and that no one will contact them again. There is no application, no interview and no means test the household has to sit through, because the screening happened upstream in the portfolio and the household is never asked to prove anything about itself. We have sent 41,000 of these letters since 2022 across three states.

On zakat. We accept zakat and we treat it as a restricted trust. Zakat contributions are held in a restricted fund with its own ledger and are reported separately in our audited financial statements. Zakat is applied only to the portfolio purchase line and never to staff, mailing, legal or administrative costs, which are funded from unrestricted giving. Our administrative and fundraising share against this campaign is 6.4 per cent, well inside the one-eighth ceiling.

On the category. We selected the debtor category because that is what this is: households under a debt they cannot discharge, where the debt was incurred for medical necessity and not in disobedience. We put the question to a scholar we retain, and his written opinion is attached to our zakat policy page. We recognise this is a category some platforms decline to verify, and we would rather say that up front than have it discovered. If the badge is not available to us we will still run the campaign, and we would ask that donors be told the reason is a platform policy on the category and not a finding about this fund.`,
        },
        {
          id: 'lg-1023-registration',
          kind: 'org_registration',
          title: 'IRS determination letter and Michigan charitable solicitation registration',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-03-11',
          language: 'en',
          text: `INTERNAL REVENUE SERVICE — DETERMINATION LETTER

Maysarah Medical Debt Relief Fund
EIN: 85-XXXXXXX (synthetic)

We have determined you are exempt from federal income tax under section 501(c)(3) of the Internal Revenue Code. You are classified as a public charity under sections 509(a)(1) and 170(b)(1)(A)(vi). Effective date of exemption: 19 January 2022.

Purpose as stated in your application: to relieve the poor and distressed by acquiring and permanently extinguishing medical debt obligations of low-income households, without recourse to the debtor.

---

STATE OF MICHIGAN — DEPARTMENT OF ATTORNEY GENERAL
CHARITABLE TRUST SECTION

Charitable Organization License number CS-70412 (synthetic).
Licensed to solicit contributions in the State of Michigan. Current through 31 December 2026.
Financial statements on file: audited, years ended 31 December 2023, 2024 and 2025.`,
        },
        {
          id: 'lg-1023-financials',
          kind: 'financial_statement',
          title: 'Audited financial statements — year ended 31 December 2025 (extracts)',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-03-11',
          language: 'en',
          text: `MAYSARAH MEDICAL DEBT RELIEF FUND
NOTES TO THE FINANCIAL STATEMENTS — YEAR ENDED 31 DECEMBER 2025
Audited by Halverson & Ruiz PLLC (synthetic). Unmodified opinion issued 14 February 2026.

NOTE 3 — NET ASSETS WITH DONOR RESTRICTIONS

The Fund maintains a separate restricted fund for contributions designated by the donor as zakat. Zakat contributions are recorded in a distinct ledger, held in a separate deposit account, and released only against portfolio acquisition costs. No zakat contribution was applied to management, general or fundraising expense during the period. Zakat contributions received in the year: USD 611,400. Released to portfolio acquisition: USD 583,900. Balance carried forward: USD 27,500.

NOTE 7 — STATEMENT OF FUNCTIONAL EXPENSES, SUMMARY

Programme services (portfolio acquisition, due diligence, notification, legal) .... USD 3,984,200 (91.8%)
Management and general ........................................................... USD   214,700 (4.9%)
Fundraising ...................................................................... USD   143,100 (3.3%)
Total expenses ................................................................... USD 4,342,000

NOTE 9 — DEBT ACQUIRED AND EXTINGUISHED

Face value of medical debt acquired and permanently extinguished during the year: USD 291.4 million, benefiting 214,880 households across three states. No amount was collected from any household. No acquired obligation was resold, assigned or retained. The Fund holds no receivable from any beneficiary household at the reporting date.`,
        },
        {
          id: 'lg-1023-zakat-page',
          kind: 'website_capture',
          title: 'maysarahfund.example.org/zakat',
          provenance: 'Web capture',
          capturedAt: '2026-03-04',
          language: 'en',
          text: `Zakat at the Maysarah Fund

We accept zakat and we hold it as a trust.

Segregation. Zakat contributions are held in a restricted fund with its own ledger and a separate deposit account. They are never pooled with unrestricted giving and they are reported as a separate line in our audited financial statements every year.

What zakat pays for. Zakat is applied to the acquisition of debt portfolios only. It does not pay salaries, mailing, legal fees or overhead. Those costs come from unrestricted donations and foundation grants.

Eligibility screening. Every account inside a portfolio we buy is screened before purchase against household income at or below four hundred per cent of the federal poverty guideline, or medical debt at or above five per cent of annual household income. Accounts failing both tests are excluded from the purchase. We can produce the screening file for any portfolio on request.

Administrative share. Our combined management and fundraising expense was 8.2 per cent of total expenditure in the 2025 audited year, and is budgeted at 6.4 per cent against this campaign. We hold ourselves to the one-eighth ceiling.

The category question. We are aware that platforms differ on whether debt relief is a verifiable zakat category. Our own position, and the written opinion of the scholar we retain, is set out in the linked memorandum. We do not ask any platform to adopt it. Where a platform declines to verify this category, we say so on the campaign page rather than leaving donors to work it out.`,
        },
        {
          id: 'lg-1023-screening',
          kind: 'beneficiary_documentation',
          title: 'Portfolio eligibility screening specification (servicer document)',
          provenance: 'Uploaded by organizer — Meridian Portfolio Services LLC (synthetic)',
          capturedAt: '2026-03-11',
          language: 'en',
          text: `MERIDIAN PORTFOLIO SERVICES LLC (synthetic)
ELIGIBILITY SCREENING SPECIFICATION — MAYSARAH FUND ACQUISITIONS
Revision 6, January 2026

Purpose. To identify, within a candidate portfolio, those accounts that meet the Fund's beneficiary definition, and to exclude all others from purchase.

Test A — Income. Estimated household income at or below 400% of the current federal poverty guideline for the household size on file, derived from the originating provider's charity care application where present, and otherwise from a census-tract and credit-attribute model with a documented accuracy band.

Test B — Debt burden. Total medical debt at or above 5% of estimated annual household income.

An account qualifying under either Test A or Test B is eligible for purchase. An account failing both is struck from the tape before pricing and is not acquired.

Mandatory exclusions applied regardless of Test A or B: accounts subject to active litigation; accounts with any non-medical component; accounts where the originating provider has not certified that its own charity care policy was applied or offered; accounts belonging to any employee or board member of the Fund or of Meridian.

Post-purchase. Acquired accounts are marked extinguished on the servicer's system within five business days, reported to the three consumer reporting agencies as satisfied and removed, and permanently blocked from resale or assignment. No collection activity of any kind is permitted on an acquired account. A per-portfolio screening file listing counts by test outcome is delivered to the Fund and retained for seven years.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1023',
      expectedRouting: 'policy_excluded',
      expectedEligible: false,
      expectedCategory: 'gharimin',
      failureClass: 'policy_excluded_category',
      rationale:
        'The category is identified correctly and that is precisely why the badge is unavailable: policy ' +
        'does not verify gharimin, because confirming a third party’s debt position and the ' +
        'circumstances in which it was incurred requires records the platform cannot obtain or validate. ' +
        'This case is built to make the distinction impossible to miss — the fund is audited with an ' +
        'unmodified opinion, holds zakat in a separate deposit account with its own ledger, applies it ' +
        'only to portfolio acquisition, screens every account before purchase, and budgets 6.4% overhead ' +
        'against a 12.5% ceiling. It would satisfy every universal criterion if the criteria were ever ' +
        'reached, and the router deliberately does not reach them. The correct reviewer message says the ' +
        'zakat designation is unavailable as a matter of category policy, not as a finding about this ' +
        'campaign, and that fundraising is unaffected.',
    },
  },

  // =========================================================================
  // lg-1024 — policy_excluded_category (ibn_sabil)
  // Same shape, different category, and with a stated interpretive argument that
  // is not unreasonable. The point is that the router does not engage with it.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1024',
      title: 'Winter transit support on the Subotica corridor: 900 people, 90 days',
      organizerName: 'Karwan Transit Aid',
      organizerType: 'registered_nonprofit',
      beneficiaryCountry: 'Serbia',
      organizerCountry: 'Austria',
      goalUsd: 64_000,
      claimedCategory: 'ibn_sabil',
      submittedAt: '2026-02-24',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Thermal sleeping bags, mats and winter clothing', amountUsd: 24_000, declaredAsOverhead: false },
        { label: 'Hot meals at two distribution points, 90 days', amountUsd: 16_800, declaredAsOverhead: false },
        { label: 'Emergency medical kit resupply and volunteer nurse costs', amountUsd: 8_900, declaredAsOverhead: false },
        { label: 'Vehicle fuel, insurance and maintenance', amountUsd: 5_200, declaredAsOverhead: false },
        { label: 'Phone credit and charging for family contact', amountUsd: 4_600, declaredAsOverhead: false },
        { label: 'Coordination staff, 0.5 FTE', amountUsd: 3_200, declaredAsOverhead: true },
        { label: 'Administration and payment processing', amountUsd: 1_300, declaredAsOverhead: true },
      ],
      priorCampaignIds: ['lg-0688'],
      sources: [
        {
          id: 'lg-1024-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-02-24',
          language: 'en',
          text: `Karwan Transit Aid runs two evening distribution points north of Subotica, in Vojvodina, about ten kilometres from the Hungarian border. One is at the edge of the abandoned brick works. The other is a lay-by on the road toward Horgos where a group has been sleeping in the tree line for most of two years. We have been doing this since October 2021.

Between 180 and 220 people come to the evening distribution on a normal winter night. Over ninety days we expect to reach around 900 individuals, because the population turns over — the median stay we record in the corridor is 47 days, and people arrive and leave in both directions. They are mostly from Afghanistan, Syria, Morocco and Bangladesh. About a fifth are under eighteen. We do not ask anyone their legal status and we do not record names.

What the money buys. Thermal sleeping bags and mats, because the ground temperature here is below freezing from December to February and the single most common thing we treat is cold injury. A hot meal cooked in Subotica and driven out in insulated containers, seven nights a week. Phone credit and a charging bank, which sounds trivial and is not — the most frequent request we get is to call a mother. A restocked medical kit and the costs of a volunteer nurse who comes two evenings a week, mostly for foot wounds, scabies and untreated dental pain. Fuel, insurance and servicing for one van that does 1,100 kilometres a month. And a half-time coordinator, because a rota of twenty-six volunteers across two countries does not organise itself.

Governance. We are a registered Verein in Vienna, ZVR 4188-27-991 (synthetic). Our accounts are prepared by a Viennese accountant and published in full each March. We have run two prior campaigns on this platform and both reported against their budgets. Our Serbian partner, Vojvodina Solidarity Network, holds the local permissions for the distribution points and their coordination note is attached.

Zakat. We accept zakat and we keep it separate. Zakat donations are held in a separate sub-account at our bank in Vienna and we publish an annual zakat report showing what was received and what it was spent on. Zakat is spent on food, clothing and medical supplies only — never on fuel, never on the coordinator, never on administration. Our administrative and fundraising share against this campaign is 7.0 per cent.

Why we selected the stranded traveller category. We have thought about this carefully and we will state our reasoning plainly. The classical description is a person who is away from home and cut off from their means, who may be a person of substance where they came from and is destitute where they are standing. That describes almost everyone at our distribution. A man who owned a shop in Herat is not poor in the sense of never having had anything; he is a traveller whose journey has consumed everything he had. We are aware that this reading is not universally accepted and that some platforms will not verify it. We would rather set out our reasoning and be told no than select a category we think fits less well because its criteria are easier.`,
        },
        {
          id: 'lg-1024-registration',
          kind: 'org_registration',
          title: 'Austrian Vereinsregister extract',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-02-24',
          language: 'en',
          text: `REPUBLIC OF AUSTRIA — VEREINSREGISTER EXTRACT (translated)

Association name: Karwan Transit Aid
ZVR number: 4188-27-991 (synthetic)
Seat: Vienna
Date of formation notice: 8 September 2021
Status: Active. Not dissolved. No supervisory proceedings pending.

Statutory purpose, section 2 of the statutes: the non-profit provision of humanitarian relief, in particular food, clothing, shelter materials and basic medical supplies, to persons in transit and to displaced persons in the Republic of Austria and abroad. The association is non-profit-making and pursues no political or commercial objectives.

Organs: General assembly, board of five, two auditors.
Representation: Chair and treasurer jointly.
Financial year: 1 January to 31 December. Accounts examined annually by the elected auditors and published.`,
        },
        {
          id: 'lg-1024-zakat-page',
          kind: 'website_capture',
          title: 'karwantransit.example.org/zakat',
          provenance: 'Web capture',
          capturedAt: '2026-02-17',
          language: 'en',
          text: `Zakat at Karwan Transit Aid

We accept zakat and we account for it separately.

Separate account. Zakat donations are received into a dedicated sub-account at our bank in Vienna. They are not commingled with our general funds and they are reconciled monthly against the zakat ledger.

Restricted use. Zakat is spent on food, clothing, footwear, shelter materials and medical supplies. It is not spent on fuel, vehicle costs, coordinator salary, insurance or administration, all of which are funded from our unrestricted income and from two Austrian municipal grants.

Annual zakat report. Every March we publish what we received in zakat, what we spent it on, and what carried over. The 2025 report is linked here: received EUR 74,180, disbursed EUR 71,900, carried forward EUR 2,280.

Administrative share. Our combined administration and fundraising expense was 9.4 per cent in 2025 and is budgeted at 7.0 per cent against the current campaign. We treat one eighth as a ceiling and we have never been near it.

Our position on the category. We fundraise for people in transit and we designate that as support to the stranded traveller. We know this reading is contested. Where a platform does not verify the category we will say so on the campaign page and keep fundraising without the designation, because the need does not change with the label.`,
        },
        {
          id: 'lg-1024-budget',
          kind: 'budget_breakdown',
          title: 'Ninety-day costing',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-02-24',
          language: 'en',
          text: `NINETY-DAY WINTER COSTING — SUBOTICA CORRIDOR
Prepared 20 February 2026. EUR converted at 1.08 USD.

Sleeping bags, mats and winter clothing. 900 sleeping bags at USD 18, 900 mats at USD 6, and a clothing allocation of USD 2.40 per person. USD 24,000. Zakat-eligible line.

Hot meals. 200 meals per night at USD 0.93 per meal, ninety nights, cooked in a rented commercial kitchen in Subotica. USD 16,800. Zakat-eligible line.

Medical. Kit resupply, wound dressings, scabies treatment, and the volunteer nurse's travel and indemnity insurance for two evenings a week. USD 8,900. Zakat-eligible line.

Vehicle. Fuel at 1,100 km a month, third-party insurance, two services, and one set of winter tyres. USD 5,200. Funded from unrestricted income, not from zakat.

Phone credit and charging. USD 4,600. Funded from unrestricted income.

Coordinator, 0.5 FTE for three months, gross including Austrian employer contributions. USD 3,200. Funded from unrestricted income.

Administration and payment processing. USD 1,300.

TOTAL USD 64,000. Administration and coordination together are USD 4,500, or 7.0 per cent.`,
        },
        {
          id: 'lg-1024-partner',
          kind: 'correspondence',
          title: 'Coordination note from Serbian partner organisation',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-02-24',
          language: 'en',
          text: `VOJVODINA SOLIDARITY NETWORK (synthetic)
Subotica
20 February 2026

To whom it may concern,

We confirm that Karwan Transit Aid has operated evening distributions at the two sites north of Subotica in coordination with our network since October 2021, and that we hold the local arrangements for both sites.

We confirm the following from our own observation. Distribution is open to anyone present and no one is asked for documents, status or nationality. Materials are handed over outright and nothing is loaned, sold or exchanged. Karwan's volunteers keep no register of names; the only figures recorded are nightly headcounts and item counts, which are shared with us weekly.

Our headcount records for December 2025 and January 2026 show a nightly average of 194 people at the two sites combined, with a peak of 261 on 8 January.

We have found Karwan to be reliable in the two respects that matter most in this corridor: they arrive when they say they will, and they do not photograph people.

Milena Radovic
Coordinator`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1024',
      expectedRouting: 'policy_excluded',
      expectedEligible: false,
      expectedCategory: 'ibn_sabil',
      failureClass: 'policy_excluded_category',
      rationale:
        'Policy does not verify ibn_sabil, on the stated ground that the circumstances defining the ' +
        'category are transient and cannot be evidenced through a crowdfunding intake process — and ' +
        'this file demonstrates exactly that, since the organisation deliberately records no names and ' +
        'the partner confirms it. The exclusion fires before any evidence is weighed, which is the ' +
        'correct order: the operator is registered, publishes an annual zakat report against a ' +
        'dedicated sub-account, restricts zakat to food, clothing and medical supplies, and budgets 7.0% ' +
        'overhead. The organizer also advances a coherent interpretive argument for the category, and ' +
        'the router must not engage with it — whether the reading is right is a scholarly question and ' +
        'this is not a scholar_board case, because the platform has already settled that it will not ' +
        'adjudicate this category at all. Reviewer message: the designation is unavailable by policy, ' +
        'the campaign is unaffected, and nothing here is a finding against the organisation.',
    },
  },

  // =========================================================================
  // lg-1025 — contradictory_sources
  // Marketing copy says nothing is deducted. The organisation's own budget,
  // audited accounts and donation FAQ all say 15%. Three documents against one,
  // and the system's job is still to show the reviewer both quotes.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1025',
      title: 'Six months of monthly food parcels for 1,500 households in Kurigram and Gaibandha',
      organizerName: 'Alokito Aid Foundation',
      organizerType: 'registered_nonprofit',
      beneficiaryCountry: 'Bangladesh',
      organizerCountry: 'Canada',
      goalUsd: 132_000,
      claimedCategory: 'fuqara_masakin',
      submittedAt: '2026-05-05',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Food parcels, 1,500 households, six monthly distributions', amountUsd: 96_900, declaredAsOverhead: false },
        { label: 'Local partner packing, warehousing and distribution', amountUsd: 8_700, declaredAsOverhead: false },
        { label: 'Field monitoring and post-distribution verification visits', amountUsd: 2_400, declaredAsOverhead: false },
        { label: 'Programme support and fundraising recovery (15% of gross, per Board Policy FIN-04)', amountUsd: 19_800, declaredAsOverhead: true },
        { label: 'Payment processing fees', amountUsd: 4_200, declaredAsOverhead: true },
      ],
      priorCampaignIds: ['lg-0813'],
      sources: [
        {
          id: 'lg-1025-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-05-05',
          language: 'en',
          text: `Alokito Aid Foundation has worked in the northern chars of Bangladesh since 2014. This campaign funds six monthly food parcels for 1,500 households in Kurigram and Gaibandha districts, through the monga season and beyond it.

The chars are the sand islands in the Brahmaputra and the Teesta. They flood, they move, and in a bad year a household can lose its land and its house in a night. The lean season between the aman planting and the harvest is when day labour disappears and households that were managing stop managing. Our own post-distribution surveys last year found that 61 per cent of parcel-receiving households had reduced to one meal a day in the two weeks before the first distribution.

The parcel is fixed and it feeds a household of five for a month: 25 kg rice, 3 kg lentils, 2 litres mustard oil, 1 kg salt, 500 g turmeric and chilli, and 1 kg sugar. Landed cost per parcel including packing and boat transport is USD 10.77. We buy in Rangpur through three suppliers on rotating quotation and we publish the quotations.

Selection is done by our partner, Char Jibon Sangstha, using a wealth-ranking exercise run with each char committee, then verified household by household by an enumerator. The scoring sheet is attached. Households qualify on landholding, whether the homestead was lost in the last flood cycle, the number of dependants, and whether there is an adult earner. Ten per cent of selections are re-verified by a second enumerator and last cycle that check overturned 4 per cent of selections.

One hundred per cent of your zakat reaches the families we serve. Not one cent is deducted for administration. We are able to say this because our overheads are covered by a separate group of long-standing supporters who fund our operations directly, so every zakat dollar goes into the parcel.

Alokito Aid Foundation is a registered Canadian charity and files a T3010 every year. We have delivered 41,000 parcels since 2014 and we have never missed a distribution cycle.`,
        },
        {
          id: 'lg-1025-budget',
          kind: 'budget_breakdown',
          title: 'Campaign budget, six-month cycle',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-05-05',
          language: 'en',
          text: `CAMPAIGN BUDGET — KURIGRAM AND GAIBANDHA, SIX MONTHLY DISTRIBUTIONS
Prepared by the finance office, 29 April 2026.

Food parcels. 1,500 households x 6 distributions x USD 10.77 landed cost. USD 96,900.

Local partner packing, warehousing and distribution. Char Jibon Sangstha service agreement, six cycles, including boat hire and porterage. USD 8,700.

Field monitoring and post-distribution verification. Enumerator days, re-verification sample, and two supervisory visits from Dhaka. USD 2,400.

Programme support and fundraising recovery (15% of gross, per Board Policy FIN-04). USD 19,800.

Payment processing fees. USD 4,200.

TOTAL USD 132,000.

Finance office note: Board Policy FIN-04 applies the programme support and fundraising recovery to all restricted funds without exception, including funds designated as zakat. The recovery is charged at the point of receipt, before allocation to the programme budget.`,
        },
        {
          id: 'lg-1025-financials',
          kind: 'financial_statement',
          title: 'Audited financial statements — year ended 31 December 2025 (extracts)',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-05-05',
          language: 'en',
          text: `ALOKITO AID FOUNDATION
NOTES TO THE FINANCIAL STATEMENTS — YEAR ENDED 31 DECEMBER 2025
Audited by Trentham Kaur LLP (synthetic). Unmodified opinion issued 3 April 2026.

NOTE 2 — REVENUE RECOGNITION AND COST RECOVERY

Restricted zakat funds are charged a 15.0% programme support and fundraising recovery in accordance with Board Policy FIN-04. The recovery is applied on receipt and is recognised as unrestricted revenue in the period received. The Board reviewed the rate in November 2025 and resolved to maintain it at 15.0% for the 2026 year.

NOTE 5 — DESIGNATED FUNDS

Zakat received in the year: CAD 1,284,600. Recovery applied under FIN-04: CAD 192,690. Net amount released to programmes: CAD 1,091,910.

NOTE 8 — STATEMENT OF FUNCTIONAL EXPENSES, SUMMARY

Charitable programmes ........................ CAD 3,611,400 (80.4%)
Management and general ....................... CAD   541,900 (12.1%)
Fundraising .................................. CAD   337,200 (7.5%)
Total expenditure ............................ CAD 4,490,500

NOTE 11 — SUBSEQUENT EVENTS

Management has advised the auditors that certain campaign materials published in 2025 described donations as reaching beneficiaries in full. Management has represented that this language refers to the programme net of recovery and that a review of donor communications is in progress. No adjustment to these statements arises.`,
        },
        {
          id: 'lg-1025-faq',
          kind: 'website_capture',
          title: 'alokitoaid.example.org/donate/faq',
          provenance: 'Web capture',
          capturedAt: '2026-04-28',
          language: 'en',
          text: `Donation FAQ

Does one hundred per cent of my donation reach beneficiaries?
We aim to maximise the proportion of every gift that reaches families. Our Board has set a programme support and fundraising recovery of 15 per cent, which is applied to all restricted funds including zakat. The remaining 85 per cent is allocated to the programme the donor selected.

Why do you charge a recovery on restricted funds?
Because restricted programmes are not free to run. Someone has to procure, ship, monitor and report, and a fund that carried none of those costs would be subsidised by our unrestricted donors. We think a stated 15 per cent is more honest than an unstated cross-subsidy.

Can I give and ask that no recovery is taken?
Yes. Donors giving CAD 25,000 or more may request a recovery waiver in writing and the finance office will confirm it. The waiver cannot be applied to gifts made through third-party platforms.

Is zakat treated differently?
Zakat is held in a designated fund and is disbursed only to households confirmed eligible under our screening. The FIN-04 recovery applies to zakat on the same basis as to other restricted gifts.

Where can I see the numbers?
Our audited financial statements and our T3010 are published here each spring.`,
        },
        {
          id: 'lg-1025-selection',
          kind: 'beneficiary_documentation',
          title: 'Household selection scoring sheet and verification protocol',
          provenance: 'Uploaded by organizer — Char Jibon Sangstha (synthetic)',
          capturedAt: '2026-05-05',
          language: 'en',
          text: `CHAR JIBON SANGSTHA / ALOKITO AID FOUNDATION
HOUSEHOLD SELECTION — SCORING SHEET AND VERIFICATION PROTOCOL

Stage 1 — Participatory wealth ranking. Facilitated with each char committee. Households are sorted by the committee into four bands using locally defined criteria. Bands 3 and 4 proceed to Stage 2.

Stage 2 — Household verification, scored by enumerator.
Landholding: none (+3), under 10 decimal (+2), 10 to 33 decimal (+1), above 33 decimal (0).
Homestead lost or relocated in the last flood cycle (+2).
No adult earner in the household (+2).
Female-headed household (+2).
Dependants under 15 (+1 each, maximum +3).
Household member with chronic illness or disability (+2).
Already receiving a monthly parcel from another agency (disqualifying).

Threshold. Households scoring 6 or above are selected, subject to the parcel allocation for the char.

Verification. Ten per cent of selections are re-verified by a second enumerator who did not conduct the original visit. In the November 2025 cycle re-verification overturned 4 per cent of selections, all in the direction of removal.

Zakat screen. Applied by the enumerator in addition to the score. Confirms the household holds assets below nisab and is not receiving zakat from another distributing body in the same cycle.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1025',
      expectedRouting: 'priority_review',
      expectedEligible: false,
      expectedCategory: 'fuqara_masakin',
      failureClass: 'contradictory_sources',
      rationale:
        'The narrative states "Not one cent is deducted for administration"; the organisation’s own ' +
        'budget line, its audited Note 2, and its public donation FAQ each state that a 15% recovery is ' +
        'applied to restricted funds including zakat, charged on receipt. Both quotes must be surfaced ' +
        'side by side with their provenance and dates — the failure mode being measured is a pipeline ' +
        'that silently reconciles the two and reports whichever it read last. The contradiction also ' +
        'decides a blocking criterion independently: derived overhead is 18.2% against the 12.5% ' +
        'ceiling, so the deterministic check fails on the organizer’s own numbers. The substance is ' +
        'genuine poverty relief with a documented means test and a nisab screen, which is what makes ' +
        'this a priority review rather than a rejection — a person decides whether this is a misleading ' +
        'claim the organisation must correct or a policy it must change.',
    },
  },

  // =========================================================================
  // lg-1026 — contradictory_sources
  // The campaign page describes a ring-fenced zakat account. The organisation's
  // own FAQ and its filed accounts both say no restricted funds exist at all.
  // =========================================================================
  {
    campaign: {
      id: 'lg-1026',
      title: 'Dry-season cash transfers for 620 herder households in Maradi',
      organizerName: 'Fondation Albarka Sahel',
      organizerType: 'registered_nonprofit',
      beneficiaryCountry: 'Niger',
      organizerCountry: 'France',
      goalUsd: 88_000,
      claimedCategory: 'fuqara_masakin',
      submittedAt: '2026-07-01',
      narrativeLanguage: 'en',
      budget: [
        { label: 'Unconditional cash transfers, 620 households, three monthly payments', amountUsd: 69_700, declaredAsOverhead: false },
        { label: 'Community enumerators and distribution agents (programme delivery)', amountUsd: 4_800, declaredAsOverhead: false },
        { label: 'Household enumeration and post-distribution monitoring', amountUsd: 5_400, declaredAsOverhead: false },
        { label: 'Mobile money transfer fees and agent network costs', amountUsd: 3_600, declaredAsOverhead: false },
        { label: 'Coordination and administration', amountUsd: 3_200, declaredAsOverhead: true },
        { label: 'Payment processing fees', amountUsd: 1_300, declaredAsOverhead: true },
      ],
      priorCampaignIds: ['lg-0791', 'lg-0902'],
      sources: [
        {
          id: 'lg-1026-narrative',
          kind: 'campaign_narrative',
          title: 'Campaign narrative',
          provenance: 'Organizer submission at intake',
          capturedAt: '2026-07-01',
          language: 'en',
          text: `Fondation Albarka Sahel has worked in Maradi region since 2017. This campaign funds three months of unconditional cash transfers to 620 herder households in Guidan Roumdji and Madarounfa departments, covering the soudure — the hungry gap between the exhaustion of last year's stocks and the millet harvest in September.

Cash rather than food, for a reason we can evidence. Our post-distribution monitoring in 2025 found that 71 per cent of transfer value was spent on food within eight days, but the remaining 29 per cent went to animal feed, school costs and repaying a shopkeeper — expenditures a food parcel forecloses. Grain is available in the Maradi markets during the soudure. What households lack is money, not supply.

The transfer is XOF 45,000 per household per month for three months, delivered by mobile money through the agent network in Guidan Roumdji, Tibiri and Madarounfa. Households without a handset receive through a nominated agent with a physical collection point, which is how about a third of our caseload is served. There is no repayment, no condition and no requirement to attend anything.

Targeting is done by our field team using a household economy approach adapted with the commune authorities. Enumerators score households on herd size against the pre-crisis baseline, whether animals were sold at distress prices before June, cereal stocks remaining in weeks, dependency ratio, and whether the household has a member in seasonal migration sending remittances. The scoring sheet and last year's targeting report are attached. Fifteen per cent of selections are re-verified.

Zakat contributions are held in a ring-fenced account at our bank in Lyon and are never commingled with our general funds. Every zakat gift is disbursed only to households confirmed eligible under a nisab screen applied by our field team at the point of enumeration, in addition to the economic scoring. We report on zakat separately to the donors who give it.

The Foundation is declared in France under the 1901 law and files annual accounts with our prefecture. We have run two prior campaigns on this platform and both delivered against budget. Our administrative and coordination costs on this campaign are 5.1 per cent, well inside the one-eighth ceiling.`,
        },
        {
          id: 'lg-1026-registration',
          kind: 'org_registration',
          title: 'French association declaration — RNA extract',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-07-01',
          language: 'en',
          text: `RÉPUBLIQUE FRANÇAISE — RÉPERTOIRE NATIONAL DES ASSOCIATIONS (translated extract)

Name: Fondation Albarka Sahel
RNA number: W691XXXXXX (synthetic)
Declared at: Préfecture du Rhône
Date of declaration: 14 June 2017. Published in the Journal Officiel des associations, 24 June 2017.
Status: Active.

Declared object: humanitarian and development action in the Sahel region, in particular food security, pastoral livelihoods and access to basic services, through direct assistance to households and through partnership with local associations.

Registered office: Lyon 7e.
Officers on file: President, Treasurer, Secretary. Last officer change declared 3 February 2025.
Annual accounts: filed with the préfecture for 2022, 2023, 2024 and 2025.`,
        },
        {
          id: 'lg-1026-faq',
          kind: 'website_capture',
          title: 'albarkasahel.example.org/faq-dons',
          provenance: 'Web capture',
          capturedAt: '2026-06-19',
          language: 'en',
          text: `Frequently asked questions about giving (English version of our French page)

Can I choose which programme my gift supports?
You can tell us your preference and we record it. We use it to guide our planning and we report back on the programme you chose. We cannot promise that your individual gift is spent on that programme, for the reason set out below.

Do you keep zakat in a separate account?
We are asked this often. We do not. All gifts, whatever their designation, are received into our single general fund and allocated by the programmes committee according to where the need is greatest. We do not operate a separate zakat fund and we do not track zakat separately in our accounts.

Why do you work this way?
Because designated funds create a queue. In 2023 we held money designated for one programme while another was underfunded, and we could not move it quickly. The board decided in March 2024 that a single general fund was the more responsible structure for an organisation of our size, and we have operated that way since.

Do you screen recipients for zakat eligibility?
Our targeting is economic. We score households on herd loss, cereal stocks and dependency, and we do not apply a religious eligibility test at any point in the process.

Is my gift tax deductible in France?
Yes. A receipt is issued in January for the preceding year.`,
        },
        {
          id: 'lg-1026-accounts',
          kind: 'financial_statement',
          title: 'Comptes annuels 2025 — extracts (translated)',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-07-01',
          language: 'en',
          text: `FONDATION ALBARKA SAHEL
ANNUAL ACCOUNTS, YEAR ENDED 31 DECEMBER 2025 — EXTRACTS (translated)
Prepared by Cabinet Verhoeven & Sy (synthetic). Filed with the Préfecture du Rhône, 12 May 2026.

NOTE 4 — FONDS DÉDIÉS (DEDICATED FUNDS)

Fonds dédiés at 1 January 2025: nil.
Amounts allocated to dedicated funds during the year: nil.
Fonds dédiés at 31 December 2025: nil.
The Association did not hold restricted or designated funds during the period. All donations, including those accompanied by a stated donor preference, were received into the general fund and applied in accordance with the programmes committee's allocation.

NOTE 6 — BANK ACCOUNTS

The Association operates two bank accounts: a current account and an interest-bearing reserve account, both at its bank in Lyon. No sub-account or segregated account was opened or maintained during the period.

NOTE 9 — RESOURCES BY ORIGIN

Individual donations EUR 1,142,800. Institutional grants EUR 706,300. Other income EUR 21,500.
No analysis of donations by donor designation is maintained.`,
        },
        {
          id: 'lg-1026-targeting',
          kind: 'beneficiary_documentation',
          title: 'Household targeting scoring sheet, soudure 2026',
          provenance: 'Uploaded by organizer',
          capturedAt: '2026-07-01',
          language: 'en',
          text: `FONDATION ALBARKA SAHEL — HOUSEHOLD TARGETING, SOUDURE 2026
Guidan Roumdji and Madarounfa departments. Adapted from the household economy approach with commune authorities.

Enumerator scoring.
Herd size against the household's own pre-crisis baseline: reduced by more than 60% (+3), 30 to 60% (+2), under 30% (+1).
Distress sale of breeding stock before 1 June (+2).
Cereal stocks remaining: under 2 weeks (+3), 2 to 6 weeks (+2), over 6 weeks (0).
Dependency ratio above 1.5 (+2).
No household member in seasonal migration remitting funds (+2).
Female-headed household (+1).
Household member with chronic illness or disability (+1).

Threshold. Households scoring 8 or above are enrolled, up to the commune allocation. Where the allocation binds, enrolment proceeds in descending score order and the cut-off is recorded.

Verification. Fifteen per cent of enrolments are re-verified by a supervisor who did not conduct the original visit. In the 2025 cycle, re-verification changed 6 per cent of enrolments.

Post-distribution monitoring. A 5 per cent sample is surveyed after each transfer on expenditure, market access and any reported diversion or fee-taking by agents. The 2025 report is attached separately.

Note on eligibility criteria. This instrument scores economic vulnerability only. No religious or confessional criterion is applied at enumeration or at enrolment.`,
        },
      ],
    },
    gold: {
      campaignId: 'lg-1026',
      expectedRouting: 'priority_review',
      expectedEligible: false,
      expectedCategory: 'fuqara_masakin',
      failureClass: 'contradictory_sources',
      rationale:
        'The campaign page says zakat is "held in a ring-fenced account at our bank in Lyon and are ' +
        'never commingled with our general funds"; the organisation’s own donation FAQ says "We do ' +
        'not operate a separate zakat fund and we do not track zakat separately in our accounts", and ' +
        'its filed 2025 accounts record fonds dédiés of nil with no sub-account maintained. Two ' +
        'independent documents, one of them audited and filed with a prefecture, contradict the ' +
        'narrative on a fact that decides a blocking criterion — whether the organisation actually ' +
        'represents that it administers zakat as zakat — and a material one. A second contradiction ' +
        'runs alongside it: the narrative claims a nisab screen at enumeration, while both the FAQ and ' +
        'the targeting sheet state that no religious eligibility criterion is applied. The programme ' +
        'itself is sound — real targeting, documented verification, 5.1% overhead — so the case must be ' +
        'presented as paired quotations for a person to resolve, not silently decided by whichever ' +
        'document the extractor happened to weight.',
    },
  },
];
