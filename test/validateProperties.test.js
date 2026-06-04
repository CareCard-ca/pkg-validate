const assert = require('assert').strict;
const { describe, it } = require('mocha');
const { validateProperties } = require('../lib/validateProperties');

const VALID_UUID = '1c76ea46-a212-4cc5-9031-a9a28d927c4c';
const INVALID_UUID = 'not-a-uuid';

// Helper to assert a key is preserved (happy) or stripped (failing) on validateProperties.
function assertAccepts(key, value) {
    const out = validateProperties({ [key]: value });
    assert.deepStrictEqual(out, { [key]: value }, `Expected key "${key}" to be accepted for value: ${JSON.stringify(value)}`);
}

function assertRejects(key, value) {
    const out = validateProperties({ [key]: value });
    assert.deepStrictEqual(out, {}, `Expected key "${key}" to be rejected for value: ${JSON.stringify(value)}`);
}

describe('ValidateProperties test', function () {
    describe('Name-string fields (isNameString)', function () {
        const nameKeys = [
            'first_name',
            'firstName',
            'last_name',
            'lastName',
            'username',
            'new_status',
            'newStatus',
            'description',
            'comment',
            'status',
            'name',
            'title',
            'brand',
            'short_description',
            'shortDescription',
            'college_name',
            'collegeName',
            'campus_name',
            'campusName',
            'role',
            'role_id',
            'roleId',
            'campus',
            'institution_name',
            'institutionName',
            'program_name',
            'programName',
            'role_name',
            'roleName',
            'document_type',
            'documentType',
            'reason',
            'entity_type',
            'entityType',
            'action_type',
            'actionType',
            'approved_by_role',
            'approvedByRole',
            'city',
            'state',
            'country',
            'type',
        ];

        nameKeys.forEach(key => {
            it(`accepts a valid name string for "${key}"`, function () {
                assertAccepts(key, 'Pankaj');
            });

            it(`rejects an invalid (non-string) value for "${key}"`, function () {
                assertRejects(key, 123);
            });
        });
    });

    describe('Street field', function () {
        it('accepts a valid street address', function () {
            assertAccepts('street', '103, main market');
        });

        it('accepts a street with special characters', function () {
            assertAccepts('street', 'H.No-21/4, MG Road');
        });

        it('rejects a non-string street value', function () {
            assertRejects('street', 123);
        });
    });

    describe('Postal code / period (isCharactersString)', function () {
        ['postal_code', 'postalCode', 'period'].forEach(key => {
            it(`accepts a valid string for "${key}"`, function () {
                assertAccepts(key, '492001');
            });

            it(`rejects a non-string value for "${key}"`, function () {
                assertRejects(key, {});
            });
        });
    });

    describe('Boolean fields (isBoolValue)', function () {
        ['is_primary', 'isPrimary', 'active'].forEach(key => {
            it(`accepts boolean true for "${key}"`, function () {
                assertAccepts(key, true);
            });

            it(`accepts boolean false for "${key}"`, function () {
                assertAccepts(key, false);
            });

            it(`rejects a non-boolean value for "${key}"`, function () {
                assertRejects(key, 'yes');
            });
        });
    });

    describe('Search string fields (isSafeSearchString)', function () {
        ['search_string', 'searchString'].forEach(key => {
            it(`accepts a valid safe search string for "${key}"`, function () {
                assertAccepts(key, ' claudpsnd@yahoo.ca ');
            });

            it(`rejects an invalid search string (UUID-like) for "${key}"`, function () {
                assertRejects(key, VALID_UUID);
            });

            it(`rejects a non-string value for "${key}"`, function () {
                assertRejects(key, 123);
            });
        });
    });

    describe('Simple password fields', function () {
        ['password', 'new_password', 'newPassword'].forEach(key => {
            it(`accepts a valid simple password for "${key}"`, function () {
                assertAccepts(key, 'secret782*goo');
            });

            it(`rejects a too-short password for "${key}"`, function () {
                assertRejects(key, 'short');
            });

            it(`rejects a too-long password for "${key}"`, function () {
                assertRejects(key, 'thisPasswordIsWayTooLongToBeValid');
            });
        });
    });

    describe('Strong password fields', function () {
        ['strong_password', 'strongPassword'].forEach(key => {
            it(`accepts a valid strong password for "${key}"`, function () {
                assertAccepts(key, 'Password123!');
            });

            it(`rejects a weak/short password for "${key}"`, function () {
                assertRejects(key, 'short');
            });
        });
    });

    describe('Email field (isEmailString)', function () {
        it('accepts a valid email', function () {
            assertAccepts('email', 'test@example.com');
        });

        it('rejects an invalid email', function () {
            assertRejects('email', 'invalid-email');
        });
    });

    describe('Phone number fields (isPhoneNumber)', function () {
        ['phone_number', 'phoneNumber'].forEach(key => {
            it(`accepts a valid phone number for "${key}"`, function () {
                assertAccepts(key, '123-456-7890');
            });

            it(`rejects an invalid phone number for "${key}"`, function () {
                assertRejects(key, '123');
            });
        });
    });

    describe('Country code fields (isCountryCodeString)', function () {
        ['country_code', 'countryCode'].forEach(key => {
            it(`accepts a valid country code for "${key}"`, function () {
                assertAccepts(key, '+1');
            });

            it(`rejects an invalid country code for "${key}"`, function () {
                assertRejects(key, '1');
            });
        });
    });

    describe('User role request text fields (isTextString)', function () {
        const textKeys = [
            'requested_by_name',
            'requestedByName',
            'requested_by_email',
            'requestedByEmail',
            'requested_by_phone',
            'requestedByPhone',
            'approved_by_name',
            'approvedByName',
            'approved_by_email',
            'approvedByEmail',
            'approved_by_phone',
            'approvedByPhone',
        ];

        textKeys.forEach(key => {
            it(`accepts text for "${key}"`, function () {
                assertAccepts(key, 'Requester <person>@example.com');
            });

            it(`rejects non-text for "${key}"`, function () {
                assertRejects(key, 123);
            });
        });
    });

    describe('User role request status fields', function () {
        ['approved_status', 'approvedStatus'].forEach(key => {
            it(`accepts a user role request status for "${key}"`, function () {
                assertAccepts(key, 'info_needed');
            });

            it(`rejects an invalid user role request status for "${key}"`, function () {
                assertRejects(key, 'not_a_status');
            });
        });
    });

    describe('User role request role fields', function () {
        ['user_role_request_role', 'userRoleRequestRole'].forEach(key => {
            it(`accepts a requestable user role for "${key}"`, function () {
                assertAccepts(key, 'student');
                assertAccepts(key, 'intern');
                assertAccepts(key, 'volunteer');
            });

            it(`rejects a non-requestable user role for "${key}"`, function () {
                assertRejects(key, 'user');
                assertRejects(key, 'cc_admin');
                assertRejects(key, 'students');
            });
        });
    });

    describe('URL-safe token fields (isUrlSafeString)', function () {
        const tokenKeys = ['token', 'email_confirm_token', 'emailConfirmToken', 'verification_token', 'verificationToken'];

        tokenKeys.forEach(key => {
            it(`accepts a valid url-safe token for "${key}"`, function () {
                assertAccepts(key, 'abc.123');
            });

            it(`rejects an empty token for "${key}"`, function () {
                assertRejects(key, '');
            });
        });
    });

    describe('UUID fields (isValidUuidString)', function () {
        const uuidKeys = [
            'uuid',
            'item_id',
            'user_id',
            'address_id',
            'addressId',
            'image_id',
            'itemId',
            'userId',
            'imageId',
            'order_id',
            'orderId',
            'category_id',
            'categoryId',
            'parent_id',
            'parentId',
            'college_id',
            'collegeId',
            'campus_id',
            'campusId',
            'program_id',
            'programId',
            'id',
            'institution_id',
            'institutionId',
            'role_assignment_id',
            'roleAssignmentId',
            'user_role_id',
            'userRoleId',
            'phone_number_id',
            'phoneNumberId',
            'entity_id',
            'entityId',
            'changed_by',
            'changedBy',
            'request_id',
            'requestId',
            'approved_by_user_id',
            'approvedByUserId',
        ];

        uuidKeys.forEach(key => {
            it(`accepts a valid UUID for "${key}"`, function () {
                assertAccepts(key, VALID_UUID);
            });

            it(`rejects an invalid UUID for "${key}"`, function () {
                assertRejects(key, INVALID_UUID);
            });
        });
    });

    describe('Integer string fields (isValidIntegerString)', function () {
        ['offset_number', 'offsetNumber', 'number_of_orders', 'numberOfOrders', 'price', 'from', 'number', 'limit', 'offset'].forEach(
            key => {
                it(`accepts a valid integer string for "${key}"`, function () {
                    assertAccepts(key, '10');
                });

                it(`rejects a non-integer value for "${key}"`, function () {
                    assertRejects(key, 'abc');
                });
            },
        );
    });

    describe('About field (isValidJsonString on raw value)', function () {
        it('accepts a valid JSON string for "about"', function () {
            assertAccepts('about', '{"key":"value"}');
        });

        it('rejects an invalid JSON string for "about"', function () {
            assertRejects('about', 'invalid json');
        });
    });

    describe('JSON object fields (isValidJsonString on JSON.stringify)', function () {
        ['weight', 'dimensions', 'permission', 'scope_data', 'scopeData', 'meta_data', 'metaData'].forEach(key => {
            it(`accepts a valid object for "${key}"`, function () {
                assertAccepts(key, { a: 1, b: 'two' });
            });

            it(`rejects an unserializable value (undefined) for "${key}"`, function () {
                // JSON.stringify(undefined) === undefined, which fails isValidJsonString.
                const out = validateProperties({ [key]: undefined });
                assert.deepStrictEqual(out, {}, `Expected "${key}" to be rejected for undefined value`);
            });
        });
    });

    describe('Aliases field (isValidArrayOfStrings)', function () {
        it('accepts a valid array of strings', function () {
            assertAccepts('aliases', ['a', 'b', 'c']);
        });

        it('rejects a non-array value', function () {
            assertRejects('aliases', 'not an array');
        });

        it('rejects an array containing non-strings', function () {
            assertRejects('aliases', ['a', 1]);
        });
    });

    describe('URL fields (isImageUrl || isValidUrl)', function () {
        ['image_url', 'imageUrl', 'website', 'file_url', 'fileUrl'].forEach(key => {
            it(`accepts a valid URL for "${key}"`, function () {
                assertAccepts(key, 'http://example.com/file.pdf');
            });

            it(`rejects an invalid URL for "${key}"`, function () {
                assertRejects(key, 'invalid url!');
            });
        });
    });

    describe('Domain fields (isValidDomainName)', function () {
        const domainKeys = ['domain_name', 'domainName', 'domain', 'email_domain', 'emailDomain', 'email_domain_name', 'emailDomainName'];

        domainKeys.forEach(key => {
            it(`accepts a valid domain for "${key}"`, function () {
                assertAccepts(key, 'sub.example.com');
            });

            it(`rejects an invalid domain for "${key}"`, function () {
                assertRejects(key, 'invalid_domain');
            });
        });
    });

    describe('Timestamp fields (isValidTimestampzString || isValidTimestampString)', function () {
        [
            'expires_at',
            'expiresAt',
            'starts_at',
            'startsAt',
            'start_time',
            'startTime',
            'end_time',
            'endTime',
            'approved_at',
            'approvedAt',
        ].forEach(key => {
            it(`accepts a valid timestamptz for "${key}"`, function () {
                assertAccepts(key, '2023-10-27T10:00:00Z');
            });

            it(`accepts a valid timestamp (no TZ) for "${key}"`, function () {
                assertAccepts(key, '2023-10-27T10:00:00');
            });

            it(`rejects an invalid date for "${key}"`, function () {
                assertRejects(key, 'invalid-date');
            });
        });
    });

    describe('General behaviour', function () {
        it('returns an empty object for null input', function () {
            assert.deepStrictEqual(validateProperties(null), {});
        });

        it('returns an empty object for undefined input', function () {
            assert.deepStrictEqual(validateProperties(undefined), {});
        });

        it('returns an empty object when called with no arguments', function () {
            assert.deepStrictEqual(validateProperties(), {});
        });

        it('ignores unknown keys', function () {
            const out = validateProperties({ unknown_key: 'any value', another: 42 });
            assert.deepStrictEqual(out, {});
        });

        it('keeps valid keys and drops invalid ones in a mixed object', function () {
            const input = {
                first_name: 'Pankaj',
                last_name: 123, // invalid
                email: 'test@example.com',
                phone_number: '123', // invalid
                uuid: VALID_UUID,
                unknown_key: 'ignored',
            };
            const expected = {
                first_name: 'Pankaj',
                email: 'test@example.com',
                uuid: VALID_UUID,
            };
            assert.deepStrictEqual(validateProperties(input), expected);
        });

        it('validates a comprehensive object containing every supported key', function () {
            const testObject = {
                first_name: 'Pankaj',
                firstName: 'Pankaj',
                username: 'pankaj',
                last_name: 'Sharma',
                lastName: 'Sharma',
                new_status: 'Active',
                newStatus: 'Active',
                description: 'A description',
                comment: 'A comment',
                status: 'Pending',
                name: 'Pankaj',
                title: 'Mr',
                brand: 'Apple',
                short_description: 'Short desc',
                shortDescription: 'Short desc',
                college_name: 'Harvard University',
                collegeName: 'Harvard University',
                campus_name: 'Main Campus',
                campusName: 'Main Campus',
                institution_name: 'Institution',
                institutionName: 'Institution',
                program_name: 'Program',
                programName: 'Program',
                role_name: 'Admin',
                roleName: 'Admin',
                document_type: 'PDF',
                documentType: 'PDF',
                reason: 'Reason',
                type: 'Type',
                street: '103, main market',
                city: 'Raipur',
                state: 'Chhattisgarh',
                country: 'India',
                postal_code: '492001',
                postalCode: '492001',
                is_primary: true,
                isPrimary: true,
                role: 'Role',
                role_id: 'RoleID',
                roleId: 'RoleID',
                campus: 'Campus',
                strong_password: 'Password123!',
                strongPassword: 'Password123!',
                new_password: 'Password123',
                newPassword: 'Password123',
                password: 'Password123',
                email: 'test@example.com',
                phone_number: '123-456-7890',
                phoneNumber: '123-456-7890',
                token: 'abc.123',
                email_confirm_token: 'abc.123',
                emailConfirmToken: 'abc.123',
                verification_token: 'abc.123',
                verificationToken: 'abc.123',
                uuid: VALID_UUID,
                user_id: VALID_UUID,
                item_id: VALID_UUID,
                itemId: VALID_UUID,
                address_id: VALID_UUID,
                addressId: VALID_UUID,
                image_id: VALID_UUID,
                imageId: VALID_UUID,
                userId: VALID_UUID,
                order_id: VALID_UUID,
                orderId: VALID_UUID,
                category_id: VALID_UUID,
                categoryId: VALID_UUID,
                parent_id: VALID_UUID,
                parentId: VALID_UUID,
                institution_id: VALID_UUID,
                institutionId: VALID_UUID,
                role_assignment_id: VALID_UUID,
                roleAssignmentId: VALID_UUID,
                user_role_id: VALID_UUID,
                userRoleId: VALID_UUID,
                phone_number_id: VALID_UUID,
                phoneNumberId: VALID_UUID,
                college_id: VALID_UUID,
                collegeId: VALID_UUID,
                campus_id: VALID_UUID,
                campusId: VALID_UUID,
                program_id: VALID_UUID,
                programId: VALID_UUID,
                id: VALID_UUID,
                from: '0',
                number: '10',
                period: 'Monthly',
                offset_number: '10',
                offsetNumber: '10',
                number_of_orders: '5',
                numberOfOrders: '5',
                price: '100',
                about: '{"key":"value"}',
                weight: { value: 10, unit: 'kg' },
                dimensions: { width: 10, height: 20 },
                permission: { res: 'a' },
                scope_data: { a: 1 },
                scopeData: { a: 1 },
                meta_data: { b: 2 },
                metaData: { b: 2 },
                image_url: 'http://example.com/image.jpg',
                imageUrl: 'http://example.com/image.jpg',
                website: 'http://example.com',
                file_url: 'http://example.com/file.pdf',
                fileUrl: 'http://example.com/file.pdf',
                active: true,
                aliases: ['a', 'b'],
                domain: 'example.com',
                domain_name: 'sub.example.com',
                domainName: 'sub.example.com',
                email_domain: 'example.com',
                emailDomain: 'example.com',
                email_domain_name: 'school.edu.in',
                emailDomainName: 'school.edu.in',
                expires_at: '2023-10-27T10:00:00Z',
                expiresAt: '2023-10-27T10:00:00',
                entity_type: 'document',
                entityType: 'document',
                action_type: 'create',
                actionType: 'create',
                approved_by_role: 'cc_admin',
                approvedByRole: 'cc_admin',
                entity_id: VALID_UUID,
                entityId: VALID_UUID,
                changed_by: VALID_UUID,
                changedBy: VALID_UUID,
                request_id: VALID_UUID,
                requestId: VALID_UUID,
                approved_by_user_id: VALID_UUID,
                approvedByUserId: VALID_UUID,
                start_time: '2023-10-27T10:00:00Z',
                startTime: '2023-10-27T10:00:00Z',
                starts_at: '2023-10-27T10:00:00Z',
                startsAt: '2023-10-27T10:00:00Z',
                end_time: '2023-10-27T10:00:00Z',
                endTime: '2023-10-27T10:00:00Z',
                approved_at: '2023-10-27T10:00:00Z',
                approvedAt: '2023-10-27T10:00:00Z',
                approved_status: 'info_needed',
                approvedStatus: 'on_hold',
                requested_by_name: 'Requester <person>@example.com',
                requestedByName: 'Requester <person>@example.com',
                requested_by_email: 'requester@example.com',
                requestedByEmail: 'requester@example.com',
                requested_by_phone: '+1 416 555 0101',
                requestedByPhone: '+1 416 555 0101',
                approved_by_name: 'Approver <person>@example.com',
                approvedByName: 'Approver <person>@example.com',
                approved_by_email: 'approver@example.com',
                approvedByEmail: 'approver@example.com',
                approved_by_phone: '+1 647 555 0101',
                approvedByPhone: '+1 647 555 0101',
                limit: '50',
                offset: '0',
            };
            const validatedObject = validateProperties(testObject);
            assert.deepStrictEqual(validatedObject, testObject, 'Validation failed for some fields');
        });

        it('rejects every supported key when given invalid values', function () {
            const testObject = {
                first_name: 123,
                last_name: 123,
                lastName: 123,
                street: 123,
                city: 123,
                state: 123,
                country: 123,
                postal_code: {},
                postalCode: [],
                is_primary: 'yes',
                isPrimary: 'invalid',
                address_id: 'invalid-uuid',
                addressId: 'invalid-uuid',
                phone_number_id: 'invalid-uuid',
                phoneNumberId: 'invalid-uuid',
                search_string: 123,
                password: 'short',
                new_password: 'thisPasswordIsDefinitelyWayTooLong',
                strong_password: 'short',
                email: 'invalid-email',
                phone_number: '123',
                token: '',
                uuid: 'invalid-uuid',
                period: 123,
                offset_number: 'abc',
                about: 'invalid json',
                image_url: 'invalid url!',
                website: 'ftp://bad',
                domain: 'invalid_domain',
                active: 'not a bool',
                aliases: 'not an array',
                expires_at: 'invalid-date',
                unknown_key: 'any value',
            };
            const validatedObject = validateProperties(testObject);
            assert.deepStrictEqual(validatedObject, {}, 'Should return empty object when all validations fail');
        });
    });
});
