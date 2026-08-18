import { FIXTURES } from '@/lib/fixtures';
import { runEval } from '@/lib/eval';

export const maxDuration = 60;

/**
 * Run the gold-set evaluation.
 *
 * Defaults to replay so the numbers are reproducible: same fixtures in, same
 * report out, every time. `live: true` re-runs against the API, which is what a
 * model comparison needs — replaying one model's recorded output while claiming
 * to measure another would be meaningless.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    live?: boolean;
    model?: string;
    only?: string[];
  };

  if (body.live && process.env.MIZAN_ENABLE_LIVE_EVAL !== 'true') {
    return Response.json(
      {
        error: 'live_eval_disabled',
        detail: 'Public evaluation is replay-only. Set MIZAN_ENABLE_LIVE_EVAL=true to allow paid live runs.',
      },
      { status: 403 },
    );
  }

  const run = await runEval({
    fixtures: body.live ? {} : FIXTURES,
    forceLive: body.live === true,
    adjudicationModel: body.model,
    only: body.only,
  });

  return Response.json({ run });
}
