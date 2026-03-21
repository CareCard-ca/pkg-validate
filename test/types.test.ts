import assert from 'assert';
import {describe, it} from 'mocha';
import {validate, validateProperties} from '../index';

describe('pkg-validate TypeScript Type Definitions', () => {
    it('should verify validate utility types', () => {
        assert.strictEqual(typeof validate.isEmailString('test@example.com'), 'boolean');
        assert.strictEqual(typeof validate.isPhoneNumber('123-456-7890'), 'boolean');
        assert.strictEqual(typeof validate.isValidUuidString('550e8400-e29b-41d4-a716-446655440000'), 'boolean');
        assert.strictEqual(typeof validate.isInteger(123), 'boolean');
        assert.strictEqual(typeof validate.isPasswordStringFailureMessage('pass'), 'string');
        assert.strictEqual(validate.isPasswordStringFailureMessage('Password123!'), null);
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
