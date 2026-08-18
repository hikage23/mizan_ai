'use client';

/**
 * The signature element. Mizan (ميزان) means "the scale" — so the scale is not
 * a logo decoration, it is the confidence indicator. The beam tips toward
 * whichever pan the evidence weighs down: right for satisfied, left for
 * contradicted or missing. The tilt angle is computed from real data, not
 * chosen for effect, which is the whole point of using it here rather than a
 * generic progress bar — the picture *is* the number.
 *
 * Kept as one small rigid rotation (beam + pans turn together), the same
 * simplification every justice-scale glyph uses. A physically hanging pan
 * reads as fussier at 24px and buys nothing at this size.
 */

export interface ScaleProps {
  /** -1 (fully against/unresolved) to 1 (fully satisfied). 0 is level. */
  tilt: number;
  /** Pixel width. Height follows at roughly 0.62×. */
  size?: number;
  tone?: 'good' | 'bad' | 'warn' | 'flat' | 'auto';
  /** Play the settle-in sweep on mount. Off by default for repeated inline use. */
  animate?: boolean;
  className?: string;
  title?: string;
}

const TONE_VAR: Record<string, string> = {
  good: 'var(--good)',
  bad: 'var(--bad)',
  warn: 'var(--warn)',
  flat: 'var(--faint)',
};

function toneFor(tilt: number): 'good' | 'bad' | 'warn' | 'flat' {
  if (Math.abs(tilt) < 0.08) return 'flat';
  return tilt > 0 ? 'good' : tilt > -0.4 ? 'warn' : 'bad';
}

export function Scale({ tilt, size = 22, tone = 'auto', animate = false, className, title }: ScaleProps) {
  const clamped = Math.max(-1, Math.min(1, tilt));
  const deg = clamped * -13; // positive tilt (good) lowers the right pan → negative rotation
  const resolvedTone = tone === 'auto' ? toneFor(clamped) : tone;
  const color = TONE_VAR[resolvedTone];

  // Fixed viewBox geometry. Fulcrum sits at (50, 22); beam spans 14..86.
  const FX = 50;
  const FY = 22;

  return (
    <svg
      viewBox="0 0 100 62"
      width={size}
      height={size * 0.62}
      className={className}
      role="img"
      aria-label={title ?? `Balance tilted ${clamped > 0 ? 'toward satisfied' : clamped < 0 ? 'toward unresolved' : 'level'}`}
    >
      {title && <title>{title}</title>}
      {/* stand */}
      <line x1={FX} y1={FY} x2={FX} y2={56} stroke="var(--ink-2)" strokeWidth={2.4} strokeLinecap="round" />
      <line x1={38} y1={56} x2={62} y2={56} stroke="var(--ink-2)" strokeWidth={2.4} strokeLinecap="round" />
      {/* pivot cap */}
      <circle cx={FX} cy={FY} r={2.6} fill="var(--ink-2)" />

      <g
        style={{
          transform: `rotate(${deg}deg)`,
          transformOrigin: `${FX}px ${FY}px`,
          transition: animate ? 'transform 900ms cubic-bezier(.2,1,.3,1)' : 'transform 500ms ease-out',
        }}
      >
        <line x1={14} y1={FY} x2={86} y2={FY} stroke="var(--ink-2)" strokeWidth={2.2} strokeLinecap="round" />
        {/* left pan (against / unresolved) */}
        <line x1={14} y1={FY} x2={14} y2={FY + 12} stroke="var(--ink-2)" strokeWidth={1.4} />
        <path d={`M 5 ${FY + 12} Q 14 ${FY + 21} 23 ${FY + 12}`} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
        {/* right pan (satisfied) */}
        <line x1={86} y1={FY} x2={86} y2={FY + 12} stroke="var(--ink-2)" strokeWidth={1.4} />
        <path d={`M 77 ${FY + 12} Q 86 ${FY + 21} 95 ${FY + 12}`} fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** The wordmark glyph — a level scale at rest, used in the header and favicon-scale contexts. */
export function ScaleMark({ size = 20, className }: { size?: number; className?: string }) {
  return <Scale tilt={0} size={size} tone="flat" className={className} />;
}
