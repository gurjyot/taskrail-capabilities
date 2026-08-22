# zoho-mail

Canonical Zoho Mail integration for TaskRail email automations.

- Read operations: `listMessages`, `getMessage`
- Write operations: `createDraft`, `sendDraft`
- Side effects: `mixed`
- Idempotency: `caller`
- Mutation: explicit authorization required for sending mail

OAuth credentials are runtime-only. Sending a draft requires `authorizeMutation: true`.
