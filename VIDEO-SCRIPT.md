# Mizan video walkthrough — target 4:45

Use the deployed build. Open these in separate tabs before recording: Queue, How it works, `lg-1014`, `lg-1032`, and Evals. Zoom to roughly 110%. On Evals, click **Replay the recorded set** once and wait for the green completion line.

## 0:00–0:30 · Problem and promise

**On screen:** Queue page, headline and routing summary.

> Hi, I’m Numaan. I built Mizan, a zakat eligibility verification copilot for LaunchGood. The policy is already published. The scaling problem is applying it consistently across campaign narratives, budgets, registration documents, websites, and beneficiary records.
>
> Mizan does the reading and assembles the case. A person still decides. The goal is not an automatic religious or trust decision; it is a faster, more consistent review with evidence a person can audit.

## 0:30–1:10 · The human/AI boundary

**On screen:** How it works, stages 1–7.

> The boundary is enforced in the system shape. Deterministic code first scans raw submitted text for model-directed instructions. A lower-cost model extracts evidence as exact quotes. Code verifies that every quote literally exists and deletes anything that fails before the adjudication model can see it.
>
> The second model assesses each criterion only against verified evidence. Arithmetic, category posture, completeness, duplicate detection, and routing remain deterministic. The routing type has no approve member, so every path ends with a person.

## 1:10–2:15 · When deterministic evidence changes the lane

**On screen:** `lg-1014`; show “Why it landed here,” Budget, then one highlighted source.

> This school-support case is the clearest example. The model read five sources, retained twenty-one verified quotes, and marked every language-based criterion satisfied. Yet the case is priority review.
>
> The organizer declared six percent overhead. Mizan ignores that classification flag and re-derives the number from the line labels. Including field staff who perform eligibility visits produces twelve-point-eight percent, just above the twelve-point-five percent ceiling.
>
> That classification is genuinely debatable, so the system does not accuse or reject. It shows both calculations and asks a reviewer how the money is actually used. Every cited quote is highlighted in its original context, because even a correct quote can mislead when context is hidden.

## 2:15–2:55 · Adversarial input without automatic punishment

**On screen:** `lg-1032`, Integrity panel and matched text.

> This submission contains an instruction directed at the reviewing model. Detection happens on raw text before any model call, so the flag is independent of a model that may already have been influenced.
>
> A match escalates the case but never suppresses it. Automatic suppression would create an easy sabotage path: someone could quote trigger language in a rival’s submission. Mizan shows the exact match and sends the raw source to a person.

## 2:55–3:50 · Run the evaluator live

**On screen:** Evals. Click **Replay the recorded set**; hold on the running state, then the completed table.

> This is a real replay, not a decorative dashboard. The page is seeded with five verbatim model recordings. Clicking here sends them through span verification, deterministic checks, scoring, and routing again, without an API key or new model spend.
>
> Four of five reach the exact expected lane. The fifth goes to a safer lane because its minimum criterion confidence is seventy-eight percent, below the eighty-five percent fast-lane floor. Across these five recorded cases there are zero false approves, zero false rejects, one hundred percent citation validity, and one of one injection caught.
>
> The corpus contains twenty-four labelled cases, but nineteen do not yet have recorded model output. They are visibly excluded rather than counted as passes. The same replay runs in CI, and the workflow fails on any false approve.

## 3:50–4:35 · Trade-offs and the next production step

**On screen:** How it works, “What breaks at scale,” then return to the queue.

> Three trade-offs are deliberate. No auto-approve preserves trust but limits throughput. Evidence-request drafts use deterministic templates: less elegant prose, but no invented document requirements. Duplicate detection is lexical rather than semantic, so two families with similar needs are not treated as fraud just because their stories are topically close.
>
> The prototype gaps are explicit: decisions are in memory, there is no production permissions layer, only five cases are recorded, and the gold labels have one author. My next steps would be Postgres with role-based access, complete corpus recordings, and an inter-rater dataset from real reviewers. That dataset is how I would measure whether Mizan saves time without lowering trust.

## 4:35–4:45 · Close

**On screen:** Queue headline: “Every case still reaches a person.”

> Everything shown uses synthetic data, and the live demo is linked with this application. Mizan weighs evidence; it never issues a ruling. Thank you for watching.

## Final checks

- Say “five recorded cases” before any percentage.
- Pause on 12.8% versus 12.5%—it is the strongest systems-thinking moment.
- Let the replay running state remain visible for a beat.
- Stop after the close; do not add an improvised feature tour.
