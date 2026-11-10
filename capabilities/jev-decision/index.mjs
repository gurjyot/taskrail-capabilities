export async function decide({ evaluate, state, question, choices, minimumConfidence = 0.9, timeoutMs = 5000 }) {
  if (typeof evaluate !== 'function') throw new Error('Authorized Jev transport required');
  if (typeof question !== 'string' || !question.trim() || !Array.isArray(choices) || choices.length < 2 || choices.length > 20 || choices.some(c => typeof c !== 'string' || !c || c.length > 200) || new Set(choices).size !== choices.length) throw new Error('Bounded question and unique choices required');
  if (!(minimumConfidence >= 0 && minimumConfidence <= 1) || !Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 30000) throw new Error('Invalid decision limits');
  const encoded = JSON.stringify(state);
  if (!encoded || encoded.length > 16000 || question.length > 2000) throw new Error('Decision evidence exceeds limit');
  const controller = new AbortController();
  let timer;
  try {
    const response = await Promise.race([
      Promise.resolve().then(() => evaluate({ state, question, choices, signal: controller.signal })),
      new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error('timeout')); }, timeoutMs); }),
    ]);
    const { choice, confidence } = response ?? {};
    if (!choices.includes(choice) || !Number.isFinite(confidence) || confidence < 0 || confidence > 1) throw new Error('Invalid decision');
    return { status: confidence >= minimumConfidence ? 'decided' : 'review', choice, confidence, source: 'jev' };
  } catch (error) {
    if (error?.code === 'BUDGET_EXHAUSTED') return { status: 'blocked', reason: 'daily_budget_exhausted', choice: null, confidence: null, source: 'jev' };
    return { status: 'unknown', choice: null, confidence: null, source: 'jev' };
  } finally { clearTimeout(timer); }
}

export function createJevEvaluator({ apiKey, model = 'jev-latest', fetchImpl = fetch }) {
  if (typeof apiKey !== 'string' || !apiKey.trim()) throw new Error('Jev credential required');
  if (!/^[a-zA-Z0-9._-]{1,80}$/.test(model)) throw new Error('Invalid model');
  return async ({ state, question, choices, signal }) => {
    const response = await fetchImpl('https://api.typesafe.ai/v1/systemone', {
      method: 'POST', redirect: 'error', signal,
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, state, questions: { decision: { type: 'choice', instructions: question, criteria: Object.fromEntries(choices.map(choice => [choice, null])) } } }),
    });
    if (!response.ok) throw new Error('Jev request failed');
    const text = await response.text();
    if (text.length > 128000) throw new Error('Jev response exceeds limit');
    const result = JSON.parse(text);
    return { choice: result.answers?.decision?.choice, confidence: result.answers?.decision?.confidence };
  };
}

export function createBudgetedEvaluator({ evaluate, store, automation, maxDailyCalls = 20, maxDailyUsd = 1, maxRequestUsd = 0.05, now = () => new Date() }) {
  if (typeof evaluate !== 'function' || typeof store?.claim !== 'function' || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(automation)) throw new Error('Evaluator, atomic claim store and automation required');
  if (!Number.isInteger(maxDailyCalls) || maxDailyCalls < 1 || maxDailyCalls > 1000 || !Number.isFinite(maxDailyUsd) || !Number.isFinite(maxRequestUsd) || maxDailyUsd <= 0 || maxRequestUsd <= 0) throw new Error('Invalid budget');
  const dailyUnits = Math.floor(maxDailyUsd * 1_000_000);
  const requestUnits = Math.ceil(maxRequestUsd * 1_000_000);
  const slots = Math.min(maxDailyCalls, Math.floor(dailyUnits / requestUnits));
  if (!Number.isSafeInteger(dailyUnits) || !Number.isSafeInteger(requestUnits) || requestUnits < 1 || slots < 1) throw new Error('Budget cannot reserve one request');
  return async input => {
    const day = now().toISOString().slice(0, 10);
    for (let slot = 0; slot < slots; slot += 1) {
      const claim = await store.claim(`jev-budget:${automation}`, `${day}-${slot}`, { day, reservedMicroUsd: requestUnits });
      if (claim.claimed) return evaluate(input);
    }
    const error = new Error('Daily Jev budget exhausted');
    error.code = 'BUDGET_EXHAUSTED';
    throw error;
  };
}
