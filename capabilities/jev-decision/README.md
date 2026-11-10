# jev-decision

Typed confidence-gated judgment using an explicitly supplied authorized Jev transport.

## Contract

`decide({evaluate,state,question,choices,minimumConfidence=.9,timeoutMs=5000})` invokes an explicitly injected Jev transport returning `{choice,confidence}`. It passes AbortSignal. The transport owns SDK mapping, cancellation, credentials and redaction before sending state. At most 16k evidence characters, 2k question characters, 2..20 choices, 30s timeout. Returns decided/review/unknown. Choice/confidence are validated. No actions or DB queries are generated or executed. Provider integration remains opt-in and requires a real-provider evaluation before autonomous use.

## Verification

Run `node --test test/*.test.mjs` in this capability. Deterministic adapter tests exercise contract behavior. External provider and production state validation are separate.

## Provider and daily limits

`createJevEvaluator({apiKey,model="jev-latest",fetchImpl?})` uses TypeSafe's fixed HTTPS `/v1/systemone` endpoint and a typed Choice question. Redirects are denied. Only normalized choice/confidence is returned. Transport tests use recorded-schema mock responses. Real-provider validation awaits a credential. Official contract https://docs.typesafe.ai/api/system-one

`createBudgetedEvaluator({evaluate,store,automation,maxDailyCalls=20,maxDailyUsd=1,maxRequestUsd=.05,now?})` requires TaskRail's atomic `IdempotencyStore` or an equivalent durable atomic claim store. Each UTC-day request reserves one slot before network work. Calls, failures and timeouts consume slots conservatively. The first bound reached blocks subsequent calls and survives process restarts. Parallel callers atomically compete for slots. Automations have independent scopes. The wrapper makes at most 1000 claim attempts.

USD limits cover reservations based on a caller-configured worst-case request amount. They are not a provider billing measurement. Set that amount using the deployed model's pricing and bounded request size. The key alone never enables autonomous decisions. `decide` returns blocked/daily_budget_exhausted without another provider call after exhaustion.
