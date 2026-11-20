# Change request: 统一响应字段 model → data

- Change ID: `CHG-20261120-002`
- Classification: `incremental-sdd`
- Owner: sowler
- Status: `verified`

## Outcome and scope

将后端统一响应包装 `com.itmy.entity.base.Response` 的数据字段从 `model` 改名为 `data`，使响应结构符合常见 REST 约定（`{code, msg, data}`），为后续前端响应适配器（CHG-20261120-001 的 T1/T4）提供稳定的字段名。

- In scope: `Response.java` 字段与 setter；两处旧引用同步修复；契约文档同步。
- Out of scope: 不改前端；不裁决响应包装是否整体扁平化（§3.3 仍待 ADR）；不动 `Request<T>.model`（请求包装字段保持不变）。

## Acceptance criteria

- [x] `Response` 的 JSON 数据字段为 `data`
- [x] 全后端无残留的 `Response.getModel()` / `.model(...)` 旧引用（`ModelException.getModel()` 与 `Request.getModel()` 不属于本变更，保留）
- [x] `mvn -o -q -Dmaven.test.skip=true compile` 整个 backend 模块树通过
- [x] `docs/frontend-backend-contract.md` §3/§4/§6 同步为 `data`

## Impact

- Apps/contracts/data/security: 契约变更（响应字段名）。前端当前数据全走 mock，无运行时前端依赖；后端内部两处调用点已同步。
- Risks and rollback: 若有外部消费者按 `model` 取值会受影响——本仓库内无此类消费者。回滚即反向改名。

## Traceability

- Tasks: 本文件内验证清单
- Tests/evidence: `mvn -o -q -Dmaven.test.skip=true compile` EXIT 0（2026-11-20）
- ADR: n/a（字段改名，非架构裁决）
