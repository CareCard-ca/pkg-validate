const isImageUrl = imageUrl => {
    if (imageUrl === undefined || typeof imageUrl !== "string" || imageUrl.length === 0) return false;

    const imageUrlRegex = /^[a-zA-Z0-9-_./]+$/;
    return imageUrlRegex.test(imageUrl);
};

const isInteger = number => {
    return Number.isInteger(number);
};

const isValidJsonString = str => {
    if (str === undefined || typeof str !== "string" || str.length === 0) return false;

    try {
        const json = JSON.parse(str);
        return (typeof json === 'object');
    } catch (error) {
        return false;
    }
};

const isValidIntegerString = str => {
    if (str === undefined || typeof str !== "string" || str.length === 0) return false;
    return (/^\d+$/g.test(str));
}

const isValidUuidString = str => {
    if (str === undefined || typeof str !== "string" || str.length === 0) return false;
    return (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str));
}

const isCharactersString = str => {
    if (str === undefined || typeof str !== "string" || str.length === 0) return false;
    return (/^[\da-zA-Z _-]+$/.test(str));
}

const isNameString = str => {
    if (str === undefined || typeof str !== "string" || str.length === 0 || str.length > 1000) return false;
    return (/^[A-Za-z][0-9a-zA-Z-_.,'() ]+$/.test(str.trim()));
}

const isSafeSearchString = str => {
    if (str === undefined || typeof str !== "string" || str.length === 0) return false;
    return /^[A-Za-z][0-9a-zA-Z\-_.,'()@ ]{1,100}$/.test(str.trim());
}

const isEmailString = email => {
    if (email === undefined || typeof email !== "string" || email.length === 0 || email.length > 1000) return false;
    const regExpEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExpEmail.test(String(email).toLowerCase());
}

const isJwtString = (jwt) => {
    if (jwt === '' || jwt.trim() === '') return false;
    const jwtRegex = /^eyJ[a-zA-Z0-9-_.]+$/;
    return jwtRegex.test(jwt);
}

const isPasswordString = password => {
    if (password === undefined || typeof password !== "string" || password.length === 0) return false;
    const regExPassword = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&*_-])[a-zA-Z0-9!@#$%^&*_-]{6,32}$/;
    return regExPassword.test(String(password));
}

const isSimplePasswordString = password => {
    if (password === undefined || typeof password !== "string" || password.length === 0) return false;
    const regExPassword = /^[a-zA-Z0-9!@#$%^&*_-]{6,32}$/;
    return regExPassword.test(String(password));
}

const isPasswordStringFailureMessage = (password) => {
    if (!isPasswordString(password)) {
        return "Total 6 to 32 characters, numbers and one of !@#$%^&*_-";
    } else {
        return null;
    }
}

const isSimplePasswordStringFailureMessage = (password) => {
    if (!isPasswordString(password)) {
        return "Total 6 to 32 characters, numbers or !@#$%^&*_-";
    } else {
        return null;
    }
}

const isUsernameString = str => {
    if (str === undefined || typeof str !== "string" || str.length === 0) return false;
    return (/^[0-9a-zA-Z]+$/.test(str));
}

function isPhoneNumber(str) {
    if (str === undefined || typeof str !== "string" || str.length === 0) return false;
    return (/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(str));
}

const isUrlSafeString = (inputString) => {
    if (inputString === '' || inputString.trim() === '') return false;
    const jwtRegex = /^[a-zA-Z0-9-_.]+$/;
    return jwtRegex.test(inputString);
}

const isString6To24CharacterLong = (password) => {
    if (password === undefined || typeof password !== "string" || password.length === 0) return false;
    return 6 <= password.length && password.length <= 24;
};

const isString6To16CharacterLong = (password) => {
    if (password === undefined || typeof password !== "string" || password.length === 0) return false;
    return 6 <= password.length && password.length <= 16;
};

const isProvinceString = (inputString) => {
    const provinces = ['on', 'qc'];

    if (isNameString(inputString)) {
        return provinces.includes(inputString.toLowerCase());
    }

    return false
};

const isBoolValue = (inputValue) => {
    return !(inputValue === undefined || typeof inputValue !== "boolean");
};

const isPostalCodeString = (inputString) => {

    const postalCodeRegex = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/i;

    if (isNameString(inputString)) {
        return postalCodeRegex.test(inputString);
    }

    return false;
};

const isSafeString = (str) => {

    if (str === undefined || typeof str !== "string" || str.length === 0) return false;
    return (/^[\da-zA-Z-_.,#*'()\[\]: ]+$/.test(str));

}

const isInStringArray = (StringArray, inputString) => {

    if (isNameString(inputString)) {
        return StringArray.includes(inputString.toLowerCase());
    }

    return false
};

const isCountryCodeString = (str) => {

    if (str === undefined || typeof str !== "string" || str.length === 0) return false;

    const postalCodeRegex = /^\+[1-9][0-9]{0,2}$/i;

    return postalCodeRegex.test(str);
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
    isCountryCodeString
};
