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
    isStreetString,
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
    validate,
    validateProperties,
    validateWhitelistProperties,
    ValidateWhitelistPropertiesOptions,
} from '../index';

/**
 * Compile-time helper. Forces TypeScript to check that `value` is assignable
 * to the explicit generic type parameter `T`. It is a no-op at runtime.
 */
function expectType<T>(_value: T): void {
    /* no-op */
}

// ---------------------------------------------------------------------------
// validateWhitelistProperties + options interface
// ---------------------------------------------------------------------------

// Signature: (Record<string, any>, string[]?, ValidateWhitelistPropertiesOptions?) => Promise<Record<string, any>>
expectType<
    (
        inputObject: Record<string, any>,
        requiredProperties?: string[],
        options?: ValidateWhitelistPropertiesOptions,
    ) => Promise<Record<string, any>>
>(validateWhitelistProperties);

// Return type is a Promise of an object.
expectType<Promise<Record<string, any>>>(validateWhitelistProperties({ a: 1 }));
expectType<Promise<Record<string, any>>>(validateWhitelistProperties({ a: 1 }, ['a']));
expectType<Promise<Record<string, any>>>(
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
expectType<string[] | undefined>(optsFull.optionalProperties);
expectType<boolean | undefined>(optsFull.convertToSnakeCase);
expectType<boolean | undefined>(optsFull.flattenOutput);
expectType<'path' | 'leaf' | undefined>(optsFull.flattenKeyStyle);

// ---------------------------------------------------------------------------
// validateProperties
// ---------------------------------------------------------------------------

expectType<(obj?: Record<string, any>) => Record<string, any>>(validateProperties);
expectType<Record<string, any>>(validateProperties());
expectType<Record<string, any>>(validateProperties({ first_name: 'Jane' }));

// ---------------------------------------------------------------------------
// Boolean-returning validators: (any) => boolean
// ---------------------------------------------------------------------------

type BoolValidator = (input: any) => boolean;

expectType<BoolValidator>(isImageUrl);
expectType<BoolValidator>(isInteger);
expectType<BoolValidator>(isValidJsonString);
expectType<BoolValidator>(isValidIntegerString);
expectType<BoolValidator>(isValidUuidString);
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
expectType<BoolValidator>(isCountryCodeString);
expectType<BoolValidator>(isValidDomainName);
expectType<BoolValidator>(isValidTimestampzString);
expectType<BoolValidator>(isValidTimestampString);
expectType<BoolValidator>(isValidUrl);
expectType<BoolValidator>(isValidArrayOfStrings);

// Confirm returns are actually `boolean`, not `any`.
expectType<boolean>(isEmailString('a@b.com'));
expectType<boolean>(isInteger(1));
expectType<boolean>(isValidUuidString('x'));
expectType<boolean>(isStreetString('103 Main Street'));
expectType<boolean>(isBoolValue(true));
expectType<boolean>(isValidArrayOfStrings(['a']));

// ---------------------------------------------------------------------------
// String-or-null validators
// ---------------------------------------------------------------------------

expectType<(password: any) => string | null>(isPasswordStringFailureMessage);
expectType<(password: any) => string | null>(isSimplePasswordStringFailureMessage);
expectType<string | null>(isPasswordStringFailureMessage('short'));
expectType<string | null>(isSimplePasswordStringFailureMessage('short'));

// ---------------------------------------------------------------------------
// Two-argument validator: isInStringArray
// ---------------------------------------------------------------------------

expectType<(arr: string[], input: any) => boolean>(isInStringArray);
expectType<boolean>(isInStringArray(['ON', 'QC'], 'on'));

// ---------------------------------------------------------------------------
// `validate` namespace (deprecated). Every key must still be present and have
// the same callable type as its top-level counterpart.
// ---------------------------------------------------------------------------

expectType<typeof isImageUrl>(validate.isImageUrl);
expectType<typeof isInteger>(validate.isInteger);
expectType<typeof isValidJsonString>(validate.isValidJsonString);
expectType<typeof isValidIntegerString>(validate.isValidIntegerString);
expectType<typeof isValidUuidString>(validate.isValidUuidString);
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
expectType<typeof isInStringArray>(validate.isInStringArray);
expectType<typeof isCountryCodeString>(validate.isCountryCodeString);
expectType<typeof isValidDomainName>(validate.isValidDomainName);
expectType<typeof isValidTimestampzString>(validate.isValidTimestampzString);
expectType<typeof isValidTimestampString>(validate.isValidTimestampString);
expectType<typeof isValidUrl>(validate.isValidUrl);
expectType<typeof isValidArrayOfStrings>(validate.isValidArrayOfStrings);
