# jev-decision

Typed confidence-gated judgment using an explicitly supplied authorized Jev transport.

## Contract

`decide({evaluate,state,question,choices,minimumConfidence=.9,timeoutMs=5000})` invokes an explicitly injected Jev transport returning `{choice,confidence}`. It passes AbortSignal. The transport owns SDK mapping, cancellation, credentials and redaction before sending state. At most 16k evidence characters, 2k question characters, 2..20 choices, 30s timeout. Returns decided/review/unknown. Choice/confidence are validated. No actions or DB queries are generated or executed. Provider integration remains opt-in and requires a real-provider evaluation before autonomous use.

## Verification

Run `node --test test/*.test.mjs` in this capability. Deterministic adapter tests exercise contract behavior. External provider and production state validation are separate.
