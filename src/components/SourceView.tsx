import type { EvidenceItem, SourceDocument } from '@/lib/types';

/**
 * Renders a source document with every cited span highlighted in place.
 *
 * This is the actual product — the whole trust mechanic is a reviewer seeing a
 * sentence sitting in its own paragraph, in the document it came from, rather
 * than taking a dossier's word for a quote. It used to live behind a collapsed
 * native <details> triangle, which buried the single most load-bearing feature
 * under the least visual weight in the page. Open by default; a document with
 * nothing cited in it collapses instead, since there's nothing to read there.
 */
export function SourceView({
  doc,
  evidence,
  defaultOpen,
}: {
  doc: SourceDocument;
  evidence: EvidenceItem[];
  defaultOpen?: boolean;
}) {
  const spans = evidence
    .filter((e) => e.span.sourceId === doc.id)
    .map((e) => {
      const at = doc.text.indexOf(e.span.quote);
      return at === -1 ? null : { start: at, end: at + e.span.quote.length, id: e.id };
    })
    .filter((x): x is { start: number; end: number; id: string } => x !== null)
    .sort((a, b) => a.start - b.start);

  // Drop overlaps rather than nesting marks — two evidence items quoting the
  // same sentence is common and nested highlights are unreadable.
  const merged: typeof spans = [];
  for (const s of spans) {
    const prev = merged[merged.length - 1];
    if (prev && s.start < prev.end) continue;
    merged.push(s);
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const s of merged) {
    if (s.start > cursor) parts.push(doc.text.slice(cursor, s.start));
    parts.push(
      <mark key={`${s.id}-${s.start}`} title={`cited as ${s.id}`}>
        {doc.text.slice(s.start, s.end)}
      </mark>,
    );
    cursor = s.end;
  }
  if (cursor < doc.text.length) parts.push(doc.text.slice(cursor));

  const open = defaultOpen ?? merged.length > 0;

  return (
    <details open={open} style={{ marginTop: 10 }}>
      <summary
        style={{
          cursor: 'pointer', fontSize: 13.5, listStyle: 'none', display: 'flex',
          alignItems: 'baseline', gap: 8, padding: '2px 0',
        }}
      >
        <span style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: 15 }}>{doc.title}</span>
        <span className="tiny faint">
          {doc.kind.replace(/_/g, ' ')} &middot; {doc.provenance} &middot; captured {doc.capturedAt}
          {merged.length > 0 && ` · ${merged.length} cited`}
        </span>
      </summary>
      <div className="ledgerpane" style={{ marginTop: 9 }} dir={doc.language === 'ar' ? 'rtl' : undefined}>
        {parts}
      </div>
    </details>
  );
}
