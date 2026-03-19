const assert = require('assert').strict;
const { describe, it } = require('mocha');
const { validateProperties } = require('../lib/validateProperties');

describe('ValidateProperties test', function () {

    describe('Validate function test', function () {

        it('fist_name validate', function (done) {
            const testObject = { first_name: "Pankaj" };

            const validatedObject = validateProperties(testObject);

            assert.deepStrictEqual(validatedObject, testObject, 'Validation failed');
            done();
        });

        it('password validate', function (done) {
            const testObject = { password: "secret782*goo" };

            const validatedObject = validateProperties(testObject);

            assert.deepStrictEqual(validatedObject, testObject, 'Validation failed');
            done();
        });

        it('item_id uuid validate', function (done) {
            const testObject = { item_id: "1c76ea46-a212-4cc5-9031-a9a28d927c4c" };

            const validatedObject = validateProperties(testObject);

            assert.deepStrictEqual(validatedObject, testObject, 'Validation failed');
            done();
        });

        it('search_string validate', function (done) {
            const testObject_1 = { search_string: "1c76ea46-a212-4cc5-9031-a9a28d927c4c" };
            const testObject_2 = { search_string: " claudpsnd@yahoo.ca " };

            const validatedObject_1 = validateProperties(testObject_1);
            const validatedObject_2 = validateProperties(testObject_2);

            assert.deepStrictEqual(validatedObject_1, {}, 'Validation failed');
            assert.deepStrictEqual(validatedObject_2, testObject_2, 'Validation failed');
            done();
        });

        it('searchString validate', function (done) {
            const testObject_1 = { searchString: "1c76ea46-a212-4cc5-9031-a9a28d927c4c" };
            const testObject_2 = { searchString: " claudpsnd@yahoo.ca " };

            const validatedObject_1 = validateProperties(testObject_1);
            const validatedObject_2 = validateProperties(testObject_2);

            assert.deepStrictEqual(validatedObject_1, {}, 'Validation failed');
            assert.deepStrictEqual(validatedObject_2, testObject_2, 'Validation failed');
            done();
        });

        it('permission_string validate', function (done) {
            const testObject_1 = {
                permission: {
                    resource: "unit_a",
                    name: "south_homes",
                    type: "r"
                }
            };
            const testObject_2 = { permission: { email: "claudpsnd@yahoo.ca" } };

            const validatedObject_1 = validateProperties(testObject_1);
            const validatedObject_2 = validateProperties(testObject_2);

            assert.deepStrictEqual(validatedObject_1, testObject_1, 'Validation failed');
            assert.deepStrictEqual(validatedObject_2, testObject_2, 'Validation failed');
            done();
        });

        it('domain validation', function (done) {
            const testObject1 = { domain: "example.com" };
            const testObject2 = { domain_name: "sub.example.com" };
            const testObject3 = { email_domain: "my-domain.org" };
            const testObject4 = { email_domain_name: "school.edu.in" };
            const testObjectBad = { domain: "invalid_domain" };

            const validatedObject1 = validateProperties(testObject1);
            const validatedObject2 = validateProperties(testObject2);
            const validatedObject3 = validateProperties(testObject3);
            const validatedObject4 = validateProperties(testObject4);
            const validatedObjectBad = validateProperties(testObjectBad);

            assert.deepStrictEqual(validatedObject1, testObject1, 'Validation failed for domain');
            assert.deepStrictEqual(validatedObject2, testObject2, 'Validation failed for domain_name');
            assert.deepStrictEqual(validatedObject3, testObject3, 'Validation failed for email_domain');
            assert.deepStrictEqual(validatedObject4, testObject4, 'Validation failed for email_domain_name');
            assert.deepStrictEqual(validatedObjectBad, {}, 'Validation should have failed for invalid domain');
            done();
        });

        it('validateProperties covers all other fields', function (done) {
            const testObject = {
                username: 'pankaj',
                new_status: 'Active',
                newStatus: 'Active',
                description: 'A description',
                comment: 'A comment',
                status: 'Pending',
                name: 'John Doe',
                title: 'Mr',
                brand: 'Apple',
                short_description: 'Short desc',
                shortDescription: 'Short desc',
                college_name: 'Harvard University',
                collegeName: 'Harvard University',
                campus_name: 'Main Campus',
                campusName: 'Main Campus',
                strong_password: 'Password123!',
                strongPassword: 'Password123!',
                new_password: 'Password123',
                newPassword: 'Password123',
                email: 'test@example.com',
                phone_number: '123-456-7890',
                phoneNumber: '123-456-7890',
                token: 'abc.123',
                email_confirm_token: 'abc.123',
                emailConfirmToken: 'abc.123',
                verification_token: 'abc.123',
                verificationToken: 'abc.123',
                uuid: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                user_id: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                image_id: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                imageId: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                userId: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                order_id: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                orderId: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                category_id: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                categoryId: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                parent_id: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                parentId: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                period: 'Monthly',
                offset_number: '10',
                offsetNumber: '10',
                number_of_orders: '5',
                numberOfOrders: '5',
                price: '100',
                about: '  {"key": "value"}  ',
                weight: { value: 10, unit: 'kg' },
                dimensions: { width: 10, height: 20 },
                image_url: 'path/to/image.jpg',
                imageUrl: 'path/to/image.jpg',
                active: true,
            };
            const validatedObject = validateProperties(testObject);

            const expected = { ...testObject, about: '{"key": "value"}' };

            assert.deepStrictEqual(validatedObject, expected, 'Validation failed for some fields');
            done();
        });

        it('validateProperties camelCase aliases', function (done) {
            const testObject = {
                firstName: 'Pankaj',
                domainName: 'example.com',
                emailDomain: 'example.com',
                emailDomainName: 'example.com',
                newStatus: 'Active',
                orderId: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                collegeName: 'Harvard University',
                campusName: 'Main Campus',
            };
            const validatedObject = validateProperties(testObject);
            assert.deepStrictEqual(
                validatedObject,
                testObject,
                'Validation failed for camelCase aliases',
            );
            done();
        });

        it('validateProperties snake_case aliases', function (done) {
            const testObject = {
                new_status: 'Active',
                order_id: '1c76ea46-a212-4cc5-9031-a9a28d927c4c',
                college_name: 'Harvard University',
                campus_name: 'Main Campus',
            };
            const validatedObject = validateProperties(testObject);
            assert.deepStrictEqual(
                validatedObject,
                testObject,
                'Validation failed for snake_case aliases',
            );
            done();
        });

        it('expires_at validation', function (done) {
            const testObject1 = { expires_at: "2023-10-27T10:00:00Z" };
            const testObject2 = { expiresAt: "2023-10-27T10:00:00" };
            const testObjectBad = { expires_at: "invalid-date" };

            const validatedObject1 = validateProperties(testObject1);
            const validatedObject2 = validateProperties(testObject2);
            const validatedObjectBad = validateProperties(testObjectBad);

            assert.deepStrictEqual(validatedObject1, testObject1, 'Validation failed for expires_at with TZ');
            assert.deepStrictEqual(validatedObject2, testObject2, 'Validation failed for expiresAt without TZ');
            assert.deepStrictEqual(validatedObjectBad, {}, 'Validation should have failed for invalid expires_at');
            done();
        });

        it('validateProperties returns empty object for null or undefined', function (done) {
            assert.deepStrictEqual(validateProperties(null), {});
            assert.deepStrictEqual(validateProperties(undefined), {});
            done();
        });

        it('validateProperties negative cases for branch coverage', function (done) {
            const testObject = {
                first_name: 123, // fails isNameString
                search_string: 123, // fails isSafeSearchString
                password: 'short', // fails isString6To16CharacterLong
                new_password: 'validButTooLongForIsString6To16CharacterLong', // fails isString6To16CharacterLong
                strong_password: 'short', // fails isString6To16CharacterLong
                email: 'invalid-email', // fails isEmailString
                phone_number: '123', // fails isPhoneNumber
                token: '', // fails isUrlSafeString
                uuid: 'invalid-uuid', // fails isValidUuidString
                period: 123, // fails isCharactersString
                offset_number: 'abc', // fails isValidIntegerString
                about: 'invalid json', // fails isValidJsonString
                weight: 'invalid json', // fails isValidJsonString
                image_url: 'invalid url!', // fails isImageUrl
                domain: 'invalid domain', // fails isValidDomainName
                active: 'not a bool',
                unknown_key: 'any value',
            };
            const validatedObject = validateProperties(testObject);
            assert.deepStrictEqual(
                validatedObject,
                {},
                'Should return empty object when all validations fail',
            );
            done();
        });
    });
});
