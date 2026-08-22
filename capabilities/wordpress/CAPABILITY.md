# wordpress

Canonical WordPress REST API integration for TaskRail automations.

- Read operations: `get`, `list`
- Mutation operations: `create`, `update`, `delete`
- Side effects: `mixed`
- Idempotency: `caller`
- Mutation: explicit authorization required

Authorization material is runtime-only. Create/update/delete operations require `authorizeMutation: true`.
