# google-ads

Canonical Google Ads API integration for TaskRail automations.

- Read operations: `listAccessibleCustomers`, `search`, `searchStream`
- Mutation operation: `mutate`
- Side effects: `mixed`
- Idempotency: `caller`
- Mutation: explicit authorization required

Credentials are runtime-only. Mutations remain deny-by-default and require `authorizeMutation: true`.
