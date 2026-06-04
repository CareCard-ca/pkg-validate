/**
 * Runtime-compatible TypeScript declarations for the CommonJS
 * `@carecard/validate` package.
 */

export type ValidatePropertiesInput = Record<string, unknown> | null | undefined;
export type ValidatePropertiesResult = Record<string, unknown>;
export type BoolValidator = (input: unknown) => boolean;
export type FailureMessageValidator = (input: unknown) => string | null;
export type InStringArrayValidator = (stringArray: readonly string[], input: unknown) => boolean;

/**
 * Utility function to validate multiple properties of an object at once.
 */
export function validateProperties(obj?: ValidatePropertiesInput): ValidatePropertiesResult;

export type ValidateWhitelistFlattenKeyStyle = 'path' | 'leaf';

/**
 * Options for {@link validateWhitelistProperties}.
 */
export interface ValidateWhitelistPropertiesOptions {
    /** Properties allowed in the input but not required. */
    optionalProperties?: readonly string[] | null;
    /** When true, the returned object's keys are converted to snake_case. */
    convertToSnakeCase?: boolean;
    /**
     * When true, the returned object is flattened so that every validated leaf
     * becomes a top-level key. No nested objects remain in the output. Applied
     * after snake_case conversion.
     */
    flattenOutput?: boolean;
    /**
     * Controls flattened key naming when `flattenOutput` is true.
     * - `path` uses full dot-notation paths, e.g. `{ "user.email": "Jane" }`.
     * - `leaf` uses only leaf names, e.g. `{ email: "Jane" }`.
     *
     * Defaults to `path`.
     */
    flattenKeyStyle?: ValidateWhitelistFlattenKeyStyle;
}

export interface ValidateWhitelistPropertiesFunction {
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
     *   validated elements.
     * - Optionally converts the resulting keys, including nested keys, to snake_case.
     * - Optionally flattens the result after snake_case conversion.
     *
     * @param inputObject The input object, for example `req.body` or `req.params`.
     * @param requiredProperties Leaf paths that must be present and valid. Dot notation is supported.
     * @param options Optional additional leaf paths plus output transformation flags.
     */
    (
        inputObject?: ValidatePropertiesInput,
        requiredProperties?: readonly string[] | null,
        options?: ValidateWhitelistPropertiesOptions | null,
    ): Promise<ValidatePropertiesResult>;
    validateWhitelistProperties: ValidateWhitelistPropertiesFunction;
    MAX_NESTING_DEPTH: 5;
    MAX_KEYS_PER_CALL: 5000;
}

export const validateWhitelistProperties: ValidateWhitelistPropertiesFunction;

export type UserRoleRequestRole = 'student' | 'intern' | 'volunteer';
export type UserRoleRequestScopeRequirement = boolean | typeof REQUIRE_SCOPE_WHEN_ROLE_OR_SCOPE_PRESENT;

export const DEFAULT_USER_ROLE_REQUEST_ROLE: 'student';
export const REQUIRE_SCOPE_WHEN_ROLE_OR_SCOPE_PRESENT: 'whenRoleOrScopePresent';

export interface ValidateNewUserRoleRequestOptions {
    defaultRole?: UserRoleRequestRole | undefined;
    requireScope?: UserRoleRequestScopeRequirement;
}

export interface ValidateNewUserRoleRequestInput extends Record<string, unknown> {
    role_name?: unknown;
    roleName?: unknown;
    role?: unknown;
    institution_id?: unknown;
    institutionId?: unknown;
    campus_id?: unknown;
    campusId?: unknown;
    program_id?: unknown;
    programId?: unknown;
}

export interface ValidateNewUserRoleRequestPayload extends Record<string, unknown> {
    role_name?: string;
    institution_id?: string;
    campus_id?: string;
    program_id?: string;
}

/**
 * Normalizes and validates a carecard.new_user_role_request payload.
 * Only student, intern, and volunteer are accepted. When scope is required,
 * both institution_id and campus_id must be provided.
 */
export function validateNewUserRoleRequestObject(
    roleRequest?: ValidateNewUserRoleRequestInput | null,
    options?: ValidateNewUserRoleRequestOptions | null,
): ValidateNewUserRoleRequestPayload;

/** Checks if the string is a valid image URL format. */
export const isImageUrl: BoolValidator;
/** Checks if the value is an integer. */
export const isInteger: BoolValidator;
/** Checks if the string is a valid JSON string and can be parsed into an object. */
export const isValidJsonString: BoolValidator;
/** Checks if the string represents a valid integer. */
export const isValidIntegerString: BoolValidator;
/** Checks if the string is a valid UUID. */
export const isValidUuidString: BoolValidator;
/** Checks if the string contains only alphanumeric characters, spaces, underscores, or hyphens. */
export const isCharactersString: BoolValidator;
/** Checks if the string is a valid street address format. */
export const isStreetString: BoolValidator;
/** Checks if the string is a valid name format. */
export const isNameString: BoolValidator;
/** Checks if the string is safe for search queries. */
export const isSafeSearchString: BoolValidator;
/** Checks if the string is a valid email address. */
export const isEmailString: BoolValidator;
/** Checks if the string is a valid JWT format. */
export const isJwtString: BoolValidator;
/** Checks if the string is a valid strong password. */
export const isPasswordString: BoolValidator;
/** Checks if the string is a valid simple password. */
export const isSimplePasswordString: BoolValidator;
/** Returns a failure message if the password is not strong enough. */
export const isPasswordStringFailureMessage: FailureMessageValidator;
/** Returns a failure message if the password is not valid as a simple password. */
export const isSimplePasswordStringFailureMessage: FailureMessageValidator;
/** Checks if the string is a valid username. */
export const isUsernameString: BoolValidator;
/** Checks if the string is a valid phone number. */
export const isPhoneNumber: BoolValidator;
/** Checks if the string is URL-safe. */
export const isUrlSafeString: BoolValidator;
/** Checks if the string length is between 6 and 24 characters. */
export const isString6To24CharacterLong: BoolValidator;
/** Checks if the string length is between 6 and 16 characters. */
export const isString6To16CharacterLong: BoolValidator;
/** Checks if the string is a valid Canadian province abbreviation (ON, QC). */
export const isProvinceString: BoolValidator;
/** Checks if the value is a boolean. */
export const isBoolValue: BoolValidator;
/** Checks if the string is a valid Canadian postal code. */
export const isPostalCodeString: BoolValidator;
/** Checks if the string contains only allowed "safe" characters. */
export const isSafeString: BoolValidator;
/** Checks if the value is non-empty text up to the supported maximum length. */
export const isTextString: BoolValidator;
/** Checks if a string exists within a given array of strings, case-insensitive. */
export const isInStringArray: InStringArrayValidator;
/** Checks if the string is one of the supported user role request statuses. */
export const isUserRoleRequestStatusString: BoolValidator;
/** Checks if the string is a supported new user role request role. */
export const isUserRoleRequestRoleString: BoolValidator;
/** Checks if the string is a valid country code, for example +1. */
export const isCountryCodeString: BoolValidator;
/** Checks if the string is a valid domain name. */
export const isValidDomainName: BoolValidator;
/** Checks if the string is a valid ISO 8601 timestamp with time zone. */
export const isValidTimestampzString: BoolValidator;
/** Checks if the string is a valid ISO 8601 timestamp without time zone. */
export const isValidTimestampString: BoolValidator;
/** Checks if the string is a valid URL. */
export const isValidUrl: BoolValidator;
/** Checks if the array contains only safe strings. */
export const isValidArrayOfStrings: BoolValidator;

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
    isStreetString: typeof isStreetString;
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
    isTextString: typeof isTextString;
    isInStringArray: typeof isInStringArray;
    isUserRoleRequestStatusString: typeof isUserRoleRequestStatusString;
    isUserRoleRequestRoleString: typeof isUserRoleRequestRoleString;
    isCountryCodeString: typeof isCountryCodeString;
    isValidDomainName: typeof isValidDomainName;
    isValidTimestampzString: typeof isValidTimestampzString;
    isValidTimestampString: typeof isValidTimestampString;
    isValidUrl: typeof isValidUrl;
    isValidArrayOfStrings: typeof isValidArrayOfStrings;
};
