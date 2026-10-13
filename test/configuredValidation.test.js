'use strict';

const assert = require('node:assert/strict');
const { describe, it } = require('mocha');
const {
  isUrlSafeString,
  validateSchemaProperties,
  validateSchemaWhitelistProperties,
  validatePasswordAgainstPolicy,
  createValueParser,
} = require('..');

const text = value =>
  typeof value === 'string' && value.length > 0
    ? { isValid: true, value: value.toUpperCase() }
    : { isValid: false };

describe('caller-configured validation', () => {
  it('accepts empty selections only with an explicit schema', async () => {
    assert.deepEqual(await validateSchemaWhitelistProperties({}, undefined, { schema: {} }), {});
    assert.deepEqual(await validateSchemaWhitelistProperties({}, null, { schema: {} }), {});
    assert.throws(() => validateSchemaWhitelistProperties({}, []), TypeError);
    assert.throws(() => validateSchemaWhitelistProperties({}, [], null), TypeError);
    assert.equal(isUrlSafeString(' '.repeat(10)), false);
    assert.equal(isUrlSafeString('x'.repeat(2049)), false);
  });
  it('composes caller predicates and transformations without field semantics', () => {
    const parser = createValueParser(
      value => typeof value === 'number',
      value => String(value),
    );
    assert.deepEqual(parser(42), { isValid: true, value: '42' });
    assert.deepEqual(parser('42'), { isValid: false });
    assert.throws(() => createValueParser(null), TypeError);
  });
  it('validates arbitrary property names using the supplied schema', () => {
    assert.deepEqual(
      validateSchemaProperties({ ' custom ': ' value ', omitted: 'other' }, { custom: text }),
      { custom: 'VALUE' },
    );
  });

  it('uses independent parsers for equal leaf names at different paths', async () => {
    const schema = { 'first.value': text, 'second.value': value => ({ isValid: true, value }) };
    assert.deepEqual(
      await validateSchemaWhitelistProperties(
        { first: { value: 'one' }, second: { value: 42 } },
        ['first.value', 'second.value'],
        { schema },
      ),
      { first: { value: 'ONE' }, second: { value: 42 } },
    );
  });

  it('rejects missing or invalid parser configuration before accepting input', () => {
    assert.throws(() => validateSchemaProperties({ custom: 'value' }), TypeError);
    assert.throws(
      () =>
        validateSchemaWhitelistProperties({}, [], { optionalProperties: ['custom'], schema: {} }),
      TypeError,
    );
    assert.throws(() => validateSchemaProperties({}, { custom: true }), TypeError);
  });

  it('preserves required, optional, array, and output transformation behavior', async () => {
    assert.deepEqual(
      await validateSchemaWhitelistProperties(
        { nested: { customName: ['one', 'two'] }, ignored: true },
        ['nested.customName'],
        { schema: { 'nested.customName': text }, convertToSnakeCase: true, flattenOutput: true },
      ),
      { 'nested.custom_name': ['ONE', 'TWO'] },
    );
    assert.throws(
      () =>
        validateSchemaWhitelistProperties({ custom: 42 }, ['custom'], { schema: { custom: text } }),
      /Bad_Input/,
    );
  });

  it('keeps reserved-looking properties inert and rejects ambiguous normalized keys', async () => {
    const input = JSON.parse('{"__proto__":{"custom":"value"}}');
    const result = await validateSchemaWhitelistProperties(input, ['__proto__.custom'], {
      schema: { '__proto__.custom': text },
    });
    assert.equal(Object.getPrototypeOf(result), Object.prototype);
    assert.equal(JSON.stringify(result), '{"__proto__":{"custom":"VALUE"}}');
    assert.throws(
      () => validateSchemaProperties({ custom: 'one', ' custom ': 'two' }, { custom: text }),
      /ambiguous/i,
    );
  });

  it('accepts caller-selected password lengths without a built-in application policy', () => {
    assert.deepEqual(
      validatePasswordAgainstPolicy(' abc ', { minimumLength: 3, maximumLength: 5 }),
      {
        isValid: true,
        value: 'abc',
      },
    );
    assert.deepEqual(validatePasswordAgainstPolicy('abc', { minimumLength: 4, maximumLength: 5 }), {
      isValid: false,
      reason: 'too_short',
    });
  });

  it('uses caller-selected blocking and keeps normalized Unicode password outcomes', () => {
    const policy = { minimumLength: 1, maximumLength: 3, isBlocked: value => value === 'abc' };
    assert.deepEqual(validatePasswordAgainstPolicy('abc', policy), {
      isValid: false,
      reason: 'blocked',
    });
    assert.deepEqual(validatePasswordAgainstPolicy(' e\u0301 ', policy), {
      isValid: true,
      value: 'é',
    });
    assert.deepEqual(validatePasswordAgainstPolicy('\ud800', policy), {
      isValid: false,
      reason: 'invalid_unicode',
    });
    assert.throws(() => validatePasswordAgainstPolicy('abc'), TypeError);
  });
});
