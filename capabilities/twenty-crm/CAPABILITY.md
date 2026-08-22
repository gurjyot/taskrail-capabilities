# twenty-crm

Canonical Twenty CRM GraphQL integration for TaskRail automations.

- Read operation: `query`
- Mutation operations: `createRecord`, `updateRecord`, `deleteRecord`
- Side effects: `mixed`
- Idempotency: `caller`
- Mutation: explicit authorization required

Access tokens are runtime-only. Record mutations require `authorizeMutation: true`.
