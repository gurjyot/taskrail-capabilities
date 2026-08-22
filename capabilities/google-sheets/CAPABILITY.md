# google-sheets

Canonical Google Sheets API integration for TaskRail automations.

- Read operations: `getValues`, `batchGet`
- Mutation operations: `appendValues`, `updateValues`
- Side effects: `mixed`
- Idempotency: `caller`
- Mutation: explicit authorization required

Write operations require `authorizeMutation: true`. OAuth credentials are runtime-only.
