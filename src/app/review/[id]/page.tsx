import { notFound } from 'next/navigation';
import { getEntry } from '@/data/corpus';
import { Adversarial } from '@/components/Adversarial';
import { DecisionPanel } from '@/components/DecisionPanel';
import { SourceView } from '@/components/SourceView';
import { Confidence, PostureBadge, RoutingPill, SeverityTag, StatusPill } from '@/components/ui';
import { analyseOverhead } from '@/lib/checks';
import { FIXTURES } from '@/lib/fixtures';
import { hasLiveKey } from '@/lib/llm';
import { assessCampaign } from '@/lib/pipeline';
import { ADMIN_OVERHEAD_CAP, criterionById, getCategory } from '@/lib/policy';
import { ROUTING_BLURB } from '@/lib/routing';
import type { Assessment } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getEntry(id);
  if (!entry) notFound();

  const { campaign } = entry;
  const category = getCategory(campaign.claimedCategory);
  const overhead = analyseOverhead(campaign);

  let assessment: Assessment | null = null;
  let failure: string | null = null;
  try {
    assessment = await assessCampaign(campaign, { fixtures: FIXTURES });
  } catch (err) {
    failure = (err as Error).name === 'ReplayMiss' ? 'not_recorded' : (err as Error).message;
  }

  return (
    <div className="shell">
      <a href="/" className="small dim" style={{ display: 'inline-block', marginBottom: 12 }}>
        &larr; Queue
      </a>

      <div className="row-between wrap" style={{ marginBottom: 6 }}>
        <h1 style={{ margin: 0, maxWidth: '48ch' }}>{campaign.title}</h1>
        {assessment && <RoutingPill routing={assessment.routing} />}
      </div>
      <p className="small dim" style={{ marginBottom: 20 }}>
        {campaign.organizerName} &middot; {campaign.organizerType.replace(/_/g, ' ')} &middot;{' '}
        raising ${campaign.goalUsd.toLocaleString('en-US')} from {campaign.organizerCountry} for
        beneficiaries in {campaign.beneficiaryCountry} &middot; submitted {campaign.submittedAt}
        {' '}&middot; claimed as <strong>{category.label}</strong> ({category.arabic})
      </p>

      {!assessment && (
        <div className="notice">
          <strong>
            {failure === 'not_recorded' ? 'No recorded fixture for this campaign.' : 'Assessment failed.'}
          </strong>{' '}
          {failure === 'not_recorded'
            ? hasLiveKey()
              ? 'A key is set — run npm run record to add this case to the fixture bundle.'
              : 'Replay serves recorded model responses; this campaign has not been recorded yet. Set ANTHROPIC_API_KEY and run npm run record to fill it in (about a cent).'
            : failure}
        </div>
      )}

      {assessment && (
        <div className="split">
          <div>
            {/* ---------------- routing ---------------- */}
            <div className="card">
              <div className="row-between" style={{ marginBottom: 8 }}>
                <h2 style={{ margin: 0 }}>Why it landed here</h2>
                <Confidence value={assessment.confidence} />
              </div>
              <p className="small dim" style={{ marginBottom: 10 }}>
                {ROUTING_BLURB[assessment.routing]}
              </p>
              <div className="stack-sm">
                {assessment.routingRationale.map((r, i) => (
                  <p key={i} className="small" style={{ margin: 0, color: 'var(--ink-2)' }}>
                    {r}
                  </p>
                ))}
              </div>
              <p className="tiny faint" style={{ marginTop: 10, marginBottom: 0 }}>
                Confidence is the <em>minimum</em> across criteria, not the mean. A dossier is only as
                good as its weakest judgement, and averaging lets nine easy satisfactions bury one
                shaky blocking call.
              </p>
            </div>

            {/* ---------------- integrity ---------------- */}
            {(assessment.integrity.injectionDetected ||
              assessment.integrity.discardedEvidenceIds.length > 0 ||
              assessment.integrity.extractionRetries > 0) && (
              <div className="card" style={{ borderColor: '#eccbc7' }}>
                <h2>Integrity</h2>
                {assessment.integrity.injectionDetected && (
                  <p className="small" style={{ color: 'var(--bad)' }}>
                    <strong>Instruction injection detected.</strong>{' '}
                    {assessment.integrity.injectionDetail} The campaign is not auto-suppressed &mdash;
                    suppressing on a keyword match would let anyone sabotage a rival by quoting these
                    phrases. It is escalated with the matched text shown so a person reads the raw source.
                  </p>
                )}
                {assessment.integrity.discardedEvidenceIds.length > 0 && (
                  <p className="small" style={{ color: 'var(--bad)' }}>
                    <strong>
                      {assessment.integrity.discardedEvidenceIds.length} extracted claim(s) failed span
                      verification and were deleted.
                    </strong>{' '}
                    The quote did not occur in the cited document. Discarded evidence is removed rather
                    than shown with a warning &mdash; a reviewer who sees a flagged fabricated quote
                    reads it anyway, and it influences them.
                  </p>
                )}
                {assessment.integrity.extractionRetries > 0 && (
                  <p className="small dim">
                    Extraction retried {assessment.integrity.extractionRetries}&times; after too much
                    evidence failed verification.
                  </p>
                )}
              </div>
            )}

            {/* ---------------- criteria ---------------- */}
            <div className="card">
              <h2>Criteria</h2>
              <p className="small dim" style={{ marginBottom: 12 }}>
                Each is a requirement from the published policy, checked against evidence quoted from
                the submission. <strong>Not evidenced</strong> is a first-class outcome, not a soft
                rejection &mdash; it means ask for a document, and it is where most genuine applicants
                land.
              </p>

              {assessment.criteria.length === 0 && (
                <p className="small dim">
                  No criteria were assessed: the claimed category is outside the verified set, so the
                  question is settled by policy before evidence is weighed.
                </p>
              )}

              {assessment.criteria.map((c) => {
                const def = criterionById(c.criterionId);
                const cited = assessment.evidence.filter((e) => c.evidenceIds.includes(e.id));
                return (
                  <div key={c.criterionId} className={`crit crit-${c.status}`}>
                    <div className="row-between" style={{ marginBottom: 5 }}>
                      <span className="small" style={{ fontWeight: 570, maxWidth: '58ch' }}>
                        {def?.text ?? c.criterionId}
                      </span>
                      <span className="row" style={{ gap: 7, flex: 'none' }}>
                        {def && <SeverityTag severity={def.severity} />}
                        <StatusPill status={c.status} />
                      </span>
                    </div>
                    <p className="small dim" style={{ margin: '0 0 6px' }}>{c.reasoning}</p>
                    {cited.map((e) => (
                      <div key={e.id} className="quote">
                        &ldquo;{e.span.quote}&rdquo;
                        <div className="tiny faint" style={{ fontFamily: 'var(--sans)', marginTop: 3 }}>
                          {e.id} &middot; {e.span.sourceId} &middot; span verified
                        </div>
                      </div>
                    ))}
                    {c.status === 'insufficient_evidence' && c.requestedDocument && (
                      <p className="small" style={{ color: 'var(--warn)', margin: '6px 0 0' }}>
                        <strong>Ask for:</strong> {c.requestedDocument}
                      </p>
                    )}
                    <div className="row" style={{ marginTop: 6 }}>
                      <Confidence value={c.confidence} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ---------------- deterministic checks ---------------- */}
            <div className="card">
              <h2>Deterministic checks</h2>
              <p className="small dim" style={{ marginBottom: 10 }}>
                Computed in code from structured fields. No model is involved and no model output can
                override them &mdash; where a number decides a question, the number decides it.
              </p>
              {assessment.checks.map((c) => (
                <div key={c.id} className="row" style={{ alignItems: 'flex-start', gap: 9, padding: '7px 0', borderBottom: '1px solid var(--line-soft)' }}>
                  <span className="dot" style={{ marginTop: 6, background: c.passed ? 'var(--good)' : c.severity === 'blocking' ? 'var(--bad)' : 'var(--warn)' }} />
                  <div>
                    <div className="small" style={{ fontWeight: 555 }}>
                      {c.label} <span className="tiny faint">({c.severity})</span>
                    </div>
                    <div className="small dim">{c.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ---------------- sources ---------------- */}
            <div className="card">
              <h2>Sources</h2>
              <p className="small dim" style={{ marginBottom: 6 }}>
                Cited passages are highlighted in place. Every quote in the dossier above appears here,
                in context &mdash; an accurate quote can still mislead, and the only defence is showing
                what surrounds it.
              </p>
              {campaign.sources.map((s) => (
                <SourceView key={s.id} doc={s} evidence={assessment.evidence} />
              ))}
            </div>
          </div>

          {/* ================= sidebar ================= */}
          <div>
            <DecisionPanel
              campaignId={campaign.id}
              aiRouting={assessment.routing}
              draftEmail={assessment.draftEvidenceRequest}
            />

            <div className="card">
              <h2>Budget</h2>
              <table>
                <tbody>
                  {campaign.budget.map((b, i) => (
                    <tr key={i}>
                      <td style={{ maxWidth: 200 }}>{b.label}</td>
                      <td className="num" style={{ textAlign: 'right' }}>
                        ${b.amountUsd.toLocaleString('en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
                <div className="row-between small">
                  <span className="dim">Organizer declared overhead</span>
                  <span className="num">{(overhead.declaredRatio * 100).toFixed(1)}%</span>
                </div>
                <div className="row-between small">
                  <span className="dim">Derived from line labels</span>
                  <span className="num" style={{ fontWeight: 640, color: overhead.withinCap ? 'var(--good)' : 'var(--bad)' }}>
                    {(overhead.derivedRatio * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="row-between small">
                  <span className="dim">Ceiling</span>
                  <span className="num">{(ADMIN_OVERHEAD_CAP * 100).toFixed(1)}%</span>
                </div>
                {overhead.classificationDisputed && (
                  <p className="tiny" style={{ color: 'var(--warn)', marginTop: 8, marginBottom: 0 }}>
                    Reclassified from labels: {overhead.reclassifiedLines.map((l) => l.label).join('; ')}.
                    The organizer&rsquo;s own flag is recorded but never used for the cap &mdash;
                    mislabelling overhead as programme cost is the cheapest way to clear the ceiling and
                    requires no forgery.
                  </p>
                )}
              </div>
            </div>

            <div className="card">
              <h2>Category</h2>
              <p className="small" style={{ marginBottom: 6 }}>
                <strong>{category.label}</strong> &mdash; <em>{category.arabic}</em>
                <span style={{ marginLeft: 8 }}>
                  <PostureBadge posture={category.posture} />
                </span>
              </p>
              {category.contemporaryReading && (
                <p className="small dim">Policy&rsquo;s reading: {category.contemporaryReading}</p>
              )}
              <p className="small dim">{category.postureRationale}</p>
              {assessment.inferredCategory && assessment.inferredCategory !== campaign.claimedCategory && (
                <p className="small" style={{ color: 'var(--bad)', marginBottom: 0 }}>
                  Narrative substance reads as{' '}
                  <strong>{getCategory(assessment.inferredCategory).label}</strong>, not the category
                  selected at intake.
                </p>
              )}
            </div>

            <div className="card card-tight">
              <div className="row-between small">
                <span className="dim">Mode</span>
                <span className="mono">{assessment.mode}</span>
              </div>
              <div className="row-between small">
                <span className="dim">Model</span>
                <span className="mono">{assessment.modelId}</span>
              </div>
              <div className="row-between small">
                <span className="dim">Cost</span>
                <span className="num">${assessment.cost.usd.toFixed(4)}</span>
              </div>
              <div className="row-between small">
                <span className="dim">Tokens</span>
                <span className="num">
                  {assessment.cost.inputTokens.toLocaleString()} in /{' '}
                  {assessment.cost.outputTokens.toLocaleString()} out
                </span>
              </div>
              <div className="row-between small">
                <span className="dim">Evidence kept</span>
                <span className="num">{assessment.evidence.length}</span>
              </div>
            </div>

            <Adversarial campaignId={campaign.id} baseline={assessment} />
          </div>
        </div>
      )}
    </div>
  );
}
