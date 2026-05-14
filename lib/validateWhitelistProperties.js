'use strict';

const {
  util: { extractObjectWithProperties },
  error: { throwBadInputError },
  caseConverter: { keysToSnakeCase },
} = require('@carecard/common-util');

const { validateProperties } = require('./validateProperties');

/**
 * Validates and transforms whitelisted properties from an input object.
 *
 * Steps:
 *  1. Extracts only the whitelisted (required + optional) properties.
 *  2. Validates property values using {@link validateProperties}.
 *  3. Asserts every required property is present and valid; throws otherwise.
 *  4. Asserts any provided optional property is valid; throws otherwise.
 *  5. Optionally converts the resulting object keys to snake_case.
 *
 * @param {Object} inputObject - The input object (e.g., req.body / req.params).
 * @param {Array<string>} [requiredProperties=[]] - Properties that MUST be present and valid.
 * @param {Object} [options]
 * @param {Array<string>} [options.optionalProperties=[]] - Properties allowed but not required.
 * @param {boolean} [options.convertToSnakeCase=false] - Whether to convert keys to snake_case.
 * @returns {Promise<Object>} Resolves with the validated (and possibly transformed) object.
 */
function validateWhitelistProperties(
  inputObject,
  requiredProperties = [],
  options = { optionalProperties: [], convertToSnakeCase: false },
) {
  const optionalProperties = (options && options.optionalProperties) || [];
  const convertToSnakeCase = !!(options && options.convertToSnakeCase);
  const allWhitelisted = [...requiredProperties, ...optionalProperties];

  // 1. Whitelist extraction.
  const extractedObject = extractObjectWithProperties(inputObject, allWhitelisted);

  // 2. Validate values.
  let validatedObject = validateProperties(extractedObject);

  // 3. Required-property existence check.
  requiredProperties.forEach(prop => {
    if (!Object.prototype.hasOwnProperty.call(validatedObject, prop)) {
      throwBadInputError({ userMessage: `Missing or invalid property: ${prop}` });
    }
  });

  // 4. Optional-property validity check (if provided, must be valid).
  optionalProperties.forEach(prop => {
    if (Object.prototype.hasOwnProperty.call(extractedObject, prop) && !Object.prototype.hasOwnProperty.call(validatedObject, prop)) {
      throwBadInputError({ userMessage: `Invalid property value: ${prop}` });
    }
  });

  // 5. Optional case transformation.
  if (convertToSnakeCase) {
    validatedObject = keysToSnakeCase(validatedObject);
  }

  return Promise.resolve(validatedObject);
}

module.exports = validateWhitelistProperties;
module.exports.validateWhitelistProperties = validateWhitelistProperties;
