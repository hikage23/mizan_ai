import { corpusStats } from '@/data/corpus';
import { RoutingPill } from '@/components/ui';
import { runEval } from '@/lib/eval';
import { FIXTURES, FIXTURE_META } from '@/lib/fixtures';
import { FAST_LANE_CONFIDENCE_FLOOR } from '@/lib/policy';
import { MODELS } from '@/lib/llm';

export const dynamic = 'force-dynamic';

export default async function EvalsPage() {
  const run = await runEval({ fixtures: FIXTURES });
  const s = run.summary as typeof run.summary & { skipped?: number };
  const stats = corpusStats();
  const pct = (n: number) => `${(n * 100).toFixed(0)}%`;

  const misses = run.results.filter((r) => !r.routingCorrect);

  return (
    <div className="shell">
      <div style={{ maxWidth: '74ch', marginBottom: 24 }}>
        <div className="eyebrow">Evaluation</div>
        <h1>Two error types, never averaged together.</h1>
        <p className="lede">
          A single accuracy number would let one of these hide behind the other. They are not the same
          kind of wrong, they do not have the same victim, and a system tuned to minimise their sum
          would make exactly the trade you would not want it to make.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card" style={{ borderColor: 'var(--oxide-line)', borderWidth: 1.5 }}>
          <div className="eyebrow" style={{ color: 'var(--oxide)' }}>False approve</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 500, color: 'var(--oxide)', lineHeight: 1 }}>
            {pct(s.falseApproveRate)}
          </div>
          <p className="small dim" style={{ marginTop: 10, marginBottom: 0 }}>
            An ineligible campaign presented to the reviewer as clean and confirm-only. This silently
            invalidates a stranger&rsquo;s zakat. Nobody finds out &mdash; there is no chargeback, no
            complaint, no correction. One of these is worse than several of the other kind. Denominated
            over the {stats.ineligible} cases where it is possible, not the whole set.
          </p>
        </div>
        <div className="card" style={{ borderColor: 'var(--ochre-line)', borderWidth: 1.5 }}>
          <div className="eyebrow" style={{ color: 'var(--ochre)' }}>False reject</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 500, color: 'var(--ochre)', lineHeight: 1 }}>
            {pct(s.falseRejectRate)}
          </div>
          <p className="small dim" style={{ marginTop: 10, marginBottom: 0 }}>
            A genuine campaign pushed toward rejection, usually because thin paperwork was read as a
            disqualifying fact. This one has a victim who knows: a family told no by a system that was
            merely under-informed. Recoverable, but not cheap &mdash; and on a platform serving
            communities already over-scrutinised, it carries a cost no accuracy number shows.
          </p>
        </div>
      </div>

      <div className="ledger" style={{ marginBottom: 24 }}>
        <div className="ledger-row">
          <span className="k">Routing accuracy<span className="note">Case reached the routing a correct reviewer would expect.</span></span>
          <span className="v">{pct(s.routingAccuracy)}</span>
        </div>
        <div className="ledger-row">
          <span className="k">Citation validity<span className="note">Deterministic, not judged — every quote checked to occur literally in its source.</span></span>
          <span className="v" style={{ color: s.citationValidityRate === 1 ? 'var(--verdigris)' : undefined }}>{pct(s.citationValidityRate)}</span>
        </div>
        <div className="ledger-row">
          <span className="k">Injections caught<span className="note">Detected pre-model, on raw text, so a positive is independent of the model.</span></span>
          <span className="v">{s.injectionsCaught}/{s.injectionsTotal || '—'}</span>
        </div>
        <div className="ledger-row" style={{ borderBottom: 'none' }}>
          <span className="k">Cost per case<span className="note">At {s.total} cases: ${s.totalCostUsd.toFixed(3)} total.</span></span>
          <span className="v">${s.total ? (s.totalCostUsd / s.total).toFixed(3) : '—'}</span>
        </div>
      </div>

      {(s.skipped ?? 0) > 0 && (
        <div className="notice" style={{ marginBottom: 16 }}>
          <strong>{s.skipped} of {stats.total} cases were skipped</strong> because they have no recorded
          fixture and no API key is set. Skipped cases are not scored as passes or failures &mdash;
          counting an unrun case either way would make the headline number depend on how much of the
          corpus happened to be recorded. The figures above are over the {s.total} cases that actually ran.
        </div>
      )}

      {/* ---------------- misses ---------------- */}
      <div className="card">
        <h2>Where it disagreed with the gold standard</h2>
        {misses.length === 0 ? (
          <p className="small dim">No routing disagreements in the cases that ran.</p>
        ) : (
          <>
            <p className="small dim" style={{ marginBottom: 12 }}>
              Listed rather than tuned away. A disagreement in the safe direction &mdash; the system
              being more cautious than the gold standard &mdash; is a different thing from a miss, and
              collapsing them into one number would hide it.
            </p>
            {misses.map((m) => (
              <div key={m.campaignId} className="crit" style={{ borderLeft: `3px solid ${m.falseApprove ? 'var(--bad)' : 'var(--warn)'}` }}>
                <div className="row-between wrap" style={{ marginBottom: 6 }}>
                  <a href={`/review/${m.campaignId}`} className="small" style={{ fontWeight: 570 }}>
                    {m.campaignId} &middot; {m.failureClass.replace(/_/g, ' ')}
                  </a>
                  <span className="row" style={{ gap: 6 }}>
                    <span className="tiny faint">expected</span>
                    <RoutingPill routing={m.expected.expectedRouting} />
                    <span className="tiny faint">got</span>
                    <RoutingPill routing={m.actual.routing} />
                  </span>
                </div>
                <p className="small dim" style={{ margin: 0 }}>
                  {m.falseApprove
                    ? 'FALSE APPROVE — presented as clean when it should not have been. This is the failure the system exists to prevent.'
                    : m.falseReject
                      ? 'FALSE REJECT — a genuine case pushed toward rejection.'
                      : `Neither a false approve nor a false reject: the case landed in a different lane than expected, but in the conservative direction. Confidence was ${Math.round(m.actual.confidence * 100)}% against the ${Math.round(FAST_LANE_CONFIDENCE_FLOOR * 100)}% fast-lane floor, so the router declined to mark it confirm-only and sent it for ordinary review instead. The floor doing its job.`}
                </p>
                <p className="tiny faint" style={{ margin: '6px 0 0' }}>
                  Gold standard: {m.expected.rationale}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ---------------- by failure class ---------------- */}
      <div className="card">
        <h2>By failure class</h2>
        <p className="small dim">
          The corpus is built around the ways verification actually breaks, not around a convenient
          sample. Classes with no bar have no recorded fixture yet.
        </p>
        <table>
          <thead>
            <tr>
              <th>Failure class</th>
              <th style={{ width: 60 }}>Ran</th>
              <th style={{ width: 60 }}>Correct</th>
              <th style={{ width: 180 }}>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.byClass)
              .sort()
              .map(([cls, total]) => {
                const b = s.byFailureClass[cls];
                const ran = b?.total ?? 0;
                const ok = b?.routingCorrect ?? 0;
                return (
                  <tr key={cls}>
                    <td>{cls.replace(/_/g, ' ')}</td>
                    <td className="num dim">{ran}/{total}</td>
                    <td className="num">{ran ? `${ok}/${ran}` : '—'}</td>
                    <td>
                      {ran > 0 && (
                        <span className="bar" style={{ width: 150 }}>
                          <span style={{ width: `${(ok / ran) * 100}%`, background: ok === ran ? 'var(--good)' : 'var(--warn)' }} />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* ---------------- method ---------------- */}
      <div className="grid-2">
        <div className="card">
          <h2>How this is measured</h2>
          <div className="stack-sm small dim">
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Deterministic where possible.</strong> Citation
              validity is a literal string check, not a judgement. Injection detection is regex over raw
              text before any model sees it. The overhead cap is arithmetic. None of these can be argued
              with by a model, which is why they carry the load-bearing guarantees.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Gold labels written before the run.</strong> Each
              case carries a stated rationale for the correct answer, visible above. The recordings were
              produced without access to the label file &mdash; otherwise the measurement would reflect
              the answer key rather than the model.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Reproducible by replay.</strong> Fixtures are
              verbatim model responses. Same fixtures in, same report out. Model comparison forces live
              calls, because replaying one model&rsquo;s output while claiming to measure another would
              be meaningless.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>What is missing.</strong> No human-review arm yet:
              the real bar is inter-rater agreement between two zakat reviewers on the same case, and
              this corpus has one author. Divergence capture in the reviewer UI is the mechanism for
              building that, but it needs real reviewers to produce data.
            </p>
          </div>
        </div>
        <div className="card">
          <h2>Model tiering</h2>
          <p className="small dim">
            Two calls per case, deliberately on different tiers. Quoting sentences out of a document is
            retrieval; weighing them against policy is judgement. Paying judgement rates for retrieval
            is how per-case cost quietly triples.
          </p>
          {MODELS.map((m) => (
            <div key={m.id} style={{ padding: '8px 0', borderBottom: '1px solid var(--line-soft)' }}>
              <div className="row-between">
                <span className="small" style={{ fontWeight: 560 }}>{m.label}</span>
                <span className="tiny num faint">
                  ${m.inputPerMTok}/${m.outputPerMTok} per MTok
                </span>
              </div>
              <div className="tiny dim">{m.role}</div>
            </div>
          ))}
          {FIXTURE_META.recordedAt && (
            <p className="tiny faint" style={{ marginTop: 10, marginBottom: 0 }}>
              Fixtures recorded {new Date(FIXTURE_META.recordedAt).toLocaleDateString()} &middot;{' '}
              {FIXTURE_META.calls} calls
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
