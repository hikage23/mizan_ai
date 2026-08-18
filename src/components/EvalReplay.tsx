'use client';

import Link from 'next/link';
import { useState } from 'react';
import { RoutingPill, Tag } from '@/components/ui';
import type { RoutingDecision } from '@/lib/types';

export interface ReplayCase {
  campaignId: string;
  title: string;
  failureClass: string;
  expectedRouting: RoutingDecision;
  actualRouting: RoutingDecision;
  confidence: number;
  routingCorrect: boolean;
  falseApprove: boolean;
  falseReject: boolean;
  citationsValid: boolean;
  injectionDetected: boolean;
  costUsd: number;
}

interface ApiEvalResult {
  campaignId: string;
  failureClass: string;
  expected: { expectedRouting: RoutingDecision };
  actual: {
    routing: RoutingDecision;
    confidence: number;
    cost: { usd: number };
    integrity: { injectionDetected: boolean };
  };
  routingCorrect: boolean;
  falseApprove: boolean;
  falseReject: boolean;
  citationsValid: boolean;
}

interface ApiEvalRun {
  startedAt: string;
  results: ApiEvalResult[];
}

function utcClock(iso: string): string {
  return `${iso.slice(11, 19)} UTC`;
}

function resultLabel(item: ReplayCase): { tone: 'good' | 'bad' | 'warn'; text: string } {
  if (item.falseApprove) return { tone: 'bad', text: 'false approve' };
  if (item.falseReject) return { tone: 'bad', text: 'false reject' };
  if (item.routingCorrect) return { tone: 'good', text: 'exact route' };
  return { tone: 'warn', text: 'safer lane' };
}

export function EvalReplay({
  initialCases,
  initialStartedAt,
}: {
  initialCases: ReplayCase[];
  initialStartedAt: string;
}) {
  const [cases, setCases] = useState(initialCases);
  const [status, setStatus] = useState<'seeded' | 'running' | 'complete' | 'error'>('seeded');
  const [startedAt, setStartedAt] = useState(initialStartedAt);
  const [error, setError] = useState('');

  const exact = cases.filter((item) => item.routingCorrect).length;
  const valid = cases.filter((item) => item.citationsValid).length;
  const falseApproves = cases.filter((item) => item.falseApprove).length;
  const totalCost = cases.reduce((sum, item) => sum + item.costUsd, 0);

  async function replay() {
    setStatus('running');
    setError('');

    try {
      const request = fetch('/api/eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ only: initialCases.map((item) => item.campaignId) }),
      });
      const [response] = await Promise.all([
        request,
        new Promise((resolve) => window.setTimeout(resolve, 650)),
      ]);
      const body = (await response.json()) as { run?: ApiEvalRun; error?: string; detail?: string };
      if (!response.ok || !body.run) {
        throw new Error(body.detail ?? body.error ?? 'Replay failed.');
      }

      const titles = new Map(initialCases.map((item) => [item.campaignId, item.title]));
      setCases(
        body.run.results.map((item) => ({
          campaignId: item.campaignId,
          title: titles.get(item.campaignId) ?? item.campaignId,
          failureClass: item.failureClass,
          expectedRouting: item.expected.expectedRouting,
          actualRouting: item.actual.routing,
          confidence: item.actual.confidence,
          routingCorrect: item.routingCorrect,
          falseApprove: item.falseApprove,
          falseReject: item.falseReject,
          citationsValid: item.citationsValid,
          injectionDetected: item.actual.integrity.injectionDetected,
          costUsd: item.actual.cost.usd,
        })),
      );
      setStartedAt(body.run.startedAt);
      setStatus('complete');
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  }

  return (
    <section className="replay-card" aria-labelledby="replay-heading">
      <div className="row-between wrap" style={{ marginBottom: 14 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 7 }}>Recorded replay</div>
          <h2 id="replay-heading" style={{ marginBottom: 4 }}>Run the evaluator now.</h2>
          <p className="small dim" style={{ margin: 0, maxWidth: '68ch' }}>
            Five verbatim model recordings are seeded below. Replay sends them through span
            verification, deterministic checks, scoring, and routing again &mdash; no API key and no
            model spend.
          </p>
        </div>
        <button className="btn btn-primary" onClick={replay} disabled={status === 'running'}>
          {status === 'running' ? 'Replaying 5 cases…' : 'Replay the recorded set'}
        </button>
      </div>

      <div className={`replay-status replay-status-${status}`} aria-live="polite">
        {status === 'running' ? (
          <>
            <span className="replay-pulse" aria-hidden="true" />
            Extraction &rarr; span verification &rarr; assessment &rarr; routing
          </>
        ) : status === 'error' ? (
          <>Replay failed: {error}</>
        ) : (
          <>
            <span className="dot" style={{ background: 'var(--good)' }} aria-hidden="true" />
            {status === 'complete' ? 'Replay complete' : 'Seeded snapshot'} &middot; {cases.length}/5
            cases executed &middot; {utcClock(startedAt)}
          </>
        )}
      </div>

      <div className="replay-metrics" aria-label="Recorded replay summary">
        <div><span>Exact routes</span><strong>{exact}/{cases.length}</strong></div>
        <div><span>Citations valid</span><strong>{valid}/{cases.length}</strong></div>
        <div><span>False approves</span><strong style={{ color: falseApproves ? 'var(--bad)' : 'var(--good)' }}>{falseApproves}</strong></div>
        <div><span>Recorded cost</span><strong>${totalCost.toFixed(3)}</strong></div>
      </div>

      <div className="replay-table-wrap">
        <table className="replay-table">
          <thead>
            <tr>
              <th>Case</th>
              <th>Expected</th>
              <th>Actual</th>
              <th>Confidence</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((item) => {
              const result = resultLabel(item);
              return (
                <tr key={item.campaignId}>
                  <td>
                    <Link href={`/review/${item.campaignId}`} style={{ fontWeight: 600 }}>
                      {item.campaignId}
                    </Link>
                    <span className="note">{item.failureClass.replace(/_/g, ' ')}</span>
                  </td>
                  <td><RoutingPill routing={item.expectedRouting} /></td>
                  <td><RoutingPill routing={item.actualRouting} /></td>
                  <td className="num">{Math.round(item.confidence * 100)}%</td>
                  <td><Tag tone={result.tone}>{result.text}</Tag></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="tiny faint" style={{ margin: '10px 0 0' }}>
        The remaining 19 corpus cases have labels but no recorded model output and are excluded from
        every metric until they actually run.
      </p>
    </section>
  );
}
