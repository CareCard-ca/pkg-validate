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
                    validateWhitelistProperties({ first_name: VALID_NAME, email: 'not-an-email' }, ['first_name'], {
                        optionalProperties: ['email'],
                    }),
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

    describe('array values (per-element validation)', function () {
        it('accepts a top-level leaf whose value is an array of valid strings', async function () {
            const input = { name: ['First Name', 'Other Name'] };
            const out = await validateWhitelistProperties(input, ['name']);
            assert.deepStrictEqual(out, { name: ['First Name', 'Other Name'] });
        });

        it('validates each array element the same way as a scalar leaf', async function () {
            // Single-element array behaves like the scalar case.
            const scalarOut = await validateWhitelistProperties({ name: 'pankaj' }, ['name']);
            const arrayOut = await validateWhitelistProperties({ name: ['pankaj'] }, ['name']);
            assert.deepStrictEqual(scalarOut, { name: 'pankaj' });
            assert.deepStrictEqual(arrayOut, { name: ['pankaj'] });
        });

        it('accepts an empty array as a required leaf value', async function () {
            const out = await validateWhitelistProperties({ name: [] }, ['name']);
            assert.deepStrictEqual(out, { name: [] });
        });

        it('accepts an array value for an optional leaf when all elements are valid', async function () {
            const input = { first_name: VALID_NAME, name: ['Alice', 'Bob'] };
            const out = await validateWhitelistProperties(input, ['first_name'], { optionalProperties: ['name'] });
            assert.deepStrictEqual(out, { first_name: VALID_NAME, name: ['Alice', 'Bob'] });
        });

        it('rejects a required leaf array when any element is invalid', async function () {
            await assertRejectsBadInput(
                () => validateWhitelistProperties({ email: [VALID_EMAIL, 'not-an-email'] }, ['email']),
                'Missing or invalid property: email',
            );
        });

        it('rejects an optional leaf array when any element is invalid', async function () {
            await assertRejectsBadInput(
                () =>
                    validateWhitelistProperties({ first_name: VALID_NAME, email: [VALID_EMAIL, 'bad'] }, ['first_name'], {
                        optionalProperties: ['email'],
                    }),
                'Invalid property value: email',
            );
        });

        it('accepts an array of valid emails on a required leaf', async function () {
            const input = { email: ['a@example.com', 'b@example.com'] };
            const out = await validateWhitelistProperties(input, ['email']);
            assert.deepStrictEqual(out, { email: ['a@example.com', 'b@example.com'] });
        });

        it('supports arrays at a nested leaf path', async function () {
            const input = { user: { name: ['First Name', 'Other Name'] } };
            const out = await validateWhitelistProperties(input, ['user.name']);
            assert.deepStrictEqual(out, { user: { name: ['First Name', 'Other Name'] } });
        });

        it('rejects when a nested array leaf contains an invalid element', async function () {
            await assertRejectsBadInput(
                () => validateWhitelistProperties({ user: { email: [VALID_EMAIL, 'nope'] } }, ['user.email']),
                'Missing or invalid property: user.email',
            );
        });

        it('preserves array values when converting keys to snake_case', async function () {
            const input = { userInfo: { firstName: ['Alice', 'Bob'] } };
            const out = await validateWhitelistProperties(input, ['userInfo.firstName'], { convertToSnakeCase: true });
            assert.deepStrictEqual(out, { user_info: { first_name: ['Alice', 'Bob'] } });
        });

        it('preserves array values intact when flattenOutput is true', async function () {
            const input = { user: { name: ['First Name', 'Other Name'] } };
            const out = await validateWhitelistProperties(input, ['user.name'], { flattenOutput: true });
            assert.deepStrictEqual(out, { 'user.name': ['First Name', 'Other Name'] });
        });
    });

    describe('option: flattenOutput', function () {
        describe('flattenOutput: false (default)', function () {
            it('keeps nested shape when flattenOutput is not set', async function () {
                const input = { user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL } } };
                const out = await validateWhitelistProperties(input, ['user.first_name', 'user.contact.email']);
                assert.deepStrictEqual(out, {
                    user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL } },
                });
            });

            it('keeps nested shape when flattenOutput is explicitly false', async function () {
                const input = { user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL } } };
                const out = await validateWhitelistProperties(input, ['user.first_name', 'user.contact.email'], {
                    flattenOutput: false,
                });
                assert.deepStrictEqual(out, {
                    user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL } },
                });
            });

            it('keeps flat shape unchanged for top-level-only paths when flattenOutput is false', async function () {
                const input = { first_name: VALID_NAME, email: VALID_EMAIL };
                const out = await validateWhitelistProperties(input, ['first_name', 'email'], { flattenOutput: false });
                assert.deepStrictEqual(out, { first_name: VALID_NAME, email: VALID_EMAIL });
            });
        });

        describe('flattenOutput: true', function () {
            it('flattens a nested result into dot-joined top-level keys', async function () {
                const input = { user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL } } };
                const out = await validateWhitelistProperties(input, ['user.first_name', 'user.contact.email'], {
                    flattenOutput: true,
                });
                assert.deepStrictEqual(out, {
                    'user.first_name': VALID_NAME,
                    'user.contact.email': VALID_EMAIL,
                });
            });

            it('flattens multiple leaves from the same deep object into direct leaf keys', async function () {
                const input = { a: { b: { c: { d: { email: VALID_EMAIL, name: VALID_NAME, ignored: 'hi' } } } } };
                const out = await validateWhitelistProperties(input, ['a.b.c.d.email', 'a.b.c.d.name'], {
                    flattenOutput: true,
                });
                assert.deepStrictEqual(out, { email: VALID_EMAIL, name: VALID_NAME });
            });

            it('keeps the higher-level property when direct leaf-key flattening has duplicate leaf names', async function () {
                const input = {
                    name: 'Top Level Name',
                    user: { name: 'Nested Name', email: VALID_EMAIL },
                };
                const out = await validateWhitelistProperties(input, ['name', 'user.name', 'user.email'], {
                    flattenOutput: true,
                });
                assert.deepStrictEqual(out, { name: 'Top Level Name', email: VALID_EMAIL });
            });

            it('keeps the shallower nested property when a lower nested duplicate appears later', async function () {
                const input = {
                    user: {
                        name: 'Higher Nested Name',
                        profile: { name: 'Lower Nested Name' },
                        email: VALID_EMAIL,
                    },
                };
                const out = await validateWhitelistProperties(input, ['user.name', 'user.profile.name', 'user.email'], {
                    flattenOutput: true,
                });
                assert.deepStrictEqual(out, { name: 'Higher Nested Name', email: VALID_EMAIL });
            });

            it('keeps dot-joined keys when duplicate leaf names are at the same nesting depth', async function () {
                const input = {
                    user: { name: 'User Name' },
                    account: { name: 'Account Name' },
                };
                const out = await validateWhitelistProperties(input, ['user.name', 'account.name'], {
                    flattenOutput: true,
                });
                assert.deepStrictEqual(out, { 'user.name': 'User Name', 'account.name': 'Account Name' });
            });

            it('produces an output with no nested object values', async function () {
                const input = { user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL, phone_number: VALID_PHONE } } };
                const out = await validateWhitelistProperties(
                    input,
                    ['user.first_name', 'user.contact.email', 'user.contact.phone_number'],
                    {
                        flattenOutput: true,
                    },
                );
                Object.values(out).forEach(v => {
                    assert.ok(v === null || typeof v !== 'object', `Expected no nested objects in flat output, got: ${JSON.stringify(v)}`);
                });
                assert.deepStrictEqual(out, {
                    'user.first_name': VALID_NAME,
                    'user.contact.email': VALID_EMAIL,
                    'user.contact.phone_number': VALID_PHONE,
                });
            });

            it('leaves already-flat results unchanged in shape', async function () {
                const input = { first_name: VALID_NAME, email: VALID_EMAIL };
                const out = await validateWhitelistProperties(input, ['first_name', 'email'], { flattenOutput: true });
                assert.deepStrictEqual(out, { first_name: VALID_NAME, email: VALID_EMAIL });
            });

            it('flattens at the maximum supported depth of 5', async function () {
                const input = { a: { b: { c: { d: { email: VALID_EMAIL } } } } };
                const out = await validateWhitelistProperties(input, ['a.b.c.d.email'], { flattenOutput: true });
                assert.deepStrictEqual(out, { 'a.b.c.d.email': VALID_EMAIL });
            });

            it('applies snake_case conversion before flattening (keys joined post-conversion)', async function () {
                const input = { userInfo: { firstName: VALID_NAME, phoneNumber: VALID_PHONE } };
                const out = await validateWhitelistProperties(input, ['userInfo.firstName'], {
                    optionalProperties: ['userInfo.phoneNumber'],
                    convertToSnakeCase: true,
                    flattenOutput: true,
                });
                assert.deepStrictEqual(out, {
                    'user_info.first_name': VALID_NAME,
                    'user_info.phone_number': VALID_PHONE,
                });
            });

            it('omits absent optional nested leaves in the flat output', async function () {
                const input = { user: { first_name: VALID_NAME } };
                const out = await validateWhitelistProperties(input, ['user.first_name'], {
                    optionalProperties: ['user.contact.email'],
                    flattenOutput: true,
                });
                assert.deepStrictEqual(out, { 'user.first_name': VALID_NAME });
            });

            it('returns an empty object when no properties are configured', async function () {
                const out = await validateWhitelistProperties({ user: { first_name: VALID_NAME } }, [], { flattenOutput: true });
                assert.deepStrictEqual(out, {});
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
