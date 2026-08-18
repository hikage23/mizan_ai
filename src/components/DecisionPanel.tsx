'use client';

import { useState } from 'react';
import type { HumanAction, RoutingDecision } from '@/lib/types';

const ACTIONS: { id: HumanAction; label: string; cls: string; hint: string }[] = [
  { id: 'approve', label: 'Grant badge', cls: 'btn-good', hint: 'Zakat designation is granted.' },
  { id: 'reject', label: 'Decline badge', cls: 'btn-bad', hint: 'Campaign keeps fundraising; only the designation is declined.' },
  { id: 'request_evidence', label: 'Request evidence', cls: 'btn-warn', hint: 'Sends the drafted request. Nothing goes out until you press this.' },
  { id: 'escalate_scholar', label: 'Escalate to scholar board', cls: '', hint: 'For questions about what a category covers.' },
  { id: 'defer', label: 'Defer', cls: '', hint: 'Leave in queue for someone with more context.' },
];

export function DecisionPanel({
  campaignId,
  aiRouting,
  draftEmail,
}: {
  campaignId: string;
  aiRouting: RoutingDecision;
  draftEmail?: string;
}) {
  const [action, setAction] = useState<HumanAction | null>(null);
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState(draftEmail ?? '');
  const [saved, setSaved] = useState<{ diverged: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!action) return;
    setBusy(true);
    setError(null);
    const res = await fetch('/api/decide', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ campaignId, action, reason, aiRouting }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.detail ?? data.error ?? 'Failed to record decision.');
      return;
    }
    setSaved({ diverged: data.decision.divergedFromAi });
  }

  if (saved) {
    return (
      <div className="card">
        <h2>Decision recorded</h2>
        <p className="small dim">
          Written append-only with your reason attached.{' '}
          {saved.diverged
            ? 'You landed somewhere the router did not recommend. That divergence is the most valuable data this system produces — it becomes a labelled case in the next eval run.'
            : 'This matched the router’s recommendation, which is logged too: agreement rate is how we tell whether the dossiers are actually helping or reviewers are just re-doing the work.'}
        </p>
        <button className="btn btn-sm" onClick={() => { setSaved(null); setAction(null); setReason(''); }}>
          Record another
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Your decision</h2>
      <p className="small dim">
        The system has not decided anything. It sorted the evidence and told you what it could not
        establish. This is the only place a determination is made.
      </p>

      <div className="row wrap" style={{ gap: 7, marginBottom: 12 }}>
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            title={a.hint}
            className={`btn btn-sm ${a.cls} ${action === a.id ? '' : ''}`}
            style={action === a.id ? { outline: '2px solid var(--brass)' } : undefined}
            onClick={() => setAction(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>

      {action === 'request_evidence' && (
        <div style={{ marginBottom: 12 }}>
          <h3>Draft to organizer</h3>
          <p className="tiny faint" style={{ marginBottom: 6 }}>
            Composed from the criteria that lacked evidence, in a template rather than by a model &mdash;
            an invented requirement here means a family chasing a document that was never needed. Edit
            freely. Nothing sends until you press the button above.
          </p>
          <textarea rows={12} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      )}

      <label className="small" style={{ display: 'block', marginBottom: 5, fontWeight: 560 }}>
        Reason <span className="faint">(required &mdash; enforced at the API, not just here)</span>
      </label>
      <textarea
        rows={3}
        value={reason}
        placeholder="Why this outcome? The next person to look at this case reads only what you write here."
        onChange={(e) => setReason(e.target.value)}
      />

      {error && <p className="small" style={{ color: 'var(--bad)', marginTop: 8 }}>{error}</p>}

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn btn-primary" disabled={!action || reason.trim().length < 8 || busy} onClick={submit}>
          {busy ? 'Recording…' : 'Record decision'}
        </button>
        {action && reason.trim().length < 8 && (
          <span className="tiny faint">A reason of at least 8 characters is required.</span>
        )}
      </div>
    </div>
  );
}
