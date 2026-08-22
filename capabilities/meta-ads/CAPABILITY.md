# meta-ads

Canonical Meta Marketing API integration for TaskRail automations.

- Read operations: campaign, ad set, ad, status and insights retrieval
- Mutation operations: `updateBudget`, `updateStatus`
- Side effects: `mixed`
- Idempotency: `caller`
- Mutation: explicit authorization required

Access tokens are runtime-only. Budget/status mutations require `authorizeMutation: true`.
