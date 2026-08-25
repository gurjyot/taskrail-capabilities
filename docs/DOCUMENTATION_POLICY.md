# Documentation Maintenance Policy

Documentation is a required part of the capability contract.

## Definition of done

Any change affecting capability purpose, operations, inputs, outputs, runtime requirements, TaskRail compatibility, error behavior, security assumptions, side effects, mutation behavior, authorization requirements, or canonical usage is incomplete until the affected local and repository-level documentation is updated in the same iteration.

## Required updates

- capability-local README and `capability.json` for contract changes;
- root `README.md` when governance, compatibility, or canonical capability inventory changes;
- `docs/README.md`, `docs/ARCHITECTURE.md`, and `AGENTS.md` for repository-wide changes.

## Rules

- No secrets, production IDs, or private credentials in docs.
- Distinguish implemented/tested behavior from real-provider production verification.
- Do not keep contradictory legacy instructions after replacing an operation/contract.
- Document mutation and authorization semantics explicitly.
- A new capability without tests and local documentation is incomplete.

New repositories in this ecosystem should be created with `README.md`, `AGENTS.md`, `docs/README.md`, `docs/DOCUMENTATION_POLICY.md`, and appropriate architecture/development/operations documentation before substantial feature work.
