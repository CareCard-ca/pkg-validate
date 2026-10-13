'use strict';
const assert = require('node:assert/strict');
const { describe, it } = require('mocha');
const {
  validateSchemaProperties,
  createValueParser,
  validateSchemaWhitelistProperties,
} = require('..');
describe('explicit property schemas', () => {
  it('retains valid falsy values and strips rejected or unknown fields', () => {
    const schema = {
      flag: createValueParser(value => typeof value === 'boolean'),
      count: createValueParser(Number.isInteger),
    };
    assert.deepEqual(validateSchemaProperties({ flag: false, count: 0, extra: 1 }, schema), {
      flag: false,
      count: 0,
    });
    assert.deepEqual(validateSchemaProperties({ flag: 1, count: '0' }, schema), {});
    assert.deepEqual(validateSchemaProperties(undefined, schema), {});
    assert.deepEqual(validateSchemaProperties(null, schema), {});
  });
  it('requires a valid schema even for empty input', () => {
    for (const schema of [null, [], false, 1]) {
      assert.throws(() => validateSchemaProperties({}, schema), TypeError);
    }
    assert.throws(() => createValueParser(() => true, null), TypeError);
    assert.deepEqual(createValueParser(() => true)(0), { isValid: true, value: 0 });
  });
  it('keeps caller-defined reserved keys as inert own data', () => {
    const schema = JSON.parse('{"__proto__":null}');
    schema.__proto__ = createValueParser(value => typeof value === 'string');
    const result = validateSchemaProperties(JSON.parse('{"__proto__":"safe"}'), schema);
    assert.equal(JSON.stringify(result), '{"__proto__":"safe"}');
    assert.equal(Object.getPrototypeOf(result), Object.prototype);
  });
  it('rejects null parser outcomes without accepting partial arrays', () => {
    assert.deepEqual(validateSchemaProperties({ item: 1 }, { item: () => null }), {});
    assert.throws(
      () =>
        validateSchemaWhitelistProperties({ items: [1] }, ['items'], {
          schema: { items: () => null },
        }),
      /Bad_Input/,
    );
  });
});
