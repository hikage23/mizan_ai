'use client';

import { useState } from 'react';
import { ASNAF } from '@/lib/policy';
import { AUTHORITIES, type Posture } from '@/data/authorities';
import { PostureBadge, KindTag, SeverityTag } from '@/components/ui';
import type { AsnafId } from '@/lib/types';

/**
 * Lets a reviewer switch which authority's eligibility lines are shown for
 * the eight categories, and hover a lens to preview what switching to it
 * would change before committing to it. This is a reference/comparison tool
 * only: the criteria and evidence machinery below always belong to
 * LaunchGood's own encoded policy (see src/data/authorities.ts for why this
 * boundary is deliberate, not a shortcut).
 */

const LAUNCHGOOD_ID = 'launchgood';

type Tab = { id: string; short: string; kind: string };

const TABS: Tab[] = [
  { id: LAUNCHGOOD_ID, short: 'LaunchGood', kind: 'The platform’s own encoded policy — what actually runs this demo.' },
  ...AUTHORITIES.map((a) => ({ id: a.id, short: a.short, kind: a.kind })),
];

function postureFor(authorityId: string, catId: AsnafId): { posture: Posture; note: string } {
  if (authorityId === LAUNCHGOOD_ID) {
    const cat = ASNAF.find((c) => c.id === catId)!;
    return { posture: cat.posture, note: cat.postureRationale };
  }
  const auth = AUTHORITIES.find((a) => a.id === authorityId);
  const p = auth?.postures[catId];
  return p ?? { posture: 'not_verified', note: 'Not addressed in this synthesis.' };
}

export function EligibilityLens() {
  const [selected, setSelected] = useState<string>(LAUNCHGOOD_ID);
  const [hovered, setHovered] = useState<string | null>(null);

  const activeTab = TABS.find((t) => t.id === selected) ?? TABS[0];
  const previewTab = hovered && hovered !== selected ? (TABS.find((t) => t.id === hovered) ?? null) : null;

  const diffs = previewTab
    ? ASNAF.filter((cat) => postureFor(selected, cat.id).posture !== postureFor(previewTab.id, cat.id).posture).map(
        (cat) => ({
          label: cat.label,
          from: postureFor(selected, cat.id).posture,
          to: postureFor(previewTab.id, cat.id).posture,
        }),
      )
    : [];

  return (
    <div style={{ marginBottom: 22 }}>
      <div className="row-between wrap" style={{ marginBottom: 10, gap: 12 }}>
        <div className="lens-tabs" role="tablist" aria-label="Zakat eligibility authority">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected === t.id}
              className={`lens-tab ${selected === t.id ? 'on' : ''}`}
              onClick={() => setSelected(t.id)}
              onMouseEnter={() => setHovered(t.id)}
              onMouseLeave={() => setHovered((h) => (h === t.id ? null : h))}
              onFocus={() => setHovered(t.id)}
              onBlur={() => setHovered((h) => (h === t.id ? null : h))}
              title={t.kind}
            >
              {t.short}
            </button>
          ))}
        </div>
        {selected !== LAUNCHGOOD_ID && (
          <span className="tiny faint">Reference lens only &mdash; the pipeline always runs on LaunchGood&rsquo;s own policy.</span>
        )}
      </div>

      {previewTab ? (
        <div className="lens-diff">
          {diffs.length === 0 ? (
            <>Same posture as {activeTab.short} on every category.</>
          ) : (
            <>
              <strong style={{ color: 'var(--ink)' }}>{previewTab.short}</strong> would change {diffs.length} of{' '}
              {ASNAF.length}:{' '}
              {diffs.map((d, i) => (
                <span key={d.label}>
                  {i > 0 && '; '}
                  {d.label} ({d.from.replace(/_/g, ' ')} &rarr; {d.to.replace(/_/g, ' ')})
                </span>
              ))}
              .
            </>
          )}
        </div>
      ) : (
        <p className="tiny faint" style={{ margin: '2px 0 0' }}>
          {activeTab.kind}
        </p>
      )}

      <div style={{ marginTop: 16 }}>
        {ASNAF.map((cat) => {
          const { posture, note } = postureFor(selected, cat.id);
          return (
            <div key={cat.id} className="card">
              <div className="row-between wrap" style={{ marginBottom: 6 }}>
                <h2 style={{ margin: 0 }}>
                  {cat.label} <span className="dim" style={{ fontWeight: 400 }}>&mdash; {cat.arabic}</span>
                </h2>
                <PostureBadge posture={posture} />
              </div>
              {selected === LAUNCHGOOD_ID && cat.contemporaryReading && (
                <p className="small" style={{ color: 'var(--ink-2)' }}>
                  <strong>Reading applied:</strong> {cat.contemporaryReading}
                </p>
              )}
              <p className="small dim">{note}</p>

              {cat.criteria.length > 0 ? (
                <div style={{ marginTop: 10 }}>
                  {cat.criteria.map((c) => (
                    <div key={c.id} className="crit">
                      <div className="row-between" style={{ marginBottom: 4 }}>
                        <span className="small" style={{ fontWeight: 555 }}>
                          {c.text}
                        </span>
                        <span className="row" style={{ gap: 5, flex: 'none' }}>
                          <KindTag kind={c.kind} />
                          <SeverityTag severity={c.severity} />
                        </span>
                      </div>
                      <div className="tiny dim">Satisfied by: {c.evidenceExpectation}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="tiny faint" style={{ margin: 0 }}>
                  {selected === LAUNCHGOOD_ID
                    ? 'No criteria encoded — the badge is unavailable in this category as a policy matter, so there is nothing for evidence to decide.'
                    : 'LaunchGood encodes no criteria for this category, so the pipeline has nothing to check regardless of which lens is selected above.'}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="tiny faint" style={{ marginTop: 14, maxWidth: '70ch' }}>
        Comparison content for NZF, AskImam and AMJA is an illustrative synthesis of each body&rsquo;s
        generally known public methodology, written for this demo &mdash; not fetched from or verified
        against any institution&rsquo;s current published rulings, and not a substitute for their own
        material. The criteria and evidence machinery shown always belong to LaunchGood&rsquo;s own
        encoded policy; switching the lens changes only how this reference page displays posture and
        rationale.
      </p>
    </div>
  );
}
