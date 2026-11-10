export async function decide({ evaluate, state, question, choices, minimumConfidence = 0.9, timeoutMs = 5000 }) {
  if (typeof evaluate !== 'function') throw new Error('Authorized Jev transport required');
  if (typeof question !== 'string' || !question.trim() || !Array.isArray(choices) || choices.length < 2 || choices.length > 20 || choices.some(c => typeof c !== 'string' || !c) || new Set(choices).size !== choices.length) throw new Error('Bounded question and unique choices required');
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
  } catch {
    return { status: 'unknown', choice: null, confidence: null, source: 'jev' };
  } finally { clearTimeout(timer); }
}
