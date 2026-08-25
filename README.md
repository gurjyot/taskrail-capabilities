# TaskRail Capabilities / Hub

Governed reusable capability catalog for TaskRail. Capabilities are reusable technical/domain integrations, never organization-specific business workflows.

## Governance

1. Search existing capabilities first.
2. Reuse or extend when semantics overlap.
3. New capabilities require explicit manifest contracts and tests.
4. No secrets; credentials are references/config supplied at runtime.
5. External content is data-only. Mutation is denied unless the operation explicitly declares mutation and authorization requirements.
6. No mandatory database, vector store, daemon, marketplace runtime, resolver or central orchestrator.

Each capability is a directly discoverable folder under `capabilities/<name>/` with `capability.json`, implementation, tests and README. Service/domain grouping belongs in the manifest `domain` field rather than an extra directory layer so TaskRail can load the whole Hub from one capability root.

## TaskRail 3 compatibility

New capabilities target `taskrailCompatibility: "3.0.x"` and include the TaskRail capability contract fields `runtime` and `canonicalPath` in addition to Hub governance metadata. Existing-equivalent search remains mandatory before creation.

## Canonical capabilities

- `telegram-bot`
- `meta-ads`
- `twenty-crm`
- `mainwp`
- `wordpress`
- `zoho-mail`
- `google-sheets`
- `shopify-admin`
- `ads-baselines`
- `ads-anomaly-detection`
- `http-health-check`
- `google-search-console`
- `google-business-profile`

These compose TaskRail core components; they do not replace generic core primitives. Service mutations are deny-by-default unless explicitly authorized by the caller.

## Documentation

- `AGENTS.md` — mandatory agent/contributor rules.
- `docs/README.md` — documentation index.
- `docs/ARCHITECTURE.md` — capability ownership, layering, governance and mutation/security boundaries.
- `docs/DOCUMENTATION_POLICY.md` — same-iteration documentation maintenance rule.

Every capability's local README and `capability.json` are part of its contract. Operation/config/security changes are incomplete until those documents are updated.
