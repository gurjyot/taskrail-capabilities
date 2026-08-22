# telegram-bot

Canonical Telegram Bot API transport for TaskRail automations.

- Operations: `sendMessage`, `editMessageText`, `deleteMessage`, `sendDocument`
- Side effects: `mixed`
- Idempotency: `caller`
- Mutation: explicit authorization required for edit/delete operations

Bot tokens are runtime-only. Message editing and deletion remain deny-by-default without explicit authorization.
