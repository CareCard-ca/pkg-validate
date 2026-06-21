---
name: logged-in-user-profile-page
description: 'Use when changing shared validation behavior for app-dashboard logged-in profile/settings fields, especially phone number and country-code request aliases.'
---

# Logged-In User Profile Page

Non-negotiable TDD rule: Always write the failing test first, run it to confirm it fails for the intended reason, then implement the code and rerun the test until it passes. Test Driven Development is required for all coding work and must not be skipped. For documentation- or skill-only edits, add or update the relevant validation check before changing the prose.

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
