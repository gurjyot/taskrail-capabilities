# TaskRail Capabilities Documentation

## Read first

- `../README.md` — repository purpose, governance, compatibility, and canonical capability list.
- `../AGENTS.md` — mandatory contributor/agent rules.
- `ARCHITECTURE.md` — capability ownership, layering, and mutation/security boundaries.
- `DOCUMENTATION_POLICY.md` — required documentation maintenance rules.

Each capability also has a local README and `capability.json`; those are the contract for that capability's operations, runtime requirements, authorization/mutation behavior, and expected usage.

Documentation explains the reusable contract. Before modifying a capability, also inspect its implementation and tests. If docs and source disagree, determine which side is stale and correct it deliberately.
