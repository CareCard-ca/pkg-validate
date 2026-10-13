'use strict';

const assert = require('assert').strict;
const { describe, it } = require('mocha');

const { isValidTimestampString, isValidTimestampzString } = require('../index');

describe('validation edge cases', function () {
  it('rejects impossible calendar timestamps at the public validator boundary', function () {
    assert.strictEqual(isValidTimestampzString('2023-02-29T10:00:00Z'), false);
    assert.strictEqual(isValidTimestampzString('2024-02-29T10:00:00Z'), true);
    assert.strictEqual(isValidTimestampzString('1900-02-29T10:00:00Z'), false);
    assert.strictEqual(isValidTimestampzString('2000-02-29T10:00:00Z'), true);
    assert.strictEqual(isValidTimestampString('2023-02-29T10:00:00'), false);
    assert.strictEqual(isValidTimestampString('2024-02-29T10:00:00'), true);
  });
});
