export const probeSql = `SELECT current_database() AS database,
 (SELECT count(*)::int FROM pg_stat_activity) AS connections,
 current_setting('max_connections')::int AS max_connections,
 (SELECT count(*)::int FROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid)) > 0) AS blocked_queries,
 (SELECT count(*)::int FROM pg_stat_activity WHERE state = 'idle in transaction' AND xact_start < now() - interval '5 minutes') AS idle_transactions`;

export async function inspect({ client, timeoutMs = 5000, now = () => new Date() }) {
  if (!client || typeof client.query !== 'function') throw new Error('Connected exclusive PostgreSQL client required');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 30000) throw new Error('timeoutMs must be 100..30000');
  const observedAt = now().toISOString();
  const started = performance.now();
  let transaction = false;
  try {
    await client.query('BEGIN READ ONLY');
    transaction = true;
    await client.query("SELECT set_config('statement_timeout', $1, true), set_config('lock_timeout', $1, true)", [String(timeoutMs)]);
    const result = await client.query(probeSql);
    await client.query('ROLLBACK');
    transaction = false;
    const metrics = result?.rows?.[0];
    if (!metrics || !Number.isFinite(Number(metrics.connections)) || Number(metrics.max_connections) <= 0) throw new Error('Invalid metrics');
    return { status: 'healthy', observedAt, source: 'postgres', latencyMs: Math.round(performance.now() - started), metrics };
  } catch {
    if (transaction) await client.query('ROLLBACK').catch(() => {});
    return { status: 'unknown', observedAt, source: 'postgres', reason: 'Database probe failed or timed out' };
  }
}

export function assessEvidence({ probe, maxConnectionRatio = 0.8, maxLatencyMs = 1000, freshness, backup, now = new Date() }) {
  if (!(maxConnectionRatio > 0 && maxConnectionRatio <= 1) || !(maxLatencyMs > 0)) throw new Error('Invalid thresholds');
  const checks = [{ name: 'database', status: probe?.status === 'healthy' ? 'healthy' : 'unknown' }];
  if (probe?.status === 'healthy') {
    const m = probe.metrics;
    const degraded = Number(m.blocked_queries) > 0 || Number(m.idle_transactions) > 0 || Number(m.connections) / Number(m.max_connections) >= maxConnectionRatio || probe.latencyMs > maxLatencyMs;
    checks[0].status = degraded ? 'degraded' : 'healthy';
  }
  function timed(name, evidence) {
    if (!evidence) return;
    const timestamp = Date.parse(evidence.observedAt);
    const ageMs = now.getTime() - timestamp;
    let status = 'unknown';
    if (Number.isFinite(timestamp) && ageMs >= 0 && Number.isFinite(evidence.maxAgeMs) && evidence.maxAgeMs > 0) {
      status = ageMs > evidence.maxAgeMs ? 'stale' : 'healthy';
    }
    if (evidence.success === false && status === 'healthy') status = 'degraded';
    checks.push({ name, status, observedAt: evidence.observedAt ?? null });
  }
  timed('freshness', freshness);
  timed('backup', backup);
  if (backup) timed('restore', backup.restore ?? { observedAt: null });
  const status = ['unknown', 'stale', 'degraded'].find(state => checks.some(c => c.status === state)) ?? 'healthy';
  return { status, observedAt: now.toISOString(), source: 'postgres-health', checks, probe };
}
