---
name: pkg-validate
description: Use when changing pkg-validate, the @carecard/validate CommonJS validation package. Covers direct validators, validateProperties, validateWhitelistProperties, nested dot paths, snake_case/camelCase aliases, flattening, CareCard BAD_INPUT errors, public exports, TypeScript declarations, Mocha tests, coverage thresholds, and type tests.
---

# Package Validate

## Overview

Use this skill when working inside `pkg-validate`, the `@carecard/validate`
package. It provides deterministic validators, key-based property sanitization,
and CareCard whitelist validation behavior used across services.

Use `$carecard-workspace-standards` for shared workspace, dependency, package,
testing, and security rules. Legacy `pkg-validate/.codex` and
`pkg-validate/.junie` guidance has been migrated into these skills; do not
depend on those folders being present.

## Non-Negotiable Rules

- Never use TypeScript type `any`. Use specific value, record, validator,
  option, result, generic, or `unknown` types with narrowing.
- Follow this repository's coding style, naming conventions, and CommonJS
  project structure.
- Use Test-Driven Development: add or update relevant Mocha or type tests before
  changing behavior.
- Never suppress errors, linter warnings, TypeScript errors, or failing tests.
  Handle the underlying issue.
- Do not add dependencies unless absolutely needed. Ask for confirmation first
  with the reason and tradeoff.
- Before finalizing work, run every direct script in `.husky` and fix anything
  they report.

## Package Shape

- Keep `index.js` as the centralized public export surface.
- Keep TypeScript declarations in `index.d.ts` aligned with every public export
  in `index.js`.
- Keep direct validators in `lib/validate.js`.
- Keep key-based property sanitization in `lib/validateProperties.js`.
- Keep whitelist, nested-path, casing, flattening, and CareCard bad-input
  behavior in `lib/validateWhitelistProperties.js`.
- Preserve the package's CommonJS module style unless the repository is
  intentionally migrated.
- Keep the deprecated `validate` namespace export backward-compatible while
  preferring direct top-level exports in new code.

## Validation Behavior

- Low-level validators should be deterministic predicate functions that return
  `true` or `false`.
- Password failure-message helpers should return `null` for valid input and a
  user-readable string for invalid input.
- `validateProperties` should return a new sanitized object and omit unknown or
  invalid fields without mutating the input.
- `validateWhitelistProperties` should reject missing or invalid required fields
  with CareCard `BAD_INPUT` errors through `@carecard/common-util`.
- Optional whitelist fields should be ignored when absent and rejected when
  present but invalid.
- Preserve supported snake_case and camelCase field aliases unless a task
  explicitly changes the API contract.
- Preserve nested dot-path handling, maximum nesting depth, maximum path count,
  optional snake_case conversion, and flattening behavior.
- Avoid broad regular expressions or validation changes without focused tests
  for accepted values, rejected values, length limits, and edge cases.

## Types And API Contracts

- Model input and output records, whitelist options, flattened output behavior,
  validators, and failure-message helpers explicitly in `index.d.ts`.
- When existing declarations are too loose, improve them with specific types as
  part of the touched change instead of adding new loose types.
- Update `test/types.test.ts` whenever public types, exports, options, return
  values, or validators change.
- Keep runtime exports, README examples, and type declarations in sync.
- Preserve validation behavior for invalid, missing, extra, and valid fields.

## Tests And Coverage

- Use Mocha for runtime tests under `test`.
- Use `test/types.test.ts` for TypeScript declaration coverage through
  `npm run test:types`.
- Add focused tests for valid input, invalid input, missing fields, optional
  fields, array handling, nested paths, casing conversion, flattening, and error
  messages when those areas change.
- Keep tests deterministic and avoid real external services.
- This package enforces 100% coverage for branches, functions, lines, and
  statements through `nyc`; do not reduce thresholds.

## Legacy Junie Source Notes

The migrated `.junie` memory files contained no active task, feedback, or error
entries. `language.json` was an empty array, `memory.version` was `3.0`, and no
plan files were present.

## Validation

Useful commands:

- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`
- `npm run test`
- `npm run test:types`
- `npm run test:coverage`
- `npm run test:All`

Before pushing or finalizing, run every direct `.husky` script. The current
`.husky/pre-commit` runs:

```bash
npm run lint:fix
npm run format
npm run test:All
```

If any validation command cannot run, report the exact command, failure reason,
and remaining risk.

## Agent Guidance Git Workflow

When this skill or any repository-owned `.agents` guidance changes, use the
repository's agents-only Git workflow:

1. Work from the affected repository root and confirm only intended `.agents`
   files changed.
2. Use `development` as the base branch when `origin/development` exists;
   otherwise use the repository's default base branch, usually `main`.
3. Create or update `feature/codex` from the updated remote base branch and
   commit all the changed `.agents` guidance files there.
4. Push `feature/codex`, create or reuse a pull request into the base branch,
   and mark the pull request ready for review with `gh pr ready <number>`.
5. Squash-merge with administrator privileges and delete the remote branch:

    ```sh
    gh pr merge <number> --squash --admin --delete-branch
    ```

6. After merge, update the local base branch and remove the local feature
   branch:

    ```sh
    git fetch origin <base> --prune
    git switch <base>
    git pull --ff-only origin <base>
    git branch -d feature/codex
    git ls-remote --heads origin feature/codex
    ```

Do not commit or push `.agents` guidance changes directly from `development`
or `main`. Do not stage unrelated files, generated output, dependency folders,
build artifacts, logs, or `.DS_Store`.
