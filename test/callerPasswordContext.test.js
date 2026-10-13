'use strict';
const assert = require('node:assert/strict');
const { describe, it } = require('mocha');
const { isCommonPassword, validatePasswordAgainstPolicy } = require('..');
describe('caller-owned password context', () => {
  it('lets the caller decide whether its contextual word is blocked', () => {
    const contextualWord = 'carecardcarecard';
    const policy = { minimumLength: 1, maximumLength: 50, isBlocked: isCommonPassword };
    assert.equal(isCommonPassword(contextualWord), false);
    assert.deepEqual(validatePasswordAgainstPolicy(contextualWord, policy), {
      isValid: true,
      value: contextualWord,
    });
    assert.deepEqual(
      validatePasswordAgainstPolicy(contextualWord, {
        ...policy,
        isBlocked: value => value === contextualWord || isCommonPassword(value),
      }),
      { isValid: false, reason: 'blocked' },
    );
  });
});
