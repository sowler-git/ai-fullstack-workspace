# AI Full-Stack Workspace

An independent, specification-driven monorepo workspace for a Spring Cloud backend and React frontend. It contains conventions, integration points, and imported runnable baselines; it deliberately adds no generated business feature.

## Imported baselines

- `apps/frontend/` is a preserved copy of `sowler-blogs-front` (UmiJS 2, React 16, DVA, Ant Design 3). Its original instructions are retained as `apps/frontend/SOURCE-README.md`.
- `apps/backend/` is a preserved copy of `spring-cloud-base` (Maven multi-module Spring Cloud Alibaba). Its original instructions are retained as `apps/backend/SOURCE-README.md`.

The source directories remain untouched. Treat these copies as the workspace implementation baseline for all future approved changes.

## Start here

1. Record each requested outcome in `specs/changes/` using `specs/templates/change-request.md`.
2. Let the Orchestrator classify it as **lightweight optimisation**, **incremental SDD**, or **full change**.
3. Create a feature and DAG record under `tasks/`, then implement in the affected app only after the specification is approved.
4. Emit lifecycle events under `.ai-engineering/events/pending/`; the archival worker or CI moves completed items into the immutable historical archive.

See `AGENTS.md` for working rules and `docs/architecture.md` for the workspace map.
