/** Generic value validation; callers own field schemas and domain policies. */
export type BoolValidator = (input: unknown) => boolean;
export type InStringArrayValidator = (values: readonly string[], input: unknown) => boolean;
export type PropertyParseResult = { isValid: true; value: unknown } | { isValid: false };
export type PropertyParser = (input: unknown) => PropertyParseResult;
export type PropertySchema = Readonly<Record<string, PropertyParser>>;
export type SchemaInput = Record<string, unknown> | null | undefined;
export type SchemaOutput = Record<string, unknown>;

export function normalizeInputWhitespace<T>(input: T): T;
export function createValueParser(
  predicate: BoolValidator,
  transform?: (input: unknown) => unknown,
): PropertyParser;
export function validateSchemaProperties(input: SchemaInput, schema: PropertySchema): SchemaOutput;
export interface ValidateSchemaWhitelistOptions {
  schema: PropertySchema;
  optionalProperties?: readonly string[] | null;
  convertToSnakeCase?: boolean;
  flattenOutput?: boolean;
  flattenKeyStyle?: 'path' | 'leaf';
}
export function validateSchemaWhitelistProperties(
  input: SchemaInput,
  required: readonly string[] | null | undefined,
  options: ValidateSchemaWhitelistOptions,
): Promise<SchemaOutput>;
export const MAX_NESTING_DEPTH: 5;
export const MAX_KEYS_PER_CALL: 5000;

export interface PasswordPolicy {
  minimumLength: number;
  maximumLength: number;
  isBlocked?: (normalizedPassword: string) => boolean;
}
export type PasswordValidationFailureReason =
  'invalid_type' | 'invalid_unicode' | 'too_short' | 'too_long' | 'blocked';
export type PasswordValidationResult =
  { isValid: true; value: string } | { isValid: false; reason: PasswordValidationFailureReason };
export function validatePasswordAgainstPolicy(
  input: unknown,
  policy: PasswordPolicy,
): PasswordValidationResult;
export function isCommonPassword(input: unknown): boolean;

export const isSingleLineTextString: BoolValidator;
export const isMultilineTextString: BoolValidator;
export const isHttpUrlString: BoolValidator;
export const isMimeTypeString: BoolValidator;
export const isIdempotencyKeyString: BoolValidator;
export const isNonNegativeSafeInteger: BoolValidator;
export const isValidUuidV4String: BoolValidator;
export const isSafeJsonValue: BoolValidator;
export const isSafeJsonString: BoolValidator;
export const isDocumentationSearchString: BoolValidator;

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
/** Checks allowlisted visible Unicode names up to 1000 UTF-16 code units, including raw input edges. */
export const isNameString: BoolValidator;
/** Checks the plain-text allowlist and NFKC-trimmed filename metadata up to 255 code points. */
export const isFileNameString: BoolValidator;
/** Checks if the string is safe for search queries. */
export const isSafeSearchString: BoolValidator;
/** Checks if the string is a valid email address. */
export const isEmailString: BoolValidator;
/** Checks if the string is a valid JWT format. */
export const isJwtString: BoolValidator;
/** Checks if the string is a valid username. */
export const isUsernameString: BoolValidator;
/** Checks if the string is a valid phone number. */
export const isPhoneNumber: BoolValidator;
/** Checks national or international phone contact snapshots with at most 15 international digits. */
export const isPhoneContactString: BoolValidator;
/** Checks if the string is URL-safe. */
export const isUrlSafeString: BoolValidator;
/** Checks if the value is a boolean. */
export const isBoolValue: BoolValidator;
/** Checks if the string is a valid Canadian postal code. */
export const isPostalCodeString: BoolValidator;
/** Checks if the string contains only allowed "safe" characters. */
export const isSafeString: BoolValidator;
/** Checks allowlisted visible Unicode text up to 10000 UTF-16 code units. */
export const isTextString: BoolValidator;
/** Checks allowlisted text or ASCII named reaction tokens, at most 64 trimmed code units. */
export const isReactionString: BoolValidator;
/** Checks if a string exists within a given array of strings, case-insensitive. */
export const isInStringArray: InStringArrayValidator;
/** Checks if the string is a valid country code, for example +1. */
export const isCountryCodeString: BoolValidator;
/** Checks if the string is a valid domain name. */
export const isValidDomainName: BoolValidator;
/** Checks if the string is a valid ISO 8601 timestamp with time zone. */
export const isValidTimestampzString: BoolValidator;
/** Checks if the string is a valid ISO 8601 timestamp without time zone. */
export const isValidTimestampString: BoolValidator;
/** Checks if the string is a valid ISO date in YYYY-MM-DD format. */
export const isValidDateString: BoolValidator;
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
  isFileNameString: typeof isFileNameString;
  isSafeSearchString: typeof isSafeSearchString;
  isEmailString: typeof isEmailString;
  isJwtString: typeof isJwtString;
  isUsernameString: typeof isUsernameString;
  isPhoneNumber: typeof isPhoneNumber;
  isPhoneContactString: typeof isPhoneContactString;
  isUrlSafeString: typeof isUrlSafeString;
  isBoolValue: typeof isBoolValue;
  isPostalCodeString: typeof isPostalCodeString;
  isSafeString: typeof isSafeString;
  isTextString: typeof isTextString;
  isReactionString: typeof isReactionString;
  isInStringArray: typeof isInStringArray;
  isCountryCodeString: typeof isCountryCodeString;
  isValidDomainName: typeof isValidDomainName;
  isValidTimestampzString: typeof isValidTimestampzString;
  isValidTimestampString: typeof isValidTimestampString;
  isValidDateString: typeof isValidDateString;
  isValidUrl: typeof isValidUrl;
  isValidArrayOfStrings: typeof isValidArrayOfStrings;
};
