'use strict';

const assert = require('assert').strict;
const { describe, it } = require('mocha');

const {
  isValidTimestampString,
  isValidTimestampzString,
  validateNewUserRoleRequestObject,
} = require('../index');

describe('validation edge cases', function () {
  it('rejects impossible calendar timestamps at the public validator boundary', function () {
    assert.strictEqual(isValidTimestampzString('2023-02-29T10:00:00Z'), false);
    assert.strictEqual(isValidTimestampzString('2024-02-29T10:00:00Z'), true);
    assert.strictEqual(isValidTimestampzString('1900-02-29T10:00:00Z'), false);
    assert.strictEqual(isValidTimestampzString('2000-02-29T10:00:00Z'), true);
    assert.strictEqual(isValidTimestampString('2023-02-29T10:00:00'), false);
    assert.strictEqual(isValidTimestampString('2024-02-29T10:00:00'), true);
  });

  it('returns the canonical persisted role for accepted caller input', function () {
    const roleRequest = validateNewUserRoleRequestObject(
      { role: ' Student ' },
      { requireScope: false },
    );

    assert.strictEqual(roleRequest.role_name, 'student');
  });

  it('uses default options when a JavaScript caller passes null', function () {
    const roleRequest = validateNewUserRoleRequestObject(
      {
        institution_id: '2c76ea46-a212-4cc5-9031-a9a28d927c4c',
        campus_id: '3c76ea46-a212-4cc5-9031-a9a28d927c4c',
      },
      null,
    );

    assert.strictEqual(roleRequest.role_name, 'student');
  });
});
