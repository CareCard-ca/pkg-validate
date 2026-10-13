const { validateExampleProperties, validateExampleRequest } = require('./configuredSchema.fixture');
const assert = require('node:assert/strict');
const {
  isNameString,
  isFileNameString,
  isTextString,
  isSafeString,
  isSafeSearchString,
  isPhoneContactString,
  validate,
} = require('..');

describe('Unicode name and filename validation through the package API', () => {
  const names = [
    'A',
    '123',
    '3M',
    '李',
    'José',
    'Jose\u0301',
    'محمد',
    'क्\u200dष',
    '👩🏽‍⚕️',
    'A&B',
    'O’Neil',
    'Peter @ Singh',
    'A_B (Research), Inc.',
    'Jean–Luc',
    '  École\u00a0& Agreements  ',
    'Ａ＆Ｂ',
    'ک\u200cتاب',
    '🇨🇦',
    '1️⃣',
  ];

  for (const name of names) {
    it(`accepts the visible name ${JSON.stringify(name)}`, () => {
      assert.equal(isNameString(name), true);
      assert.equal(validate.isNameString(name), true);
    });
  }

  it('preserves allowed punctuation, surrounding spaces and length limits', () => {
    for (const name of ['Peter', "A0_-.,'() ", ' Peter ', 'A'.repeat(1000)]) {
      assert.equal(isNameString(name), true);
    }
    assert.equal(isNameString('A'.repeat(1001)), false);
    assert.equal(isNameString('😀'.repeat(501)), false);
  });

  for (const value of [
    undefined,
    null,
    123,
    {},
    '',
    ' \t\n',
    '\u0301',
    '\u200d',
    'A\u0000B',
    'A\tB',
    'A\nB',
    'A\rB',
    'A\u007fB',
    'A\u0085B',
    'A\u2028B',
    'A\u2029B',
    'A\u202eB',
    'A\u2066B',
    'A\ud800B',
    'A\udc00B',
    '\nPeter\n',
    '\tPeter',
    'Peter\r',
    '\ufeffPeter',
    'Peter\u200b',
    'Private \ue000',
    '\u3164',
    '.',
    '..',
    '_-&()',
  ]) {
    it(`rejects unsafe or invisible name ${JSON.stringify(value)}`, () => {
      assert.equal(isNameString(value), false);
    });
  }

  for (const fileName of [
    '123',
    '3.pdf',
    'A&B.pdf',
    '李.pdf',
    '👩🏽‍⚕️.png',
    'a..b.pdf',
    '.hidden',
    '  Ａ＆Ｂ.pdf  ',
    '😀'.repeat(255),
  ]) {
    it(`accepts the metadata filename ${JSON.stringify(fileName)}`, () => {
      assert.equal(isFileNameString(fileName), true);
      assert.equal(validate.isFileNameString(fileName), true);
    });
  }

  for (const value of [
    undefined,
    null,
    123,
    {},
    '',
    ' ',
    '.',
    '..',
    '  ..  ',
    'a/b.pdf',
    'a\\b.pdf',
    'a／b.pdf',
    'a＼b.pdf',
    'a\n.pdf',
    '\nreport.pdf',
    'report.pdf\t',
    'a\u0000.pdf',
    'a\u202e.pdf',
    '\ud800.pdf',
    '\u200d',
    '😀'.repeat(256),
    'ﬃ'.repeat(86),
  ]) {
    it(`rejects unsafe filename ${JSON.stringify(value)}`, () => {
      assert.equal(isFileNameString(value), false);
    });
  }

  const unsupportedText = [
    '<Research>',
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(1)',
    '$(id)',
    '`id`',
    "Robert'); DROP TABLE users;--",
    '../secret',
    'A/B',
    'A\\B',
    'C++',
    'Report #1.pdf',
    'a:@*?"<>|.pdf',
    'Ａ＜Ｂ',
    'A［B］',
    'A＝B',
    '#️⃣',
    'A\u2060B',
  ];

  for (const value of unsupportedText) {
    it(`rejects syntax outside the plain-text allowlist ${JSON.stringify(value)}`, () => {
      for (const predicate of [isNameString, isFileNameString, isTextString, isSafeString]) {
        assert.equal(predicate(value), false);
      }
      assert.deepEqual(
        validateExampleProperties({ name: value, fileName: value, documentDescription: value }),
        {},
      );
    });
  }

  it('applies the plain-text allowlist with the existing text length budget', () => {
    for (const name of names) {
      assert.equal(isTextString(name), true);
    }
    assert.equal(isTextString('A'.repeat(10000)), true);
    assert.equal(isTextString('A'.repeat(10001)), false);
    for (const value of [
      undefined,
      null,
      123,
      '',
      ' ',
      '.',
      '\u0301',
      '\u200d',
      '\ud800',
      '\nText',
      'Text\t',
    ]) {
      assert.equal(isTextString(value), false);
    }
  });

  it('keeps safe strings and searches within their existing stricter character rules', () => {
    assert.equal(isSafeString("Report_123 (Signed), O'Neil."), true);
    assert.equal(isSafeString('A'.repeat(10000)), true);
    for (const value of [
      ' ',
      '.',
      'École',
      'Name & Co',
      'Name @ Work',
      'Text\n',
      'javascript:alert(1)',
      '[Name]',
      '#346 Charles*',
    ]) {
      assert.equal(isSafeString(value), false);
    }
    for (const value of ['\nPeter\n', '\tPeter', 'Peter\r', '\ufeffPeter']) {
      assert.equal(isSafeSearchString(value), false);
    }
    assert.equal(isSafeSearchString(' Peter @ Singh '), true);
    assert.equal(isSafeSearchString('3Peter'), false);
  });

  it('rejects invalid required and present optional text at the whitelist boundary', async () => {
    for (const key of ['name', 'fileName', 'documentDescription']) {
      await assert.rejects(async () => validateExampleRequest({ [key]: '<Research>' }, [key]), {
        code: 'BAD_INPUT',
      });
      await assert.rejects(
        async () => validateExampleRequest({ [key]: '$(id)' }, [], { optionalProperties: [key] }),
        { code: 'BAD_INPUT' },
      );
      assert.deepEqual(await validateExampleRequest({}, [], { optionalProperties: [key] }), {});
    }
    const input = {
      name: 'École & Agreements',
      fileName: '  Ａ＆Ｂ.pdf  ',
      documentDescription: 'Needs & review',
    };
    assert.deepEqual(await validateExampleRequest(input, Object.keys(input)), {
      ...input,
      fileName: 'A&B.pdf',
    });
    assert.equal(input.fileName, '  Ａ＆Ｂ.pdf  ');
  });

  it('validates phone contact snapshots without changing the national phone contract', () => {
    for (const phone of [
      '4165550101',
      '(416) 555-0101',
      '+1 416 555 0101',
      '+14165550101',
      '+44 20 7946 0958',
      '+966-555-123-456',
    ]) {
      assert.equal(isPhoneContactString(phone), true);
    }
    for (const phone of [
      undefined,
      null,
      123,
      '',
      '123',
      '+0000000',
      '+12345',
      '+1234567890123456',
      '+1  4165550101',
      '+1 4165550101\n',
      '<phone>',
      '$(1234567)',
      'Not a phone',
    ]) {
      assert.equal(isPhoneContactString(phone), false);
    }
    assert.equal(validate.isPhoneNumber('+1 416 555 0101'), false);
  });

  it('validates name, filename and search field aliases consistently', () => {
    const input = {
      first_name: '李',
      middleName: '123',
      nick_name: '👩🏽‍⚕️',
      requestedByName: 'A&B',
      approved_by_name: 'محمد',
      file_name: '123.pdf',
      fileName: 'A&B.pdf',
      filename: '李.pdf',
      search_string: '123',
      searchString: '李',
    };
    assert.deepEqual(validateExampleProperties(input), input);
    assert.deepEqual(
      validateExampleProperties({
        middle_name: '\n',
        fileName: '../a',
        searchString: 'a'.repeat(102),
      }),
      {},
    );
    assert.deepEqual(validateExampleProperties({ searchString: 'a'.repeat(101) }), {
      searchString: 'a'.repeat(101),
    });
  });

  it('retains the existing username property rules independently of display names', () => {
    assert.deepEqual(validateExampleProperties({ username: "Peter-0_'()" }), {
      username: "Peter-0_'()",
    });
    for (const username of ['123', '3Peter', 'A', 'Peter@', '李', 'A'.repeat(1001)]) {
      assert.deepEqual(validateExampleProperties({ username }), {});
    }
  });
});
