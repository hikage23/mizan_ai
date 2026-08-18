# Submission checklist — LaunchGood Applied AI Engineer

## Required (missing either = automatic rejection)

- [ ] **Deployed demo link.** `npx vercel --prod` from the project root.
- [ ] **Video walkthrough ≤5 min.** Script in `VIDEO-SCRIPT.md`.
- [ ] Both submitted as links in a PDF, or under "Additional Information".

## Before recording

1. `ANTHROPIC_API_KEY=sk-... npm run record` — assesses all 24 campaigns (~25¢ total). A queue
   showing 19 "not recorded" rows undercuts the eval story.
2. `npm run eval` — confirm no false approves.
3. `npm run build` — confirm clean.
4. Deploy, then set `ANTHROPIC_API_KEY` in the Vercel dashboard so the adversarial controls work for
   whoever clicks the link.

## What this submission argues, mapped to their rubric

**Problem choice.** LaunchGood publishes a zakat policy and charges zero platform fees. Those two
facts together mean policy enforcement can't scale by hiring. The problem is real, specific to them,
and sits across trust & safety, finance and community trust.

**Human/AI boundary.** Enforced as a type, not a prompt: `RoutingDecision` has no approve member, so
no code path grants a badge. The justification is domain-specific — zakat is an obligation
discharged, not a payment made, so its errors are silent and unrecoverable.

**AI responsibility.** The model reads five-plus documents per case and produces span-cited evidence
against a 6-11 criterion rubric. Strip it out and there is no system — the deterministic layer alone
would only check arithmetic.

**Judgment under uncertainty.** Span verification with deletion-not-warning. Injection detection
pre-model that escalates rather than suppresses. Overhead re-derived from labels rather than the
organizer's flag. Confidence as minimum rather than mean. `insufficient_evidence` as a first-class
outcome so genuine applicants get asked rather than rejected.

**Systems thinking.** Two-tier model routing on cost grounds. Replay for reproducible evals. CI gate
on the one metric that matters. Ramadan surge behaviour and language fairness addressed explicitly on
the architecture page, including what is *not* handled.

**Communication.** Every non-obvious decision is argued in a comment at the point it was made, and
the three pages other than the queue exist to explain reasoning rather than show features.

## Honest gaps to name if asked

- No inter-rater agreement data. Gold labels have one author.
- Two non-English cases is not a language-fairness evaluation.
- Decisions are in-memory per instance; production wants Postgres. The schema is already the shape.
- Precedent retrieval (feeding decided cases back as few-shot context) is designed but not built.
