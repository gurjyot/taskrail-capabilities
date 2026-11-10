import test from 'node:test';
import assert from 'node:assert/strict';
import * as capability from '../index.js';

test('multimodal-evidence loads and exposes its run contract', () => {
  assert.equal(typeof capability.run, 'function');
});
