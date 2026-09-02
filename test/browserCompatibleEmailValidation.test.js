'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { describe, it } = require('mocha');

const browserCompatibleConsumerSource = String.raw`
  const assert = require('node:assert/strict');
  const { registerHooks } = require('node:module');

  registerHooks({
    resolve(specifier, context, nextResolve) {
      if (specifier === 'async_hooks' || specifier === 'node:async_hooks') {
        throw new Error('Server-only async_hooks is unavailable');
      }
      return nextResolve(specifier, context);
    },
  });

  const { isEmailString } = require('.');
  assert.equal(isEmailString('person@example.com'), true);
`;

// Pattern: Consumer Contract - executes the public package boundary without a server-only runtime.
function runBrowserCompatibleConsumer() {
  return spawnSync(process.execPath, ['--eval', browserCompatibleConsumerSource], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
}

describe('browser-compatible email validation', function () {
  it('loads the public email validator without server-only async context', function () {
    const result = runBrowserCompatibleConsumer();

    assert.strictEqual(result.status, 0, result.stderr || result.stdout);
  });
});
