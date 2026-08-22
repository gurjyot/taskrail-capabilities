# mainwp

Read-only MainWP integration for TaskRail monitoring automations.

- Operations: `listSites`, `getSite`, `getSiteStatus`
- Side effects: `read`
- Idempotency: `not-applicable`
- Mutation: denied

Credentials are runtime-only. The capability retrieves child-site inventory and operational status without modifying sites.
