'use client';

import { useState } from 'react';
import { ADVERSARIAL_MUTATIONS } from '@/lib/eval';
import type { Assessment } from '@/lib/types';

/**
 * The live control. Mutates the campaign and re-runs the pipeline against the
 * changed document, which by construction cannot hit a fixture.
 */
export function Adversarial({ campaignId, baseline }: { campaignId: string; baseline: Assessment }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string; assessment: Assessment } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(id: string) {
    setBusy(id);
    setError(null);
    setResult(null);
    const res = await fetch(`/api/assess/${campaignId}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mutation: id }),
    });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) {
      setError(data.detail ?? data.error);
      return;
    }
    setResult({ id, assessment: data.assessment });
  }

  return (
    <div className="card">
      <h2>Break it on purpose</h2>
      <p className="small dim">
        Each of these edits the submitted documents and re-runs the pipeline. Because the text changes,
        the fixture key changes, so these always execute live &mdash; which is the point: it shows the
        system reasoning about the document in front of it rather than replaying a cached verdict.
      </p>

      <div className="stack-sm">
        {ADVERSARIAL_MUTATIONS.map((m) => (
          <div key={m.id} className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
            <button className="btn btn-sm" style={{ flex: 'none', minWidth: 190, textAlign: 'left' }}
              disabled={busy !== null} onClick={() => run(m.id)}>
              {busy === m.id ? 'Running…' : m.label}
            </button>
            <span className="tiny dim">{m.description}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="notice" style={{ marginTop: 12 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
          <h3>Before &rarr; after</h3>
          <table>
            <tbody>
              <tr>
                <td className="dim">Routing</td>
                <td className="mono">{baseline.routing}</td>
                <td className="mono" style={{ fontWeight: 620 }}>{result.assessment.routing}</td>
              </tr>
              <tr>
                <td className="dim">Confidence</td>
                <td className="num">{Math.round(baseline.confidence * 100)}%</td>
                <td className="num" style={{ fontWeight: 620 }}>{Math.round(result.assessment.confidence * 100)}%</td>
              </tr>
              <tr>
                <td className="dim">Evidence kept</td>
                <td className="num">{baseline.evidence.length}</td>
                <td className="num" style={{ fontWeight: 620 }}>{result.assessment.evidence.length}</td>
              </tr>
              <tr>
                <td className="dim">Injection detected</td>
                <td>{baseline.integrity.injectionDetected ? 'yes' : 'no'}</td>
                <td style={{ fontWeight: 620 }}>{result.assessment.integrity.injectionDetected ? 'yes' : 'no'}</td>
              </tr>
            </tbody>
          </table>
          <div className="stack-sm" style={{ marginTop: 10 }}>
            {result.assessment.routingRationale.map((r, i) => (
              <p key={i} className="small dim" style={{ margin: 0 }}>{r}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
