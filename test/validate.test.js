const assert = require('assert').strict;
const { describe, it } = require('mocha');
const validate = require('../index').validate;

describe('AuthUtil test', function () {
    const goodString = 'I am a good person';
    const badString = 'I <script>am evil</script>';
    const user = { username: 'username' };

    describe('Validate function test', function () {
        it('isImageUrl returns true if safe image url, false otherwise', function (done) {
            const image_url = 'A44C0A67A8704767AD2B97DC46478827/8B57EB9F014143F2AE6B9D8EBBB7CDA6-700.jpg';
            const image_url_bad_one = 'A44C0A67*A8704767AD2B97DC46478827/8B57EB9F014143F2AE6B9D8EBBB7CDA6-700.jpg';
            const image_url_bad_two = 'A44C0A67>A8704767AD2B97DC46478827/8B57EB9F014143F2AE6B9D8EBBB7CDA6-700.jpg';

            assert.ok(!validate.isImageUrl(image_url_bad_one), 'Bad image url test failed');
            assert.ok(!validate.isImageUrl(image_url_bad_two), 'Bad image url test failed');
            assert.ok(!validate.isImageUrl(undefined), 'Undefined image url test failed');
            assert.ok(!validate.isImageUrl(null), 'Null image url test failed');
            assert.ok(!validate.isImageUrl(''), 'Empty image url test failed');
            assert.ok(!validate.isImageUrl('a'.repeat(2049)), 'Long image url test failed');
            assert.ok(validate.isImageUrl(image_url), 'Good image url test failed');
            done();
        });

        it('isInteger returns true if integer false otherwise', function (done) {
            const badInteger_1 = 234.65;
            const badInteger_2 = '';
            const badInteger_3 = '3.2';
            const badInteger_4 = '67';
            const goodInteger_1 = 72662;

            assert.ok(!validate.isInteger(badInteger_1), 'Bad integer test failed');
            assert.ok(!validate.isInteger(badInteger_2), 'Bad integer test failed');
            assert.ok(!validate.isInteger(badInteger_3), 'Bad integer test failed');
            assert.ok(!validate.isInteger(badInteger_4), 'Bad integer test failed');
            assert.ok(validate.isInteger(goodInteger_1), 'Good integer test failed');
            done();
        });

        it('isValidJsonString returns true if json false otherwise', function (done) {
            const badString = '1chie87';
            const badStringTwo = '13-34';
            const goodString =
                '{"blocks":[{"key":"ediog","text":"I am doing well","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';

            assert.ok(!validate.isValidJsonString(undefined), 'Undefined string test failed');
            assert.ok(!validate.isValidJsonString(3), 'Type of string test failed');
            assert.ok(!validate.isValidJsonString(badString), 'Bad string test failed');
            assert.ok(!validate.isValidJsonString(badStringTwo), 'Bad string test failed');
            assert.ok(validate.isValidJsonString(goodString), 'Good string test failed');
            done();
        });

        it('isValidIntegerString returns true if integer false otherwise', function (done) {
            const badString = '1chie87';
            const badStringTwo = '13-34';
            const goodString = '17';

            assert.ok(!validate.isValidIntegerString(undefined), 'Undefined string test failed');
            assert.ok(!validate.isValidIntegerString(3), 'Type of string test failed');
            assert.ok(!validate.isValidIntegerString(''), 'Empty string test failed');
            assert.ok(!validate.isValidIntegerString('1'.repeat(21)), 'Long string test failed');
            assert.ok(!validate.isValidIntegerString(badString), 'Bad string test failed');
            assert.ok(!validate.isValidIntegerString(badStringTwo), 'Bad string test failed');
            assert.ok(validate.isValidIntegerString(goodString), 'Good string test failed');
            done();
        });

        it('isValidUuidString returns true if uuid false otherwise', function (done) {
            const badUuid = '1c76ea46-a212-4cc5-9031-a9a28d927c4c98';
            const goodUuid = '1c76ea46-a212-4cc5-9031-a9a28d927c4c';

            assert.ok(!validate.isValidUuidString(undefined), 'Undefined string test failed');
            assert.ok(!validate.isValidUuidString(3), 'Type of string test failed');
            assert.ok(!validate.isValidUuidString(''), 'Empty string test failed');
            assert.ok(!validate.isValidUuidString(badUuid), 'Bad string test failed');
            assert.ok(validate.isValidUuidString(goodUuid), 'Good string test failed');
            done();
        });

        it('isCharactersString returns true if input is character false otherwise', function (done) {
            assert.ok(!validate.isCharactersString(undefined), 'Undefined string test failed');
            assert.ok(!validate.isCharactersString(3), 'Type of string test failed');
            assert.ok(!validate.isCharactersString(''), 'Empty string test failed');
            assert.ok(!validate.isCharactersString('a'.repeat(1001)), 'Long string test failed');
            assert.ok(!validate.isCharactersString(badString), 'Bad string test failed');
            assert.ok(validate.isCharactersString(goodString), 'Good string test failed');
            done();
        });

        it('isStreetString returns true if valid street address false otherwise', function (done) {
            const goodStreet1 = '103, main market';
            const goodStreet2 = 'H.No-21/4, MG Road';
            const goodStreet3 = 'Flat #12-A';
            const badStreet1 = '<script>alert(1)</script>';
            const badStreet2 = '';
            const badStreet3 = 123;
            assert.ok(validate.isStreetString(goodStreet1), 'Good street test failed');
            assert.ok(validate.isStreetString(goodStreet2), 'Good street test failed');
            assert.ok(validate.isStreetString(goodStreet3), 'Good street test failed');
            assert.ok(!validate.isStreetString(badStreet1), 'Bad street test failed');
            assert.ok(!validate.isStreetString(badStreet2), 'Empty street test failed');
            assert.ok(!validate.isStreetString(badStreet3), 'Non-string street test failed');
            done();
        });

        it('isNameString returns true if input is character false otherwise', function (done) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const longName = chars.repeat(100);
            assert.ok(!validate.isNameString(longName), 'Long name test failed');
            assert.ok(!validate.isNameString('Peter @ Singh'), 'Bad name');
            assert.ok(!validate.isNameString('3Peter'), 'Bad name');
            assert.ok(!validate.isNameString(''), 'Empty name');
            assert.ok(!validate.isNameString(123), 'Non-string name');
            assert.ok(validate.isNameString('Peter (Singh)'), 'Good name');
            assert.ok(validate.isNameString('Peter'), 'Good name');
            assert.ok(validate.isNameString('Peter-Singh'), 'Peter-Singh');
            assert.ok(validate.isNameString('P. Singh'), 'Peter-Singh');
            assert.ok(validate.isNameString("P's Singh"), "P's Singh");
            assert.ok(validate.isNameString("P's Singh-Lion"), "P's Singh-Lion");
            assert.ok(validate.isNameString("P's Singh-Lion,s"), "P's Singh-Lion");
            assert.ok(validate.isNameString(" P's Singh-Lion "), "P's Singh-Lion");
            done();
        });

        it('isSafeSearchString returns true if input is character false otherwise', function (done) {
            assert.ok(validate.isSafeSearchString('Peter @ Singh'), 'Bad name');
            assert.ok(!validate.isSafeSearchString('3Peter'), 'Bad name');
            assert.ok(!validate.isSafeSearchString(''), 'Empty search');
            assert.ok(!validate.isSafeSearchString(123), 'Non-string search');
            assert.ok(validate.isSafeSearchString('Peter (Singh)'), 'Good name');
            assert.ok(validate.isSafeSearchString('Peter'), 'Good name');
            assert.ok(validate.isSafeSearchString('Peter-Singh'), 'Peter-Singh');
            assert.ok(validate.isSafeSearchString('P. Singh'), 'Peter-Singh');
            assert.ok(validate.isSafeSearchString("P's Singh"), "P's Singh");
            assert.ok(validate.isSafeSearchString("P's Singh-Lion"), "P's Singh-Lion");
            assert.ok(validate.isSafeSearchString("P's Singh-Lion,s"), "P's Singh-Lion");
            assert.ok(validate.isSafeSearchString(" P's Singh-Lion "), "P's Singh-Lion");
            assert.ok(validate.isSafeSearchString('pank@gmail.com '), 'pank@gmail.com');
            done();
        });

        it('isEmailString returns true if input is email false otherwise ', function (done) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const longEmail = chars.repeat(100) + '@gmail.com';
            assert.ok(!validate.isEmailString(longEmail), 'Long email test failed');
            assert.ok(!validate.isEmailString(''), 'Empty email test failed');
            assert.ok(!validate.isEmailString(123), 'Non-string email test failed');
            assert.ok(!validate.isEmailString(goodString), 'Bad email test failed');
            assert.ok(!validate.isEmailString(badString), 'Bad email test failed');
            assert.ok(!validate.isEmailString('peter @gmail.com'), 'Email validation failed');
            assert.ok(validate.isEmailString('peter@gmail.com'), 'Email validation failed');
            done();
        });

        it('isJwtString returns true if input is jwt string false otherwise', function (done) {
            const goodJwt =
                'eyJhbGciOiJzaGE1MTIiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoyNjg0LCJ0aW1lIjoxNjEwNzE2ODM0ODc2fQ.9o_7dM4YjjcNseH7Cw3IL_t8yD1hhs1hluTCWG_JzYEExYOp89Gd6k0AbU018x3EQXCrdMUE6KXfL0KNg2Li9g';
            const badJwt =
                'eyJhbGciOiJza<scriptE1MTIiLCJ0eXAiOiJKV/1QifQ.eyJ1c2VyX2lkIjoyNjg0LCJ0aW1lIjoxNjEwNzE2ODM0ODc2fQ.9o_7dM4YjjcNseH7Cw3IL_t8yD1hhs1hluTCWG_JzYEExYOp89Gd6k0AbU018x3EQXCrdMUE6KXfL0KNg2Li9g';

            assert.ok(!validate.isJwtString(goodString), 'Bad email test failed');
            assert.ok(!validate.isJwtString(badString), 'Bad email test failed');
            assert.ok(!validate.isJwtString(badJwt), 'Bad badJwt string test failed');
            assert.ok(!validate.isJwtString(''), 'Empty jwt string test failed');
            assert.ok(!validate.isJwtString('   '), 'Whitespace only jwt string test failed');
            assert.ok(!validate.isJwtString('a'.repeat(8193)), 'Long jwt string test failed');
            assert.ok(validate.isJwtString(goodJwt), 'Good JwtString string test failed');
            done();
        });

        it('isPasswordString returns true if input is password string false otherwise', function (done) {
            const badPassword_1 = 'I am a good person';
            const badPassword_2 = '!@#$%^&*';
            const badPassword_3 = 'I <script>am evil</script>';
            const badPassword_4 = 'ha!lsw 3ol&*ler';
            const badPassword_5 = 'pnka*';
            const badPassword_6 = 'pnka*some654t#hinddtyte5dtytkugjh';
            const goodPassword_1 = 'pankaj*';
            const goodPassword_2 = 'pank!aj67';
            const goodPassword_3 = 'some654t#hing#';
            const goodPassword_4 = '82625%82726';
            const goodPassword_5 = 'halsw3ol&*ler';
            const goodPassword_6 = 'pnkaj*-hg';
            const goodPassword_7 = 'pnkaj_hg';

            assert.deepStrictEqual(
                validate.isPasswordStringFailureMessage(badPassword_1),
                'Total 6 to 32 characters, numbers and one of !@#$%^&*_-',
            );
            assert.deepStrictEqual(validate.isPasswordStringFailureMessage(goodPassword_1), null);

            assert.ok(!validate.isPasswordString(badPassword_1), 'Bad Password validation failed');
            assert.ok(!validate.isPasswordString(badPassword_2), 'Bad Password validation failed');
            assert.ok(!validate.isPasswordString(badPassword_3), 'Bad Password validation failed');
            assert.ok(!validate.isPasswordString(badPassword_4), 'Bad Password validation failed');
            assert.ok(!validate.isPasswordString(badPassword_5), 'Bad Password validation failed');
            assert.ok(!validate.isPasswordString(badPassword_6), 'Bad Password validation failed');
            assert.ok(!validate.isPasswordString(''), 'Empty Password validation failed');
            assert.ok(!validate.isPasswordString(123), 'Non-string Password validation failed');
            assert.ok(!validate.isPasswordString('a'.repeat(129)), 'Long Password validation failed');
            assert.ok(validate.isPasswordString(goodPassword_1), 'Password validation failed');
            assert.ok(validate.isPasswordString(goodPassword_2), 'Password validation failed');
            assert.ok(validate.isPasswordString(goodPassword_3), 'Password validation failed');
            assert.ok(validate.isPasswordString(goodPassword_4), 'Password validation failed');
            assert.ok(validate.isPasswordString(goodPassword_5), 'Password validation failed');
            assert.ok(validate.isPasswordString(goodPassword_6), 'Password validation failed');
            assert.ok(validate.isPasswordString(goodPassword_7), 'Password validation failed');
            done();
        });

        it('isSimplePasswordString returns true if input is password string false otherwise', function (done) {
            const badPassword_1 = 'I am a good person';
            const badPassword_2 = 'I <script>am evil</script>';
            const badPassword_3 = 'ha!lsw 3ol&*ler';
            const badPassword_4 = 'pnka*';
            const badPassword_5 = 'pnka*some654t#hinjgiuffdytrrtsdjj';
            const badPassword_6 = 'pnkad';
            const goodPassword_1 = 'pankaj*e';
            const goodPassword_2 = 'pank!aj67';
            const goodPassword_3 = 'some654t#hing#';
            const goodPassword_4 = '82625%82726';
            const goodPassword_5 = 'halsw3ol&*ler';
            const goodPassword_6 = 'pnkaj*sd';
            const goodPassword_7 = 'pnkajchatpta';
            const goodPassword_8 = '!@#$%^&*';

            assert.deepStrictEqual(
                validate.isSimplePasswordStringFailureMessage(badPassword_1),
                'Total 6 to 32 characters, numbers or !@#$%^&*_-',
            );
            assert.deepStrictEqual(validate.isSimplePasswordStringFailureMessage(goodPassword_1), null);

            assert.ok(!validate.isSimplePasswordString(badPassword_1), 'Bad Password validation failed');
            assert.ok(!validate.isSimplePasswordString(badPassword_2), 'Bad Password validation failed');
            assert.ok(!validate.isSimplePasswordString(badPassword_3), 'Bad Password validation failed');
            assert.ok(!validate.isSimplePasswordString(badPassword_4), 'Bad Password validation failed');
            assert.ok(!validate.isSimplePasswordString(badPassword_5), 'Bad Password validation failed');
            assert.ok(!validate.isSimplePasswordString(badPassword_6), 'Bad Password validation failed');
            assert.ok(!validate.isSimplePasswordString(''), 'Empty Password validation failed');
            assert.ok(!validate.isSimplePasswordString(123), 'Non-string Password validation failed');
            assert.ok(!validate.isSimplePasswordString('a'.repeat(129)), 'Long Password validation failed');
            assert.ok(validate.isSimplePasswordString(goodPassword_1), 'Password validation failed');
            assert.ok(validate.isSimplePasswordString(goodPassword_2), 'Password validation failed');
            assert.ok(validate.isSimplePasswordString(goodPassword_3), 'Password validation failed');
            assert.ok(validate.isSimplePasswordString(goodPassword_4), 'Password validation failed');
            assert.ok(validate.isSimplePasswordString(goodPassword_5), 'Password validation failed');
            assert.ok(validate.isSimplePasswordString(goodPassword_6), 'Password validation failed');
            assert.ok(validate.isSimplePasswordString(goodPassword_7), 'Password validation failed');
            assert.ok(validate.isSimplePasswordString(goodPassword_8), 'Password validation failed');
            done();
        });

        it('isUsernameString returns true if input is username string false otherwise', function (done) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const longUserName = chars.repeat(100);
            assert.ok(!validate.isUsernameString(longUserName), 'Long user name test failed');
            assert.ok(!validate.isUsernameString(''), 'Empty string test failed');
            assert.ok(!validate.isUsernameString(123), 'Non-string test failed');
            assert.ok(!validate.isUsernameString(goodString), 'Good string test failed');
            assert.ok(!validate.isUsernameString(badString), 'Bad string test failed');
            assert.ok(validate.isUsernameString('testUsername'), 'username validation failed');
            assert.ok(validate.isUsernameString(user.username), 'username validation failed');
            done();
        });

        it('isPhoneNumber returns true if input is username string false otherwise', function (done) {
            assert.ok(validate.isPhoneNumber('509 644 2443'), 'Good phone number test failed');
            assert.ok(!validate.isPhoneNumber('509 644 2443998776655'), 'Bad phone number test failed');
            assert.ok(!validate.isPhoneNumber(''), 'Empty phone number test failed');
            assert.ok(!validate.isPhoneNumber(123), 'Non-string phone number test failed');
            done();
        });

        it('isUrlSafeString returns true if input is username string false otherwise', function (done) {
            const urlSafeString =
                'hbGciOiJzaGE1MTIiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoyNjg0LCJ0aW1lIjoxNjEwNzE2ODM0ODc2fQ.' +
                '9o_7dM4YjjcNseH7Cw3IL_t8yD1hhs1hluTCWG_JzYEExYOp89Gd6k0AbU018x3EQXCrdMUE6KXfL0KNg2Li9g';

            const urlUnSafeString =
                'hbGciOiJzaGE1MTIiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoyNjg0LCJ0aW1lIjoxNjEwNzE2ODM0ODc2fQ.' +
                '9o_7dM4YjjcNseH7Cw3IL_t8yD1hhs1hl=uTCWG_JzYEExYOp8/9Gd6k0AbU018x3EQXCrdMUE6KXfL0KNg2Li9g';

            assert.ok(!validate.isUrlSafeString(urlUnSafeString), 'Url unsafe test failed');
            assert.ok(validate.isUrlSafeString(urlSafeString), 'Url safe test failed');
            done();
        });

        it('isPasswordLengthCorrect returns true if 6 <= password <= 24', function (done) {
            const password = 'hbGciOiJzaGE1MTIiLCJ';

            const badPassword =
                'hbGciOiJzaGE1MTIiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoyNjg0LCJ0aW1lIjoxNjEwNzE2ODM0ODc2fQ.' +
                '9o_7dM4YjjcNseH7Cw3IL_t8yD1hhs1hl=uTCWG_JzYEExYOp8/9Gd6k0AbU018x3EQXCrdMUE6KXfL0KNg2Li9g';

            assert.ok(validate.isString6To24CharacterLong(password), 'Good password fail');
            assert.ok(!validate.isString6To24CharacterLong(badPassword), 'Bad password fail');
            assert.ok(!validate.isString6To24CharacterLong(''), 'Empty password fail');
            assert.ok(!validate.isString6To24CharacterLong(undefined), 'Undefined password fail');
            done();
        });

        it('isPasswordLengthCorrect returns true if 6 <= password <= 16', function (done) {
            const password = 'hbGciOiJzaGE1MTI';

            const badPassword =
                'hbGciOiJzaGE1MTIiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoyNjg0LCJ0aW1lIjoxNjEwNzE2ODM0ODc2fQ.' +
                '9o_7dM4YjjcNseH7Cw3IL_t8yD1hhs1hl=uTCWG_JzYEExYOp8/9Gd6k0AbU018x3EQXCrdMUE6KXfL0KNg2Li9g';

            assert.ok(validate.isString6To16CharacterLong(password), 'Good password fail');
            assert.ok(!validate.isString6To16CharacterLong(badPassword), 'Bad password fail');
            assert.ok(!validate.isString6To16CharacterLong(''), 'Empty password fail');
            assert.ok(!validate.isString6To16CharacterLong(undefined), 'Undefined password fail');
            done();
        });

        it('isProvinceString returns true if input is two letter province code', function (done) {
            const ontario = 'ON';
            const quebec = 'QC';
            const bad = 'IamBad';

            assert.ok(validate.isProvinceString(ontario), 'Good province code failing');
            assert.ok(validate.isProvinceString(quebec), 'Good province code failing');
            assert.ok(!validate.isProvinceString(bad), 'Bad province code failing');
            assert.ok(!validate.isProvinceString(123), 'Non-string province code failing');
            done();
        });

        it('isBoolValue', function (done) {
            const trueValue = true;
            const falseValue = false;
            const trueString = 'true';
            const falseString = 'false';
            const notBool = 'I am string';

            assert.ok(validate.isBoolValue(trueValue), 'Bool value failing');
            assert.ok(validate.isBoolValue(falseValue), 'Bool value failing');
            assert.ok(validate.isBoolValue(trueString), 'Bool string true failing');
            assert.ok(validate.isBoolValue(falseString), 'Bool string false failing');
            assert.ok(!validate.isBoolValue(notBool), 'Not bool value failing');
            done();
        });

        it('isPostalCodeString returns true if postal code', function (done) {
            const codeOne = 'M4Y1R6';
            const codeTwo = 'G1G0E3';
            const bad = 'M441R6';

            assert.ok(validate.isPostalCodeString(codeOne), 'Good province code failing');
            assert.ok(validate.isPostalCodeString(codeTwo), 'Good province code failing');
            assert.ok(!validate.isPostalCodeString(bad), 'Bad province code failing');
            assert.ok(!validate.isPostalCodeString(123), 'Non-string postal code failing');
            done();
        });

        it('isSafeString returns true if safe', function (done) {
            const safeString_1 = '#346 Charles* st. west:-(ON) east_side [as]';
            const unsafeString_1 = '<G1G0E3?';

            assert.ok(validate.isSafeString(safeString_1), 'Safe string code failing');
            assert.ok(!validate.isSafeString(unsafeString_1), 'Unsafe string code failing');
            assert.ok(!validate.isSafeString(''), 'Empty string failing');
            assert.ok(!validate.isSafeString(undefined), 'Undefined string failing');
            assert.ok(!validate.isSafeString('a'.repeat(10001)), 'Too long string failing');
            done();
        });

        it('isInStringArray returns true if input is in string array', function (done) {
            const stringArray_1 = ['on', 'ca'];
            const stringArray_2 = ['gc', 'qc'];
            const value_1 = 'ca';
            const value_2 = 'aa';

            assert.ok(validate.isInStringArray(stringArray_1, value_1), 'Safe string code failing');
            assert.ok(!validate.isInStringArray(stringArray_2, value_2), 'Unsafe string code failing');
            assert.ok(!validate.isInStringArray(stringArray_1, 123), 'Non-string value in array failing');
            done();
        });

        it('isCountryCodeString returns true if country code', function (done) {
            const codeOne = '+1';
            const codeTwo = '+966';
            const bad = '572';

            assert.ok(validate.isCountryCodeString(codeOne), 'Good country code failing');
            assert.ok(validate.isCountryCodeString(codeTwo), 'Good country code failing');
            assert.ok(!validate.isCountryCodeString(bad), 'Bad country code failing');
            assert.ok(!validate.isCountryCodeString(''), 'Empty country code failing');
            assert.ok(!validate.isCountryCodeString(undefined), 'Undefined country code failing');
            assert.ok(!validate.isCountryCodeString('+1234'), 'Long country code failing');
            done();
        });

        it('isValidDomainName returns true if valid domain name, false otherwise', function (done) {
            const goodDomain1 = 'example.com';
            const goodDomain2 = 'sub.example.com';
            const goodDomain3 = 'my-domain.org';
            const goodDomain4 = 'school.edu.in';
            const badDomain1 = 'example';
            const badDomain2 = '.example.com';
            const badDomain3 = 'example.com-';
            const badDomain4 = '-example.com';
            const badDomain5 = 'example..com';

            assert.ok(validate.isValidDomainName(goodDomain1), 'Good domain test failed');
            assert.ok(validate.isValidDomainName(goodDomain2), 'Good domain test failed');
            assert.ok(validate.isValidDomainName(goodDomain3), 'Good domain test failed');
            assert.ok(validate.isValidDomainName(goodDomain4), 'Good domain test failed');
            assert.ok(!validate.isValidDomainName(badDomain1), 'Bad domain test failed');
            assert.ok(!validate.isValidDomainName(badDomain2), 'Bad domain test failed');
            assert.ok(!validate.isValidDomainName(badDomain3), 'Bad domain test failed');
            assert.ok(!validate.isValidDomainName(badDomain4), 'Bad domain test failed');
            assert.ok(!validate.isValidDomainName(badDomain5), 'Bad domain test failed');
            assert.ok(!validate.isValidDomainName(''), 'Empty domain test failed');
            assert.ok(!validate.isValidDomainName(undefined), 'Undefined domain test failed');
            done();
        });

        it('isValidTimestampzString returns true if timestamp with time zone, false otherwise', function (done) {
            const goodTz1 = '2023-10-27T10:00:00Z';
            const goodTz2 = '2023-10-27T10:00:00+02:00';
            const goodTz3 = '2023-10-27T10:00:00.123Z';
            const badTz1 = '2023-10-27T10:00:00';
            const badTz2 = '2023-13-27T10:00:00Z'; // Invalid month
            const badTz3 = '2023-10-27 10:00:00Z'; // Missing T

            assert.ok(validate.isValidTimestampzString(goodTz1), 'Good timestampz test failed');
            assert.ok(validate.isValidTimestampzString(goodTz2), 'Good timestampz test failed');
            assert.ok(validate.isValidTimestampzString(goodTz3), 'Good timestampz test failed');
            assert.ok(!validate.isValidTimestampzString(badTz1), 'Bad timestampz test failed (no TZ)');
            assert.ok(!validate.isValidTimestampzString(badTz2), 'Bad timestampz test failed (invalid date)');
            assert.ok(!validate.isValidTimestampzString(badTz3), 'Bad timestampz test failed (missing T)');
            assert.ok(!validate.isValidTimestampzString(undefined), 'Undefined test failed');
            done();
        });

        it('isValidTimestampString returns true if timestamp without time zone, false otherwise', function (done) {
            const goodT1 = '2023-10-27T10:00:00';
            const goodT2 = '2023-10-27T10:00:00.123';
            const badT1 = '2023-10-27T10:00:00Z';
            const badT2 = '2023-13-27T10:00:00'; // Invalid month
            const badT3 = '2023-10-27 10:00:00'; // Missing T

            assert.ok(validate.isValidTimestampString(goodT1), 'Good timestamp test failed');
            assert.ok(validate.isValidTimestampString(goodT2), 'Good timestamp test failed');
            assert.ok(!validate.isValidTimestampString(badT1), 'Bad timestamp test failed (has TZ)');
            assert.ok(!validate.isValidTimestampString(badT2), 'Bad timestamp test failed (invalid date)');
            assert.ok(!validate.isValidTimestampString(badT3), 'Bad timestamp test failed (missing T)');
            assert.ok(!validate.isValidTimestampString(undefined), 'Undefined test failed');
            done();
        });
        it('isValidUrl returns true if valid url, false otherwise', function (done) {
            assert.ok(validate.isValidUrl('http://example.com'), 'http url failed');
            assert.ok(validate.isValidUrl('https://example.com'), 'https url failed');
            assert.ok(!validate.isValidUrl('ftp://example.com'), 'ftp url should fail');
            assert.ok(!validate.isValidUrl('invalid-url'), 'invalid url should fail');
            assert.ok(!validate.isValidUrl(undefined), 'undefined url should fail');
            assert.ok(!validate.isValidUrl(''), 'empty url should fail');
            assert.ok(!validate.isValidUrl('a'.repeat(2049)), 'long url should fail');
            done();
        });

        it('isValidArrayOfStrings returns true if valid array of strings, false otherwise', function (done) {
            assert.ok(validate.isValidArrayOfStrings(['a', 'b']), 'valid array failed');
            assert.ok(!validate.isValidArrayOfStrings(['a', 1]), 'array with number should fail');
            assert.ok(!validate.isValidArrayOfStrings('not an array'), 'non-array should fail');
            assert.ok(!validate.isValidArrayOfStrings(['']), 'array with empty string should fail');
            assert.ok(!validate.isValidArrayOfStrings(['a'.repeat(10001)]), 'array with long string should fail');
            done();
        });
    });
});
