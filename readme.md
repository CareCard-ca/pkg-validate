# @carecard/validate

Non-negotiable root-cause solution rule: Always identify and solve the verified root cause, use the stronger solution, and deliver a correct, durable, production-quality result. Never treat a temporary workaround, resource increase, retry, suppression, bypass, or symptom-only patch as completion. Validate the root-cause fix against the real failing workflow and prove the end state.

`@carecard/validate` is a small CommonJS validation package for CareCard
services. It exposes individual value validators, a bulk property sanitizer, and
a whitelist validator for request-like payloads.

The package returns booleans from the low-level validators, strips unknown or
invalid values from `validateProperties`, and throws CareCard `BAD_INPUT` errors
from `validateWhitelistProperties` when required or provided whitelist values do
not pass validation.

## Development Rule

Non-negotiable TDD rule: Always write the failing test first, run it to confirm it fails for the intended reason, then implement the code and rerun the test until it passes. Test Driven Development is required for all coding work and must not be skipped. For documentation- or skill-only edits, add or update the relevant validation check before changing the prose.

Non-negotiable repository isolation rule: Every repository must run its Husky hooks and tests using only files, code, fixtures, dependencies, and services contained within that repository. Tests and Husky scripts must not import, require, read, execute, or otherwise depend on sibling repositories or paths outside the repository root. app-e2e-tests is the only exception because cross-repository end-to-end testing is its explicit responsibility.

Non-negotiable error and warning rule: Never suppress, silence, hide, downgrade, filter, ignore, skip, or bypass errors or warnings from code, tests, tools, compilers, linters, or validation. Fix the root cause, then rerun the affected check and require a clean result. Expected error-path tests may assert errors, but must not conceal unexpected failures.

Non-negotiable code organization rule: Functions with the same or equivalent behavior must use the same or clearly corresponding descriptive names across CareCard repositories, and equivalent functionality must live in files with the same names within each repository's established architecture. No backward compatibility names, aliases, or duplicate locations are allowed.

## Installation

```sh
npm install @carecard/validate
```

## Importing

```js
const { validate, validateProperties, validateWhitelistProperties, isEmailString, isValidUuidString } = require('@carecard/validate');
```

The validators are available both as top-level exports and under the deprecated
`validate` namespace.

```js
isEmailString('jane@example.com'); // true
validate.isEmailString('jane@example.com'); // true
```

## Direct Validators

Every direct validator returns `true` or `false`. Failure message helpers return
a string on failure and `null` on success.

| Function                                      | Accepted value                                                                                                                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isImageUrl(value)`                           | Non-empty string up to 2048 chars using letters, numbers, `-`, `_`, `.`, and `/`. Intended for safe image/file paths.                                                                   |
| `isInteger(value)`                            | JavaScript integer number. String numbers are rejected.                                                                                                                                 |
| `isValidJsonString(value)`                    | Non-empty string up to 10000 chars that parses to a non-null JSON object or array. JSON primitives are rejected.                                                                        |
| `isValidIntegerString(value)`                 | Digit-only string, 1 to 20 chars. No signs or decimals.                                                                                                                                 |
| `isValidUuidString(value)`                    | Canonical UUID string in `8-4-4-4-12` format, case-insensitive.                                                                                                                         |
| `isCharactersString(value)`                   | 1 to 1000 chars containing letters, numbers, spaces, `_`, or `-`.                                                                                                                       |
| `isStreetString(value)`                       | Non-empty street-like string up to 1000 chars using letters, numbers, spaces, `,`, `.`, `/`, `#`, or `-`, and not starting with `,`, `_`, or `-`.                                       |
| `isNameString(value)`                         | 1 to 1000 char string that starts with a letter and uses letters, numbers, spaces, `_`, `-`, `.`, `,`, `'`, `(`, or `)`. Leading/trailing spaces are trimmed before pattern validation. |
| `isSafeSearchString(value)`                   | Trimmed string that starts with a letter and then uses letters, numbers, spaces, `_`, `-`, `.`, `,`, `'`, `(`, `)`, or `@`.                                                             |
| `isEmailString(value)`                        | Email-like string up to 320 chars using the package email regex.                                                                                                                        |
| `isJwtString(value)`                          | Non-blank JWT-like string up to 8192 chars that starts with `eyJ` and contains only letters, numbers, `-`, `_`, and `.`.                                                                |
| `isPasswordString(value)`                     | 6 to 32 chars from letters, numbers, and `!@#$%^&*_-`, with at least one alphanumeric char and one listed special char.                                                                 |
| `isSimplePasswordString(value)`               | 6 to 32 chars from letters, numbers, and `!@#$%^&*_-`.                                                                                                                                  |
| `isPasswordStringFailureMessage(value)`       | `null` when `isPasswordString` passes, otherwise a human-readable failure message.                                                                                                      |
| `isSimplePasswordStringFailureMessage(value)` | `null` when `isSimplePasswordString` passes, otherwise a human-readable failure message.                                                                                                |
| `isUsernameString(value)`                     | 1 to 200 alphanumeric chars.                                                                                                                                                            |
| `isPhoneNumber(value)`                        | North American 10-digit phone number with optional parentheses around the area code and optional space, `-`, or `.` separators.                                                         |
| `isUrlSafeString(value)`                      | Non-blank string up to 2048 chars using letters, numbers, `-`, `_`, and `.`.                                                                                                            |
| `isString6To24CharacterLong(value)`           | String with length from 6 to 24.                                                                                                                                                        |
| `isString6To16CharacterLong(value)`           | String with length from 6 to 16.                                                                                                                                                        |
| `isProvinceString(value)`                     | `ON` or `QC`, case-insensitive.                                                                                                                                                         |
| `isBoolValue(value)`                          | Boolean `true`/`false` or strings `"true"`/`"false"`.                                                                                                                                   |
| `isPostalCodeString(value)`                   | Canadian postal code format, case-insensitive, with optional middle space.                                                                                                              |
| `isSafeString(value)`                         | 1 to 10000 chars using letters, numbers, spaces, `-`, `_`, `.`, `,`, `#`, `*`, `'`, `(`, `)`, `[`, `]`, or `:`.                                                                         |
| `isInStringArray(array, value)`               | `value`, after lowercase/trim validation as a name string, is included in the supplied array.                                                                                           |
| `isCountryCodeString(value)`                  | Country dialing code in `+1` to `+999` format.                                                                                                                                          |
| `isValidDomainName(value)`                    | Domain name with at least one dot, valid DNS-like labels, and max total length 253.                                                                                                     |
| `isValidTimestampzString(value)`              | ISO 8601 timestamp with `Z` or `+/-HH:MM` timezone offset.                                                                                                                              |
| `isValidTimestampString(value)`               | ISO 8601 timestamp without timezone offset.                                                                                                                                             |
| `isValidDateString(value)`                    | ISO date in `YYYY-MM-DD` format.                                                                                                                                                        |
| `isValidUrl(value)`                           | Absolute `http://` or `https://` URL up to 2048 chars.                                                                                                                                  |
| `isValidArrayOfStrings(value)`                | Array where every element passes `isSafeString`.                                                                                                                                        |

## `validateProperties(obj)`

`validateProperties` accepts an object and returns a new object that contains
only recognized keys whose values pass the validator assigned to that key.
Unknown keys and invalid values are silently omitted. `null`, `undefined`, or no
argument returns `{}`.

```js
const input = {
    first_name: 'Jane',
    email: 'jane@example.com',
    phone_number: '123',
    unknown_key: 'ignored',
};

validateProperties(input);
// {
//   first_name: 'Jane',
//   email: 'jane@example.com'
// }
```

### Supported Property Keys

Keys are matched exactly. Both snake_case and camelCase variants are listed
where the package supports both.

| Validator                                                 | Keys                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isNameString`                                            | `first_name`, `firstName`, `last_name`, `lastName`, `username`, `new_status`, `newStatus`, `description`, `comment`, `status`, `name`, `title`, `brand`, `short_description`, `shortDescription`, `college_name`, `collegeName`, `campus_name`, `campusName`, `role`, `role_id`, `roleId`, `campus`, `institution_name`, `institutionName`, `program_name`, `programName`, `role_name`, `roleName`, `document_name`, `documentName`, `document_required_for_role_name`, `documentRequiredForRoleName`, `reason`, `entity_type`, `entityType`, `action_type`, `actionType`, `city`, `state`, `country`, `type`                                                                                                                                             |
| `isStreetString`                                          | `street`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `isCharactersString`                                      | `postal_code`, `postalCode`, `period`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `isBoolValue`                                             | `is_primary`, `isPrimary`, `active`, `document_optional`, `documentOptional`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `isSafeSearchString`                                      | `search_string`, `searchString`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `isString6To16CharacterLong` and `isSimplePasswordString` | `password`, `new_password`, `newPassword`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `isString6To16CharacterLong` and `isPasswordString`       | `strong_password`, `strongPassword`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `isEmailString`                                           | `email`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `isPhoneNumber`                                           | `phone_number`, `phoneNumber`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `isCountryCodeString`                                     | `country_code`, `countryCode`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `isUrlSafeString`                                         | `token`, `email_confirm_token`, `emailConfirmToken`, `verification_token`, `verificationToken`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `isValidUuidString`                                       | `uuid`, `item_id`, `itemId`, `user_id`, `userId`, `address_id`, `addressId`, `order_id`, `orderId`, `category_id`, `categoryId`, `parent_id`, `parentId`, `college_id`, `collegeId`, `campus_id`, `campusId`, `program_id`, `programId`, `program_term_id`, `programTermId`, `template_id`, `templateId`, `program_template_id`, `programTemplateId`, `user_item_id`, `userItemId`, `user_item_status_id`, `userItemStatusId`, `requirement_item_id`, `requirementItemId`, `program_document_id`, `programDocumentId`, `id`, `institution_id`, `institutionId`, `role_assignment_id`, `roleAssignmentId`, `user_role_id`, `userRoleId`, `phone_number_id`, `phoneNumberId`, `entity_id`, `entityId`, `changed_by`, `changedBy`, `request_id`, `requestId` |
| `isCcIdString`                                            | `cc_id`, `ccId`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `isValidIntegerString`                                    | `offset_number`, `offsetNumber`, `number_of_orders`, `numberOfOrders`, `price`, `from`, `number`, `limit`, `offset`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `isValidJsonString` on the raw value                      | `about`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `isValidJsonString(JSON.stringify(value))`                | `weight`, `dimensions`, `permission`, `scope_data`, `scopeData`, `meta_data`, `metaData`, `metadata`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `isTextString`                                            | `document_description`, `documentDescription`, `nick_name`, `nickName`, `requested_by_name`, `requestedByName`, `requested_by_email`, `requestedByEmail`, `requested_by_phone`, `requestedByPhone`, `approved_by_name`, `approvedByName`, `approved_by_email`, `approvedByEmail`, `approved_by_phone`, `approvedByPhone`                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `isValidArrayOfStrings`                                   | `aliases`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `isImageUrl` or `isValidUrl`                              | `image_url`, `imageUrl`, `website`, `file_url`, `fileUrl`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `isValidDomainName`                                       | `domain_name`, `domainName`, `domain`, `email_domain`, `emailDomain`, `email_domain_name`, `emailDomainName`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `isValidTimestampzString` or `isValidTimestampString`     | `expires_at`, `expiresAt`, `start_time`, `startTime`, `end_time`, `endTime`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `isValidDateString`                                       | `effective_start_date`, `effectiveStartDate`, `effective_end_date`, `effectiveEndDate`, `valid_until_date`, `validUntilDate`, `renew_date`, `renewDate`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

## `validateWhitelistProperties(inputObject, requiredProperties, options)`

`validateWhitelistProperties` extracts only the required and optional property
paths you provide, validates each leaf through `validateProperties`, and returns
a `Promise<ValidatePropertiesResult>` with the sanitized output.

```js
const body = {
    first_name: 'Jane',
    email: 'jane@example.com',
    role: 'Admin',
    extra: '<script>',
};

const out = await validateWhitelistProperties(body, ['first_name', 'email'], {
    optionalProperties: ['role'],
});

// {
//   first_name: 'Jane',
//   email: 'jane@example.com',
//   role: 'Admin'
// }
```

### Defaults

When omitted, `requiredProperties` defaults to `[]` and `options` defaults to:

```js
{
    optionalProperties: [],
    convertToSnakeCase: false,
    flattenOutput: false,
    flattenKeyStyle: 'path',
}
```

The default output preserves the nested shape described by whitelisted dot paths.
`flattenKeyStyle` only changes output when `flattenOutput` is `true`.

```js
const input = {
    user: {
        first_name: 'Jane',
        contact: { email: 'jane@example.com' },
    },
};

await validateWhitelistProperties(input, ['user.first_name', 'user.contact.email']);
// {
//   user: {
//     first_name: 'Jane',
//     contact: { email: 'jane@example.com' }
//   }
// }
```

### Options

| Option               | Default  | Behavior                                                                                                                                                                           |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `optionalProperties` | `[]`     | Additional property paths that may be present. Absent optional paths are ignored. Present optional paths must be valid.                                                            |
| `convertToSnakeCase` | `false`  | When `true`, converts returned keys, including nested keys, to snake_case using `@carecard/common-util`. Conversion happens before flattening.                                     |
| `flattenOutput`      | `false`  | When `true`, removes nested objects from the returned value so every validated leaf becomes a top-level key.                                                                       |
| `flattenKeyStyle`    | `'path'` | Controls flattened key naming when `flattenOutput` is `true`. Use `'path'` for full dot-notation keys or `'leaf'` for direct leaf names. Invalid values throw a `BAD_INPUT` error. |

Example with only the default options:

```js
await validateWhitelistProperties({ first_name: 'Jane', email: 'jane@example.com', ignored: 'x' }, ['first_name']);
// { first_name: 'Jane' }
```

Example with optional properties:

```js
await validateWhitelistProperties({ first_name: 'Jane', phone_number: '4165551234' }, ['first_name'], {
    optionalProperties: ['phone_number'],
});
// { first_name: 'Jane', phone_number: '4165551234' }
```

### Required And Optional Values

Required paths must exist and pass validation. Missing or invalid required paths
throw a CareCard bad input error.

```js
await validateWhitelistProperties({ email: 'bad' }, ['email']);
// throws/rejects with:
// {
//   code: 'BAD_INPUT',
//   message: 'Bad_Input',
//   userMessage: 'Missing or invalid property: email'
// }
```

Optional paths are ignored when absent, but invalid when present.

```js
await validateWhitelistProperties({ first_name: 'Jane', email: 'bad' }, ['first_name'], {
    optionalProperties: ['email'],
});
// userMessage: 'Invalid property value: email'
```

### Nested Paths

Use dot notation for nested objects. The leaf key decides which validator is
used.

```js
const out = await validateWhitelistProperties(
    {
        user: {
            first_name: 'Jane',
            contact: { email: 'jane@example.com', ignored: 'x' },
        },
    },
    ['user.first_name', 'user.contact.email'],
);

// {
//   user: {
//     first_name: 'Jane',
//     contact: { email: 'jane@example.com' }
//   }
// }
```

Nested paths support up to 5 segments. The combined count of required and
optional paths must be 5000 or fewer.

### Arrays

If a whitelisted leaf value is an array, each element is validated as if it were
the scalar value for that same leaf key. The array is accepted only when every
element passes. Empty arrays are accepted.

```js
await validateWhitelistProperties({ email: ['a@example.com', 'b@example.com'] }, ['email']);
// { email: ['a@example.com', 'b@example.com'] }
```

This array behavior is intended for repeated scalar fields such as `email` or
`name`.

### Case Conversion And Flattening

```js
const out = await validateWhitelistProperties({ userInfo: { firstName: 'Jane', phoneNumber: '4165551234' } }, ['userInfo.firstName'], {
    optionalProperties: ['userInfo.phoneNumber'],
    convertToSnakeCase: true,
    flattenOutput: true,
});

// {
//   'user_info.first_name': 'Jane',
//   'user_info.phone_number': '4165551234'
// }
```

With `flattenOutput: false` or no `flattenOutput` option, nested paths keep the
nested output shape:

```js
const input = { a: { b: { c: { d: { email: 'jane@example.com' } } } } };
await validateWhitelistProperties(input, ['a.b.c.d.email']);
// { a: { b: { c: { d: { email: 'jane@example.com' } } } } }
```

With `flattenOutput: true`, keys are full dot paths by default:

```js
const input = { a: { b: { c: { d: { email: 'jane@example.com', name: 'Jane' } } } } };
await validateWhitelistProperties(input, ['a.b.c.d.email', 'a.b.c.d.name'], {
    flattenOutput: true,
});
// { 'a.b.c.d.email': 'jane@example.com', 'a.b.c.d.name': 'Jane' }
```

Use `flattenKeyStyle: 'leaf'` to return top-level leaf keys instead:

```js
const input = { a: { b: { c: { d: { email: 'jane@example.com', name: 'Jane' } } } } };
await validateWhitelistProperties(input, ['a.b.c.d.email', 'a.b.c.d.name'], {
    flattenOutput: true,
    flattenKeyStyle: 'leaf',
});
// { email: 'jane@example.com', name: 'Jane' }
```

When `flattenKeyStyle: 'leaf'` produces duplicate keys at different nesting
levels, the higher-level value is kept and the lower-level duplicate is
discarded. Duplicate leaf keys at the same nesting depth keep the first value
encountered:

```js
const input = {
    name: 'Top Level Name',
    user: { name: 'Nested Name', email: 'jane@example.com' },
};

await validateWhitelistProperties(input, ['name', 'user.name', 'user.email'], {
    flattenOutput: true,
    flattenKeyStyle: 'leaf',
});
// { name: 'Top Level Name', email: 'jane@example.com' }
```

## TypeScript

The package ships `index.d.ts` and declares types for the CommonJS exports.

```ts
import { validateWhitelistProperties, isEmailString, ValidatePropertiesResult } from '@carecard/validate';

const valid: boolean = isEmailString('jane@example.com');
const output: ValidatePropertiesResult = await validateWhitelistProperties({ first_name: 'Jane' }, ['first_name']);
const maxDepth: 5 = validateWhitelistProperties.MAX_NESTING_DEPTH;
```

## Project Layout

```text
index.js                         CommonJS public entry point
index.d.ts                       TypeScript declarations
lib/validate.js                  Direct value validators
lib/validateProperties.js        Key-to-validator sanitizer
lib/validateWhitelistProperties.js Required/optional whitelist validator
test/*.test.js                   Mocha runtime tests
test/types.test.ts               TypeScript declaration tests
```

## Development

```sh
npm ci
npm run test
npm run test:types
npm run test:All
npm run lint
npm run format:check
```

CI runs on Node.js 25 and executes `npm run test:All`. Publishing to npm happens
from `main` through the `Publish to npm` GitHub workflow.

## Auth Boundary

Validation protects request shape, not authorization. `ms-auth` owns its
auth-table RLS contract: normal users are self-row only, JWT `roles: ["ad"]`
is the auth super-admin signal, and public auth flows use narrow system
contexts. Do not use validators as a replacement for service RLS or database
context checks.

Docs that mention `ms-auth` controller internals should use concise action
names such as `loginUser`, `registerUser`, `getUserDetail`, and `renewJwt`.
Access level is conveyed by route middleware and endpoint placement, not by
`public`/`protected`/`admin`/`Handler` suffixes.
