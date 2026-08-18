/**
 * Mizan — model access, with a recorded-replay path.
 *
 * The demo has to work for a reviewer clicking a link with no API key, and eval
 * numbers have to be reproducible run-to-run. Both fall out of the same design:
 * every model call is content-addressed and can be served from a recorded
 * fixture instead of the network.
 *
 * Replay is not a mock. Fixtures are verbatim responses from a real model run,
 * recorded by `npm run record`. Replaying them exercises the entire downstream
 * pipeline — span verification, criteria aggregation, routing — against real
 * model output, including its mistakes. The only thing replay removes is the
 * network call and the nondeterminism.
 */

import Anthropic from '@anthropic-ai/sdk';
import { createHash } from 'crypto';
import type { RunCost } from './types';

// ---------------------------------------------------------------------------
// Model registry
// ---------------------------------------------------------------------------

export interface ModelSpec {
  id: string;
  label: string;
  /** USD per million input tokens. */
  inputPerMTok: number;
  /** USD per million output tokens. */
  outputPerMTok: number;
  /** What this tier is for in this pipeline. */
  role: string;
}

/**
 * Prices are the published list rates at time of writing and are used only to
 * compute the cost-per-review figure shown in the eval dashboard. Override the
 * default model with MIZAN_MODEL if these IDs have moved on.
 */
export const MODELS: ModelSpec[] = [
  {
    id: 'claude-haiku-4-5',
    label: 'Haiku 4.5',
    inputPerMTok: 1,
    outputPerMTok: 5,
    role: 'Extraction tier. Quoting spans out of documents is a retrieval task, not a judgement task.',
  },
  {
    id: 'claude-sonnet-4-5',
    label: 'Sonnet 4.5',
    inputPerMTok: 3,
    outputPerMTok: 15,
    role: 'Default adjudication tier. Weighs extracted evidence against policy criteria.',
  },
  {
    id: 'claude-opus-4-5',
    label: 'Opus 4.5',
    inputPerMTok: 5,
    outputPerMTok: 25,
    role: 'Escalation tier. Reserved for cases the router sends to the scholar board.',
  },
];

export const DEFAULT_EXTRACTION_MODEL = process.env.MIZAN_EXTRACTION_MODEL ?? 'claude-haiku-4-5';
export const DEFAULT_ADJUDICATION_MODEL = process.env.MIZAN_MODEL ?? 'claude-sonnet-4-5';

export function modelSpec(id: string): ModelSpec {
  return (
    MODELS.find((m) => m.id === id) ?? {
      id,
      label: id,
      inputPerMTok: 3,
      outputPerMTok: 15,
      role: 'Unknown model; cost estimated at mid-tier rates.',
    }
  );
}

export function priceOf(modelId: string, inputTokens: number, outputTokens: number): number {
  const spec = modelSpec(modelId);
  return (
    (inputTokens / 1_000_000) * spec.inputPerMTok +
    (outputTokens / 1_000_000) * spec.outputPerMTok
  );
}

// ---------------------------------------------------------------------------
// Call interface
// ---------------------------------------------------------------------------

export interface StructuredCall {
  /** Stage name; part of the fixture key. */
  stage: string;
  /** Stable identifier for the subject, usually a campaign ID. */
  subject: string;
  model: string;
  system: string;
  user: string;
  /** JSON Schema the model must emit against. */
  schema: Record<string, unknown>;
  toolName: string;
  toolDescription: string;
  maxTokens?: number;
}

export interface StructuredResult<T> {
  data: T;
  cost: RunCost;
  mode: 'live' | 'replay';
  /** Fixture key, exposed so the UI can show what was replayed. */
  key: string;
}

export function fixtureKey(call: StructuredCall): string {
  const h = createHash('sha256')
    .update(`${call.stage}|${call.model}|${call.system}|${call.user}`)
    .digest('hex')
    .slice(0, 16);
  return `${call.stage}__${call.subject}__${h}`;
}

export function hasLiveKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

export class ReplayMiss extends Error {
  constructor(public key: string) {
    super(
      `No recorded fixture for "${key}" and no ANTHROPIC_API_KEY is set. ` +
        `Run "npm run record" with a key to record this call, or set a key to run live.`,
    );
    this.name = 'ReplayMiss';
  }
}

/**
 * Execute a structured call, live or from fixture.
 *
 * `forceLive` exists for the eval harness, which needs to bypass the cache when
 * measuring a model it has never run — otherwise a model comparison would
 * silently compare a model against another model's recorded output.
 */
export async function callStructured<T>(
  call: StructuredCall,
  fixtures: Record<string, unknown>,
  opts: {
    forceLive?: boolean;
    /**
     * Capture hook for the recorder. The runtime never writes fixtures itself —
     * keeping the request path free of write side-effects means a deployed
     * instance cannot mutate its own recorded evidence, which is what makes the
     * eval numbers reproducible rather than drifting under traffic.
     */
    onRecord?: (key: string, data: unknown, cost: RunCost) => void;
  } = {},
): Promise<StructuredResult<T>> {
  const key = fixtureKey(call);

  if (!opts.forceLive && fixtures[key]) {
    const rec = fixtures[key] as { data: T; cost: RunCost };
    return { data: rec.data, cost: { ...rec.cost, latencyMs: 0 }, mode: 'replay', key };
  }

  if (!hasLiveKey()) throw new ReplayMiss(key);

  const started = Date.now();
  const response = await getClient().messages.create({
    model: call.model,
    max_tokens: call.maxTokens ?? 4096,
    system: call.system,
    messages: [{ role: 'user', content: call.user }],
    tools: [
      {
        name: call.toolName,
        description: call.toolDescription,
        input_schema: call.schema as Anthropic.Tool.InputSchema,
      },
    ],
    // Forcing the tool is what makes the output structurally guaranteed rather
    // than parsed-and-hoped-for. A malformed response fails at the API layer and
    // is retried there, not silently half-parsed downstream.
    tool_choice: { type: 'tool', name: call.toolName },
  });

  const block = response.content.find((c) => c.type === 'tool_use');
  if (!block || block.type !== 'tool_use') {
    throw new Error(`Model did not emit the required tool call for stage "${call.stage}".`);
  }

  const cost: RunCost = {
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    usd: priceOf(call.model, response.usage.input_tokens, response.usage.output_tokens),
    latencyMs: Date.now() - started,
  };

  opts.onRecord?.(key, block.input, cost);
  return { data: block.input as T, cost, mode: 'live', key };
}

export function emptyCost(): RunCost {
  return { inputTokens: 0, outputTokens: 0, usd: 0, latencyMs: 0 };
}

export function addCost(a: RunCost, b: RunCost): RunCost {
  return {
    inputTokens: a.inputTokens + b.inputTokens,
    outputTokens: a.outputTokens + b.outputTokens,
    usd: a.usd + b.usd,
    latencyMs: a.latencyMs + b.latencyMs,
  };
}
