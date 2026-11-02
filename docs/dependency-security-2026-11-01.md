# Dependency security validation: 2026-11-01

Apply $carecard-workspace-standards and $pkg-publish to package changes and
the coordinated release sequence.

The installed Express peer graph contained body-parser 2.3.0 and qs 6.16.0.
The refreshed lockfile resolves body-parser 2.4.0 and qs 6.17.1, addressing
[GHSA-27r3-jxmh-p828](https://github.com/advisories/GHSA-27r3-jxmh-p828)
and [GHSA-6pq8-jhm2-2vcw](https://github.com/advisories/GHSA-6pq8-jhm2-2vcw).
These are dependency updates; no validation API or business policy changes.

Existing security overrides now select Glob 14.0.2, Minimatch 11.0.1 and
Serialize JavaScript 7.1.3. Their published fixes address
[GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4),
[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)
and [GHSA-m5mm-p8h7-m29v](https://github.com/advisories/GHSA-m5mm-p8h7-m29v).
The dependency inventory audit tracks the updated supported Glob release.

The complete `npm audit --json` and `npm ls --all` checks succeed. Preserve
ordinary diagnostics, runtime and type coverage, coverage thresholds and all
native Husky gates. Package 3.45.0 is the coordinated release target; refresh
declared CareCard dependencies after their publishing turns and validate again
before this package's deferred source push and publication.

Non-negotiable repository isolation rule: Every repository must run its Husky
hooks and tests using only files, code, fixtures, dependencies, and services
contained within that repository. Tests and Husky scripts must not import,
require, read, execute, or otherwise depend on sibling repositories or paths
outside the repository root. app-e2e-tests is the only exception because
cross-repository end-to-end testing is its explicit responsibility.

The direct `@carecard/common-util` dependency selects 3.45.0 from the verified
coordinated registry release. Preserve the generic public contract and the
full native validation gates when consuming this dependency.
