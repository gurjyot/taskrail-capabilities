# TaskRail Capabilities Architecture

## Purpose

`taskrail-capabilities` is the governed reusable integration layer for TaskRail. It sits between TaskRail's vendor-neutral core components and automation-specific workflow logic.

```text
TaskRail core components
        ↓
Governed capabilities in this repository
        ↓
Generic or private automations
        ↓
Environment-specific runtime configuration
```

## Capability ownership

A capability owns reusable technical/domain behavior such as talking to a service API, normalizing service data, or implementing a reusable domain operation. It should not decide an organization's campaign strategy, follow-up policy, client thresholds, schedules, or other workflow/business rules.

## Canonical shape

Capabilities live directly under `capabilities/<name>/` and should include:
- `capability.json` as the machine-readable contract;
- deterministic implementation;
- tests;
- local README;
- explicit TaskRail/runtime/canonical-path metadata.

Service/domain grouping belongs in manifest metadata instead of adding another directory layer that complicates discovery.

## Discovery and governance

Before creation, search for semantic overlap. The preferred decision order is:

```text
REUSE → EXTEND → CREATE
```

Create only when the behavior is genuinely reusable and materially distinct from existing capabilities.

## Security and mutation boundary

- Credentials are runtime references/config, never committed secrets.
- Untrusted external content is handled as data.
- Read operations should not silently become mutation paths.
- Mutation-capable operations must declare mutation and authorization requirements explicitly.
- Callers remain responsible for organization-specific authorization policy.

## TaskRail relationship

Capabilities compose TaskRail core components; they do not replace or fork generic framework primitives. If a behavior is truly vendor-neutral and foundational across capabilities/automations, evaluate whether it belongs in TaskRail core rather than duplicating it here.

## Documentation invariant

A capability's README and manifest are part of its public contract. Adding/changing an operation without documenting inputs, outputs, errors, runtime requirements, side effects, mutation authorization, and compatibility leaves the capability incomplete.

## Optional evidence capabilities

- `postgres-health` collects bounded read-only database metadata and evaluates freshness, backup and restore evidence.
- `jev-decision` wraps an explicitly supplied Jev transport with typed choices, confidence review and timeouts.
- `multimodal-evidence` validates authorized local media and delegates perception to an existing gateway.

These capabilities add no daemon, mandatory model or database dependency. Clients, transport credentials, schedules, thresholds and production evidence remain caller-owned.
