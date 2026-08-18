import { corpusStats } from '@/data/corpus';
import { Scale } from '@/components/Scale';
import { RoutingPill, Tag } from '@/components/ui';
import { FIXTURE_META, fixtureCount } from '@/lib/fixtures';
import { hasLiveKey } from '@/lib/llm';
import { ROUTING_BLURB, ROUTING_LABEL } from '@/lib/routing';
import { buildQueue, queueSummary } from '@/lib/queue';
import type { RoutingDecision } from '@/lib/types';

export const dynamic = 'force-dynamic';

const ORDER: RoutingDecision[] = [
  'priority_review',
  'scholar_board',
  'evidence_request',
  'standard_review',
  'fast_lane_review',
  'policy_excluded',
];

export default async function QueuePage() {
  const items = await buildQueue();
  const summary = queueSummary(items);
  const stats = corpusStats();
  const live = hasLiveKey();
  const needsPerson = (summary.counts.priority_review ?? 0) + (summary.counts.scholar_board ?? 0);

  return (
    <div className="shell">
      {/* ---------------- signature hero ---------------- */}
      <div className="hero">
        <Scale tilt={0.15} size={116} animate tone="auto" title="Mizan — the scale, tipped toward the evidence at hand" />
        <div>
          <div className="eyebrow">Zakat verification queue</div>
          <h1 style={{ maxWidth: '20ch' }}>Every case still reaches a person.</h1>
          <p className="lede">
            This decides which person, and how fast. Zakat is an obligation discharged, not a payment
            made — if it reaches an ineligible recipient, the donor&rsquo;s obligation goes unmet and
            they never find out. No chargeback, no complaint, no correction. So there is no auto-approve
            path here: the system assembles the evidence, names what is missing, and puts the case in
            front of the right reviewer with the work already done.
          </p>
        </div>
      </div>

      {/* ---------------- ledger, not a stat-tile grid ---------------- */}
      <div className="split" style={{ marginBottom: 22, alignItems: 'stretch' }}>
        <div className="ledger">
          <div className="ledger-row">
            <span className="k">In queue</span>
            <span className="v">
              {summary.total}
              <span className="note">{stats.countries} countries &middot; {stats.languages.join(', ')}</span>
            </span>
          </div>
          <div className="ledger-row">
            <span className="k">Need a person first</span>
            <span className="v" style={{ color: 'var(--oxide)' }}>
              {needsPerson}
              <span className="note" style={{ color: 'var(--faint)' }}>Blocking contradiction, or a question about what a category means.</span>
            </span>
          </div>
          <div className="ledger-row">
            <span className="k">Waiting on a document</span>
            <span className="v" style={{ color: 'var(--ochre)' }}>
              {summary.counts.evidence_request ?? 0}
              <span className="note" style={{ color: 'var(--faint)' }}>Plausible but under-documented. Ask, do not reject.</span>
            </span>
          </div>
          <div className="ledger-row" style={{ borderBottom: 'none' }}>
            <span className="k">Cost per review</span>
            <span className="v">
              ${summary.perCampaignCost ? summary.perCampaignCost.toFixed(3) : '—'}
              <span className="note">Extraction on the cheap tier, adjudication on the mid tier.</span>
            </span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ marginBottom: 12 }}>By routing</h2>
          <div className="stack-sm">
            {ORDER.filter((r) => summary.counts[r]).map((r) => (
              <div key={r} className="row-between">
                <RoutingPill routing={r} />
                <span className="num small dim">{summary.counts[r]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {summary.pending > 0 && (
        <div className="notice" style={{ marginBottom: 18 }}>
          <strong>{summary.recorded} of {summary.total} campaigns have recorded fixtures.</strong>{' '}
          The remaining {summary.pending} are listed but not assessed. Replay fixtures are verbatim
          responses from a real model run &mdash; they are what makes the eval numbers reproducible,
          and they let this demo work with no API key at all.{' '}
          {live
            ? 'A key is set, so open any pending case to run it live.'
            : 'Set ANTHROPIC_API_KEY and run npm run record to fill in the rest (about a cent per campaign).'}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {items.map(({ campaign, assessment, pendingReason }) => (
          <a key={campaign.id} href={`/review/${campaign.id}`} className="qrow">
            <div className="row-between">
              <div style={{ minWidth: 0 }}>
                <div className="qtitle">{campaign.title}</div>
                <div className="qmeta">
                  {campaign.organizerName} &middot; {campaign.beneficiaryCountry} &middot;{' '}
                  <span className="num">${campaign.goalUsd.toLocaleString('en-US')}</span>
                  {campaign.narrativeLanguage !== 'en' && (
                    <> &middot; <Tag tone="info">{campaign.narrativeLanguage}</Tag></>
                  )}
                </div>
              </div>
              <div className="row" style={{ gap: 10, flex: 'none' }}>
                {assessment?.integrity.injectionDetected && <Tag tone="bad">injection</Tag>}
                {assessment ? (
                  <>
                    <span className="tiny num faint">{Math.round(assessment.confidence * 100)}%</span>
                    <RoutingPill routing={assessment.routing} title />
                  </>
                ) : (
                  <span className="badge badge-flat">
                    {pendingReason === 'not_recorded' ? 'not recorded' : 'error'}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>

      <hr className="rule" />

      <div className="grid-2">
        <div>
          <h2>What each routing means</h2>
          <div className="stack-sm">
            {ORDER.map((r) => (
              <div key={r} className="row" style={{ alignItems: 'baseline', gap: 10 }}>
                <span style={{ flex: 'none', minWidth: 150 }}>
                  <RoutingPill routing={r} />
                </span>
                <span className="small dim">{ROUTING_BLURB[r]}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>The corpus</h2>
          <p className="small dim">
            {stats.total} synthetic campaigns across {Object.keys(stats.byClass).length} failure
            classes, {stats.eligible} of which should end up eligible. Cases were written to exercise
            the ways a verification process actually breaks &mdash; a category chosen because its
            criteria are looser, an organisation that does not accept zakat at all, overhead relabelled
            as programme cost, a genuine family with thin paperwork, text that tries to instruct the
            reviewing model.
          </p>
          <div className="row wrap" style={{ gap: 12, rowGap: 6 }}>
            {Object.entries(stats.byClass)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => (
                <Tag key={k}>{k.replace(/_/g, ' ')} {v}</Tag>
              ))}
          </div>
          {FIXTURE_META.recordedAt && (
            <p className="tiny faint" style={{ marginTop: 14 }}>
              {fixtureCount()} recorded calls &middot; extraction {FIXTURE_META.extractionModel} &middot;{' '}
              adjudication {FIXTURE_META.adjudicationModel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
