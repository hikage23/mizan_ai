# Mizan — zakat eligibility verification copilot

**Weighs evidence. Never issues rulings.**

Built for the LaunchGood Applied AI Engineer application.

---

## The problem

LaunchGood publishes a zakat policy: the eight Quranic categories of eligible recipients, which of
them the platform actually verifies, a contemporary reading for the categories that need one, and an
administrative ceiling of one eighth. It is a considered document written with input across the four
madhabs.

The policy is not the problem. **Applying it consistently, with evidence, across 155 countries with a
small team, is the problem.** Every zakat-designated campaign needs someone to read a narrative,
registration papers, a website, financial statements and a budget, and decide whether the stated
policy is met. That work scales linearly with the platform. And because LaunchGood charges **zero
platform fees** — revenue is optional donor tips on $688M+ raised — it cannot be solved by hiring.

Mizan does the reading. A person still decides.

## What the AI owns, and what it never touches

| Stage | Owner |
|---|---|
| Scan submitted text for instructions aimed at the reviewing model | deterministic |
| Extract evidence, each tied to an exact quote | model |
| Verify every span against its source; delete what fails | deterministic |
| Assess each criterion against verified evidence only | model |
| Overhead cap, category posture, duplicate detection, completeness | deterministic |
| Route the case | deterministic |
| **Decide** | **human** |

### There is no auto-approve path

Not as a policy, as a **type**. `RoutingDecision` has no `approve` member, so no branch of the router
can grant a badge. Every outcome terminates at a person.

Automating the human away is normally the entire point, and on most review queues a high-confidence
fast path is correct. Zakat is different for a reason specific to what zakat is: it is an *obligation
discharged*, not a payment made. If a donor's zakat reaches an ineligible recipient, their obligation
is not fulfilled — and they never find out. No chargeback, no refund, no complaint that surfaces the
error. The loss is silent, unrecoverable, and borne by someone who trusted a badge.

A system whose mistakes are invisible to the people they harm should not be allowed to write them at
machine speed. So the win here is not removing the reviewer. It is **ten minutes instead of ninety,
with two reviewers reaching the same answer.**

The router's second invariant: low confidence can only ever route toward *more* scrutiny. Every
branch that lowers scrutiny is gated on high confidence **and** clean deterministic checks; every
branch that raises it fires on either signal alone.

## Anti-fabrication

Every AI-produced claim carries a span pointing at exact characters in a source document. Before a
dossier reaches a human, each span is checked to occur literally in the document it cites. Drifted
offsets are repaired from an exact quote match; a quote that does not occur at all is a fabrication
and **the item is deleted** — not shown with a warning, because a reviewer who sees a flagged
fabricated quote reads it anyway and it influences them. The count is surfaced separately in an
integrity panel.

Verification sits *between* the two model calls, so the adjudicating model never sees an unverified
quote.

## Not-evidenced is a first-class outcome

The line between `contradicted` and `insufficient_evidence` is the most consequential judgement in
the pipeline. Most applicants are honest people with thin paperwork. Marking their case contradicted
pushes a genuine claimant toward rejection on the strength of a missing document.

So a documentation gap routes to `evidence_request`, which drafts an email naming the *specific*
document needed — composed from a template rather than by a model, because an invented requirement
means a family chasing a document that never existed. Nothing sends until a human presses the button.

## Running it

```bash
npm install
npm run dev          # works immediately — recorded fixtures, no API key needed
npm run eval         # gold-set evaluation, exits non-zero on any false approve
npm run build
```

**Replay mode.** Fixtures are verbatim responses from a real model run. Replaying them exercises the
entire downstream pipeline — span verification, aggregation, routing — against real model output
including its mistakes. The only thing replay removes is the network call and the nondeterminism.
That is what makes the eval numbers reproducible and lets the demo work with no key.

To record the remaining campaigns (~1¢ each):

```bash
ANTHROPIC_API_KEY=sk-... npm run record
```

## Deploying

Zero-config on Vercel. No database — decisions are held in memory per instance, which is a stated
limitation of the prototype and keeps deployment to a git push.

```bash
npx vercel --prod
```

Optionally set `ANTHROPIC_API_KEY` in the Vercel dashboard to enable live assessment of
not-yet-recorded campaigns and the adversarial controls.

## Evaluation

24 synthetic campaigns across 11 failure classes, each with a gold label stating the correct answer
and why. Recordings were produced **without access to the label file** — otherwise the measurement
would reflect the answer key rather than the model.

Two error types, tracked separately and never averaged:

- **False approve** — an ineligible campaign presented as clean and confirm-only. The catastrophic
  one. Denominated over the cases where it is *possible*, not the whole set, because a rate diluted
  by ineligible-impossible cases reads far better than the system deserves.
- **False reject** — a genuine campaign pushed toward rejection. Has a victim who knows about it.

CI runs the gold set in replay mode on every push and fails the build on any false approve.

## What is missing

The real bar is **inter-rater agreement** — two zakat reviewers, same case, same answer. Gold labels
here have one author, so every number is currently measuring agreement with one person's reading.
Divergence capture in the reviewer UI is the mechanism for building that dataset; it needs real
reviewers to produce data.

Also thin: two non-English cases is not a language-fairness evaluation for a platform in 155
countries, and there is no native-speaker review arm.

---

*All campaigns, organisations, documents and figures are synthetic. No case depicts a real
organisation or a real decision. The encoded policy is a transcription of LaunchGood's published
zakat policy, used to demonstrate policy execution at scale. This system does not issue religious
rulings.*
