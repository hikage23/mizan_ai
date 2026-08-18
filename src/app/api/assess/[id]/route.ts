import { getCampaign } from '@/data/corpus';
import { ADVERSARIAL_MUTATIONS } from '@/lib/eval';
import { FIXTURES } from '@/lib/fixtures';
import { hasLiveKey } from '@/lib/llm';
import { assessCampaign } from '@/lib/pipeline';
import type { Campaign } from '@/lib/types';

/**
 * Assess one campaign, optionally after applying an adversarial mutation.
 *
 * A mutated campaign is deliberately NOT served from fixtures — its text differs,
 * so the fixture key differs, and the call goes live. That is the point of the
 * control: it proves the pipeline is reasoning about the document in front of it
 * rather than replaying a cached verdict. With no API key set, the mutation
 * honestly reports that it cannot run.
 */
export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const campaign = getCampaign(id);
  if (!campaign) return Response.json({ error: 'unknown campaign' }, { status: 404 });

  const body = (await request.json().catch(() => ({}))) as { mutation?: string };
  const mutationId = body.mutation;

  let subject: Campaign = campaign;
  let mutated = false;

  if (mutationId) {
    const m = ADVERSARIAL_MUTATIONS.find((x) => x.id === mutationId);
    if (!m) return Response.json({ error: 'unknown mutation' }, { status: 400 });
    if (!hasLiveKey()) {
      return Response.json(
        {
          error: 'live_required',
          detail:
            'Adversarial mutation changes the document, so no recorded fixture can match it. ' +
            'Set ANTHROPIC_API_KEY to run this control live.',
        },
        { status: 409 },
      );
    }
    subject = applyMutation(campaign, m);
    mutated = true;
  }

  try {
    const assessment = await assessCampaign(subject, {
      fixtures: mutated ? {} : FIXTURES,
      forceLive: mutated,
    });
    return Response.json({ assessment, mutated, mutationId: mutationId ?? null });
  } catch (err) {
    const e = err as Error;
    return Response.json(
      { error: e.name === 'ReplayMiss' ? 'not_recorded' : 'failed', detail: e.message },
      { status: e.name === 'ReplayMiss' ? 409 : 500 },
    );
  }
}

type Mutation = (typeof ADVERSARIAL_MUTATIONS)[number];

function applyMutation(campaign: Campaign, m: Mutation): Campaign {
  const next: Campaign = structuredClone(campaign);
  next.id = `${campaign.id}__${m.id}`;

  if ('stripSources' in m && m.stripSources) {
    next.sources = next.sources.filter((s) => s.kind === 'campaign_narrative');
    return next;
  }
  if ('relabelBudget' in m && m.relabelBudget) {
    next.budget = next.budget.map((b) => ({ ...b, declaredAsOverhead: false }));
    return next;
  }
  const narrative = next.sources.find((s) => s.kind === 'campaign_narrative');
  if (narrative) narrative.text = m.apply(narrative.text);
  return next;
}
