/**
 * Utility functions for validating various types of strings and values.
 */
export const validate: {
  /** Checks if the string is a valid image URL format. */
  isImageUrl: (imageUrl: any) => boolean;
  /** Checks if the value is an integer. */
  isInteger: (number: any) => boolean;
  /** Checks if the string is a valid JSON string and can be parsed into an object. */
  isValidJsonString: (str: any) => boolean;
  /** Checks if the string represents a valid integer. */
  isValidIntegerString: (str: any) => boolean;
  /** Checks if the string is a valid UUID. */
  isValidUuidString: (str: any) => boolean;
  /** Checks if the string contains only alphanumeric characters, spaces, underscores, or hyphens. */
  isCharactersString: (str: any) => boolean;
  /** Checks if the string is a valid name format. */
  isNameString: (str: any) => boolean;
  /** Checks if the string is safe for search queries. */
  isSafeSearchString: (str: any) => boolean;
  /** Checks if the string is a valid email address. */
  isEmailString: (email: any) => boolean;
  /** Checks if the string is a valid JWT format. */
  isJwtString: (jwt: any) => boolean;
  /** Checks if the string is a valid strong password. */
  isPasswordString: (password: any) => boolean;
  /** Checks if the string is a valid simple password. */
  isSimplePasswordString: (password: any) => boolean;
  /** Returns a failure message if the password is not strong enough. */
  isPasswordStringFailureMessage: (password: any) => string | null;
  /** Returns a failure message if the password is not valid as a simple password. */
  isSimplePasswordStringFailureMessage: (password: any) => string | null;
  /** Checks if the string is a valid username. */
  isUsernameString: (str: any) => boolean;
  /** Checks if the string is a valid phone number. */
  isPhoneNumber: (str: any) => boolean;
  /** Checks if the string is URL-safe. */
  isUrlSafeString: (inputString: any) => boolean;
  /** Checks if the string length is between 6 and 24 characters. */
  isString6To24CharacterLong: (password: any) => boolean;
  /** Checks if the string length is between 6 and 16 characters. */
  isString6To16CharacterLong: (password: any) => boolean;
  /** Checks if the string is a valid Canadian province abbreviation (ON, QC). */
  isProvinceString: (inputString: any) => boolean;
  /** Checks if the value is a boolean. */
  isBoolValue: (inputValue: any) => boolean;
  /** Checks if the string is a valid Canadian postal code. */
  isPostalCodeString: (inputString: any) => boolean;
  /** Checks if the string contains only allowed "safe" characters. */
  isSafeString: (str: any) => boolean;
  /** Checks if a string exists within a given array of strings (case-insensitive). */
  isInStringArray: (StringArray: string[], inputString: any) => boolean;
  /** Checks if the string is a valid country code (e.g., +1). */
  isCountryCodeString: (str: any) => boolean;
  /** Checks if the string is a valid domain name. */
  isValidDomainName: (domain: any) => boolean;
  /** Checks if the string is a valid ISO 8601 timestamp with time zone. */
  isValidTimestampzString: (str: any) => boolean;
  /** Checks if the string is a valid ISO 8601 timestamp without time zone. */
  isValidTimestampString: (str: any) => boolean;
};

/**
 * Utility function to validate multiple properties of an object at once.
 */
export const validateProperties: {
  validateProperties: (obj?: Record<string, any>) => Record<string, any>;
};
