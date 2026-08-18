/**
 * Mizan — deterministic integrity checks.
 *
 * Nothing in this file calls a model. That is the point: the guarantees the
 * system makes about fabrication are enforced by code that cannot itself
 * hallucinate. A model proposes evidence; this file decides whether that
 * evidence exists.
 */

import type {
  Campaign,
  EvidenceItem,
  SourceDocument,
  SourceSpan,
} from './types';

// ---------------------------------------------------------------------------
// Span verification
// ---------------------------------------------------------------------------

/** Collapse whitespace and normalise quotes so cosmetic drift is not a failure. */
function normalise(s: string): string {
  return s
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/[‐-―]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export interface SpanVerification {
  ok: boolean;
  /** Corrected offsets when the quote was found but the indices were off. */
  corrected?: SourceSpan;
  reason?: string;
}

/**
 * A span is valid if its quote actually occurs in the cited document.
 *
 * Models are reliably good at quoting and unreliably good at counting characters,
 * so an off-by-N offset with a correct quote is repaired rather than rejected —
 * the quote is the security-relevant part. A quote that does not occur at all is
 * a fabrication and is rejected outright.
 */
export function verifySpan(span: SourceSpan, docs: SourceDocument[]): SpanVerification {
  const doc = docs.find((d) => d.id === span.sourceId);
  if (!doc) return { ok: false, reason: `cited source ${span.sourceId} does not exist` };

  if (!span.quote || span.quote.trim().length === 0) {
    return { ok: false, reason: 'empty quote' };
  }

  const exact = doc.text.slice(span.start, span.end);
  if (exact === span.quote) return { ok: true };

  // Quote is right, offsets drifted. Repair.
  const idx = doc.text.indexOf(span.quote);
  if (idx !== -1) {
    return {
      ok: true,
      corrected: { ...span, start: idx, end: idx + span.quote.length },
      reason: 'offsets repaired from exact quote match',
    };
  }

  // Try normalised matching to absorb whitespace and smart-quote differences.
  const nDoc = normalise(doc.text);
  const nQuote = normalise(span.quote);
  if (nQuote.length >= 12 && nDoc.includes(nQuote)) {
    // Locate approximately by walking the raw text for the normalised match.
    const approx = approximateLocate(doc.text, span.quote);
    if (approx) {
      return { ok: true, corrected: { ...span, ...approx }, reason: 'matched after normalisation' };
    }
    return { ok: true, reason: 'matched after normalisation; offsets not recoverable' };
  }

  return { ok: false, reason: 'quote does not occur in the cited source' };
}

/** Slide a window over raw text looking for a normalised match. */
function approximateLocate(text: string, quote: string): { start: number; end: number } | null {
  const nQuote = normalise(quote);
  const window = quote.length;
  const step = Math.max(1, Math.floor(window / 4));
  for (let i = 0; i + window <= text.length + window; i += step) {
    const slice = text.slice(i, i + Math.ceil(window * 1.6));
    if (normalise(slice).includes(nQuote)) {
      return { start: i, end: Math.min(text.length, i + Math.ceil(window * 1.6)) };
    }
  }
  return null;
}

export interface EvidenceVerification {
  kept: EvidenceItem[];
  discardedIds: string[];
  hallucinated: SourceSpan[];
}

/**
 * Verify every piece of evidence, keeping only what is provably grounded.
 *
 * Discarded evidence is not shown to reviewers with a warning label — it is
 * removed. A reviewer who sees a flagged-but-visible fabricated quote will read
 * it anyway, and it will influence them. The only safe treatment is deletion,
 * with the count surfaced separately in the integrity panel.
 */
export function verifyEvidence(
  evidence: EvidenceItem[],
  docs: SourceDocument[],
): EvidenceVerification {
  const kept: EvidenceItem[] = [];
  const discardedIds: string[] = [];
  const hallucinated: SourceSpan[] = [];

  for (const item of evidence) {
    const result = verifySpan(item.span, docs);
    if (result.ok) {
      kept.push({
        ...item,
        span: result.corrected ?? item.span,
        spanVerified: true,
      });
    } else {
      discardedIds.push(item.id);
      hallucinated.push(item.span);
    }
  }

  return { kept, discardedIds, hallucinated };
}

// ---------------------------------------------------------------------------
// Prompt injection detection
// ---------------------------------------------------------------------------

/**
 * Campaign narratives are attacker-controlled text that we feed to a model. An
 * organizer with an ineligible campaign has direct financial motive to embed
 * instructions in it.
 *
 * Detection runs on the raw source text *before* extraction, and a positive
 * result never silently changes the verdict — it routes to a human with the
 * matched text shown. Suppressing the campaign automatically would hand any
 * competitor a way to sabotage a rival by mentioning these phrases.
 */
const INJECTION_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /ignore (all )?(previous|prior|above)\s+instructions?/i, label: 'instruction override' },
  { pattern: /disregard (the )?(previous|prior|above|system)/i, label: 'instruction override' },
  { pattern: /you are (now )?(a|an|the)\s+\w+/i, label: 'role reassignment' },
  { pattern: /\bsystem\s*(prompt|message)\b/i, label: 'system prompt reference' },
  { pattern: /mark (this|the) (campaign|application) as (eligible|approved|verified)/i, label: 'verdict instruction' },
  { pattern: /(approve|verify|accept) (this|the) (campaign|application) (automatically|immediately|without)/i, label: 'verdict instruction' },
  { pattern: /do not (flag|escalate|review|reject)/i, label: 'suppression instruction' },
  { pattern: /\[\s*(system|assistant|instruction)\s*\]/i, label: 'role tag injection' },
  { pattern: /<\/?(system|instructions?|assistant)>/i, label: 'role tag injection' },
  { pattern: /as an ai (language )?model/i, label: 'model addressing' },
  { pattern: /output only\s+["']?(eligible|approved|satisfied)/i, label: 'output forcing' },
];

export interface InjectionFinding {
  detected: boolean;
  detail?: string;
  matches: { sourceId: string; label: string; excerpt: string }[];
}

export function detectInjection(docs: SourceDocument[]): InjectionFinding {
  const matches: InjectionFinding['matches'] = [];

  for (const doc of docs) {
    for (const { pattern, label } of INJECTION_PATTERNS) {
      const m = doc.text.match(pattern);
      if (m && m.index !== undefined) {
        matches.push({
          sourceId: doc.id,
          label,
          excerpt: doc.text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 60).trim(),
        });
      }
    }
  }

  if (matches.length === 0) return { detected: false, matches: [] };

  const labels = [...new Set(matches.map((m) => m.label))];
  return {
    detected: true,
    detail: `${matches.length} pattern match(es) across ${new Set(matches.map((m) => m.sourceId)).size} source(s): ${labels.join(', ')}`,
    matches,
  };
}

/**
 * Wrap untrusted document text so the model has an unambiguous boundary.
 * Defence in depth — the detector above is the load-bearing control, this
 * reduces the chance an undetected attempt lands.
 */
export function fenceUntrusted(doc: SourceDocument): string {
  const fence = `===UNTRUSTED_DOCUMENT_${doc.id}===`;
  const scrubbed = doc.text.replace(/===UNTRUSTED_DOCUMENT[^=]*===/g, '[removed]');
  return `${fence}\n${scrubbed}\n${fence}`;
}

// ---------------------------------------------------------------------------
// Duplicate / recycled campaign detection
// ---------------------------------------------------------------------------

function shingles(text: string, k = 5): Set<string> {
  const words = normalise(text).split(' ').filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + k <= words.length; i++) out.add(words.slice(i, i + k).join(' '));
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

export interface DuplicateFinding {
  isDuplicate: boolean;
  bestMatchCampaignId?: string;
  similarity: number;
}

/**
 * Near-duplicate narrative detection via 5-gram Jaccard similarity.
 *
 * Deliberately not embeddings: recycled campaigns are copy-paste jobs with light
 * edits, which lexical overlap catches precisely and cheaply. Embeddings would
 * also flag *topically* similar campaigns, and "two different families in Gaza
 * both need medical funding" is not fraud. Precision matters more than recall
 * here, because the cost of wrongly implying an organizer recycled a campaign is
 * high and lands on people who are usually telling the truth.
 */
export function detectDuplicate(
  campaign: Campaign,
  corpus: Campaign[],
  threshold = 0.45,
): DuplicateFinding {
  const narrative = campaign.sources.find((s) => s.kind === 'campaign_narrative');
  if (!narrative) return { isDuplicate: false, similarity: 0 };

  const mine = shingles(narrative.text);
  let best = 0;
  let bestId: string | undefined;

  for (const other of corpus) {
    if (other.id === campaign.id) continue;
    const otherNarrative = other.sources.find((s) => s.kind === 'campaign_narrative');
    if (!otherNarrative) continue;
    const score = jaccard(mine, shingles(otherNarrative.text));
    if (score > best) {
      best = score;
      bestId = other.id;
    }
  }

  return {
    isDuplicate: best >= threshold,
    bestMatchCampaignId: best >= threshold ? bestId : undefined,
    similarity: Number(best.toFixed(3)),
  };
}
