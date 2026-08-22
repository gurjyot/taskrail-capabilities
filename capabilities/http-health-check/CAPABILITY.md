# http-health-check

Bounded read-only HTTP availability probe for TaskRail automations.

- Operations: `check`
- Side effects: `read`
- Idempotency: `not-applicable`
- Mutation: denied

The capability performs a bounded network read to classify endpoint availability and never mutates the target.
