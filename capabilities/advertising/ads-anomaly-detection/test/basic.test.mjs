import test from 'node:test';
import assert from 'node:assert/strict';
import * as cap from '../index.mjs';

test('ads-anomaly-detection exports an executable contract', () => {
  assert.equal(typeof cap.run === 'function' || typeof cap.calculate === 'function' || typeof cap.detect === 'function', true);
});
