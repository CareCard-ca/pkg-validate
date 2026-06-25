/**
 * Compile-time type tests for `@carecard/validate`.
 *
 * Each `expectType<T>(value)` call asserts that the inferred type of `value`
 * is assignable to the explicit type parameter `T`. If the public type surface
 * declared in `index.d.ts` changes in a backwards-incompatible way, this file
 * will fail to compile, and `npm run test:types` (`tsc --noEmit`) will fail.
 *
 * This file is intentionally a pure type-level test — it has no runtime
 * assertions and is not executed by Mocha. It is type-checked via the
 * `include` glob in `tsconfig.json` (`test/**\/*.ts`).
 */

import validateCommonJs = require('@carecard/validate');
import * as validatePackage from '@carecard/validate';
import {
    DEFAULT_USER_ROLE_REQUEST_ROLE,
    REQUIRE_SCOPE_WHEN_ROLE_OR_SCOPE_PRESENT,
    ValidateNewUserRoleRequestOptions,
    ValidateNewUserRoleRequestPayload,
    ValidatePropertiesInput,
    ValidatePropertiesResult,
    ValidateWhitelistPropertiesFunction,
    isBoolValue,
    isCcIdString,
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
    isStreetString,
    isString6To16CharacterLong,
    isString6To24CharacterLong,
    isUrlSafeString,
    isUsernameString,
    isValidArrayOfStrings,
    isValidDomainName,
    isValidIntegerString,
    isValidJsonString,
    isValidDateString,
    isValidTimestampString,
    isValidTimestampzString,
    isValidUrl,
    isValidUuidString,
    isTextString,
    isUserRoleRequestRoleString,
    isUserRoleRequestStatusString,
    validate,
    validateNewUserRoleRequestObject,
    validateProperties,
    validateWhitelistProperties,
    ValidateWhitelistPropertiesOptions,
} from '@carecard/validate';

/**
 * Compile-time helper. Forces TypeScript to check that `value` is assignable
 * to the explicit generic type parameter `T`. It is a no-op at runtime.
 */
function expectType<T>(_value: T): void {
    /* no-op */
}

type Equal<Left, Right> = (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2 ? true : false;

type Expect<Condition extends true> = Condition;

type ExpectedRuntimeExportKey =
    | 'DEFAULT_USER_ROLE_REQUEST_ROLE'
    | 'REQUIRE_SCOPE_WHEN_ROLE_OR_SCOPE_PRESENT'
    | 'isBoolValue'
    | 'isCcIdString'
    | 'isCharactersString'
    | 'isCountryCodeString'
    | 'isEmailString'
    | 'isImageUrl'
    | 'isInStringArray'
    | 'isInteger'
    | 'isJwtString'
    | 'isNameString'
    | 'isPasswordString'
    | 'isPasswordStringFailureMessage'
    | 'isPhoneNumber'
    | 'isPostalCodeString'
    | 'isProvinceString'
    | 'isSafeSearchString'
    | 'isSafeString'
    | 'isSimplePasswordString'
    | 'isSimplePasswordStringFailureMessage'
    | 'isStreetString'
    | 'isString6To16CharacterLong'
    | 'isString6To24CharacterLong'
    | 'isTextString'
    | 'isUrlSafeString'
    | 'isUserRoleRequestRoleString'
    | 'isUserRoleRequestStatusString'
    | 'isUsernameString'
    | 'isValidArrayOfStrings'
    | 'isValidDomainName'
    | 'isValidDateString'
    | 'isValidIntegerString'
    | 'isValidJsonString'
    | 'isValidTimestampString'
    | 'isValidTimestampzString'
    | 'isValidUrl'
    | 'isValidUuidString'
    | 'validate'
    | 'validateNewUserRoleRequestObject'
    | 'validateProperties'
    | 'validateWhitelistProperties';

const exportKeysMatchRuntime: Expect<Equal<keyof typeof validatePackage, ExpectedRuntimeExportKey>> = true;
expectType<true>(exportKeysMatchRuntime);
const commonJsImportKeysMatchRuntime: Expect<Equal<keyof typeof validateCommonJs, ExpectedRuntimeExportKey>> = true;
expectType<true>(commonJsImportKeysMatchRuntime);
expectType<typeof validatePackage>(validateCommonJs);

// ---------------------------------------------------------------------------
// validateWhitelistProperties + options interface
// ---------------------------------------------------------------------------

// Signature: (ValidatePropertiesInput, string[]?, ValidateWhitelistPropertiesOptions?) => Promise<ValidatePropertiesResult>
expectType<ValidateWhitelistPropertiesFunction>(validateWhitelistProperties);
expectType<5>(validateWhitelistProperties.MAX_NESTING_DEPTH);
expectType<5000>(validateWhitelistProperties.MAX_KEYS_PER_CALL);
expectType<typeof validateWhitelistProperties>(validateWhitelistProperties.validateWhitelistProperties);

// Return type is a Promise of an object.
expectType<Promise<ValidatePropertiesResult>>(validateWhitelistProperties({ a: 1 }));
expectType<Promise<ValidatePropertiesResult>>(validateWhitelistProperties({ a: 1 }, ['a']));
expectType<Promise<ValidatePropertiesResult>>(
    validateWhitelistProperties({ a: 1 }, ['a'], {
        optionalProperties: ['b'],
        convertToSnakeCase: true,
        flattenOutput: true,
        flattenKeyStyle: 'path',
    }),
);

// Options interface: all fields optional.
const optsEmpty: ValidateWhitelistPropertiesOptions = {};
const optsPartial: ValidateWhitelistPropertiesOptions = { optionalProperties: ['x'] };
const optsFull: ValidateWhitelistPropertiesOptions = {
    optionalProperties: ['x', 'y'],
    convertToSnakeCase: false,
    flattenOutput: true,
    flattenKeyStyle: 'leaf',
};
expectType<ValidateWhitelistPropertiesOptions>(optsEmpty);
expectType<ValidateWhitelistPropertiesOptions>(optsPartial);
expectType<ValidateWhitelistPropertiesOptions>(optsFull);
expectType<readonly string[] | null | undefined>(optsFull.optionalProperties);
expectType<boolean | undefined>(optsFull.convertToSnakeCase);
expectType<boolean | undefined>(optsFull.flattenOutput);
expectType<'path' | 'leaf' | undefined>(optsFull.flattenKeyStyle);

// ---------------------------------------------------------------------------
// validateProperties
// ---------------------------------------------------------------------------

expectType<(obj?: ValidatePropertiesInput) => ValidatePropertiesResult>(validateProperties);
expectType<ValidatePropertiesResult>(validateProperties());
expectType<ValidatePropertiesResult>(validateProperties({ first_name: 'Jane' }));
expectType<ValidatePropertiesResult>(validateProperties(null));

// ---------------------------------------------------------------------------
// Boolean-returning validators: (unknown) => boolean
// ---------------------------------------------------------------------------

type BoolValidator = (input: unknown) => boolean;

expectType<BoolValidator>(isImageUrl);
expectType<BoolValidator>(isInteger);
expectType<BoolValidator>(isValidJsonString);
expectType<BoolValidator>(isValidIntegerString);
expectType<BoolValidator>(isValidUuidString);
expectType<BoolValidator>(isCcIdString);
expectType<BoolValidator>(isCharactersString);
expectType<BoolValidator>(isStreetString);
expectType<BoolValidator>(isNameString);
expectType<BoolValidator>(isSafeSearchString);
expectType<BoolValidator>(isEmailString);
expectType<BoolValidator>(isJwtString);
expectType<BoolValidator>(isPasswordString);
expectType<BoolValidator>(isSimplePasswordString);
expectType<BoolValidator>(isUsernameString);
expectType<BoolValidator>(isPhoneNumber);
expectType<BoolValidator>(isUrlSafeString);
expectType<BoolValidator>(isString6To24CharacterLong);
expectType<BoolValidator>(isString6To16CharacterLong);
expectType<BoolValidator>(isProvinceString);
expectType<BoolValidator>(isBoolValue);
expectType<BoolValidator>(isPostalCodeString);
expectType<BoolValidator>(isSafeString);
expectType<BoolValidator>(isTextString);
expectType<BoolValidator>(isCountryCodeString);
expectType<BoolValidator>(isUserRoleRequestRoleString);
expectType<BoolValidator>(isUserRoleRequestStatusString);
expectType<BoolValidator>(isValidDomainName);
expectType<BoolValidator>(isValidDateString);
expectType<BoolValidator>(isValidTimestampzString);
expectType<BoolValidator>(isValidTimestampString);
expectType<BoolValidator>(isValidUrl);
expectType<BoolValidator>(isValidArrayOfStrings);

// Confirm returns are actually `boolean`, not `any`.
expectType<boolean>(isEmailString('a@b.com'));
expectType<boolean>(isInteger(1));
expectType<boolean>(isValidUuidString('x'));
expectType<boolean>(isCcIdString('a1b2c3d4'));
expectType<boolean>(isStreetString('103 Main Street'));
expectType<boolean>(isTextString('free text'));
expectType<boolean>(isUserRoleRequestRoleString('student'));
expectType<boolean>(isUserRoleRequestStatusString('pending'));
expectType<boolean>(isBoolValue(true));
expectType<boolean>(isValidDateString('2026-06-08'));
expectType<boolean>(isValidArrayOfStrings(['a']));

// ---------------------------------------------------------------------------
// String-or-null validators
// ---------------------------------------------------------------------------

expectType<(password: unknown) => string | null>(isPasswordStringFailureMessage);
expectType<(password: unknown) => string | null>(isSimplePasswordStringFailureMessage);
expectType<string | null>(isPasswordStringFailureMessage('short'));
expectType<string | null>(isSimplePasswordStringFailureMessage('short'));

// ---------------------------------------------------------------------------
// Two-argument validator: isInStringArray
// ---------------------------------------------------------------------------

expectType<(arr: string[], input: unknown) => boolean>(isInStringArray);
expectType<boolean>(isInStringArray(['ON', 'QC'], 'on'));

// ---------------------------------------------------------------------------
// New user-role request helper exports
// ---------------------------------------------------------------------------

expectType<'student'>(DEFAULT_USER_ROLE_REQUEST_ROLE);
expectType<'whenRoleOrScopePresent'>(REQUIRE_SCOPE_WHEN_ROLE_OR_SCOPE_PRESENT);
expectType<ValidateNewUserRoleRequestOptions>({});
expectType<ValidateNewUserRoleRequestOptions>({ defaultRole: 'student' });
expectType<ValidateNewUserRoleRequestOptions>({ defaultRole: undefined, requireScope: false });
expectType<ValidateNewUserRoleRequestOptions>({ requireScope: REQUIRE_SCOPE_WHEN_ROLE_OR_SCOPE_PRESENT });
expectType<ValidateNewUserRoleRequestPayload>(
    validateNewUserRoleRequestObject({
        roleName: 'student',
        institutionId: '11111111-1111-4111-8111-111111111111',
        campusId: '22222222-2222-4222-8222-222222222222',
        programId: '33333333-3333-4333-8333-333333333333',
    }),
);

// ---------------------------------------------------------------------------
// `validate` namespace (deprecated). Every key must still be present and have
// the same callable type as its top-level counterpart.
// ---------------------------------------------------------------------------

expectType<typeof isImageUrl>(validate.isImageUrl);
expectType<typeof isInteger>(validate.isInteger);
expectType<typeof isValidJsonString>(validate.isValidJsonString);
expectType<typeof isValidIntegerString>(validate.isValidIntegerString);
expectType<typeof isValidUuidString>(validate.isValidUuidString);
expectType<typeof isCcIdString>(validate.isCcIdString);
expectType<typeof isCharactersString>(validate.isCharactersString);
expectType<typeof isStreetString>(validate.isStreetString);
expectType<typeof isNameString>(validate.isNameString);
expectType<typeof isSafeSearchString>(validate.isSafeSearchString);
expectType<typeof isEmailString>(validate.isEmailString);
expectType<typeof isJwtString>(validate.isJwtString);
expectType<typeof isPasswordString>(validate.isPasswordString);
expectType<typeof isSimplePasswordString>(validate.isSimplePasswordString);
expectType<typeof isPasswordStringFailureMessage>(validate.isPasswordStringFailureMessage);
expectType<typeof isSimplePasswordStringFailureMessage>(validate.isSimplePasswordStringFailureMessage);
expectType<typeof isUsernameString>(validate.isUsernameString);
expectType<typeof isPhoneNumber>(validate.isPhoneNumber);
expectType<typeof isUrlSafeString>(validate.isUrlSafeString);
expectType<typeof isString6To24CharacterLong>(validate.isString6To24CharacterLong);
expectType<typeof isString6To16CharacterLong>(validate.isString6To16CharacterLong);
expectType<typeof isProvinceString>(validate.isProvinceString);
expectType<typeof isBoolValue>(validate.isBoolValue);
expectType<typeof isPostalCodeString>(validate.isPostalCodeString);
expectType<typeof isSafeString>(validate.isSafeString);
expectType<typeof isTextString>(validate.isTextString);
expectType<typeof isInStringArray>(validate.isInStringArray);
expectType<typeof isUserRoleRequestStatusString>(validate.isUserRoleRequestStatusString);
expectType<typeof isUserRoleRequestRoleString>(validate.isUserRoleRequestRoleString);
expectType<typeof isCountryCodeString>(validate.isCountryCodeString);
expectType<typeof isValidDomainName>(validate.isValidDomainName);
expectType<typeof isValidTimestampzString>(validate.isValidTimestampzString);
expectType<typeof isValidTimestampString>(validate.isValidTimestampString);
expectType<typeof isValidUrl>(validate.isValidUrl);
expectType<typeof isValidArrayOfStrings>(validate.isValidArrayOfStrings);
