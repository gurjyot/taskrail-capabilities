# postgres-health

Read-only database pressure and timestamped freshness backup restore evidence.

## Contract

`inspect({client, timeoutMs=5000})` requires an exclusive connected client, with caller-enforced connect/socket deadlines. Executes a read-only transaction, local statement/lock timeouts and fixed metadata query, then rolls back. Use a least-privilege monitoring role. Probe failure returns unknown, with no raw error payload. No client rows are collected.

`assessEvidence({probe, maxConnectionRatio=.8, maxLatencyMs=1000, freshness?, backup?, now?})` reports healthy/degraded/stale/unknown. Timestamp evidence uses `{observedAt,maxAgeMs,success?}`. Backup may include restore evidence with the same shape. Missing restore proof remains unknown. Thresholds belong to callers. The caller must acquire and release clients safely and supply explicit evidence freshness.

## Verification

Run `node --test test/*.test.mjs` in this capability. Deterministic adapter tests exercise contract behavior. External provider and production state validation are separate.
