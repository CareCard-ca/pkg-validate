# @carecard/validate

Reusable format predicates, canonical input normalization, and caller-configured
validation. Domain field schemas, allowed roles, workflow states, and password
policy belong to the service or application that owns them. This package never
interprets a property name or supplies a business-policy default.

## Explicit schemas

`createValueParser(predicate, transform?)` adapts a boolean predicate and optional
value transformation. A custom parser returns `{ isValid: true, value }` or
`{ isValid: false }`. Predicates must return exactly `true` to accept a value.

`validateSchemaProperties(input, schema)` returns only valid own fields named in
the caller schema. It copies and trims JSON keys and string edges before parsing,
omits unknown or rejected fields, and does not mutate the input.

`validateSchemaWhitelistProperties(input, requiredPaths, options)` requires an
explicit `options.schema` with one parser for every full selected path. Required
missing/invalid fields and supplied invalid optional fields produce `BAD_INPUT`.
Missing optional fields are omitted. Array leaves are parsed element by element.
Missing or invalid schema configuration raises `TypeError`.

```js
const {
  createValueParser,
  isInteger,
  validateSchemaWhitelistProperties,
} = require('@carecard/validate');

const output = await validateSchemaWhitelistProperties(
  { measurement: { count: 3 }, ignored: true },
  ['measurement.count'],
  { schema: { 'measurement.count': createValueParser(isInteger) } },
);
// { measurement: { count: 3 } }
```

Options also support `optionalProperties`, `convertToSnakeCase`, `flattenOutput`,
and `flattenKeyStyle` (`path` by default or `leaf`). Snake/camel path variants
resolve as before; mixed casing within a segment is rejected. Selection is
bounded to five path segments and 5,000 paths per call. Public constants are
`MAX_NESTING_DEPTH` and `MAX_KEYS_PER_CALL`.

Flattened leaf collisions favor the shallower value, then the first traversal.
Reserved-looking keys remain inert own data, and inherited paths are ignored.
Ambiguous normalized keys, cyclic JSON input, and accessors are rejected.

## Configured password validation

`validatePasswordAgainstPolicy(value, { minimumLength, maximumLength, isBlocked? })`
requires caller-selected lengths. It trims string edges, normalizes NFC, and
counts Unicode code points. Successful results contain the canonical value.
Failure reasons are `invalid_type`, `invalid_unicode`, `too_short`, `too_long`,
and `blocked`. Invalid policy configuration raises `TypeError`.

`isCommonPassword(value)` exposes a generic weak-password corpus lookup. It has
no automatic effect; callers decide whether to use it as `isBlocked`.

## Format predicates and normalization

Direct predicates cover integers, UUIDs, dates/timestamps, email, HTTP URLs,
MIME types, safe JSON, Unicode text, names, filename metadata, phones, and other
reusable formats. They return booleans and do not assign domain meaning to data.
`isInStringArray(values, input)` checks a caller-supplied case-insensitive list.
The existing `validate` namespace contains the same generic format predicates.

`normalizeInputWhitespace(input)` copies JSON records and arrays, trims own keys
and string edges, preserves internal whitespace and opaque/binary values, and
rejects key collisions, accessors, and cycles. Raw format predicates retain their
character constraints. Filename callers may explicitly normalize accepted
metadata with NFKC and trim; display names remain unchanged.

The public root and focused imports stay safe for browser bundles. TypeScript
contracts are supplied in `index.d.ts`.

## Validation

Run `npm run test:All`, `npm run lint`, and `npm run format:check`. Runtime
coverage remains 100% for statements, branches, functions, and lines. Tests
exercise public behavior with caller-owned example schemas; business policy is
verified in its owning repository.

Non-negotiable test order invariance rule: Every test must pass independently of which tests run before or after it, and the suite must pass in every execution order. Each test must establish the state it needs, isolate mutable state, and clean up state it owns; it must never rely on another test's setup, mutations, or cleanup. Default test, CI, and Husky commands must use the test framework's ordinary ordering and must not force randomized ordering. Random-order execution is an explicit diagnostic only, and every failure it exposes must be fixed at the root cause.

Non-negotiable root-cause solution rule: Always identify and solve the verified root cause, use the stronger solution, and deliver a correct, durable, production-quality result. Never treat a temporary workaround, resource increase, retry, suppression, bypass, or symptom-only patch as completion. Validate the root-cause fix against the real failing workflow and prove the end state.

Non-negotiable TDD rule: Always write the failing test first, run it to confirm it fails for the intended reason, then implement the code and rerun the test until it passes. Test Driven Development is required for all coding work and must not be skipped. For documentation- or skill-only edits, run the relevant focused non-test
validation before changing the prose; do not add automated tests that inspect
prose, files, or repository structure.

Non-negotiable repository isolation rule: Every repository must run its Husky hooks and tests using only files, code, fixtures, dependencies, and services contained within that repository. Tests and Husky scripts must not import, require, read, execute, or otherwise depend on sibling repositories or paths outside the repository root. app-e2e-tests is the only exception because cross-repository end-to-end testing is its explicit responsibility.

Non-negotiable error and warning rule: Never suppress, silence, hide, downgrade, filter, ignore, skip, or bypass errors or warnings from code, tests, tools, compilers, linters, or validation. Fix the root cause, then rerun the affected check and require a clean result. Expected error-path tests may assert errors, but must not conceal unexpected failures.

Non-negotiable TypeScript type rule: Never use the TypeScript type `any`; always use specific domain types, generics, existing project types, or `unknown` with explicit narrowing in all TypeScript-family files (`.ts`, `.tsx`, `.mts`, `.cts`, and `.d.ts`).

Non-negotiable code organization rule: Functions with the same or equivalent behavior must use the same or clearly corresponding descriptive names across CareCard repositories, and equivalent functionality must live in files with the same names within each repository's established architecture. No backward compatibility names, aliases, or duplicate locations are allowed.
