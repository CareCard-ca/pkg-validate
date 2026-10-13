'use strict';

const { normalizeInputWhitespace } = require('./inputWhitespace');
const commonPasswords = new Set(require('../data/commonPasswords.json'));

// Pattern: Predicate - exposes generic weak-password evidence without deciding caller policy.
function isCommonPassword(password) {
  return commonPasswords.has(password);
}

// Pattern: Configuration Guard - requires explicit length and optional blocking rules.
function assertPasswordPolicy(policy) {
  if (
    !policy ||
    !Number.isSafeInteger(policy.minimumLength) ||
    policy.minimumLength < 0 ||
    !Number.isSafeInteger(policy.maximumLength) ||
    policy.maximumLength < policy.minimumLength ||
    (policy.isBlocked !== undefined && typeof policy.isBlocked !== 'function')
  ) {
    throw new TypeError('An explicit valid password policy is required.');
  }
}

// Pattern: Configured Validation - applies the caller's policy to canonical password text.
function validatePasswordAgainstPolicy(password, policy) {
  assertPasswordPolicy(policy);
  if (typeof password !== 'string') {
    return { isValid: false, reason: 'invalid_type' };
  }
  if (!password.isWellFormed()) {
    return { isValid: false, reason: 'invalid_unicode' };
  }
  const value = normalizeInputWhitespace(password).normalize('NFC');
  const length = [...value].length;
  if (length < policy.minimumLength) {
    return { isValid: false, reason: 'too_short' };
  }
  if (length > policy.maximumLength) {
    return { isValid: false, reason: 'too_long' };
  }
  if (policy.isBlocked?.(value)) {
    return { isValid: false, reason: 'blocked' };
  }
  return { isValid: true, value };
}

module.exports = { isCommonPassword, validatePasswordAgainstPolicy };
