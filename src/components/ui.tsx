import { ROUTING_BLURB, ROUTING_LABEL } from '@/lib/routing';
import { Scale } from './Scale';
import type { CriterionStatus, RoutingDecision } from '@/lib/types';

/**
 * Two visual languages for metadata, deliberately — not five pill palettes
 * competing for the same kind of attention:
 *
 *  .badge  — a filled label, spent only on the thing the page is actually
 *            about (the routing verdict). Earns its weight.
 *  .tag    — a quiet dot + word, for everything secondary (criterion status,
 *            severity, kind). Reads as metadata, not as another verdict.
 *  Scale   — wherever a reading has a real "which way does this lean"
 *            quality (confidence), it gets the scale glyph instead of a
 *            generic bar. The product's name is the indicator.
 */

const ROUTING_TONE: Record<RoutingDecision, string> = {
  fast_lane_review: 'badge-good',
  standard_review: 'badge-info',
  priority_review: 'badge-bad',
  evidence_request: 'badge-warn',
  scholar_board: 'badge-flat',
  policy_excluded: 'badge-flat',
};

const ROUTING_TILT: Record<RoutingDecision, number> = {
  fast_lane_review: 0.9,
  standard_review: 0.15,
  priority_review: -0.9,
  evidence_request: -0.3,
  scholar_board: 0,
  policy_excluded: 0,
};

export function RoutingPill({ routing, title }: { routing: RoutingDecision; title?: boolean }) {
  return (
    <span className={`badge ${ROUTING_TONE[routing]}`} title={title ? ROUTING_BLURB[routing] : undefined}>
      <Scale tilt={ROUTING_TILT[routing]} size={14} />
      {ROUTING_LABEL[routing]}
    </span>
  );
}

const STATUS_TONE: Record<CriterionStatus, string> = {
  satisfied: 'tag-good',
  contradicted: 'tag-bad',
  insufficient_evidence: 'tag-warn',
  not_applicable: 'tag-flat',
};

const STATUS_LABEL: Record<CriterionStatus, string> = {
  satisfied: 'Satisfied',
  contradicted: 'Contradicted',
  insufficient_evidence: 'Not evidenced',
  not_applicable: 'N/A',
};

export function StatusPill({ status }: { status: CriterionStatus }) {
  return <span className={`tag ${STATUS_TONE[status]}`}>{STATUS_LABEL[status]}</span>;
}

/** Quiet dot-tag for severity, kind, language — secondary metadata only. */
export function Tag({ tone = 'flat', children }: { tone?: 'good' | 'bad' | 'warn' | 'info' | 'flat'; children: React.ReactNode }) {
  return <span className={`tag ${tone !== 'flat' ? `tag-${tone}` : ''}`}>{children}</span>;
}

/**
 * Who produced a claim, coloured the same way wherever it shows up (policy
 * page criteria, review dossier, how-it-works pipeline stages): deterministic
 * code is a neutral fact (info/slate); a model's read is a judgement that
 * wants a human eye on it (warn/ochre — the same colour an under-evidenced
 * criterion gets, deliberately, since both mean "not yet settled"); a human
 * decision is resolved (good/verdigris). Accepts either key vocabulary.
 */
const KIND_TONE: Record<string, 'info' | 'warn' | 'good'> = {
  deterministic: 'info', code: 'info',
  llm: 'warn', ai: 'warn',
  human: 'good',
};
export function KindTag({ kind, children }: { kind: string; children?: React.ReactNode }) {
  const tone = KIND_TONE[kind] ?? 'flat';
  return <Tag tone={tone}>{children ?? kind}</Tag>;
}

/** Consequence-if-missed, not who-judged-it: blocking is the oxide "bad" a
 *  reader should stop on, material is the ochre "worth noting." */
const SEVERITY_TONE: Record<string, 'bad' | 'warn'> = { blocking: 'bad', material: 'warn' };
export function SeverityTag({ severity }: { severity: string }) {
  return <Tag tone={SEVERITY_TONE[severity] ?? 'flat'}>{severity}</Tag>;
}

/** Category-level verdict: verified/conditional/not_verified. A badge, not a
 *  tag — this is as load-bearing as the routing pill (it says whether the
 *  category is usable at all), so it earns the filled treatment. Shared
 *  between the policy reference page and the live review sidebar so the same
 *  colour means the same thing in both places. */
const POSTURE_TONE: Record<string, string> = {
  verified: 'badge-good',
  conditional: 'badge-warn',
  not_verified: 'badge-flat',
};
export function PostureBadge({ posture }: { posture: string }) {
  return <span className={`badge ${POSTURE_TONE[posture] ?? 'badge-flat'}`}>{posture.replace(/_/g, ' ')}</span>;
}

export function Confidence({ value, size = 20 }: { value: number; size?: number }) {
  const pct = Math.round(value * 100);
  // Confidence isn't "for vs against" the way a criterion's evidence is, but it
  // shares the same reads-as-tipping quality: below the fast-lane floor, the
  // beam leans away from level rather than pretending to a false precision.
  const tilt = (value - 0.5) * 2;
  return (
    <span className="row" style={{ gap: 7 }}>
      <Scale tilt={tilt} size={size} />
      <span className="tiny num dim">{pct}%</span>
    </span>
  );
}

export function Money({ usd }: { usd: number }) {
  return <span className="num">${usd.toLocaleString('en-US')}</span>;
}
