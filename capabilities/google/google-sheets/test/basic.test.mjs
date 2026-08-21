import test from 'node:test';
import assert from 'node:assert/strict';
import * as cap from '../index.mjs';

test('google-sheets exports an executable contract', () => {
  assert.equal(typeof cap.run === 'function' || typeof cap.calculate === 'function' || typeof cap.detect === 'function', true);
});

test('google-sheets manifest requires explicit mutation authorization', async () => {
  const manifest = JSON.parse(await (await import('node:fs/promises')).readFile(new URL('../capability.json', import.meta.url), 'utf8'));
  assert.equal(manifest.authorization.mutation, 'explicit');
});
