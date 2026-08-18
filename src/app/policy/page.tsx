import { ADMIN_OVERHEAD_CAP, POLICY_VERSION, UNIVERSAL_CRITERIA } from '@/lib/policy';
import { SeverityTag } from '@/components/ui';
import { EligibilityLens } from '@/components/EligibilityLens';

export default function PolicyPage() {
  return (
    <div className="shell-narrow">
      <div className="eyebrow">Encoded policy &middot; {POLICY_VERSION}</div>
      <h1>The policy already exists. Applying it consistently is the problem.</h1>
      <p className="lede" style={{ marginBottom: 20 }}>
        LaunchGood publishes a zakat policy: the eight Quranic categories, which ones it actually
        verifies, a contemporary reading for the categories that need one, and an administrative
        ceiling. It is a considered document. What does not scale is applying it by hand, the same way
        every time, across 155 countries with a small team.
      </p>

      <div className="callout" style={{ marginBottom: 24 }}>
        This system does not invent fiqh and contains no code path that asks whether a criterion is
        correct. The model reasons about <em>whether evidence supports a criterion</em>. Whether the
        criterion is right belongs to scholars. Where a case turns on what a category <em>means</em>,
        routing sends it to the scholar board and the pipeline stops.
      </div>

      <h2>Cross-cutting criteria</h2>
      <p className="small dim">
        Applied to every campaign regardless of category. These exist because the failure modes that
        get a platform criticised are usually not category-reasoning errors &mdash; they are cases
        where nobody asked whether the organisation accepts zakat at all, or whether the narrative
        matched the box that was ticked.
      </p>
      <div style={{ marginBottom: 30 }}>
        {UNIVERSAL_CRITERIA.map((c) => (
          <div key={c.id} className="crit">
            <div className="row-between" style={{ marginBottom: 4 }}>
              <span className="small" style={{ fontWeight: 570 }}>{c.text}</span>
              <SeverityTag severity={c.severity} />
            </div>
            <div className="tiny dim">Satisfied by: {c.evidenceExpectation}</div>
            <div className="tiny faint mono" style={{ marginTop: 3 }}>{c.id}</div>
          </div>
        ))}
      </div>

      <h2>The eight categories</h2>
      <p className="small dim" style={{ marginBottom: 14 }}>
        Surah At-Tawbah 9:60. Three are actively verified, one under a narrow carve-out, and four are
        outside the verified set &mdash; not because they are invalid, but because a crowdfunding
        intake process cannot evidence them. A campaign in an unverified category can still fundraise;
        only the designation is unavailable. Reasonable authorities draw these lines differently
        &mdash; switch the lens below to see where, and hover a lens to preview the difference first.
      </p>

      <EligibilityLens />

      <div className="card">
        <h2>The administrative ceiling</h2>
        <p className="small dim">
          {(ADMIN_OVERHEAD_CAP * 100).toFixed(1)}% &mdash; one eighth. Because zakat administrators are
          one of the eight categories, the majority position permits up to that share to cover the cost
          of collecting and distributing. Policy adopts it as a hard ceiling.
        </p>
        <p className="small dim" style={{ marginBottom: 0 }}>
          The check re-derives overhead from budget line labels rather than trusting the organizer&rsquo;s
          own classification flag. Mislabelling overhead as programme cost is the cheapest way to clear
          the ceiling: it requires no forgery and is invisible to a reviewer skimming a budget table. The
          reviewer sees both numbers and where they diverge, which accuses nobody of anything.
        </p>
      </div>
    </div>
  );
}
