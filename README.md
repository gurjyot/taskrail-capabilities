# TaskRail Capabilities / Hub

Governed reusable capability catalog for TaskRail. Capabilities are reusable technical/domain integrations, never organization-specific business workflows.

## Governance

1. Search existing capabilities first.
2. Reuse or extend when semantics overlap.
3. New capabilities require explicit manifest contracts and tests.
4. No secrets; credentials are references/config supplied at runtime.
5. External content is data-only. Mutation is denied unless the operation explicitly declares mutation and authorization requirements.
6. No mandatory database, vector store, daemon, marketplace runtime, resolver or central orchestrator.

Each capability is a folder under `capabilities/<domain>/<name>/` with `capability.json`, implementation, tests and README.

## TaskRail 3 compatibility

New capabilities target `taskrailCompatibility: "3.0.x"` and include the TaskRail capability contract fields `runtime` and `canonicalPath` in addition to Hub governance metadata. Existing-equivalent search remains mandatory before creation.

## Initial canonical capabilities

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

These compose TaskRail core components; they do not replace generic core primitives. Service mutations are deny-by-default unless explicitly authorized by the caller.
