const assert = require('assert').strict;
const {describe, it} = require('mocha');
const validate = require('../index').validate;


describe('AuthUtil test', function () {
    const goodString = "I am a good person";
    const badString = 'I <script>am evil</script>';
    const user = {username: 'username'};

    describe('Validate function test', function () {

        it('isImageUrl returns true if safe image url, false otherwise', function (done) {
            const image_url = "A44C0A67A8704767AD2B97DC46478827/8B57EB9F014143F2AE6B9D8EBBB7CDA6-700.jpg";
            const image_url_bad_one = "A44C0A67*A8704767AD2B97DC46478827/8B57EB9F014143F2AE6B9D8EBBB7CDA6-700.jpg";
            const image_url_bad_two = "A44C0A67>A8704767AD2B97DC46478827/8B57EB9F014143F2AE6B9D8EBBB7CDA6-700.jpg";

            assert.ok(!validate.isImageUrl(image_url_bad_one), 'Bad image url test failed');
            assert.ok(!validate.isImageUrl(image_url_bad_two), 'Bad image url test failed');
            assert.ok(validate.isImageUrl(image_url), 'Good image url test failed');
            done();
        });

        it('isInteger returns true if integer false otherwise', function (done) {
            const badInteger_1 = 234.65;
            const badInteger_2 = '';
            const badInteger_3 = "3.2";
            const badInteger_4 = "67";
            const goodInteger_1 = 72662;

            assert.ok(!validate.isInteger(badInteger_1), 'Bad integer test failed');
            assert.ok(!validate.isInteger(badInteger_2), 'Bad integer test failed');
            assert.ok(!validate.isInteger(badInteger_3), 'Bad integer test failed');
            assert.ok(!validate.isInteger(badInteger_4), 'Bad integer test failed');
            assert.ok(validate.isInteger(goodInteger_1), 'Good integer test failed');
            done();
        });

        it('isValidJsonString returns true if json false otherwise', function (done) {
            const badString = "1chie87";
            const badStringTwo = "13-34";
            const goodString = "{\"blocks\":[{\"key\":\"ediog\",\"text\":\"I am doing well\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}";

            assert.ok(!validate.isValidJsonString(undefined), 'Undefined string test failed');
            assert.ok(!validate.isValidJsonString(3), 'Type of string test failed');
            assert.ok(!validate.isValidJsonString(badString), 'Bad string test failed');
            assert.ok(!validate.isValidJsonString(badStringTwo), 'Bad string test failed');
            assert.ok(validate.isValidJsonString(goodString), 'Good string test failed');
            done();
        });

        it('isValidIntegerString returns true if integer false otherwise', function (done) {
            const badString = "1chie87";
            const badStringTwo = "13-34";
            const goodString = "17";

            assert.ok(!validate.isValidIntegerString(undefined), 'Undefined string test failed');
            assert.ok(!validate.isValidIntegerString(3), 'Type of string test failed');
            assert.ok(!validate.isValidIntegerString(badString), 'Bad string test failed');
            assert.ok(!validate.isValidIntegerString(badStringTwo), 'Bad string test failed');
            assert.ok(validate.isValidIntegerString(goodString), 'Good string test failed');
            done();
        });

        it('isValidUuidString returns true if uuid false otherwise', function (done) {
            const badUuid = "1c76ea46-a212-4cc5-9031-a9a28d927c4c98";
            const goodUuid = "1c76ea46-a212-4cc5-9031-a9a28d927c4c";

            assert.ok(!validate.isValidUuidString(undefined), 'Undefined string test failed');
            assert.ok(!validate.isValidUuidString(3), 'Type of string test failed');
            assert.ok(!validate.isValidUuidString(badUuid), 'Bad string test failed');
            assert.ok(validate.isValidUuidString(goodUuid), 'Good string test failed');
            done();
        });

        it('isCharactersString returns true if input is character false otherwise', function (done) {
            assert.ok(!validate.isCharactersString(undefined), 'Undefined string test failed');
            assert.ok(!validate.isCharactersString(3), 'Type of string test failed');
            assert.ok(!validate.isCharactersString(badString), 'Bad string test failed');
            assert.ok(validate.isCharactersString(goodString), 'Good string test failed');
            done();
        });

        it('isNameString returns true if input is character false otherwise', function (done) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            const longName = chars.repeat(100);
            assert.ok(!validate.isNameString(longName), "Long name test failed");
            assert.ok(!validate.isNameString('Peter @ Singh'), 'Bad name');
            assert.ok(!validate.isNameString('3Peter'), 'Bad name');
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
            assert.ok(validate.isSafeSearchString('Peter (Singh)'), 'Good name');
            assert.ok(validate.isSafeSearchString('Peter'), 'Good name');
            assert.ok(validate.isSafeSearchString('Peter-Singh'), 'Peter-Singh');
            assert.ok(validate.isSafeSearchString('P. Singh'), 'Peter-Singh');
            assert.ok(validate.isSafeSearchString("P's Singh"), "P's Singh");
            assert.ok(validate.isSafeSearchString("P's Singh-Lion"), "P's Singh-Lion");
            assert.ok(validate.isSafeSearchString("P's Singh-Lion,s"), "P's Singh-Lion");
            assert.ok(validate.isSafeSearchString(" P's Singh-Lion "), "P's Singh-Lion");
            assert.ok(validate.isSafeSearchString("pank@gmail.com "), "pank@gmail.com");
            done();
        });

        it('isEmailString returns true if input is email false otherwise ', function (done) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            const longEmail = chars.repeat(100) + "@gmail.com";
            assert.ok(!validate.isEmailString(longEmail), 'Long email test failed');
            assert.ok(!validate.isEmailString(goodString), 'Bad email test failed');
            assert.ok(!validate.isEmailString(badString), 'Bad email test failed');
            assert.ok(!validate.isEmailString('peter @gmail.com'), 'Email validation failed');
            assert.ok(validate.isEmailString('peter@gmail.com'), 'Email validation failed');
            done();
        });

        it('isJwtString returns true if input is jwt string false otherwise', function (done) {
            const goodJwt = 'eyJhbGciOiJzaGE1MTIiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoyNjg0LCJ0aW1lIjoxNjEwNzE2ODM0ODc2fQ.9o_7dM4YjjcNseH7Cw3IL_t8yD1hhs1hluTCWG_JzYEExYOp89Gd6k0AbU018x3EQXCrdMUE6KXfL0KNg2Li9g';
            const badJwt = 'eyJhbGciOiJza<scriptE1MTIiLCJ0eXAiOiJKV/1QifQ.eyJ1c2VyX2lkIjoyNjg0LCJ0aW1lIjoxNjEwNzE2ODM0ODc2fQ.9o_7dM4YjjcNseH7Cw3IL_t8yD1hhs1hluTCWG_JzYEExYOp89Gd6k0AbU018x3EQXCrdMUE6KXfL0KNg2Li9g';

            assert.ok(!validate.isJwtString(goodString), 'Bad email test failed');
            assert.ok(!validate.isJwtString(badString), 'Bad email test failed');
            assert.ok(!validate.isJwtString(badJwt), 'Bad badJwt string test failed');
            assert.ok(validate.isJwtString(goodJwt), 'Good JwtString string test failed');
            done();
        });

        it('isPasswordString returns true if input is password string false otherwise', function (done) {
            const badPassword_1 = 'I am a good person';
            const badPassword_2 = "!@#$%^&*";
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

            assert.deepStrictEqual(validate.isPasswordStringFailureMessage(badPassword_1),
                "Total 6 to 32 characters, numbers and one of !@#$%^&*_-");

            assert.ok(!validate.isPasswordString(badPassword_1), 'Bad Password validation failed');
            assert.ok(!validate.isPasswordString(badPassword_2), 'Bad Password validation failed');
            assert.ok(!validate.isPasswordString(badPassword_3), 'Bad Password validation failed');
            assert.ok(!validate.isPasswordString(badPassword_4), 'Bad Password validation failed');
            assert.ok(!validate.isPasswordString(badPassword_5), 'Bad Password validation failed');
            assert.ok(!validate.isPasswordString(badPassword_6), 'Bad Password validation failed');
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

            assert.deepStrictEqual(validate.isSimplePasswordStringFailureMessage(badPassword_1),
                "Total 6 to 32 characters, numbers or !@#$%^&*_-");

            assert.ok(!validate.isSimplePasswordString(badPassword_1), 'Bad Password validation failed');
            assert.ok(!validate.isSimplePasswordString(badPassword_2), 'Bad Password validation failed');
            assert.ok(!validate.isSimplePasswordString(badPassword_3), 'Bad Password validation failed');
            assert.ok(!validate.isSimplePasswordString(badPassword_4), 'Bad Password validation failed');
            assert.ok(!validate.isSimplePasswordString(badPassword_5), 'Bad Password validation failed');
            assert.ok(!validate.isSimplePasswordString(badPassword_6), 'Bad Password validation failed');
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
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            const longUserName = chars.repeat(100);
            assert.ok(!validate.isUsernameString(longUserName), "Long user name test failed");
            assert.ok(!validate.isUsernameString(goodString), 'Good string test failed');
            assert.ok(!validate.isUsernameString(badString), 'Bad string test failed');
            assert.ok(validate.isUsernameString('testUsername'), 'username validation failed');
            assert.ok(validate.isUsernameString(user.username), 'username validation failed');
            done();
        });

        it('isPhoneNumber returns true if input is username string false otherwise', function (done) {
            assert.ok(validate.isPhoneNumber("509 644 2443"), 'Good phone number test failed');
            assert.ok(!validate.isPhoneNumber("509 644 2443998"), 'Bad phone number test failed');
            done();
        });

        it('isUrlSafeString returns true if input is username string false otherwise', function (done) {
            const urlSafeString = 'hbGciOiJzaGE1MTIiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoyNjg0LCJ0aW1lIjoxNjEwNzE2ODM0ODc2fQ.' +
                '9o_7dM4YjjcNseH7Cw3IL_t8yD1hhs1hluTCWG_JzYEExYOp89Gd6k0AbU018x3EQXCrdMUE6KXfL0KNg2Li9g';

            const urlUnSafeString = 'hbGciOiJzaGE1MTIiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoyNjg0LCJ0aW1lIjoxNjEwNzE2ODM0ODc2fQ.' +
                '9o_7dM4YjjcNseH7Cw3IL_t8yD1hhs1hl=uTCWG_JzYEExYOp8/9Gd6k0AbU018x3EQXCrdMUE6KXfL0KNg2Li9g';

            assert.ok(!validate.isUrlSafeString(urlUnSafeString), 'Url unsafe test failed');
            assert.ok(validate.isUrlSafeString(urlSafeString), 'Url safe test failed');
            done();
        });

        it('isPasswordLengthCorrect returns true if 6 <= password <= 24', function (done) {
            const password = 'hbGciOiJzaGE1MTIiLCJ';

            const badPassword = 'hbGciOiJzaGE1MTIiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoyNjg0LCJ0aW1lIjoxNjEwNzE2ODM0ODc2fQ.' +
                '9o_7dM4YjjcNseH7Cw3IL_t8yD1hhs1hl=uTCWG_JzYEExYOp8/9Gd6k0AbU018x3EQXCrdMUE6KXfL0KNg2Li9g';

            assert.ok(validate.isString6To24CharacterLong(password), 'Good password fail');
            assert.ok(!validate.isString6To24CharacterLong(badPassword), 'Bad password fail');
            done();
        });

        it('isPasswordLengthCorrect returns true if 6 <= password <= 16', function (done) {
            const password = 'hbGciOiJzaGE1MTI';

            const badPassword = 'hbGciOiJzaGE1MTIiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoyNjg0LCJ0aW1lIjoxNjEwNzE2ODM0ODc2fQ.' +
                '9o_7dM4YjjcNseH7Cw3IL_t8yD1hhs1hl=uTCWG_JzYEExYOp8/9Gd6k0AbU018x3EQXCrdMUE6KXfL0KNg2Li9g';

            assert.ok(validate.isString6To16CharacterLong(password), 'Good password fail');
            assert.ok(!validate.isString6To16CharacterLong(badPassword), 'Bad password fail');
            done();
        });

        it('isProvinceString returns true if input is two letter province code', function (done) {
            const ontario = "ON";
            const quebec = "QC";
            const bad = "IamBad";

            assert.ok(validate.isProvinceString(ontario), 'Good province code failing');
            assert.ok(validate.isProvinceString(quebec), 'Good province code failing');
            assert.ok(!validate.isProvinceString(bad), 'Bad province code failing');
            done();
        });

        it('isBoolValue', function (done) {
            const trueValue = true;
            const falseValue = true;
            const notBool = 'I am string';

            assert.ok(validate.isBoolValue(trueValue), 'Bool value failing');
            assert.ok(validate.isBoolValue(falseValue), 'Bool value failing');
            assert.ok(!validate.isBoolValue(notBool), 'Not bool value failing');
            done();
        });

        it('isPostalCodeString returns true if postal code', function (done) {
            const codeOne = "M4Y1R6";
            const codeTwo = "G1G0E3";
            const bad = "M441R6";

            assert.ok(validate.isPostalCodeString(codeOne), 'Good province code failing');
            assert.ok(validate.isPostalCodeString(codeTwo), 'Good province code failing');
            assert.ok(!validate.isPostalCodeString(bad), 'Bad province code failing');
            done();
        });

        it('isSafeString returns true if safe', function (done) {
            const safeString_1 = "#346 Charles* st. west:-(ON) east_side [as]";
            const unsafeString_1 = "<G1G0E3?";

            assert.ok(validate.isSafeString(safeString_1), 'Safe string code failing');
            assert.ok(!validate.isSafeString(unsafeString_1), 'Unsafe string code failing');
            done();
        });

        it('isSafeString returns true if safe', function (done) {
            const stringArray_1 = ["on", "ca"];
            const stringArray_2 = ["gc", "qc"];
            const value_1 = "ca";
            const value_2 = "aa";

            assert.ok(validate.isInStringArray(stringArray_1, value_1), 'Safe string code failing');
            assert.ok(!validate.isInStringArray(stringArray_2, value_2), 'Unsafe string code failing');
            done();
        });

        it('isCountryCodeString returns true if postal code', function (done) {
            const codeOne = "+1";
            const codeTwo = "+966";
            const bad = "572";

            assert.ok(validate.isCountryCodeString(codeOne), 'Good country code failing');
            assert.ok(validate.isCountryCodeString(codeTwo), 'Good country code failing');
            assert.ok(!validate.isCountryCodeString(bad), 'Bad country code failing');
            done();
        });

        it('isValidDomainName returns true if valid domain name, false otherwise', function (done) {
            const goodDomain1 = "example.com";
            const goodDomain2 = "sub.example.com";
            const goodDomain3 = "my-domain.org";
            const goodDomain4 = "school.edu.in";
            const badDomain1 = "example";
            const badDomain2 = ".example.com";
            const badDomain3 = "example.com-";
            const badDomain4 = "-example.com";
            const badDomain5 = "example..com";

            assert.ok(validate.isValidDomainName(goodDomain1), 'Good domain test failed');
            assert.ok(validate.isValidDomainName(goodDomain2), 'Good domain test failed');
            assert.ok(validate.isValidDomainName(goodDomain3), 'Good domain test failed');
            assert.ok(validate.isValidDomainName(goodDomain4), 'Good domain test failed');
            assert.ok(!validate.isValidDomainName(badDomain1), 'Bad domain test failed');
            assert.ok(!validate.isValidDomainName(badDomain2), 'Bad domain test failed');
            assert.ok(!validate.isValidDomainName(badDomain3), 'Bad domain test failed');
            assert.ok(!validate.isValidDomainName(badDomain4), 'Bad domain test failed');
            assert.ok(!validate.isValidDomainName(badDomain5), 'Bad domain test failed');
            assert.ok(!validate.isValidDomainName(""), 'Empty domain test failed');
            assert.ok(!validate.isValidDomainName(undefined), 'Undefined domain test failed');
            done();
        });
    });
});
