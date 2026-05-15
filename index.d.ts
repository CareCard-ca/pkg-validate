/**
 * Utility function to validate multiple properties of an object at once.
 */
export function validateProperties(obj?: Record<string, any>): Record<string, any>;

/**
 * Options for {@link validateWhitelistProperties}.
 */
export interface ValidateWhitelistPropertiesOptions {
    /** Properties allowed in the input but not required. */
    optionalProperties?: string[];
    /** When true, the returned object's keys are converted to snake_case. */
    convertToSnakeCase?: boolean;
    /**
     * When true, the returned object is flattened so that every validated leaf
     * becomes a top-level key. Existing dot-path flattening is preserved, and
     * multiple leaves from the same nested parent can flatten to direct leaf
     * property names (e.g. `{ email: 'Jane' }`). If duplicate direct leaf keys
     * exist at different nesting levels, the higher-level property wins. No
     * nested objects remain in the output. Applied after snake_case conversion.
     */
    flattenOutput?: boolean;
}

/**
 * Validates and transforms whitelisted properties from an input object.
 *
 * - Supports nested objects via dot-notation paths (e.g. `"address.city"`),
 *   up to 5 levels deep. The function checks that each path resolves to an
 *   existing leaf property and validates the leaf value by its leaf segment.
 * - Extracts only the whitelisted (required + optional) leaf properties and
 *   rebuilds the same nested shape in the result.
 * - Validates values via {@link validateProperties}.
 * - Throws a "Bad_Input" error when any required property is missing/invalid,
 *   when a provided optional property has an invalid value, when a path
 *   exceeds 5 levels of nesting, or when the combined count of
 *   `requiredProperties` and `options.optionalProperties` exceeds 5000.
 * - Array values are supported: if a leaf value is an array, the per-leaf
 *   validator is applied to each element. The leaf is accepted only when every
 *   element passes validation, and the returned value is an array of the
 *   validated elements (e.g. `{ name: ["First", "Other"] }` is validated like
 *   `{ name: "First" }` and `{ name: "Other" }` individually).
 * - Optionally converts the resulting keys (including nested keys) to snake_case.
 * - Optionally flattens the result after snake_case conversion.
 *
 * @param inputObject The input object (e.g. `req.body` or `req.params`).
 * @param requiredProperties Leaf paths that must be present and valid. Dot-notation supported.
 * @param options Optional additional leaf paths plus output transformation flags.
 */
export function validateWhitelistProperties(
    inputObject: Record<string, any>,
    requiredProperties?: string[],
    options?: ValidateWhitelistPropertiesOptions,
): Promise<Record<string, any>>;

/** Checks if the string is a valid image URL format. */
export function isImageUrl(imageUrl: any): boolean;
/** Checks if the value is an integer. */
export function isInteger(number: any): boolean;
/** Checks if the string is a valid JSON string and can be parsed into an object. */
export function isValidJsonString(str: any): boolean;
/** Checks if the string represents a valid integer. */
export function isValidIntegerString(str: any): boolean;
/** Checks if the string is a valid UUID. */
export function isValidUuidString(str: any): boolean;
/** Checks if the string contains only alphanumeric characters, spaces, underscores, or hyphens. */
export function isCharactersString(str: any): boolean;
/** Checks if the string is a valid name format. */
export function isNameString(str: any): boolean;
/** Checks if the string is safe for search queries. */
export function isSafeSearchString(str: any): boolean;
/** Checks if the string is a valid email address. */
export function isEmailString(email: any): boolean;
/** Checks if the string is a valid JWT format. */
export function isJwtString(jwt: any): boolean;
/** Checks if the string is a valid strong password. */
export function isPasswordString(password: any): boolean;
/** Checks if the string is a valid simple password. */
export function isSimplePasswordString(password: any): boolean;
/** Returns a failure message if the password is not strong enough. */
export function isPasswordStringFailureMessage(password: any): string | null;
/** Returns a failure message if the password is not valid as a simple password. */
export function isSimplePasswordStringFailureMessage(password: any): string | null;
/** Checks if the string is a valid username. */
export function isUsernameString(str: any): boolean;
/** Checks if the string is a valid phone number. */
export function isPhoneNumber(str: any): boolean;
/** Checks if the string is URL-safe. */
export function isUrlSafeString(inputString: any): boolean;
/** Checks if the string length is between 6 and 24 characters. */
export function isString6To24CharacterLong(password: any): boolean;
/** Checks if the string length is between 6 and 16 characters. */
export function isString6To16CharacterLong(password: any): boolean;
/** Checks if the string is a valid Canadian province abbreviation (ON, QC). */
export function isProvinceString(inputString: any): boolean;
/** Checks if the value is a boolean. */
export function isBoolValue(inputValue: any): boolean;
/** Checks if the string is a valid Canadian postal code. */
export function isPostalCodeString(inputString: any): boolean;
/** Checks if the string contains only allowed "safe" characters. */
export function isSafeString(str: any): boolean;
/** Checks if a string exists within a given array of strings (case-insensitive). */
export function isInStringArray(StringArray: string[], inputString: any): boolean;
/** Checks if the string is a valid country code (e.g., +1). */
export function isCountryCodeString(str: any): boolean;
/** Checks if the string is a valid domain name. */
export function isValidDomainName(domain: any): boolean;
/** Checks if the string is a valid ISO 8601 timestamp with time zone. */
export function isValidTimestampzString(str: any): boolean;
/** Checks if the string is a valid ISO 8601 timestamp without time zone. */
export function isValidTimestampString(str: any): boolean;

/** Checks if the string is a valid URL. */
export function isValidUrl(url: any): boolean;
/** Checks if the array contains only safe strings. */
export function isValidArrayOfStrings(arr: any): boolean;

/**
 * Utility functions for validating various types of strings and values.
 * @deprecated Use direct imports instead.
 */
export const validate: {
    isImageUrl: typeof isImageUrl;
    isInteger: typeof isInteger;
    isValidJsonString: typeof isValidJsonString;
    isValidIntegerString: typeof isValidIntegerString;
    isValidUuidString: typeof isValidUuidString;
    isCharactersString: typeof isCharactersString;
    isNameString: typeof isNameString;
    isSafeSearchString: typeof isSafeSearchString;
    isEmailString: typeof isEmailString;
    isJwtString: typeof isJwtString;
    isPasswordString: typeof isPasswordString;
    isSimplePasswordString: typeof isSimplePasswordString;
    isPasswordStringFailureMessage: typeof isPasswordStringFailureMessage;
    isSimplePasswordStringFailureMessage: typeof isSimplePasswordStringFailureMessage;
    isUsernameString: typeof isUsernameString;
    isPhoneNumber: typeof isPhoneNumber;
    isUrlSafeString: typeof isUrlSafeString;
    isString6To24CharacterLong: typeof isString6To24CharacterLong;
    isString6To16CharacterLong: typeof isString6To16CharacterLong;
    isProvinceString: typeof isProvinceString;
    isBoolValue: typeof isBoolValue;
    isPostalCodeString: typeof isPostalCodeString;
    isSafeString: typeof isSafeString;
    isInStringArray: typeof isInStringArray;
    isCountryCodeString: typeof isCountryCodeString;
    isValidDomainName: typeof isValidDomainName;
    isValidTimestampzString: typeof isValidTimestampzString;
    isValidTimestampString: typeof isValidTimestampString;
    isValidUrl: typeof isValidUrl;
    isValidArrayOfStrings: typeof isValidArrayOfStrings;
};
