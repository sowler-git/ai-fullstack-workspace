# AI Engineering Control Plane

This directory is a file-backed control-plane skeleton, intentionally tool-neutral.

| Location | Purpose |
| --- | --- |
| `events/pending/` | New immutable JSON lifecycle events awaiting processing |
| `events/processed/` | Local processed-event receipts (not committed) |
| `retry/` | Failed move records, safe to retry with the same `eventId` |
| `state/` | Current derived state; local state is ignored |
| `index/` | Event-ID and archive lookup indices; local indices are ignored |
| `archive/` | Append-only historical snapshots and evidence |

## Archival protocol

1. A verified feature or change emits a `completed` event under `events/pending/`.
2. The processor validates its required fields and checks `eventId` in `index/` and `archive/`.
3. If absent, it copies the evidence to `archive/YYYY/MM/<entityId>/`, records the event ID, and marks the event processed.
4. If already present, it records a no-op receipt. This makes delivery idempotent.
5. A transient failure writes a retry record with the same event ID and incremented attempt. Retry processing repeats step 2.

No processor is supplied in this skeleton; select an approved runtime or CI integration before automation is enabled. The event schema and CI validator are ready for that integration.
