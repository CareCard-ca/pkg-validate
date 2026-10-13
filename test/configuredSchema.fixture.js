'use strict';
const validation = require('..');
const {
  createValueParser,
  validateSchemaProperties,
  validateSchemaWhitelistProperties,
  isCommonPassword,
  validatePasswordAgainstPolicy,
  normalizeInputWhitespace,
} = validation;

const EXAMPLE_PASSWORD_POLICY = {
  minimumLength: 15,
  maximumLength: 128,
  isBlocked: isCommonPassword,
};
function validateExamplePassword(value) {
  return validatePasswordAgainstPolicy(value, EXAMPLE_PASSWORD_POLICY);
}
function parseJsonText(value) {
  if (typeof value !== 'string' || value.length > 10000) {
    return { isValid: false };
  }
  try {
    const result = JSON.stringify(normalizeInputWhitespace(JSON.parse(value)));
    return validation.isSafeJsonString(result)
      ? { isValid: true, value: result }
      : { isValid: false };
  } catch {
    return { isValid: false };
  }
}
function parseSearch(value) {
  return typeof value === 'string' && validation.isNameString(value) && value.trim().length <= 101;
}
function parseUsername(value) {
  return (
    typeof value === 'string' &&
    validation.isNameString(value) &&
    /^[A-Za-z][0-9a-zA-Z-_.,'() ]+$/.test(value.trim())
  );
}
function parseUrl(value) {
  return (
    validation.isImageUrl(value) ||
    (validation.isValidUrl(value) && validation.isHttpUrlString(value))
  );
}
const FIELD_PARSERS = {
  first_name: createValueParser(validation.isNameString),
  firstName: createValueParser(validation.isNameString),
  middle_name: createValueParser(validation.isNameString),
  middleName: createValueParser(validation.isNameString),
  nick_name: createValueParser(validation.isNameString),
  requestedByName: createValueParser(validation.isNameString),
  approved_by_name: createValueParser(validation.isNameString),
  comment: createValueParser(validation.isNameString),
  name: createValueParser(validation.isNameString),
  reason: createValueParser(validation.isNameString),
  username: createValueParser(parseUsername),
  file_name: createValueParser(validation.isFileNameString, value =>
    value.normalize('NFKC').trim(),
  ),
  fileName: createValueParser(validation.isFileNameString, value => value.normalize('NFKC').trim()),
  filename: createValueParser(validation.isFileNameString, value => value.normalize('NFKC').trim()),
  street: createValueParser(
    value => validation.isStreetString(value) && validation.isSingleLineTextString(value),
  ),
  search_string: createValueParser(parseSearch),
  searchString: createValueParser(parseSearch),
  password: validateExamplePassword,
  email: createValueParser(validation.isEmailString),
  requested_by_email: createValueParser(validation.isEmailString),
  requestedByEmail: createValueParser(validation.isEmailString),
  approved_by_email: createValueParser(validation.isEmailString),
  approvedByEmail: createValueParser(validation.isEmailString),
  phone_number: createValueParser(validation.isPhoneNumber),
  phoneNumber: createValueParser(validation.isPhoneNumber),
  documentDescription: createValueParser(validation.isTextString),
  number: createValueParser(validation.isValidIntegerString),
  about: parseJsonText,
  metadata: createValueParser(validation.isSafeJsonValue),
  imageUrl: createValueParser(parseUrl),
  website: createValueParser(parseUrl),
  fileUrl: createValueParser(parseUrl),
  active: createValueParser(validation.isBoolValue),
};
function validateExampleProperties(input) {
  return validateSchemaProperties(input, FIELD_PARSERS);
}
function validateExampleRequest(input, required = [], options) {
  const configuration = options || {};
  const paths = [...(required || []), ...(configuration.optionalProperties || [])];
  const schema = Object.fromEntries(
    paths.map(path => [
      path,
      FIELD_PARSERS[String(path).split('.').pop()] || (() => ({ isValid: false })),
    ]),
  );
  return validateSchemaWhitelistProperties(input, required, { ...configuration, schema });
}
module.exports = { validateExampleProperties, validateExampleRequest, validateExamplePassword };
