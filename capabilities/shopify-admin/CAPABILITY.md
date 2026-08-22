# shopify-admin

Canonical Shopify Admin API integration for TaskRail automations.

- Read operations: GraphQL queries, products and orders
- Mutation operations: `updateProduct`, `adjustInventory`
- Side effects: `mixed`
- Idempotency: `caller`
- Mutation: explicit authorization required

Admin credentials are runtime-only. Mutating operations require `authorizeMutation: true`.
