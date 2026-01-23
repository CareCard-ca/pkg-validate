const isImageUrl = (imageUrl) => {
  if (
    imageUrl === undefined ||
    typeof imageUrl !== 'string' ||
    imageUrl.length === 0 ||
    imageUrl.length > 2048
  )
    return false;

  const imageUrlRegex = /^[a-zA-Z0-9-_./]+$/;
  return imageUrlRegex.test(imageUrl);
};

const isInteger = (number) => {
  return Number.isInteger(number);
};

const isValidJsonString = (str) => {
  if (str === undefined || typeof str !== 'string' || str.length === 0 || str.length > 10000)
    return false;

  try {
    const json = JSON.parse(str);
    return typeof json === 'object' && json !== null;
  } catch {
    return false;
  }
};

const isValidIntegerString = (str) => {
  if (str === undefined || typeof str !== 'string' || str.length === 0 || str.length > 20)
    return false;
  return /^\d+$/.test(str);
};

const isValidUuidString = (str) => {
  if (str === undefined || typeof str !== 'string' || str.length === 0) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
};

const isCharactersString = (str) => {
  if (str === undefined || typeof str !== 'string' || str.length === 0 || str.length > 1000)
    return false;
  return /^[\da-zA-Z _-]+$/.test(str);
};

const isNameString = (str) => {
  if (typeof str !== 'string' || str.length === 0 || str.length > 1000) {
    return false;
  }
  return /^[A-Za-z][0-9a-zA-Z-_.,'() ]+$/.test(str.trim());
};

const isSafeSearchString = (str) => {
  if (typeof str !== 'string' || str.length === 0) return false;
  return /^[A-Za-z][0-9a-zA-Z\-_.,'()@ ]{1,100}$/.test(str.trim());
};

const isEmailString = (email) => {
  if (typeof email !== 'string' || email.length === 0 || email.length > 320) {
    return false;
  }
  // Simplified safe email regex
  const regExpEmail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-zA-Z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/;
  return regExpEmail.test(email);
};

const isJwtString = (jwt) => {
  if (typeof jwt !== 'string' || jwt.length === 0 || jwt.length > 8192 || jwt.trim() === '')
    return false;
  const jwtRegex = /^eyJ[a-zA-Z0-9-_.]+$/;
  return jwtRegex.test(jwt);
};

const isPasswordString = (password) => {
  if (typeof password !== 'string' || password.length === 0 || password.length > 128) return false;
  const regExPassword = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*_-])[a-zA-Z0-9!@#$%^&*_-]{6,32}$/;
  return regExPassword.test(String(password));
};

const isSimplePasswordString = (password) => {
  if (typeof password !== 'string' || password.length === 0 || password.length > 128) return false;
  const regExPassword = /^[a-zA-Z0-9!@#$%^&*_-]{6,32}$/;
  return regExPassword.test(String(password));
};

const isPasswordStringFailureMessage = (password) => {
  if (!isPasswordString(password)) {
    return 'Total 6 to 32 characters, numbers and one of !@#$%^&*_-';
  } else {
    return null;
  }
};

const isSimplePasswordStringFailureMessage = (password) => {
  if (!isSimplePasswordString(password)) {
    return 'Total 6 to 32 characters, numbers or !@#$%^&*_-';
  } else {
    return null;
  }
};

const isUsernameString = (str) => {
  if (typeof str !== 'string' || str.length === 0 || str.length > 200) return false;
  return /^[0-9a-zA-Z]+$/.test(str);
};

function isPhoneNumber(str) {
  if (typeof str !== 'string' || str.length === 0 || str.length > 20) return false;
  return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(str);
}

const isUrlSafeString = (inputString) => {
  if (
    typeof inputString !== 'string' ||
    inputString.length === 0 ||
    inputString.length > 2048 ||
    inputString.trim() === ''
  )
    return false;
  const urlSafeRegex = /^[a-zA-Z0-9-_.]+$/;
  return urlSafeRegex.test(inputString);
};

const isString6To24CharacterLong = (password) => {
  if (typeof password !== 'string' || password.length === 0) return false;
  return 6 <= password.length && password.length <= 24;
};

const isString6To16CharacterLong = (password) => {
  if (typeof password !== 'string' || password.length === 0) return false;
  return 6 <= password.length && password.length <= 16;
};

const isProvinceString = (inputString) => {
  const provinces = ['on', 'qc'];

  if (isNameString(inputString)) {
    return provinces.includes(inputString.toLowerCase().trim());
  }

  return false;
};

const isBoolValue = (inputValue) => {
  return typeof inputValue === 'boolean';
};

const isPostalCodeString = (inputString) => {
  const postalCodeRegex = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/i;

  if (isNameString(inputString)) {
    return postalCodeRegex.test(inputString.trim());
  }

  return false;
};

const isSafeString = (str) => {
  if (typeof str !== 'string' || str.length === 0 || str.length > 10000) return false;
  return /^[\da-zA-Z-_.,#*'()[\]: ]+$/.test(str);
};

const isInStringArray = (StringArray, inputString) => {
  if (isNameString(inputString)) {
    return StringArray.includes(inputString.toLowerCase().trim());
  }

  return false;
};

const isCountryCodeString = (str) => {
  if (typeof str !== 'string' || str.length === 0 || str.length > 4) return false;

  const countryCodeRegex = /^\+[1-9][0-9]{0,2}$/;

  return countryCodeRegex.test(str);
};

const isValidDomainName = (domain) => {
  if (typeof domain !== 'string' || domain.length === 0 || domain.length > 253) return false;

  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  return domainRegex.test(domain);
};

module.exports = {
    isImageUrl,
    isInteger,
    isValidJsonString,
    isValidIntegerString,
    isValidUuidString,
    isCharactersString,
    isNameString,
    isSafeSearchString,
    isEmailString,
    isJwtString,
    isPasswordString,
    isSimplePasswordString,
    isPasswordStringFailureMessage,
    isSimplePasswordStringFailureMessage,
    isUsernameString,
    isPhoneNumber,
    isUrlSafeString,
    isString6To24CharacterLong,
    isString6To16CharacterLong,
    isProvinceString,
    isBoolValue,
    isPostalCodeString,
    isSafeString,
    isInStringArray,
    isCountryCodeString,
    isValidDomainName
};
