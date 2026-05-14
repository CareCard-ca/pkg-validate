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
        `Expected userMessage to include "${expectedFragment}", got: "${err.userMessage}"`,
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
      await assertRejectsBadInput(() => validateWhitelistProperties({}, ['first_name']), 'Missing or invalid property: first_name');
    });

    it('rejects when a required property is present but has an invalid value', async function () {
      await assertRejectsBadInput(
        () => validateWhitelistProperties({ email: 'not-an-email' }, ['email']),
        'Missing or invalid property: email',
      );
    });

    it('rejects when a provided optional property has an invalid value', async function () {
      await assertRejectsBadInput(
        () =>
          validateWhitelistProperties({ first_name: VALID_NAME, email: 'not-an-email' }, ['first_name'], { optionalProperties: ['email'] }),
        'Invalid property value: email',
      );
    });

    it('rejects when input is null and a required property is configured', async function () {
      await assertRejectsBadInput(() => validateWhitelistProperties(null, ['first_name']), 'Missing or invalid property: first_name');
    });

    it('throws an Error whose code is BAD_INPUT', async function () {
      const err = await assertRejectsBadInput(() => validateWhitelistProperties({}, ['email']));
      assert.ok(err instanceof Error);
      assert.strictEqual(err.code, 'BAD_INPUT');
    });
  });

  describe('nested objects (dot-notation leaf paths)', function () {
    it('extracts a single nested required leaf and rebuilds the nested shape', async function () {
      const input = {
        user: { first_name: VALID_NAME, ignored: 'x' },
        unrelated: 1,
      };
      const out = await validateWhitelistProperties(input, ['user.first_name']);
      assert.deepStrictEqual(out, { user: { first_name: VALID_NAME } });
    });

    it('extracts multiple nested required leaves across different branches', async function () {
      const input = {
        user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL } },
      };
      const out = await validateWhitelistProperties(input, ['user.first_name', 'user.contact.email']);
      assert.deepStrictEqual(out, {
        user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL } },
      });
    });

    it('supports nested optional leaves when present', async function () {
      const input = { user: { first_name: VALID_NAME, contact: { phone_number: VALID_PHONE } } };
      const out = await validateWhitelistProperties(input, ['user.first_name'], {
        optionalProperties: ['user.contact.phone_number'],
      });
      assert.deepStrictEqual(out, {
        user: { first_name: VALID_NAME, contact: { phone_number: VALID_PHONE } },
      });
    });

    it('omits absent nested optional leaves', async function () {
      const input = { user: { first_name: VALID_NAME } };
      const out = await validateWhitelistProperties(input, ['user.first_name'], {
        optionalProperties: ['user.contact.phone_number'],
      });
      assert.deepStrictEqual(out, { user: { first_name: VALID_NAME } });
    });

    it('supports the maximum nesting depth of 5 levels', async function () {
      const input = { a: { b: { c: { d: { email: VALID_EMAIL } } } } };
      const out = await validateWhitelistProperties(input, ['a.b.c.d.email']);
      assert.deepStrictEqual(out, { a: { b: { c: { d: { email: VALID_EMAIL } } } } });
    });

    it('converts nested keys to snake_case when convertToSnakeCase is true', async function () {
      const input = { userInfo: { firstName: VALID_NAME, phoneNumber: VALID_PHONE } };
      const out = await validateWhitelistProperties(input, ['userInfo.firstName'], {
        optionalProperties: ['userInfo.phoneNumber'],
        convertToSnakeCase: true,
      });
      assert.deepStrictEqual(out, { user_info: { first_name: VALID_NAME, phone_number: VALID_PHONE } });
    });

    it('rejects when a nested required leaf is missing (leaf absent)', async function () {
      await assertRejectsBadInput(
        () => validateWhitelistProperties({ user: {} }, ['user.first_name']),
        'Missing or invalid property: user.first_name',
      );
    });

    it('rejects when an intermediate node on the required path is missing', async function () {
      await assertRejectsBadInput(
        () => validateWhitelistProperties({}, ['user.first_name']),
        'Missing or invalid property: user.first_name',
      );
    });

    it('rejects when an intermediate node on the required path is not an object', async function () {
      await assertRejectsBadInput(
        () => validateWhitelistProperties({ user: 'not-an-object' }, ['user.first_name']),
        'Missing or invalid property: user.first_name',
      );
    });

    it('rejects when a nested required leaf has an invalid value', async function () {
      await assertRejectsBadInput(
        () => validateWhitelistProperties({ user: { email: 'not-an-email' } }, ['user.email']),
        'Missing or invalid property: user.email',
      );
    });

    it('rejects when a provided nested optional leaf has an invalid value', async function () {
      await assertRejectsBadInput(
        () =>
          validateWhitelistProperties({ user: { first_name: VALID_NAME, email: 'bad' } }, ['user.first_name'], {
            optionalProperties: ['user.email'],
          }),
        'Invalid property value: user.email',
      );
    });

    it('drops sibling properties not listed in the whitelist at any nesting level', async function () {
      const input = {
        user: {
          first_name: VALID_NAME,
          secret: 'should be stripped',
          contact: { email: VALID_EMAIL, password: 'Pa$$w0rd1' },
        },
      };
      const out = await validateWhitelistProperties(input, ['user.first_name', 'user.contact.email']);
      assert.deepStrictEqual(out, {
        user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL } },
      });
    });
  });

  describe('limits: MAX_NESTING_DEPTH (5)', function () {
    const mod = require('../lib/validateWhitelistProperties');

    it('exposes MAX_NESTING_DEPTH = 5 on the module', function () {
      assert.strictEqual(mod.MAX_NESTING_DEPTH, 5);
    });

    it('accepts a required path at exactly the maximum depth of 5', async function () {
      const input = { a: { b: { c: { d: { email: VALID_EMAIL } } } } };
      const out = await validateWhitelistProperties(input, ['a.b.c.d.email']);
      assert.deepStrictEqual(out, { a: { b: { c: { d: { email: VALID_EMAIL } } } } });
    });

    it('accepts an optional path at exactly the maximum depth of 5', async function () {
      const input = { a: { b: { c: { d: { email: VALID_EMAIL } } } } };
      const out = await validateWhitelistProperties(input, [], { optionalProperties: ['a.b.c.d.email'] });
      assert.deepStrictEqual(out, { a: { b: { c: { d: { email: VALID_EMAIL } } } } });
    });

    it('rejects when a required path exceeds the maximum nesting depth of 5', async function () {
      await assertRejectsBadInput(() => validateWhitelistProperties({}, ['a.b.c.d.e.f']), 'exceeds maximum nesting depth of 5');
    });

    it('rejects when an optional path exceeds the maximum nesting depth of 5', async function () {
      await assertRejectsBadInput(
        () => validateWhitelistProperties({}, [], { optionalProperties: ['a.b.c.d.e.f'] }),
        'exceeds maximum nesting depth of 5',
      );
    });
  });

  describe('limits: MAX_KEYS_PER_CALL (5000)', function () {
    const MAX = 5000;
    const mod = require('../lib/validateWhitelistProperties');

    it('exposes MAX_KEYS_PER_CALL = 5000 on the module', function () {
      assert.strictEqual(mod.MAX_KEYS_PER_CALL, 5000);
    });

    it('accepts when requiredProperties.length equals exactly 5000', async function () {
      const required = new Array(MAX).fill('first_name');
      const out = await validateWhitelistProperties({ first_name: VALID_NAME }, required);
      assert.deepStrictEqual(out, { first_name: VALID_NAME });
    });

    it('accepts when required + optional equals exactly 5000', async function () {
      const required = ['first_name'];
      const optional = new Array(MAX - 1).fill('phone_number');
      const out = await validateWhitelistProperties({ first_name: VALID_NAME, phone_number: VALID_PHONE }, required, {
        optionalProperties: optional,
      });
      assert.deepStrictEqual(out, { first_name: VALID_NAME, phone_number: VALID_PHONE });
    });

    it('rejects when combined required + optional exceeds 5000', async function () {
      const required = new Array(MAX).fill('first_name');
      const optional = ['phone_number']; // 5000 + 1 = 5001
      await assertRejectsBadInput(
        () =>
          validateWhitelistProperties({ first_name: VALID_NAME }, required, {
            optionalProperties: optional,
          }),
        'Too many properties to validate: 5001 (maximum 5000)',
      );
    });

    it('rejects when requiredProperties alone exceeds 5000', async function () {
      const required = new Array(MAX + 1).fill('first_name');
      await assertRejectsBadInput(
        () => validateWhitelistProperties({ first_name: VALID_NAME }, required),
        'Too many properties to validate: 5001 (maximum 5000)',
      );
    });

    it('rejects when optionalProperties alone exceeds 5000', async function () {
      const optional = new Array(MAX + 1).fill('first_name');
      await assertRejectsBadInput(
        () => validateWhitelistProperties({ first_name: VALID_NAME }, [], { optionalProperties: optional }),
        'Too many properties to validate: 5001 (maximum 5000)',
      );
    });
  });
});
