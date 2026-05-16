'use strict';

const assert = require('assert').strict;
const { describe, it } = require('mocha');
const { validateWhitelistProperties } = require('../index');
const validateWhitelistPropertiesModule = require('../lib/validateWhitelistProperties');

const VALID_EMAIL = 'jane.doe@example.com';
const VALID_NAME = 'Jane';
const VALID_PHONE = '4165551234';
const MAX_NESTING_DEPTH = 5;
const MAX_KEYS_PER_CALL = 5000;

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
    describe('promise API, defaults, and empty whitelists', function () {
        it('returns a Promise', function () {
            const result = validateWhitelistProperties({ first_name: VALID_NAME }, ['first_name']);
            assert.ok(result && typeof result.then === 'function', 'Expected a thenable Promise');
            return result;
        });

        it('works without an options argument', async function () {
            const out = await validateWhitelistProperties({ first_name: VALID_NAME }, ['first_name']);
            assert.deepStrictEqual(out, { first_name: VALID_NAME });
        });

        it('uses default requiredProperties = [] when called with only inputObject', async function () {
            const out = await validateWhitelistProperties({ first_name: VALID_NAME });
            assert.deepStrictEqual(out, {});
        });

        it('treats a null requiredProperties value as an empty required list', async function () {
            const out = await validateWhitelistProperties({ first_name: VALID_NAME }, null, {
                optionalProperties: ['first_name'],
            });
            assert.deepStrictEqual(out, { first_name: VALID_NAME });
        });

        it('treats an undefined requiredProperties value as an empty required list', async function () {
            const out = await validateWhitelistProperties({ first_name: VALID_NAME }, undefined, {
                optionalProperties: ['first_name'],
            });
            assert.deepStrictEqual(out, { first_name: VALID_NAME });
        });

        it('returns an empty object when no whitelisted properties are configured', async function () {
            const out = await validateWhitelistProperties({ anything: 1 }, []);
            assert.deepStrictEqual(out, {});
        });
    });

    describe('top-level whitelist extraction', function () {
        it('resolves with only the required whitelisted properties', async function () {
            const input = { first_name: VALID_NAME, email: VALID_EMAIL, extra: 'should be stripped' };
            const out = await validateWhitelistProperties(input, ['first_name', 'email']);
            assert.deepStrictEqual(out, { first_name: VALID_NAME, email: VALID_EMAIL });
        });

        it('includes optional properties when they are provided and valid', async function () {
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

        it('drops unknown properties that are not in the whitelist', async function () {
            const input = { first_name: VALID_NAME, password: 'Pa$$w0rd1', __proto__pollute: true };
            const out = await validateWhitelistProperties(input, ['first_name']);
            assert.deepStrictEqual(out, { first_name: VALID_NAME });
        });
    });

    describe('top-level validation errors', function () {
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

    describe('nested dot-notation paths', function () {
        describe('extracting and rebuilding nested output', function () {
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

            it('includes nested optional leaves when they are present and valid', async function () {
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

            it('supports a required nested path at the maximum depth of 5 levels', async function () {
                const input = { a: { b: { c: { d: { email: VALID_EMAIL } } } } };
                const out = await validateWhitelistProperties(input, ['a.b.c.d.email']);
                assert.deepStrictEqual(out, { a: { b: { c: { d: { email: VALID_EMAIL } } } } });
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

        describe('missing or invalid nested paths', function () {
            it('rejects when a nested required leaf is missing', async function () {
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

            it('rejects when a deep intermediate node is null on a required path', async function () {
                await assertRejectsBadInput(
                    () => validateWhitelistProperties({ a: { b: null } }, ['a.b.c.email']),
                    'Missing or invalid property: a.b.c.email',
                );
            });

            it('rejects when a deep intermediate node is a non-object on a required path', async function () {
                await assertRejectsBadInput(
                    () => validateWhitelistProperties({ a: { b: 'not-an-object' } }, ['a.b.c.email']),
                    'Missing or invalid property: a.b.c.email',
                );
            });

            it('omits an optional leaf when a deep intermediate node is null', async function () {
                const input = { first_name: VALID_NAME, a: { b: null } };
                const out = await validateWhitelistProperties(input, ['first_name'], {
                    optionalProperties: ['a.b.c.email'],
                });
                assert.deepStrictEqual(out, { first_name: VALID_NAME });
            });
        });
    });

    describe('array leaf values', function () {
        describe('valid array values', function () {
            it('accepts a top-level leaf whose value is an array of valid strings', async function () {
                const input = { name: ['First Name', 'Other Name'] };
                const out = await validateWhitelistProperties(input, ['name']);
                assert.deepStrictEqual(out, { name: ['First Name', 'Other Name'] });
            });

            it('validates each array element the same way as a scalar leaf', async function () {
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
        });

        describe('invalid array values', function () {
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

            it('rejects when a nested array leaf contains an invalid element', async function () {
                await assertRejectsBadInput(
                    () => validateWhitelistProperties({ user: { email: [VALID_EMAIL, 'nope'] } }, ['user.email']),
                    'Missing or invalid property: user.email',
                );
            });
        });

        describe('array values with output transformations', function () {
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
    });

    describe('snake_case and camelCase path matching', function () {
        describe('top-level path matching', function () {
            it('accepts a camelCase whitelist matching a snake_case input key', async function () {
                const input = { first_name: VALID_NAME, phone_number: VALID_PHONE };
                const out = await validateWhitelistProperties(input, ['firstName'], {
                    optionalProperties: ['phoneNumber'],
                });
                assert.deepStrictEqual(out, { firstName: VALID_NAME, phoneNumber: VALID_PHONE });
            });

            it('accepts a snake_case whitelist matching a camelCase input key', async function () {
                const input = { firstName: VALID_NAME, phoneNumber: VALID_PHONE };
                const out = await validateWhitelistProperties(input, ['first_name'], {
                    optionalProperties: ['phone_number'],
                });
                assert.deepStrictEqual(out, { first_name: VALID_NAME, phone_number: VALID_PHONE });
            });

            it('matches when both whitelist and input use the same camelCase form', async function () {
                const input = { firstName: VALID_NAME };
                const out = await validateWhitelistProperties(input, ['firstName']);
                assert.deepStrictEqual(out, { firstName: VALID_NAME });
            });

            it('matches when both whitelist and input use the same snake_case form', async function () {
                const input = { first_name: VALID_NAME };
                const out = await validateWhitelistProperties(input, ['first_name']);
                assert.deepStrictEqual(out, { first_name: VALID_NAME });
            });

            it('prefers the exact form when both forms are present on the input', async function () {
                const input = { firstName: 'Alice', first_name: 'Bob' };
                const out = await validateWhitelistProperties(input, ['firstName']);
                assert.deepStrictEqual(out, { firstName: 'Alice' });
            });

            it('rejects when the alternate-case key is also absent from the input', async function () {
                await assertRejectsBadInput(() => validateWhitelistProperties({}, ['firstName']), 'Missing or invalid property: firstName');
            });
        });

        describe('nested path matching', function () {
            it('accepts a nested camelCase whitelist matching nested snake_case input keys', async function () {
                const input = { user_info: { first_name: VALID_NAME, phone_number: VALID_PHONE } };
                const out = await validateWhitelistProperties(input, ['userInfo.firstName'], {
                    optionalProperties: ['userInfo.phoneNumber'],
                });
                assert.deepStrictEqual(out, { userInfo: { firstName: VALID_NAME, phoneNumber: VALID_PHONE } });
            });

            it('accepts a nested snake_case whitelist matching nested camelCase input keys', async function () {
                const input = { userInfo: { firstName: VALID_NAME, phoneNumber: VALID_PHONE } };
                const out = await validateWhitelistProperties(input, ['user_info.first_name'], {
                    optionalProperties: ['user_info.phone_number'],
                });
                assert.deepStrictEqual(out, { user_info: { first_name: VALID_NAME, phone_number: VALID_PHONE } });
            });

            it('supports mixed segment forms on a single path', async function () {
                const input = { user_info: { firstName: VALID_NAME } };
                const out = await validateWhitelistProperties(input, ['userInfo.first_name']);
                assert.deepStrictEqual(out, { userInfo: { first_name: VALID_NAME } });
            });
        });

        describe('rejected mixed-case path segments', function () {
            it('rejects a required property whose name mixes snake_case and camelCase', async function () {
                await assertRejectsBadInput(
                    () => validateWhitelistProperties({ my_mixName: 'x' }, ['my_mixName']),
                    'mixing snake_case and camelCase',
                );
            });

            it('rejects an optional property whose name mixes snake_case and camelCase', async function () {
                await assertRejectsBadInput(
                    () => validateWhitelistProperties({}, [], { optionalProperties: ['my_mixName'] }),
                    'mixing snake_case and camelCase',
                );
            });

            it('rejects a mixed-case segment inside a nested path', async function () {
                await assertRejectsBadInput(() => validateWhitelistProperties({}, ['user.my_mixName']), 'mixing snake_case and camelCase');
            });

            it('rejects a mixed-case intermediate segment in a nested path', async function () {
                await assertRejectsBadInput(
                    () => validateWhitelistProperties({}, ['my_mixName.first_name']),
                    'mixing snake_case and camelCase',
                );
            });
        });
    });

    describe('output transformations', function () {
        describe('convertToSnakeCase option', function () {
            it('converts top-level keys to snake_case', async function () {
                const input = { firstName: VALID_NAME, phoneNumber: VALID_PHONE };
                const out = await validateWhitelistProperties(input, ['firstName'], {
                    optionalProperties: ['phoneNumber'],
                    convertToSnakeCase: true,
                });
                assert.deepStrictEqual(out, { first_name: VALID_NAME, phone_number: VALID_PHONE });
            });

            it('converts nested keys to snake_case', async function () {
                const input = { userInfo: { firstName: VALID_NAME, phoneNumber: VALID_PHONE } };
                const out = await validateWhitelistProperties(input, ['userInfo.firstName'], {
                    optionalProperties: ['userInfo.phoneNumber'],
                    convertToSnakeCase: true,
                });
                assert.deepStrictEqual(out, { user_info: { first_name: VALID_NAME, phone_number: VALID_PHONE } });
            });

            it('applies snake_case conversion regardless of whitelist form', async function () {
                const input = { first_name: VALID_NAME, phone_number: VALID_PHONE };
                const out = await validateWhitelistProperties(input, ['firstName'], {
                    optionalProperties: ['phoneNumber'],
                    convertToSnakeCase: true,
                });
                assert.deepStrictEqual(out, { first_name: VALID_NAME, phone_number: VALID_PHONE });
            });
        });

        describe('flattenOutput: false', function () {
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

            it('keeps flat shape unchanged for top-level-only paths', async function () {
                const input = { first_name: VALID_NAME, email: VALID_EMAIL };
                const out = await validateWhitelistProperties(input, ['first_name', 'email'], { flattenOutput: false });
                assert.deepStrictEqual(out, { first_name: VALID_NAME, email: VALID_EMAIL });
            });

            it('ignores flattenKeyStyle when output is not flattened', async function () {
                const input = { user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL } } };
                const out = await validateWhitelistProperties(input, ['user.first_name', 'user.contact.email'], {
                    flattenKeyStyle: 'leaf',
                });
                assert.deepStrictEqual(out, {
                    user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL } },
                });
            });
        });

        describe('flattenOutput: true with path keys', function () {
            it('uses dot-joined top-level keys by default', async function () {
                const input = { user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL } } };
                const out = await validateWhitelistProperties(input, ['user.first_name', 'user.contact.email'], {
                    flattenOutput: true,
                });
                assert.deepStrictEqual(out, {
                    'user.first_name': VALID_NAME,
                    'user.contact.email': VALID_EMAIL,
                });
            });

            it('uses dot-joined keys for multiple leaves from the same deep object by default', async function () {
                const input = { a: { b: { c: { d: { email: VALID_EMAIL, name: VALID_NAME, ignored: 'hi' } } } } };
                const out = await validateWhitelistProperties(input, ['a.b.c.d.email', 'a.b.c.d.name'], {
                    flattenOutput: true,
                });
                assert.deepStrictEqual(out, { 'a.b.c.d.email': VALID_EMAIL, 'a.b.c.d.name': VALID_NAME });
            });

            it('uses dot-joined keys when flattenKeyStyle is explicitly path', async function () {
                const input = { a: { b: { c: { d: { email: VALID_EMAIL, name: VALID_NAME } } } } };
                const out = await validateWhitelistProperties(input, ['a.b.c.d.email', 'a.b.c.d.name'], {
                    flattenOutput: true,
                    flattenKeyStyle: 'path',
                });
                assert.deepStrictEqual(out, { 'a.b.c.d.email': VALID_EMAIL, 'a.b.c.d.name': VALID_NAME });
            });

            it('keeps duplicate leaf names distinct with dot-joined keys', async function () {
                const input = {
                    name: 'Top Level Name',
                    user: { name: 'Nested Name', email: VALID_EMAIL },
                };
                const out = await validateWhitelistProperties(input, ['name', 'user.name', 'user.email'], {
                    flattenOutput: true,
                });
                assert.deepStrictEqual(out, { name: 'Top Level Name', 'user.name': 'Nested Name', 'user.email': VALID_EMAIL });
            });

            it('keeps same-depth duplicate leaf names distinct with dot-joined keys', async function () {
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

            it('applies snake_case conversion before flattening', async function () {
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

        describe('flattenOutput: true with leaf keys', function () {
            it('flattens multiple leaves from the same deep object into direct leaf keys', async function () {
                const input = { a: { b: { c: { d: { email: VALID_EMAIL, name: VALID_NAME, ignored: 'hi' } } } } };
                const out = await validateWhitelistProperties(input, ['a.b.c.d.email', 'a.b.c.d.name'], {
                    flattenOutput: true,
                    flattenKeyStyle: 'leaf',
                });
                assert.deepStrictEqual(out, { email: VALID_EMAIL, name: VALID_NAME });
            });

            it('keeps the higher-level property when leaf-key flattening has duplicate leaf names', async function () {
                const input = {
                    name: 'Top Level Name',
                    user: { name: 'Nested Name', email: VALID_EMAIL },
                };
                const out = await validateWhitelistProperties(input, ['name', 'user.name', 'user.email'], {
                    flattenOutput: true,
                    flattenKeyStyle: 'leaf',
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
                    flattenKeyStyle: 'leaf',
                });
                assert.deepStrictEqual(out, { name: 'Higher Nested Name', email: VALID_EMAIL });
            });

            it('keeps the first value when duplicate leaf names are at the same nesting depth', async function () {
                const input = {
                    user: { name: 'User Name' },
                    account: { name: 'Account Name' },
                };
                const out = await validateWhitelistProperties(input, ['user.name', 'account.name'], {
                    flattenOutput: true,
                    flattenKeyStyle: 'leaf',
                });
                assert.deepStrictEqual(out, { name: 'User Name' });
            });

            it('produces an output with no nested object values', async function () {
                const input = { user: { first_name: VALID_NAME, contact: { email: VALID_EMAIL, phone_number: VALID_PHONE } } };
                const out = await validateWhitelistProperties(
                    input,
                    ['user.first_name', 'user.contact.email', 'user.contact.phone_number'],
                    {
                        flattenOutput: true,
                        flattenKeyStyle: 'leaf',
                    },
                );
                Object.values(out).forEach(v => {
                    assert.ok(v === null || typeof v !== 'object', `Expected no nested objects in flat output, got: ${JSON.stringify(v)}`);
                });
                assert.deepStrictEqual(out, {
                    first_name: VALID_NAME,
                    email: VALID_EMAIL,
                    phone_number: VALID_PHONE,
                });
            });

            it('leaves already-flat results unchanged in shape', async function () {
                const input = { first_name: VALID_NAME, email: VALID_EMAIL };
                const out = await validateWhitelistProperties(input, ['first_name', 'email'], {
                    flattenOutput: true,
                    flattenKeyStyle: 'leaf',
                });
                assert.deepStrictEqual(out, { first_name: VALID_NAME, email: VALID_EMAIL });
            });

            it('uses the leaf key at the maximum supported depth of 5', async function () {
                const input = { a: { b: { c: { d: { email: VALID_EMAIL } } } } };
                const out = await validateWhitelistProperties(input, ['a.b.c.d.email'], {
                    flattenOutput: true,
                    flattenKeyStyle: 'leaf',
                });
                assert.deepStrictEqual(out, { email: VALID_EMAIL });
            });

            it('applies snake_case conversion before leaf flattening', async function () {
                const input = { userInfo: { firstName: VALID_NAME, phoneNumber: VALID_PHONE } };
                const out = await validateWhitelistProperties(input, ['userInfo.firstName'], {
                    optionalProperties: ['userInfo.phoneNumber'],
                    convertToSnakeCase: true,
                    flattenOutput: true,
                    flattenKeyStyle: 'leaf',
                });
                assert.deepStrictEqual(out, {
                    first_name: VALID_NAME,
                    phone_number: VALID_PHONE,
                });
            });

            it('omits absent optional nested leaves in the flat leaf-key output', async function () {
                const input = { user: { first_name: VALID_NAME } };
                const out = await validateWhitelistProperties(input, ['user.first_name'], {
                    optionalProperties: ['user.contact.email'],
                    flattenOutput: true,
                    flattenKeyStyle: 'leaf',
                });
                assert.deepStrictEqual(out, { first_name: VALID_NAME });
            });

            it('returns an empty object when no properties are configured', async function () {
                const out = await validateWhitelistProperties({ user: { first_name: VALID_NAME } }, [], {
                    flattenOutput: true,
                    flattenKeyStyle: 'leaf',
                });
                assert.deepStrictEqual(out, {});
            });
        });

        describe('flattenKeyStyle validation', function () {
            it('rejects an unsupported flattenKeyStyle', async function () {
                await assertRejectsBadInput(
                    () =>
                        validateWhitelistProperties({ user: { first_name: VALID_NAME } }, ['user.first_name'], {
                            flattenOutput: true,
                            flattenKeyStyle: 'inferred',
                        }),
                    'Invalid flattenKeyStyle: inferred. Expected "path" or "leaf"',
                );
            });
        });
    });

    describe('validation limits', function () {
        describe('MAX_NESTING_DEPTH', function () {
            it('exposes MAX_NESTING_DEPTH = 5 on the module', function () {
                assert.strictEqual(validateWhitelistPropertiesModule.MAX_NESTING_DEPTH, MAX_NESTING_DEPTH);
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

        describe('MAX_KEYS_PER_CALL', function () {
            it('exposes MAX_KEYS_PER_CALL = 5000 on the module', function () {
                assert.strictEqual(validateWhitelistPropertiesModule.MAX_KEYS_PER_CALL, MAX_KEYS_PER_CALL);
            });

            it('accepts when requiredProperties.length equals exactly 5000', async function () {
                const required = new Array(MAX_KEYS_PER_CALL).fill('first_name');
                const out = await validateWhitelistProperties({ first_name: VALID_NAME }, required);
                assert.deepStrictEqual(out, { first_name: VALID_NAME });
            });

            it('accepts when required + optional equals exactly 5000', async function () {
                const required = ['first_name'];
                const optional = new Array(MAX_KEYS_PER_CALL - 1).fill('phone_number');
                const out = await validateWhitelistProperties({ first_name: VALID_NAME, phone_number: VALID_PHONE }, required, {
                    optionalProperties: optional,
                });
                assert.deepStrictEqual(out, { first_name: VALID_NAME, phone_number: VALID_PHONE });
            });

            it('rejects when combined required + optional exceeds 5000', async function () {
                const required = new Array(MAX_KEYS_PER_CALL).fill('first_name');
                const optional = ['phone_number'];
                await assertRejectsBadInput(
                    () =>
                        validateWhitelistProperties({ first_name: VALID_NAME }, required, {
                            optionalProperties: optional,
                        }),
                    'Too many properties to validate: 5001 (maximum 5000)',
                );
            });

            it('rejects when requiredProperties alone exceeds 5000', async function () {
                const required = new Array(MAX_KEYS_PER_CALL + 1).fill('first_name');
                await assertRejectsBadInput(
                    () => validateWhitelistProperties({ first_name: VALID_NAME }, required),
                    'Too many properties to validate: 5001 (maximum 5000)',
                );
            });

            it('rejects when optionalProperties alone exceeds 5000', async function () {
                const optional = new Array(MAX_KEYS_PER_CALL + 1).fill('first_name');
                await assertRejectsBadInput(
                    () => validateWhitelistProperties({ first_name: VALID_NAME }, [], { optionalProperties: optional }),
                    'Too many properties to validate: 5001 (maximum 5000)',
                );
            });
        });
    });
});
