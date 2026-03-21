import assert from 'assert';
import {describe, it} from 'mocha';
import {validate, validateProperties} from '../index';

describe('pkg-validate TypeScript Type Definitions', () => {
    it('should verify all validate utility functions', () => {
        // String/Format checks
        assert.strictEqual(typeof validate.isImageUrl('http://example.com/image.png'), 'boolean');
        assert.strictEqual(typeof validate.isValidJsonString('{"a":1}'), 'boolean');
        assert.strictEqual(typeof validate.isValidIntegerString('123'), 'boolean');
        assert.strictEqual(typeof validate.isValidUuidString('550e8400-e29b-41d4-a716-446655440000'), 'boolean');
        assert.strictEqual(typeof validate.isCharactersString('abc 123_-'), 'boolean');
        assert.strictEqual(typeof validate.isNameString('John Doe'), 'boolean');
        assert.strictEqual(typeof validate.isSafeSearchString('search query'), 'boolean');
        assert.strictEqual(typeof validate.isEmailString('test@example.com'), 'boolean');
        assert.strictEqual(typeof validate.isJwtString('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'), 'boolean');
        assert.strictEqual(typeof validate.isUsernameString('user123'), 'boolean');
        assert.strictEqual(typeof validate.isPhoneNumber('123-456-7890'), 'boolean');
        assert.strictEqual(typeof validate.isUrlSafeString('url-safe-string'), 'boolean');
        assert.strictEqual(typeof validate.isProvinceString('ON'), 'boolean');
        assert.strictEqual(typeof validate.isPostalCodeString('A1A 1A1'), 'boolean');
        assert.strictEqual(typeof validate.isSafeString('safe string!'), 'boolean');
        assert.strictEqual(typeof validate.isCountryCodeString('+1'), 'boolean');
        assert.strictEqual(typeof validate.isValidDomainName('example.com'), 'boolean');
        assert.strictEqual(typeof validate.isValidTimestampzString('2023-10-27T10:00:00Z'), 'boolean');
        assert.strictEqual(typeof validate.isValidTimestampString('2023-10-27T10:00:00'), 'boolean');

        // Password checks
        assert.strictEqual(typeof validate.isPasswordString('Pass123!'), 'boolean');
        assert.strictEqual(typeof validate.isSimplePasswordString('pass123'), 'boolean');
        assert.strictEqual(typeof validate.isPasswordStringFailureMessage('pass'), 'string');
        assert.strictEqual(validate.isPasswordStringFailureMessage('Password123!'), null);
        assert.strictEqual(typeof validate.isSimplePasswordStringFailureMessage('p'), 'string');
        assert.strictEqual(validate.isSimplePasswordStringFailureMessage('pass123'), null);
        assert.strictEqual(typeof validate.isString6To24CharacterLong('password'), 'boolean');
        assert.strictEqual(typeof validate.isString6To16CharacterLong('password'), 'boolean');

        // Logic checks
        assert.strictEqual(typeof validate.isInteger(123), 'boolean');
        assert.strictEqual(typeof validate.isBoolValue(true), 'boolean');
        assert.strictEqual(typeof validate.isInStringArray(['a', 'b'], 'a'), 'boolean');
    });

    it('should verify validateProperties types', () => {
        const input = {
            first_name: 'John',
            email: 'john@example.com',
            invalid_prop: 'some value'
        };
        const result = validateProperties.validateProperties(input);
        assert.ok(result);
        assert.strictEqual(result.first_name, 'John');
        assert.strictEqual(result.email, 'john@example.com');
        assert.strictEqual(result.invalid_prop, undefined);
    });
});
