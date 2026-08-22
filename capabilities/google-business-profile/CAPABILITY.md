# google-business-profile

Read-only Google Business Profile Performance integration for TaskRail automations.

- Operations: `getDailyMetrics`, `fetchMultiDailyMetrics`, `listSearchKeywordsMonthly`
- Side effects: `read`
- Idempotency: `not-applicable`
- Mutation: none

OAuth credentials are runtime-only. This capability performs network reads and does not mutate Business Profile data.
