# Workspace architecture

```
specs → orchestrator → tasks/DAG → apps (backend + frontend) → tests/evidence
   └──────────────────── lifecycle events ───────────────────→ archive/index
```

The repository is a monorepo: implementation apps share one specification, task, documentation, and CI boundary. `apps/backend` and `apps/frontend` remain independently buildable once their toolchains are selected.
