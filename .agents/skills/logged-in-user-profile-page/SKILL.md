---
name: logged-in-user-profile-page
description: 'Use when changing shared validation behavior for app-dashboard logged-in profile/settings fields, especially phone number and country-code request aliases.'
---

Non-negotiable root-cause solution rule: Always identify and solve the verified root cause with a correct, durable, production-quality solution. Never treat a temporary workaround, resource increase, retry, suppression, bypass, or symptom-only patch as completion. Validate the root-cause fix against the real failing workflow and prove the end state.

# Logged-In User Profile Page

Non-negotiable TDD rule: Always write the failing test first, run it to confirm it fails for the intended reason, then implement the code and rerun the test until it passes. Test Driven Development is required for all coding work and must not be skipped. For documentation- or skill-only edits, add or update the relevant validation check before changing the prose.

Non-negotiable repository isolation rule: Every repository must run its Husky hooks and tests using only files, code, fixtures, dependencies, and services contained within that repository. Tests and Husky scripts must not import, require, read, execute, or otherwise depend on sibling repositories or paths outside the repository root. app-e2e-tests is the only exception because cross-repository end-to-end testing is its explicit responsibility.

Non-negotiable error and warning rule: Never suppress, silence, hide, downgrade, filter, ignore, skip, or bypass errors or warnings from code, tests, tools, compilers, linters, or validation. Fix the root cause, then rerun the affected check and require a clean result. Expected error-path tests may assert errors, but must not conceal unexpected failures.

Non-negotiable code organization rule: Functions with the same or equivalent behavior must use the same or clearly corresponding descriptive names across CareCard repositories, and equivalent functionality must live in files with the same names within each repository's established architecture. No backward compatibility names, aliases, or duplicate locations are allowed.

## Scope

Use this skill inside `pkg-validate` when dashboard profile/settings behavior
depends on shared validation rules.

Relevant profile/settings fields:

- Phone number: `phone_number`, `phoneNumber`
- Country code: `country_code`, `countryCode`

## Requirements

- Keep `validateProperties` aliases in sync with `validateWhitelistProperties`
  consumers in services such as `ms-auth`.
- Preserve both snake_case and camelCase aliases unless a task explicitly
  removes one.
- Add focused tests for every accepted and rejected profile/settings key alias.
- Update `readme.md` whenever a key alias is added or removed.
- Do not add dashboard-specific service behavior to this package; keep it to
  deterministic validation helpers and key-based validation contracts.

## Validation

- Run focused Mocha tests for the changed validator keys.
- Run `npm run test:types` when public exports or declarations are affected.
- Run `npm run test:All` for validator contract changes before finalizing.
