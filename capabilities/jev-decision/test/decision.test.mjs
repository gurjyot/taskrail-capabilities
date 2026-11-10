import test from "node:test";
import assert from "node:assert/strict";
import { decide } from "../index.mjs";
const input = {
  state: { blocked: 2 },
  question: "Choose urgency",
  choices: ["high", "low"],
};
test("typed decision gates confidence and rejects unknown choices", async () => {
  assert.equal(
    (
      await decide({
        ...input,
        evaluate: async () => ({ choice: "high", confidence: 0.99 }),
      })
    ).status,
    "decided",
  );
  assert.equal(
    (
      await decide({
        ...input,
        evaluate: async () => ({ choice: "high", confidence: 0.4 }),
      })
    ).status,
    "review",
  );
  assert.equal(
    (
      await decide({
        ...input,
        evaluate: async () => ({ choice: "oops", confidence: 0.99 }),
      })
    ).status,
    "unknown",
  );
});
test("transport failure is unknown without exposing error text", async () => {
  const result = await decide({
    ...input,
    evaluate: async () => {
      throw new Error("secret");
    },
  });
  assert.equal(result.status, "unknown");
  assert.ok(!JSON.stringify(result).includes("secret"));
});

test("official transport uses Choice envelope and fixed endpoint", async () => {
  const { createJevEvaluator } = await import("../index.mjs");
  const evaluate = createJevEvaluator({
    apiKey: "fixture",
    fetchImpl: async (url, options) => {
      assert.equal(url, "https://api.typesafe.ai/v1/systemone");
      assert.equal(options.redirect, "error");
      const body = JSON.parse(options.body);
      assert.equal(body.questions.decision.type, "choice");
      return new Response(
        JSON.stringify({
          answers: { decision: { choice: "high", confidence: 0.99 } },
        }),
      );
    },
  });
  assert.equal((await decide({ ...input, evaluate })).status, "decided");
});
test("atomic reservations limit concurrent calls and preserve failures", async () => {
  const { createBudgetedEvaluator } = await import("../index.mjs");
  const claims = new Set();
  let calls = 0;
  const store = {
    async claim(scope, key) {
      const name = scope + key;
      if (claims.has(name)) return { claimed: false };
      claims.add(name);
      return { claimed: true };
    },
  };
  const options = {
    evaluate: async () => {
      calls++;
      return { choice: "high", confidence: 0.99 };
    },
    store,
    automation: "fixture",
    maxDailyCalls: 2,
    maxDailyUsd: 0.1,
    maxRequestUsd: 0.05,
    now: () => new Date("2026-01-01T00:00:00Z"),
  };
  const evaluate = createBudgetedEvaluator(options);
  const results = await Promise.all(
    Array.from({ length: 8 }, () => decide({ ...input, evaluate })),
  );
  assert.equal(calls, 2);
  assert.equal(results.filter((x) => x.status === "blocked").length, 6);
  const restarted = createBudgetedEvaluator(options);
  assert.equal(
    (await decide({ ...input, evaluate: restarted })).status,
    "blocked",
  );
  const tomorrow = createBudgetedEvaluator({
    ...options,
    now: () => new Date("2026-01-02T00:00:00Z"),
  });
  assert.equal(
    (await decide({ ...input, evaluate: tomorrow })).status,
    "decided",
  );
});
