const assert = require('node:assert/strict');
const { isNameString, isFileNameString, validate, validateProperties } = require('..');

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
    'A/B',
    '<Research>',
    'Private \ue000',
  ];

  for (const name of names) {
    it(`accepts the visible name ${JSON.stringify(name)}`, () => {
      assert.equal(isNameString(name), true);
      assert.equal(validate.isNameString(name), true);
    });
  }

  it('preserves previously accepted names, surrounding whitespace and length limits', () => {
    for (const name of ['Peter', "A0_-.,'() ", '\nPeter\n', 'A'.repeat(1000)]) {
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
    'a:@*?"<>|.pdf',
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
    assert.deepEqual(validateProperties(input), input);
    assert.deepEqual(
      validateProperties({ middle_name: '\n', fileName: '../a', searchString: 'a'.repeat(102) }),
      {},
    );
    assert.deepEqual(validateProperties({ searchString: 'a'.repeat(101) }), {
      searchString: 'a'.repeat(101),
    });
  });

  it('retains the existing username property rules independently of display names', () => {
    assert.deepEqual(validateProperties({ username: "Peter-0_'()" }), { username: "Peter-0_'()" });
    for (const username of ['123', '3Peter', 'A', 'Peter@', '李', 'A'.repeat(1001)]) {
      assert.deepEqual(validateProperties({ username }), {});
    }
  });
});
