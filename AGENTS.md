# AI Engineering Working Agreement

## Scope and safety

- Work only on the smallest approved change. Do not generate a full product from a skeleton.
- Never overwrite an existing user file. If a proposed path exists, inspect it first and merge intentionally.
- Preserve `.ai-engineering/archive/` as append-only history. Do not rewrite archived records.

## Change classification

| Class | Use when | Required records |
| --- | --- | --- |
| Lightweight optimisation | Behaviour and public contracts are unchanged | task note, verification evidence |
| Incremental SDD | One bounded capability or contract changes | delta spec, task DAG, tests |
| Full change | Cross-domain, security, data, or architectural impact | full spec set, ADR when applicable, task DAG, tests, rollout notes |

## Event and archive contract

- A lifecycle event must include `eventId`, `entityType`, `entityId`, `eventType`, `occurredAt`, and `attempt`.
- `eventId` is the idempotency key. A duplicate must not produce another archive entry.
- Failed archival moves go to `.ai-engineering/retry/` with an incremented `attempt`; retries are safe because archived event IDs are indexed.
- CI validates template presence and event fields. A future runtime worker may process the same contract.

## Delivery gate

Before implementation is called complete: link the spec, task, tests, event evidence, and any required ADR in the change record.
