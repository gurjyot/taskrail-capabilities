# google-ads

Canonical TaskRail Google Ads integration.

Read operations support accessible-customer discovery and GAQL search/searchStream. Mutations are deny-by-default and require `authorizeMutation: true` plus an explicit service/payload.

The default endpoint targets Google Ads API `v25`; callers may supply `apiVersion` so version upgrades do not require changing automation business logic.

Credentials are runtime-only and must never be committed.
