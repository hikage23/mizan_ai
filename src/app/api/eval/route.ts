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

  const run = await runEval({
    fixtures: body.live ? {} : FIXTURES,
    forceLive: body.live === true,
    adjudicationModel: body.model,
    only: body.only,
  });

  return Response.json({ run });
}
