/**
 * Runs the gold-set evaluation from the command line, for CI.
 *
 *   npm run eval                    # replay — reproducible, free, no key needed
 *   ANTHROPIC_API_KEY=... npm run eval -- --live
 *
 * Exits non-zero on any false approve. That is the CI gate: a build that would
 * present an ineligible campaign to a reviewer as clean-and-confirm-only does not
 * ship, regardless of how good the other numbers look. Every other metric is
 * reported, but only this one blocks — a gate that fires on everything gets
 * disabled the first week.
 */

import { runEval } from '../src/lib/eval';
import fixtures from '../src/data/fixtures/recorded.json';

async function main() {
  const live = process.argv.includes('--live');
  const run = await runEval({
    fixtures: live ? {} : (fixtures as Record<string, unknown>),
    forceLive: live,
  });
  const s = run.summary as typeof run.summary & { skipped?: number };
  const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

  console.log('');
  for (const r of run.results) {
    const flag = r.falseApprove
      ? 'FALSE-APPROVE'
      : r.falseReject
        ? 'FALSE-REJECT'
        : r.routingCorrect
          ? 'ok'
          : 'lane-diff';
    console.log(`  ${r.campaignId}  ${r.failureClass.padEnd(28)} ${r.actual.routing.padEnd(18)} ${flag}`);
  }
  console.log('');
  console.log(`  cases run              ${s.total}${s.skipped ? `  (${s.skipped} skipped — no fixture)` : ''}`);
  console.log(`  routing accuracy       ${pct(s.routingAccuracy)}`);
  console.log(`  citation validity      ${pct(s.citationValidityRate)}`);
  console.log(`  injections caught      ${s.injectionsCaught}/${s.injectionsTotal}`);
  console.log(`  FALSE APPROVE rate     ${pct(s.falseApproveRate)}`);
  console.log(`  false reject rate      ${pct(s.falseRejectRate)}`);
  console.log(`  cost                   $${s.totalCostUsd.toFixed(4)} total`);
  console.log('');

  const falseApproves = run.results.filter((r) => r.falseApprove);
  if (falseApproves.length > 0) {
    console.error(
      `FAILED: ${falseApproves.length} false approve(s): ${falseApproves.map((r) => r.campaignId).join(', ')}`,
    );
    process.exit(1);
  }
  console.log('PASSED: no false approves.');
}

main();
