'use strict';

const assert = require('assert').strict;
const { describe, it } = require('mocha');
const { validateWhitelistProperties } = require('../index');

const VALID_EMAIL = 'jane.doe@example.com';
const VALID_NAME = 'Jane';
const VALID_PHONE = '4165551234';

async function assertRejectsBadInput(thunk, expectedFragment) {
  try {
    const result = typeof thunk === 'function' ? thunk() : thunk;
    await result;
  } catch (err) {
    assert.strictEqual(err.code, 'BAD_INPUT', `Expected BAD_INPUT code, got: ${err.code}`);
    assert.strictEqual(err.message, 'Bad_Input');
    if (expectedFragment) {
      assert.ok(
        (err.userMessage || '').includes(expectedFragment),
        `Expected userMessage to include "${expectedFragment}", got: "${err.userMessage}"`
      );
    }
    return err;
  }
  assert.fail('Expected promise to reject with a BAD_INPUT error');
}

describe('validateWhitelistProperties', function () {
  describe('valid inputs', function () {
    it('returns a promise that resolves with only the whitelisted properties', async function () {
      const input = { first_name: VALID_NAME, email: VALID_EMAIL, extra: 'should be stripped' };
      const out = await validateWhitelistProperties(input, ['first_name', 'email']);
      assert.deepStrictEqual(out, { first_name: VALID_NAME, email: VALID_EMAIL });
    });

    it('accepts optional properties when provided and valid', async function () {
      const input = { first_name: VALID_NAME, phone_number: VALID_PHONE };
      const out = await validateWhitelistProperties(input, ['first_name'], {
        optionalProperties: ['phone_number'],
      });
      assert.deepStrictEqual(out, { first_name: VALID_NAME, phone_number: VALID_PHONE });
    });

    it('omits optional properties that are absent from the input', async function () {
      const input = { first_name: VALID_NAME };
      const out = await validateWhitelistProperties(input, ['first_name'], {
        optionalProperties: ['phone_number'],
      });
      assert.deepStrictEqual(out, { first_name: VALID_NAME });
    });

    it('drops unknown properties not in the whitelist', async function () {
      const input = { first_name: VALID_NAME, password: 'Pa$$w0rd1', __proto__pollute: true };
      const out = await validateWhitelistProperties(input, ['first_name']);
      assert.deepStrictEqual(out, { first_name: VALID_NAME });
    });

    it('returns an empty object when no whitelisted properties are configured', async function () {
      const out = await validateWhitelistProperties({ anything: 1 }, []);
      assert.deepStrictEqual(out, {});
    });

    it('converts keys to snake_case when convertToSnakeCase is true', async function () {
      const input = { firstName: VALID_NAME, phoneNumber: VALID_PHONE };
      const out = await validateWhitelistProperties(input, ['firstName'], {
        optionalProperties: ['phoneNumber'],
        convertToSnakeCase: true,
      });
      assert.deepStrictEqual(out, { first_name: VALID_NAME, phone_number: VALID_PHONE });
    });

    it('returns a Promise', function () {
      const result = validateWhitelistProperties({ first_name: VALID_NAME }, ['first_name']);
      assert.ok(result && typeof result.then === 'function', 'Expected a thenable Promise');
      return result;
    });

    it('works without an options argument', async function () {
      const out = await validateWhitelistProperties({ first_name: VALID_NAME }, ['first_name']);
      assert.deepStrictEqual(out, { first_name: VALID_NAME });
    });
  });

  describe('invalid inputs', function () {
    it('rejects when a required property is missing from input', async function () {
      await assertRejectsBadInput(
        () => validateWhitelistProperties({}, ['first_name']),
        'Missing or invalid property: first_name'
      );
    });

    it('rejects when a required property is present but has an invalid value', async function () {
      await assertRejectsBadInput(
        () => validateWhitelistProperties({ email: 'not-an-email' }, ['email']),
        'Missing or invalid property: email'
      );
    });

    it('rejects when a provided optional property has an invalid value', async function () {
      await assertRejectsBadInput(
        () =>
          validateWhitelistProperties(
            { first_name: VALID_NAME, email: 'not-an-email' },
            ['first_name'],
            { optionalProperties: ['email'] }
          ),
        'Invalid property value: email'
      );
    });

    it('rejects when input is null and a required property is configured', async function () {
      await assertRejectsBadInput(
        () => validateWhitelistProperties(null, ['first_name']),
        'Missing or invalid property: first_name'
      );
    });

    it('throws an Error whose code is BAD_INPUT', async function () {
      const err = await assertRejectsBadInput(() => validateWhitelistProperties({}, ['email']));
      assert.ok(err instanceof Error);
      assert.strictEqual(err.code, 'BAD_INPUT');
    });
  });
});
