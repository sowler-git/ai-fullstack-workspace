# Archive index

The archival worker maintains a durable mapping of `eventId` to archive location. This is the idempotency boundary. Local rebuildable indices use `*.local.json` and are ignored.
