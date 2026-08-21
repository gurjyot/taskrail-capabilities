import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('capability publication targets TaskRail 3 contract', () => {
  const c = JSON.parse(fs.readFileSync('capabilities/http-health-check/capability.json','utf8'));
  assert.equal(c.taskrailCompatibility, '3.0.x');
  assert.equal(c.runtime, 'node');
  assert.equal(c.canonicalPath, 'index.mjs');
  assert.ok(Array.isArray(c.operations) && c.operations.length > 0);
  assert.equal(c.authorization.mutation, 'denied');
});
