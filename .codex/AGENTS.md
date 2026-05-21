# Codex Instructions For pkg-validate

Follow the root workspace instructions in `/Users/pankajpriscilla/SO_CareCardCa/.codex/AGENTS.md` first. This file adds rules specific to the `@carecard/validate` package.

## Non-Negotiable Instructions

- Never use TypeScript type `any`. Use specific value, record, validator, option, result, generic, or `unknown` types with narrowing.
- Always follow this repository's coding style, naming conventions, and CommonJS project structure.
- Always use Test-Driven Development: add or update the relevant Mocha or type tests before changing behavior.
- Never suppress errors, linter warnings, TypeScript errors, or failing tests. Handle the underlying issue.
- Do not add new dependencies unless they are absolutely needed. Ask for confirmation first with the reason and tradeoff.
- Before finalizing work in this repository, run every script in `.husky/` and fix anything they report.

## Package Shape

- Keep `index.js` as the centralized public export surface.
- Keep TypeScript declarations in `index.d.ts` aligned with every public export in `index.js`.
- Keep direct validators in `lib/validate.js`.
- Keep key-based property sanitization in `lib/validateProperties.js`.
- Keep whitelist, nested-path, casing, flattening, and CareCard bad-input behavior in `lib/validateWhitelistProperties.js`.
- Preserve the package's CommonJS module style unless the repository is intentionally migrated.
- Keep the deprecated `validate` namespace export backward-compatible while preferring direct top-level exports in new code.

## Validation Rules

- Low-level validators should be deterministic predicate functions that return `true` or `false`.
- Password failure-message helpers should return `null` for valid input and a user-readable string for invalid input.
- `validateProperties` should return a new sanitized object and omit unknown or invalid fields without mutating the input.
- `validateWhitelistProperties` should reject missing or invalid required fields with CareCard `BAD_INPUT` errors through `@carecard/common-util`.
- Optional whitelist fields should be ignored when absent and rejected when present but invalid.
- Preserve supported snake_case and camelCase field aliases unless a task explicitly changes the API contract.
- Preserve nested dot-path handling, the maximum nesting depth, maximum path count, optional snake_case conversion, and flattening behavior.
- Avoid broad regular expressions or validation changes without focused tests for accepted values, rejected values, length limits, and edge cases.

## Types And API Contracts

- Model input and output records, whitelist options, flattened output behavior, validators, and failure-message helpers explicitly in `index.d.ts`.
- When existing declarations are too loose, improve them with specific types as part of the touched change instead of adding new loose types.
- Update `test/types.test.ts` whenever public types, exports, options, return values, or validators change.
- Keep runtime exports, README examples, and type declarations in sync.

## Tests

- Use Mocha for runtime tests under `test/`.
- Use `test/types.test.ts` for TypeScript declaration coverage through `npm run test:types`.
- Add focused tests for valid input, invalid input, missing fields, optional fields, array handling, nested paths, casing conversion, flattening, and error messages when those areas change.
- Keep tests deterministic and avoid relying on real external services.
- Before pushing or finalizing, run `.husky/pre-commit`; it runs lint fixing, formatting, and `npm run test:All`.
