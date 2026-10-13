const {
  validateExampleProperties,
  validateExampleRequest,
  validateExamplePassword,
} = require('./configuredSchema.fixture');
('use strict');

const assert = require('node:assert/strict');
const { normalizeInputWhitespace } = require('..');

describe('Canonical input whitespace through the package API', () => {
  it('trims Unicode edge whitespace in text, nested keys and array values without mutation', () => {
    const input = {
      ' user ': {
        ' first_name\t': '\n École & Co. \u00a0',
        ' comments ': ['\t First\nSecond \r\n', '  A  B  '],
      },
      count: 7,
      active: false,
      empty: null,
    };
    const result = normalizeInputWhitespace(input);
    assert.deepEqual(result, {
      user: { first_name: 'École & Co.', comments: ['First\nSecond', 'A  B'] },
      count: 7,
      active: false,
      empty: null,
    });
    assert.equal(input[' user '][' first_name\t'], '\n École & Co. \u00a0');
    assert.equal(normalizeInputWhitespace('\r\n\t\u00a0 text \u3000\ufeff'), 'text');
    assert.equal(normalizeInputWhitespace(' \n\t '), '');
    assert.equal(normalizeInputWhitespace(undefined), undefined);
  });

  it('keeps reserved-looking normalized keys inert and serializable', () => {
    const result = normalizeInputWhitespace(
      JSON.parse('{" __proto__ ":{" role ":" admin "}," constructor ":" value "}'),
    );
    assert.equal(result.role, undefined);
    assert.deepEqual(
      JSON.parse(JSON.stringify(result)),
      JSON.parse('{"__proto__":{"role":"admin"},"constructor":"value"}'),
    );
  });

  it('rejects ambiguous normalized keys instead of selecting an attacker-controlled value', () => {
    for (const value of [
      { email: 'safe@example.ca', ' email ': 'other@example.ca' },
      { nested: { ' name': 'A', 'name ': 'B' } },
    ]) {
      assert.throws(() => normalizeInputWhitespace(value), /ambiguous/i);
    }
  });

  it('does not execute accessors or accept cyclic input', () => {
    const input = {};
    Object.defineProperty(input, ' text ', {
      enumerable: true,
      get() {
        throw new Error('Getter executed');
      },
    });
    assert.throws(() => normalizeInputWhitespace(input), /data propert/i);
    const cycle = {};
    cycle.child = cycle;
    assert.throws(() => normalizeInputWhitespace(cycle), /cyclic/i);
  });

  it('preserves shared records, opaque values, binary file bytes and sparse array shape', () => {
    const child = { ' name ': ' A ' };
    assert.deepEqual(normalizeInputWhitespace({ first: child, second: child }), {
      first: { name: 'A' },
      second: { name: 'A' },
    });
    const bytes = Buffer.from(' file bytes \n');
    const date = new Date('2026-01-01');
    const values = new Array(2);
    values[1] = ' text ';
    const expectedValues = new Array(2);
    expectedValues[1] = 'text';
    const result = normalizeInputWhitespace({ bytes, date, values });
    assert.equal(result.bytes, bytes);
    assert.equal(result.date, date);
    assert.deepEqual(result.values, expectedValues);
  });

  it('normalizes before required-field, character, enum and nested metadata validation', async () => {
    const input = {
      ' first_name ': '\t Zoë \n',
      ' email ': ' user@example.ca ',
      ' metadata ': { ' label ': ' A  B ', ' values ': [' one ', ' two '] },
    };
    assert.deepEqual(validateExampleProperties(input), {
      first_name: 'Zoë',
      email: 'user@example.ca',
      metadata: { label: 'A  B', values: ['one', 'two'] },
    });
    assert.deepEqual(
      await validateExampleRequest({ ' user ': input }, [
        'user.first_name',
        'user.email',
        'user.metadata',
      ]),
      {
        user: {
          first_name: 'Zoë',
          email: 'user@example.ca',
          metadata: { label: 'A  B', values: ['one', 'two'] },
        },
      },
    );
    assert.equal(
      Object.hasOwn(validateExampleProperties({ first_name: ' \t<script> \n' }), 'first_name'),
      false,
    );
    assert.equal(
      Object.hasOwn(validateExampleProperties({ first_name: ' A\nB ' }), 'first_name'),
      false,
    );
    assert.throws(() => validateExampleProperties({ name: 'A', ' name ': 'B' }), /ambiguous/i);
    await assert.rejects(async () =>
      validateExampleRequest({ email: 'safe@example.ca', ' email ': 'other@example.ca' }, [
        'email',
      ]),
    );
  });

  it('trims before password length and blocklist checks and preserves internal spaces', () => {
    assert.deepEqual(validateExamplePassword('\t Valid password phrase 🔐 \n'), {
      isValid: true,
      value: 'Valid password phrase 🔐',
    });
    assert.deepEqual(validateExamplePassword('  12345678901234  '), {
      isValid: false,
      reason: 'too_short',
    });
    assert.deepEqual(validateExamplePassword('  films+pic+galeries  '), {
      isValid: false,
      reason: 'blocked',
    });
    assert.deepEqual(validateExamplePassword(' valid  password phrase '), {
      isValid: true,
      value: 'valid  password phrase',
    });
  });

  it('normalizes the keys and values inside explicitly serialized JSON fields', () => {
    assert.deepEqual(
      validateExampleProperties({ about: ' {" label ":" Value "," list ":[" A "]} ' }),
      {
        about: '{"label":"Value","list":["A"]}',
      },
    );
    assert.deepEqual(validateExampleProperties({ about: '{"name":"A"," name ":"B"}' }), {});
    assert.deepEqual(validateExampleProperties({ about: 42 }), {});
  });
});
