# Video walkthrough — ≤5 minutes

They said explicitly: show the system in action, explain how human and AI interact, and name the
trade-offs. Everything below serves those three. Record in one take if you can; a slightly rough take
that reasons out loud beats a polished one that narrates features.

---

## 0:00 – 0:35 · The math problem

> LaunchGood charges zero platform fees. Revenue is optional donor tips on $688 million raised across
> 155 countries. So when review work scales linearly with growth, they can't hire their way out of
> it — the unit economics won't allow it.
>
> I picked zakat verification. LaunchGood publishes a zakat policy: eight Quranic categories, which
> ones they verify, a one-eighth administrative ceiling. It's a considered document. The policy isn't
> the problem. Applying it the same way every time, with evidence, at that scale with a small team —
> that's the problem.

*On screen: the queue page.*

## 0:35 – 1:15 · The boundary, stated up front

> Before I show anything working, the design decision everything else follows from.
>
> There is no auto-approve path in this system. Not as a policy — as a type. The routing type has no
> approve member, so no branch of the router can grant a badge. Six outcomes, all six are a person.
>
> That's unusual, because automating the human away is normally the point. Here's why zakat is
> different. Zakat is an obligation discharged, not a payment made. If a donor's zakat reaches an
> ineligible recipient, their obligation isn't fulfilled — and they never find out. No chargeback, no
> complaint, no correction. The loss is silent and it lands on someone who trusted the badge.
>
> A system whose mistakes are invisible to the people they harm shouldn't write them at machine
> speed. So the win isn't removing the reviewer. It's ten minutes instead of ninety, with two
> reviewers reaching the same answer.

*On screen: `/how-it-works`, scroll the stage table showing deterministic / model / human.*

## 1:15 – 2:20 · A case where the model and the arithmetic disagree

*Open `lg-1014` — the Bangladesh school-funding campaign.*

> Every criterion here came back satisfied. The model read five documents, pulled twenty-one quotes,
> and found nothing wrong.
>
> The case is still at the top of the priority queue. Look at the budget panel: the organizer declared
> six per cent overhead. Derived from the line labels it's twelve point eight, against a twelve point
> five ceiling. One line — "field staff salaries for eligibility verification visits" — is defensible
> either way, and that's exactly why a person decides it and not a model.
>
> The check ignores the organizer's own classification flag entirely. Mislabelling overhead as
> programme cost is the cheapest way to clear that ceiling: no forgery, and invisible to a reviewer
> skimming a budget table. So the reviewer sees both numbers and where they diverge, which accuses
> nobody of anything.

*Scroll to the evidence. Expand a source document.*

> Every quote is highlighted in the document it came from. That's the trust mechanic — an accurate
> quote can still mislead, and the only defence is showing what surrounds it.

## 2:20 – 3:05 · Where the AI is wrong, and what catches it

*Open `lg-1032` — the injection case. Point at the integrity panel.*

> This campaign's text contains instructions aimed at the model reviewing it. That gets detected by
> regex on raw text before any model reads it, so a positive is an independent fact rather than
> something inferred from a model that may already have been influenced.
>
> Note what it does *not* do: it doesn't suppress the campaign. Auto-suppressing on a keyword match
> would let anyone sabotage a rival by quoting these phrases. It escalates, with the matched text
> shown, and a person reads the source.

*Now hit "Delete the supporting documents" in the Break-it-on-purpose panel — requires a key.*

> This mutates the documents and re-runs live. Because the text changed, no fixture can match it —
> which is the point. It shows the system reasoning about the document in front of it, not replaying
> a cached verdict.
>
> Confidence collapses and it drops out of any fast lane. A system that stayed confident here would be
> reading the applicant's self-description as proof.

## 3:05 – 4:00 · Evals

*Open `/evals`.*

> Two error types, never averaged together. A single accuracy number would let one hide behind the
> other, and they aren't the same kind of wrong.
>
> False approve is an ineligible campaign shown to the reviewer as clean and confirm-only. That's the
> catastrophic one — it's the silent, unrecoverable failure. It's denominated over the cases where
> it's *possible*, not the whole set, because diluting it with cases that were never eligible to be
> wrongly approved would flatter the system.
>
> False reject is a genuine campaign pushed toward rejection because thin paperwork got read as a
> disqualifying fact. That one has a victim who knows about it — and on a platform serving communities
> that are already over-scrutinised, that carries a cost no accuracy number shows.
>
> Citation validity is a hundred per cent, and that's a deterministic string check, not a judgement.
> Every quote is verified to occur literally in its source; anything that fails is deleted before a
> human sees it.

*Point at the disagreement panel.*

> One disagreement, and I left it in rather than tuning it away. The system sent a clean case to
> standard review instead of the fast lane, because confidence was seventy-eight against an
> eighty-five floor. Confidence is the *minimum* across criteria, not the mean — a dossier is only as
> good as its weakest judgement, and averaging lets nine easy satisfactions bury one shaky blocking
> call. So it erred cautious. That's the floor doing its job, and it's a different thing from a miss.

*Point at the CI note / model tiering.*

> The gold set runs in CI on every push, in replay mode so it's free and byte-identical, and the build
> fails on any false approve. Only that one metric gates — a gate that fires on everything gets
> disabled in week one. Two model calls per case on different tiers: quoting sentences is retrieval,
> weighing them is judgement, and paying judgement rates for retrieval is how per-case cost quietly
> triples. Three cents.

## 4:00 – 4:45 · Trade-offs and what I'd do next

> Three trade-offs I'd defend.
>
> **No auto-approve costs throughput.** I chose that deliberately for the asymmetry I opened with.
> On a queue where errors are visible and recoverable, I'd argue the other way.
>
> **The evidence-request draft is a template, not generated text.** Worse prose, better behaviour. A
> model would write something warmer and would occasionally invent a requirement — and that means a
> family chasing a document that never existed.
>
> **Duplicate detection is lexical, not embeddings.** Embeddings would also flag topically similar
> campaigns, and two different families in Gaza both needing medical funding is not fraud.
>
> What's missing is the measurement that matters most: inter-rater agreement. Two zakat reviewers,
> same case, same answer. My gold labels have one author, so right now every number is measuring
> agreement with one person's reading. Divergence capture in the reviewer UI is the mechanism for
> building that dataset — every time a reviewer lands somewhere the router didn't recommend, that's a
> labelled case for the next run. It just needs real reviewers.

## 4:45 – 5:00 · Close

> Everything here is synthetic and I've stated my assumptions on the architecture page. I didn't try
> to guess how LaunchGood works internally — I built against the policy you publish, because that's
> the thing that already exists and already doesn't scale.

---

## Recording notes

- Have `ANTHROPIC_API_KEY` set before recording so the adversarial control actually runs on camera.
- Run `npm run record` first so all 24 campaigns are assessed — a queue with 19 "not recorded" rows
  undercuts the eval story.
- Zoom the browser to ~110%. The dossier is dense and text needs to be legible on a laptop.
- The single most persuasive 15 seconds is `lg-1014`: every criterion satisfied, still top of the
  priority queue, because arithmetic overruled the model. Do not rush it.
