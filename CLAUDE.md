# Repository Agent Instructions

## Mandatory startup for every agent

Every agent, including Codex, Claude, other assistants, and delegated agents,
must read and follow [carecard-must-do](.agents/skills/carecard-must-do/SKILL.md)
before beginning or resuming any task. This includes planning, questions,
read-only investigation, coding, review, documentation, and validation.

Then load the [repository engineering standards](.agents/skills/pkg-validate-coding-standards-and-best-practices/SKILL.md)
and the specialist skills relevant to the task.
An agent without automatic skill discovery must open the skill explicitly;
the requirement applies regardless of the agent platform.

Also read [AGENTS.md](AGENTS.md) for the full repository instructions.

## Existing repository isolation contract

Non-negotiable repository isolation rule: Every repository must run its Husky
hooks and tests using only files, code, fixtures, dependencies, and services
contained within that repository. Tests and Husky scripts must not import,
require, read, execute, or otherwise depend on sibling repositories or paths
outside the repository root. app-e2e-tests is the only exception because
cross-repository end-to-end testing is its explicit responsibility.

Also apply [$carecard-workspace-standards](.agents/skills/carecard-workspace-standards/SKILL.md)
for the mandatory TDD and code organization rules.
