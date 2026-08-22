# google-search-console

Read-only Google Search Console integration for TaskRail automations.

- Operations: `listSites`, `querySearchAnalytics`, `listSitemaps`, `inspectUrl`
- Side effects: `read`
- Idempotency: `not-applicable`
- Mutation: none

OAuth credentials are runtime-only. This capability retrieves Search Console data without changing properties or resources.
