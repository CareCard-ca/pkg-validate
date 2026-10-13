const { validateExampleProperties, validateExampleRequest } = require('./configuredSchema.fixture');
('use strict');

const assert = require('node:assert/strict');
const {
  isSingleLineTextString,
  isMultilineTextString,
  isHttpUrlString,
  isMimeTypeString,
  isIdempotencyKeyString,
  isNonNegativeSafeInteger,
  isValidUuidV4String,
  isSafeJsonValue,
  isDocumentationSearchString,
  isSafeJsonString,
} = require('..');

describe('Field-specific input validation through the package API', () => {
  const unsafeText = [
    '<script>alert(1)</script>',
    '＜img＞',
    '﹤script﹥',
    'A\u0000B',
    'A\tB',
    'A\u001bB',
    'A\u007fB',
    'A\u0085B',
    'A\u2028B',
    'A\u2029B',
    'A\u202eB',
    'A\u2066B',
    'A\u200bB',
    'A\ufeffB',
    'A\ue000B',
    'A\ud800B',
    'A\udc00B',
  ];

  it('preserves international text, ordinary punctuation, and visible emoji', () => {
    for (const value of [
      '',
      ' ',
      '  École & Co.  ',
      '李',
      'ک\u200cتاب',
      'क्\u200dष',
      '👩🏽‍⚕️',
      '12/34 King St. #5',
      "O'Neil's: review (A+B) = 50%; yes!",
      'Café €5',
      'Spring/Summer',
      'Ａ＆Ｂ',
      '[]{}@_-.,!?*',
    ]) {
      assert.equal(isSingleLineTextString(value), true, JSON.stringify(value));
      assert.equal(isMultilineTextString(value), true, JSON.stringify(value));
    }
  });

  it('checks raw and compatibility-normalized text before trimming', () => {
    for (const value of [...unsafeText, undefined, null, 42, {}, []]) {
      assert.equal(isSingleLineTextString(value), false, JSON.stringify(value));
      assert.equal(isMultilineTextString(value), false, JSON.stringify(value));
    }
    for (const value of ['Text\n', '\nText', 'First\nSecond', 'First\r\nSecond']) {
      assert.equal(isSingleLineTextString(value), false);
      assert.equal(isMultilineTextString(value), true);
    }
    for (const value of ['First\rSecond', 'First\r', '\r\n\rText']) {
      assert.equal(isMultilineTextString(value), false);
    }
    for (const value of ['\ud800\n\udc00', '\ud800\r\n\udc00']) {
      assert.equal(isMultilineTextString(value), false);
      assert.equal(isSafeJsonValue({ comment: value }), false);
    }
  });

  it('accepts complete HTTP(S) URLs and rejects parser-discarded raw syntax', () => {
    for (const value of [
      'https://example.com/path?q=a%20b&lang=fr#details',
      'http://localhost:3000/files/123.pdf',
      'https://例え.テスト/資料',
      'https://example.com/' + 'a'.repeat(10000),
    ]) {
      assert.equal(isHttpUrlString(value), true, value);
    }
    for (const value of [
      undefined,
      null,
      12,
      '',
      'example.com',
      'https://',
      'javascript:alert(1)',
      'data:text/html,test',
      'ftp://example.com',
      ' https://example.com',
      'https://example.com\n',
      'https://example.com/a\nb',
      'https://example.com/a\tb',
      'https://example.com/<script>',
      'https://example.com/＜script＞',
      'https://example.com/\\path',
      'https://example.com/\ud800',
      'https://example.com/\u202e',
      'https://example.com/a b',
    ]) {
      assert.equal(isHttpUrlString(value), false, JSON.stringify(value));
    }
  });

  it('validates MIME tokens and parameters as a complete value', () => {
    for (const value of [
      'application/pdf',
      'image/svg+xml',
      'application/vnd.carecard.file+json',
      'text/plain; charset=utf-8',
      'text/plain; charset="utf-8"',
    ]) {
      assert.equal(isMimeTypeString(value), true, value);
    }
    for (const value of [
      undefined,
      null,
      42,
      '',
      'text',
      '/plain',
      'text/',
      '*/plain',
      'text/html\r\nX-Injected: yes',
      'text/html\n',
      ' text/html',
      'text/plain; charset=',
      'text/plain; charset="unfinished',
      'text/<html>',
      'text/plain; value="<script>"',
      'text/plain; x=a\u001b',
    ]) {
      assert.equal(isMimeTypeString(value), false, JSON.stringify(value));
    }
  });

  it('bounds idempotency keys without accepting human text or control syntax', () => {
    for (const value of ['123', 'message_1-2.3:4', 'a'.repeat(128)]) {
      assert.equal(isIdempotencyKeyString(value), true);
    }
    for (const value of [undefined, null, 123, '', 'a'.repeat(129), '<id>', 'id\n', ' id ', 'é']) {
      assert.equal(isIdempotencyKeyString(value), false);
    }
  });

  it('accepts only whole nonnegative safe decimal integers', () => {
    for (const value of [
      0,
      12,
      Number.MAX_SAFE_INTEGER,
      '0',
      '0012',
      String(Number.MAX_SAFE_INTEGER),
    ]) {
      assert.equal(isNonNegativeSafeInteger(value), true);
    }
    for (const value of [
      undefined,
      null,
      true,
      {},
      [],
      NaN,
      Infinity,
      -1,
      1.2,
      Number.MAX_SAFE_INTEGER + 1,
      '',
      ' ',
      ' 12',
      '12 ',
      '12<script>',
      '12x',
      '0x10',
      '1e2',
      '+12',
      '-1',
      '1.2',
      String(Number.MAX_SAFE_INTEGER + 1),
      '1'.repeat(21),
    ]) {
      assert.equal(isNonNegativeSafeInteger(value), false, String(value));
    }
  });

  it('retains the version-four UUID contract where required', () => {
    assert.equal(isValidUuidV4String('21f75228-a1d7-4d31-9d17-298e11e75b66'), true);
    for (const value of [
      undefined,
      42,
      '',
      '21f75228-a1d7-1d31-9d17-298e11e75b66',
      '21f75228-a1d7-4d31-0d17-298e11e75b66',
      '21f75228-a1d7-4d31-9d17-298e11e75b66\n',
    ]) {
      assert.equal(isValidUuidV4String(value), false);
    }
  });

  it('keeps extensible metadata, arrays, and reserved-looking keys as JSON data', () => {
    const metadata = JSON.parse(
      '{"__proto__":{"label":"Data"},"constructor":{"prototype":{"admin":true}},"rows":[null,false,12,"First\\nSecond"]}',
    );
    assert.equal(isSafeJsonValue(metadata), true);
    assert.equal(isSafeJsonValue([]), true);
    assert.equal(isSafeJsonValue({}), true);
    assert.equal(isSafeJsonValue(Object.assign(Object.create(null), { label: 'Data' })), true);
    const shared = { label: 'Data' };
    assert.equal(isSafeJsonValue({ first: shared, second: shared }), true);
    assert.equal(isSafeJsonValue({ label: 'A'.repeat(9988) }), true);
  });

  it('rejects unsafe nested metadata without silently discarding unsupported values', () => {
    for (const value of unsafeText) {
      assert.equal(isSafeJsonValue({ rows: [{ label: value }] }), false);
      assert.equal(isSafeJsonValue({ [value]: 'Data' }), false);
    }
    for (const value of [
      undefined,
      null,
      'text',
      12,
      true,
      { label: 'A'.repeat(9989) },
      { count: Infinity },
      { count: NaN },
      { missing: undefined },
      { count: 1n },
      { callback() {} },
      new Date(),
      Object.create({ inherited: 'Data' }),
    ]) {
      assert.equal(isSafeJsonValue(value), false);
    }
    const cycle = {};
    cycle.self = cycle;
    assert.equal(isSafeJsonValue(cycle), false);
    const unavailableMetadata = new Proxy(
      {},
      {
        ownKeys() {
          throw new TypeError('Metadata cannot be represented as JSON');
        },
      },
    );
    assert.equal(isSafeJsonValue(unavailableMetadata), false);
  });

  it('permits documentation search syntax while rejecting unsafe raw characters', () => {
    for (const value of [
      '',
      'C++',
      'foo.bar()',
      '`code`',
      'a | b',
      'C:\\files',
      'école',
      'tag:[value]',
    ]) {
      assert.equal(isDocumentationSearchString(value), true);
    }
    for (const value of [...unsafeText, 'query\n', undefined, 12]) {
      assert.equal(isDocumentationSearchString(value), false);
    }
  });

  it('validates serialized metadata without changing its wire representation', () => {
    for (const value of ['{}', '[]', '{"label":"Data"}', ' {"label":"Data"} ']) {
      assert.equal(isSafeJsonString(value), true);
    }
    for (const value of [undefined, 42, '', 'invalid', 'null', '"text"', '{"label":"<script>"}']) {
      assert.equal(isSafeJsonString(value), false);
    }
  });

  it('rejects unsafe metadata even when a hostile object changes inherited properties', () => {
    const original = Object.getOwnPropertyDescriptor(Object.prototype, 'finished');
    const metadata = new Proxy(
      { comment: '<script>' },
      {
        getPrototypeOf() {
          Object.defineProperty(Object.prototype, 'finished', { value: true, configurable: true });
          return Object.prototype;
        },
      },
    );
    try {
      assert.equal(isSafeJsonValue(metadata), false);
    } finally {
      if (original) {
        Object.defineProperty(Object.prototype, 'finished', original);
      } else {
        delete Object.prototype.finished;
      }
    }
  });

  it('rejects unsafe format fields through property and whitelist boundaries', async () => {
    for (const input of [
      { street: '12 Main\nStreet' },
      { street: '12 Main\rStreet' },
      { website: 'https://example.com/a\nb' },
      { fileUrl: 'https://example.com/<script>' },
      { about: '{"label":"<script>"}' },
      { metadata: { label: '<script>' } },
    ]) {
      assert.deepEqual(validateExampleProperties(input), {});
      await assert.rejects(async () => validateExampleRequest(input, Object.keys(input)), {
        code: 'BAD_INPUT',
      });
    }
    const input = {
      street: '12 Main St. #5',
      website: 'https://example.com/a%20b',
      imageUrl: 'images/photo.png',
      about: ' {"label":"Data"} ',
      metadata: { label: 'Review: phase 2\nNext step' },
    };
    const expected = { ...input, about: '{"label":"Data"}' };
    assert.deepEqual(validateExampleProperties(input), expected);
    assert.deepEqual(await validateExampleRequest(input, Object.keys(input)), expected);
  });

  it('rebuilds reserved-looking nested whitelist paths without changing unrelated objects', async () => {
    const input = JSON.parse('{"__proto__":{"name":"Data"}}');
    const originalName = Object.getOwnPropertyDescriptor(Object.prototype, 'name');
    const unrelated = {};
    try {
      const output = await validateExampleRequest(input, ['__proto__.name']);
      assert.equal(unrelated.name, undefined);
      assert.deepEqual(JSON.parse(JSON.stringify(output)), input);
    } finally {
      if (originalName) {
        Object.defineProperty(Object.prototype, 'name', originalName);
      } else {
        delete Object.prototype.name;
      }
    }
  });

  it('preserves reserved metadata leaves during flattening', async () => {
    const metadata = JSON.parse('{"__proto__":"Data","constructor":"Value","prototype":"Example"}');
    const output = await validateExampleRequest({ metadata }, ['metadata'], {
      flattenOutput: true,
      flattenKeyStyle: 'leaf',
    });
    assert.deepEqual(JSON.parse(JSON.stringify(output)), metadata);
    assert.equal(output.unexpectedAuthority, undefined);
  });

  it('preserves nested metadata as inert JSON during snake-case conversion', async () => {
    const input = JSON.parse(
      '{"metadata":{"__proto__":{"unexpectedAuthority":"Data"},"note":"Example"}}',
    );
    const output = await validateExampleRequest(input, ['metadata'], {
      convertToSnakeCase: true,
    });
    assert.equal(output.metadata.unexpected_authority, undefined);
    assert.deepEqual(
      JSON.parse(JSON.stringify(output)),
      JSON.parse('{"metadata":{"__proto__":{"unexpected_authority":"Data"},"note":"Example"}}'),
    );
  });
});
