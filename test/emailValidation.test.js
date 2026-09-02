'use strict';

const assert = require('node:assert');
const { isEmailString, validateProperties } = require('..');

describe('public email validation', function () {
  const acceptedEmails = [
    'person@example.com',
    'first.last+tag@sub-domain.example.ca',
    'customer/department=shipping@example.com',
    'person@xn--bcher-kva.example',
    `${'a'.repeat(64)}@example.com`,
  ];
  const rejectedEmails = [
    '',
    ' person@example.com',
    'person@example.com ',
    'person@',
    'person@example',
    'person@example.123',
    '.person@example.com',
    'person.@example.com',
    'first..last@example.com',
    'person@-example.com',
    'person@example-.com',
    'person@example..com',
    'person@example_com',
    'person@[192.0.2.1]',
    '"person name"@example.com',
    'pérson@example.com',
    `a@${'b'.repeat(64)}.com`,
    `${'a'.repeat(65)}@example.com`,
    `${'a'.repeat(243)}@example.com`,
    123,
    null,
  ];

  for (const email of acceptedEmails) {
    it(`accepts ${email}`, function () {
      assert.strictEqual(isEmailString(email), true);
    });
  }

  for (const email of rejectedEmails) {
    it(`rejects ${String(email)}`, function () {
      assert.strictEqual(isEmailString(email), false);
    });
  }

  for (const key of [
    'email',
    'requested_by_email',
    'requestedByEmail',
    'approved_by_email',
    'approvedByEmail',
  ]) {
    it(`uses the email contract for ${key}`, function () {
      assert.deepStrictEqual(validateProperties({ [key]: 'invalid' }), {});
      assert.deepStrictEqual(validateProperties({ [key]: 'person@example.com' }), {
        [key]: 'person@example.com',
      });
    });
  }
});
