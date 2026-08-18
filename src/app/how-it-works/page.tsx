import { FAST_LANE_CONFIDENCE_FLOOR } from '@/lib/policy';
import { ROUTING_BLURB, ROUTING_LABEL } from '@/lib/routing';
import { Tag } from '@/components/ui';
import type { RoutingDecision } from '@/lib/types';

const STAGES = [
  {
    n: '01',
    title: 'Scan for injection — before any model reads the text',
    body: 'Campaign narratives are attacker-controlled text with direct financial motive behind them. The detector is regex over raw source, run first, so a positive result is an independent fact about the submission rather than something inferred from a model that may already have been influenced. A hit escalates to a human with the matched text shown. It never auto-suppresses — suppression on keyword match would let anyone sabotage a rival by quoting these phrases.',
    owner: 'code',
  },
  {
    n: '02',
    title: 'Extract evidence, each tied to an exact quote',
    body: 'The cheap tier reads every source document and pulls out sentences bearing on each criterion. The instruction it is held to is that silence is always correct when the evidence is not there — an absent claim is a useful downstream signal, an invented one corrupts the review. It is told to find evidence that cuts against eligibility with the same diligence as evidence that supports it.',
    owner: 'ai',
  },
  {
    n: '03',
    title: 'Verify every span. Delete what fails.',
    body: 'Each quote is checked to occur literally in the document it cites. Offsets that drifted are repaired from an exact quote match; a quote that does not occur at all is a fabrication and the item is deleted — not shown with a warning, because a reviewer who sees a flagged fabricated quote reads it anyway and it influences them. If too much fails, extraction retries. This sits between the two model calls so the adjudicating model never sees an unverified quote.',
    owner: 'code',
  },
  {
    n: '04',
    title: 'Assess each criterion against verified evidence only',
    body: 'The mid tier returns satisfied, contradicted, or not-evidenced per criterion. The line between the last two is the most consequential judgement in the pipeline: most applicants are honest people with thin paperwork, and marking their case contradicted pushes a genuine claimant toward rejection on the strength of a missing document. The instruction is explicit that when unsure, it is not-evidenced — and that a gap must name the one specific document that would close it.',
    owner: 'ai',
  },
  {
    n: '05',
    title: 'Run the deterministic checks',
    body: 'Overhead against the one-eighth ceiling, re-derived from line labels rather than the organizer’s own flag. Category verifiability. Documentation completeness. Near-duplicate narrative detection by 5-gram overlap, two-tiered so ordinary seasonal reuse does not read the same as verbatim copying. Web-evidence staleness. No model output can override any of these.',
    owner: 'code',
  },
  {
    n: '06',
    title: 'Route — as a pure function, in code',
    body: `The boundary is this file, not a prompt. Two properties hold by construction. There is no code path that grants a badge: the routing type has no approve member, and every branch terminates at a human. And low confidence can only ever route toward more scrutiny — every branch that lowers it is gated on high confidence and clean checks, while every branch that raises it fires on either signal alone. Below ${Math.round(FAST_LANE_CONFIDENCE_FLOOR * 100)}% aggregate confidence nothing is marked confirm-only, and confidence is the minimum across criteria rather than the mean.`,
    owner: 'code',
  },
  {
    n: '07',
    title: 'A person decides',
    body: 'The reviewer sees the verdict per criterion, the quotes behind it in their original context, what is missing, and what the router could not settle. They approve, decline, ask for a document, or escalate — with a reason that is mandatory at the API, not just in the form. Decisions are append-only. Where they diverge from the routing, that divergence is captured as the next eval case.',
    owner: 'human',
  },
];

const OWNER_TONE = { code: 'info', ai: 'warn', human: 'good' } as const;
const OWNER_LABEL = { code: 'deterministic', ai: 'model', human: 'human' } as const;

const ROUTINGS: RoutingDecision[] = [
  'fast_lane_review', 'standard_review', 'priority_review',
  'evidence_request', 'scholar_board', 'policy_excluded',
];

export default function HowItWorksPage() {
  return (
    <div className="shell-narrow">
      <div className="eyebrow">Architecture</div>
      <h1>What the AI owns, what it never touches.</h1>
      <p className="lede" style={{ marginBottom: 22 }}>
        The model does the reading: dozens of pages across a campaign narrative, registration papers, a
        website capture, financial statements, a budget. It finds the sentences that matter and says
        what each one establishes. What it does not do is decide, and that is enforced by the shape of
        the code rather than by asking it nicely.
      </p>

      <div className="callout" style={{ marginBottom: 26 }}>
        <strong>Why no auto-approve, when automating the human away is normally the point.</strong>{' '}
        On most review queues a high-confidence fast path is correct. Zakat is different for a reason
        specific to what zakat is: it is an obligation discharged, not a payment made. If a donor&rsquo;s
        zakat reaches an ineligible recipient, their obligation is not fulfilled &mdash; and they will
        never find out. No chargeback, no refund, no complaint that surfaces the error. A system whose
        mistakes are invisible to the people they harm should not be allowed to write them at machine
        speed. So the win is not removing the reviewer. It is ten minutes instead of ninety, with two
        reviewers reaching the same answer.
      </div>

      {STAGES.map((s) => (
        <div key={s.n} className="card">
          <div className="row-between wrap" style={{ marginBottom: 6 }}>
            <div className="row" style={{ gap: 10 }}>
              <span className="mono faint" style={{ fontSize: 13 }}>{s.n}</span>
              <h2 style={{ margin: 0 }}>{s.title}</h2>
            </div>
            <Tag tone={OWNER_TONE[s.owner as keyof typeof OWNER_TONE]}>
              {OWNER_LABEL[s.owner as keyof typeof OWNER_LABEL]}
            </Tag>
          </div>
          <p className="small dim" style={{ margin: 0 }}>{s.body}</p>
        </div>
      ))}

      <hr className="rule" />

      <h2>Where a case can end up</h2>
      <p className="small dim">Six outcomes. All six are a person.</p>
      <table style={{ marginBottom: 26 }}>
        <tbody>
          {ROUTINGS.map((r) => (
            <tr key={r}>
              <td style={{ width: 180, fontWeight: 555 }}>{ROUTING_LABEL[r]}</td>
              <td className="dim">{ROUTING_BLURB[r]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>What breaks at scale, and what I would do about it</h2>
      <div className="stack-sm small dim" style={{ marginBottom: 24 }}>
        <p style={{ margin: 0 }}>
          <strong style={{ color: 'var(--ink)' }}>Ramadan.</strong> Volume on this platform is wildly
          seasonal and a large share of the year arrives in thirty days. The queue is already sorted by
          who needs a person most, so the degradation mode is graceful: fast-lane cases wait. What I
          would add is a explicit surge policy that raises the fast-lane confidence floor rather than
          lowering it, because the temptation under load runs the wrong way.
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: 'var(--ink)' }}>Language.</strong> The corpus includes Arabic and
          French cases specifically to measure whether quality degrades on non-English input. It is a
          real fairness axis for a platform in 155 countries, and it needs far more than two cases and
          a native-speaker review arm this prototype does not have.
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: 'var(--ink)' }}>Adversarial drift.</strong> Organizers will learn what
          the system asks for. The overhead check already assumes this by ignoring the organizer&rsquo;s
          own classification. The next thing to harden is the evidence-request loop, since a system that
          reliably names the document it wants also teaches people exactly what to fabricate.
        </p>
        <p style={{ margin: 0 }}>
          <strong style={{ color: 'var(--ink)' }}>The measurement I do not have.</strong> The real bar is
          inter-rater agreement &mdash; two zakat reviewers, same case, same answer. Gold labels here have
          one author. Divergence capture in the reviewer UI is the mechanism for building that dataset,
          but it needs real reviewers to produce data, and until it does every number on the evals page
          is measuring agreement with one person&rsquo;s reading.
        </p>
      </div>

      <h2>Assumptions I made</h2>
      <div className="stack-sm small dim">
        <p style={{ margin: 0 }}>
          Zakat verification runs as a queue with a small team and no per-case time budget to speak of.
          Campaigns arrive with heterogeneous documentation and often none. Organizers self-select their
          category at intake. A campaign denied the designation can still fundraise. Reviewers are
          trained on the policy but are not scholars, and a scholar board exists for genuinely novel
          questions. None of this required knowing how LaunchGood works internally; all of it is stated
          so it can be corrected.
        </p>
      </div>
    </div>
  );
}
