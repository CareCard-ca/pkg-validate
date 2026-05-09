import assert from 'assert';
import { describe, it } from 'mocha';
import {
  isBoolValue,
  isCharactersString,
  isCountryCodeString,
  isEmailString,
  isImageUrl,
  isInStringArray,
  isInteger,
  isJwtString,
  isNameString,
  isPasswordString,
  isPasswordStringFailureMessage,
  isPhoneNumber,
  isPostalCodeString,
  isProvinceString,
  isSafeSearchString,
  isSafeString,
  isSimplePasswordString,
  isSimplePasswordStringFailureMessage,
  isString6To16CharacterLong,
  isString6To24CharacterLong,
  isUrlSafeString,
  isUsernameString,
  isValidArrayOfStrings,
  isValidDomainName,
  isValidIntegerString,
  isValidJsonString,
  isValidTimestampString,
  isValidTimestampzString,
  isValidUrl,
  isValidUuidString,
  validateProperties,
} from '../index';

describe('pkg-validate TypeScript Type Definitions', () => {
  it('should verify all validate utility functions', () => {
    // String/Format checks
    assert.strictEqual(typeof isImageUrl('http://example.com/image.png'), 'boolean');
    assert.strictEqual(typeof isValidJsonString('{"a":1}'), 'boolean');
    assert.strictEqual(typeof isValidIntegerString('123'), 'boolean');
    assert.strictEqual(typeof isValidUuidString('550e8400-e29b-41d4-a716-446655440000'), 'boolean');
    assert.strictEqual(typeof isCharactersString('abc 123_-'), 'boolean');
    assert.strictEqual(typeof isNameString('John Doe'), 'boolean');
    assert.strictEqual(typeof isSafeSearchString('search query'), 'boolean');
    assert.strictEqual(typeof isEmailString('test@example.com'), 'boolean');
    assert.strictEqual(typeof isJwtString('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'), 'boolean');
    assert.strictEqual(typeof isUsernameString('user123'), 'boolean');
    assert.strictEqual(typeof isPhoneNumber('123-456-7890'), 'boolean');
    assert.strictEqual(typeof isUrlSafeString('url-safe-string'), 'boolean');
    assert.strictEqual(typeof isProvinceString('ON'), 'boolean');
    assert.strictEqual(typeof isPostalCodeString('A1A 1A1'), 'boolean');
    assert.strictEqual(typeof isSafeString('safe string!'), 'boolean');
    assert.strictEqual(typeof isCountryCodeString('+1'), 'boolean');
    assert.strictEqual(typeof isValidDomainName('example.com'), 'boolean');
    assert.strictEqual(typeof isValidTimestampzString('2023-10-27T10:00:00Z'), 'boolean');
    assert.strictEqual(typeof isValidTimestampString('2023-10-27T10:00:00'), 'boolean');
    assert.strictEqual(typeof isValidUrl('https://example.com'), 'boolean');
    assert.strictEqual(typeof isValidArrayOfStrings(['a', 'b']), 'boolean');

    // Password checks
    assert.strictEqual(typeof isPasswordString('Pass123!'), 'boolean');
    assert.strictEqual(typeof isSimplePasswordString('pass123'), 'boolean');
    assert.strictEqual(typeof isPasswordStringFailureMessage('pass'), 'string');
    assert.strictEqual(isPasswordStringFailureMessage('Password123!'), null);
    assert.strictEqual(typeof isSimplePasswordStringFailureMessage('p'), 'string');
    assert.strictEqual(isSimplePasswordStringFailureMessage('pass123'), null);
    assert.strictEqual(typeof isString6To24CharacterLong('password'), 'boolean');
    assert.strictEqual(typeof isString6To16CharacterLong('password'), 'boolean');

    // Logic checks
    assert.strictEqual(typeof isInteger(123), 'boolean');
    assert.strictEqual(typeof isBoolValue(true), 'boolean');
    assert.strictEqual(typeof isInStringArray(['a', 'b'], 'a'), 'boolean');
  });

  it('should verify validateProperties types', () => {
    const input = {
      first_name: 'John',
      email: 'john@example.com',
      invalid_prop: 'some value',
    };
    const result = validateProperties(input);
    assert.ok(result);
    assert.strictEqual(result.first_name, 'John');
    assert.strictEqual(result.email, 'john@example.com');
    assert.strictEqual(result.invalid_prop, undefined);
  });
});
