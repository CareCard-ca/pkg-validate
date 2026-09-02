const isImageUrl = imageUrl => {
  if (
    imageUrl === undefined ||
    typeof imageUrl !== 'string' ||
    imageUrl.length === 0 ||
    imageUrl.length > 2048
  ) {
    return false;
  }

  const imageUrlRegex = /^[a-zA-Z0-9-_./]+$/;
  return imageUrlRegex.test(imageUrl);
};

const isInteger = number => {
  return Number.isInteger(number);
};

// Pattern: Predicate - reports whether a bounded string contains a JSON object or array.
const isValidJsonString = str => {
  if (str === undefined || typeof str !== 'string' || str.length === 0 || str.length > 10000) {
    return false;
  }

  try {
    const json = JSON.parse(str);
    return typeof json === 'object' && json !== null;
  } catch {
    return false;
  }
};

const isValidIntegerString = str => {
  if (str === undefined || typeof str !== 'string' || str.length === 0 || str.length > 20) {
    return false;
  }
  return /^\d+$/.test(str);
};

const isValidUuidString = str => {
  if (str === undefined || typeof str !== 'string' || str.length === 0) {
    return false;
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

const isCcIdString = str => {
  if (typeof str !== 'string') {
    return false;
  }
  return /^[a-z0-9]{8}$/.test(str);
};

const isCharactersString = str => {
  if (str === undefined || typeof str !== 'string' || str.length === 0 || str.length > 1000) {
    return false;
  }
  return /^[\da-zA-Z _-]+$/.test(str);
};

const isStreetString = str => {
  if (typeof str !== 'string' || str.trim().length === 0 || str.length > 1000) {
    return false;
  }
  const value = str.trim();
  const streetRegex = /^(?![,_-])[0-9a-zA-Z\s,./#-]+$/;
  return streetRegex.test(value);
};

const isNameString = str => {
  if (typeof str !== 'string' || str.length === 0 || str.length > 1000) {
    return false;
  }
  return /^[A-Za-z][0-9a-zA-Z-_.,'() ]+$/.test(str.trim());
};

const isSafeSearchString = str => {
  if (typeof str !== 'string' || str.length === 0) {
    return false;
  }
  return /^[A-Za-z][0-9a-zA-Z\-_.,'()@ ]{1,100}$/.test(str.trim());
};

const isEmailString = email => {
  if (typeof email !== 'string' || email.length === 0 || email.length > 320) {
    return false;
  }
  // Simplified safe email regex
  const regExpEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-zA-Z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/;
  return regExpEmail.test(email);
};

const isJwtString = jwt => {
  if (typeof jwt !== 'string' || jwt.length === 0 || jwt.length > 8192 || jwt.trim() === '') {
    return false;
  }
  const jwtRegex = /^eyJ[a-zA-Z0-9-_.]+$/;
  return jwtRegex.test(jwt);
};

// Pattern: Policy Function - owns normalization, length, and blocklist decisions for passwords.
const validatePassword = password => {
  if (typeof password !== 'string') {
    return { isValid: false, reason: 'invalid_type' };
  }
  if (!password.isWellFormed()) {
    return { isValid: false, reason: 'invalid_unicode' };
  }
  const normalizedPassword = password.normalize('NFC');
  const passwordLength = [...normalizedPassword].length;
  if (passwordLength < MINIMUM_PASSWORD_LENGTH) {
    return { isValid: false, reason: 'too_short' };
  }
  if (passwordLength > MAXIMUM_PASSWORD_LENGTH) {
    return { isValid: false, reason: 'too_long' };
  }
  if (commonPasswords.has(normalizedPassword)) {
    return { isValid: false, reason: 'blocked' };
  }
  return { isValid: true, value: normalizedPassword };
};

const isUsernameString = str => {
  if (typeof str !== 'string' || str.length === 0 || str.length > 200) {
    return false;
  }
  return /^[0-9a-zA-Z]+$/.test(str);
};

function isPhoneNumber(str) {
  if (typeof str !== 'string' || str.length === 0 || str.length > 20) {
    return false;
  }
  return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(str);
}

const isUrlSafeString = inputString => {
  if (
    typeof inputString !== 'string' ||
    inputString.length === 0 ||
    inputString.length > 2048 ||
    inputString.trim() === ''
  ) {
    return false;
  }
  const urlSafeRegex = /^[a-zA-Z0-9-_.]+$/;
  return urlSafeRegex.test(inputString);
};

const isProvinceString = inputString => {
  const provinces = ['on', 'qc'];

  if (isNameString(inputString)) {
    return provinces.includes(inputString.toLowerCase().trim());
  }

  return false;
};

const isBoolValue = inputValue => {
  return typeof inputValue === 'boolean' || inputValue === 'true' || inputValue === 'false';
};

const isPostalCodeString = inputString => {
  const postalCodeRegex = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/i;

  if (isNameString(inputString)) {
    return postalCodeRegex.test(inputString.trim());
  }

  return false;
};

const isSafeString = str => {
  if (typeof str !== 'string' || str.length === 0 || str.length > 10000) {
    return false;
  }
  return /^[\da-zA-Z-_.,#*'()[\]: ]+$/.test(str);
};

const isTextString = str => {
  return typeof str === 'string' && str.length > 0 && str.length <= 10000;
};

const isInStringArray = (StringArray, inputString) => {
  if (isNameString(inputString)) {
    return StringArray.includes(inputString.toLowerCase().trim());
  }

  return false;
};

const isUserRoleRequestStatusString = inputString => {
  const statuses = [
    'pending',
    'approved',
    'rejected',
    'cancelled',
    'expired',
    'hidden',
    'on_hold',
    'in_progress',
    'info_needed',
  ];
  return isInStringArray(statuses, inputString);
};

const isUserRoleRequestRoleString = inputString => {
  const roles = ['student', 'intern', 'volunteer'];
  return typeof inputString === 'string' && roles.includes(inputString.trim().toLowerCase());
};

const isCountryCodeString = str => {
  if (typeof str !== 'string' || str.length === 0 || str.length > 4) {
    return false;
  }

  const countryCodeRegex = /^\+[1-9][0-9]{0,2}$/;

  return countryCodeRegex.test(str);
};

const isValidDomainName = domain => {
  if (typeof domain !== 'string' || domain.length === 0 || domain.length > 253) {
    return false;
  }

  const domainRegex =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  return domainRegex.test(domain);
};

// Pattern: Pure Function - validates calendar and clock fields without Date.parse normalization.
const hasValidTimestampFields = match => {
  if (!match) {
    return false;
  }
  const [, year, month, day, hour, minute, second] = match;
  return (
    isValidCalendarDate(Number(year), Number(month), Number(day)) &&
    Number(hour) <= 23 &&
    Number(minute) <= 59 &&
    Number(second) <= 59
  );
};

// Pattern: Pure Function - validates the numeric UTC offset carried by a timestamp.
const hasValidTimestampOffset = match => {
  const zone = match?.[7];
  return zone === 'Z' || (Number(match?.[8]) <= 23 && Number(match?.[9]) <= 59);
};

// Pattern: Predicate - accepts only real ISO timestamps with an explicit time zone.
const isValidTimestampzString = str => {
  if (typeof str !== 'string' || str.length === 0 || str.length > 64) {
    return false;
  }
  // ISO 8601 for UTC or with Offset: 2023-10-27T10:00:00Z or 2023-10-27T10:00:00+02:00
  const timestampzRegex =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-](\d{2}):(\d{2}))$/;
  const match = str.match(timestampzRegex);
  return hasValidTimestampFields(match) && hasValidTimestampOffset(match);
};

// Pattern: Predicate - accepts only real ISO local timestamps without a time zone.
const isValidTimestampString = str => {
  if (typeof str !== 'string' || str.length === 0 || str.length > 64) {
    return false;
  }
  // ISO 8601 without time zone: 2023-10-27T10:00:00 or 2023-10-27T10:00:00.123
  const timestampRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?$/;
  return hasValidTimestampFields(str.match(timestampRegex));
};

// Pattern: Pure Function - validates Gregorian date fields without runtime date coercion.
function isValidCalendarDate(year, month, day) {
  if (year < 1 || month < 1 || month > 12 || day < 1) {
    return false;
  }
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthLengths = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= monthLengths[month - 1];
}

// Pattern: Predicate - accepts only real Gregorian dates in YYYY-MM-DD form.
const isValidDateString = str => {
  if (typeof str !== 'string' || str.length === 0 || str.length > 10) {
    return false;
  }

  const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = str.match(dateRegex);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return isValidCalendarDate(year, month, day);
};

const isValidUrl = url => {
  if (typeof url !== 'string' || url.length === 0 || url.length > 2048) {
    return false;
  }
  if (!URL.canParse(url)) {
    return false;
  }

  const parsedUrl = new URL(url);
  return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
};
const isValidArrayOfStrings = arr => {
  if (!Array.isArray(arr)) {
    return false;
  }
  return arr.every(isSafeString);
};
module.exports = {
  isImageUrl,
  isInteger,
  isValidJsonString,
  isValidIntegerString,
  isValidUuidString,
  isCcIdString,
  isCharactersString,
  isStreetString,
  isNameString,
  isSafeSearchString,
  isEmailString,
  isJwtString,
  validatePassword,
  isUsernameString,
  isPhoneNumber,
  isUrlSafeString,
  isProvinceString,
  isBoolValue,
  isPostalCodeString,
  isSafeString,
  isTextString,
  isInStringArray,
  isUserRoleRequestStatusString,
  isUserRoleRequestRoleString,
  isCountryCodeString,
  isValidDomainName,
  isValidTimestampzString,
  isValidTimestampString,
  isValidDateString,
  isValidUrl,
  isValidArrayOfStrings,
};
const commonPasswords = new Set(require('../data/commonPasswords.json'));

const MINIMUM_PASSWORD_LENGTH = 15;
const MAXIMUM_PASSWORD_LENGTH = 128;
