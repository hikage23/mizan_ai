export default function EvalsLoading() {
  return (
    <div className="shell" aria-busy="true" aria-label="Loading evaluation replay">
      <div className="eyebrow">Evaluation</div>
      <h1>Replaying the recorded cases…</h1>
      <p className="lede">Running span verification, deterministic checks, scoring, and routing.</p>
      <div className="replay-card" style={{ marginTop: 24 }}>
        <div className="replay-status replay-status-running">
          <span className="replay-pulse" aria-hidden="true" />
          Loading the seeded fixture bundle
        </div>
      </div>
    </div>
  );
}
