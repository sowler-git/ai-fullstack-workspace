# Change request: 前后端对接契约基线文档

- Change ID: `CHG-20261120-001`
- Classification: `lightweight-optimisation`
- Owner: sowler
- Status: `draft`

## Outcome and scope

建立一份中文的前后端对接契约基线文档，如实记录 `apps/frontend` 与 `apps/backend` 当前 HTTP 对接面的真相：传输层、认证、统一响应结构、端点对照、数据形状、冲突项与待办。

- In scope: 新建 `docs/frontend-backend-contract.md`；新建与本变更关联的 spec/task 记录。
- Out of scope: **不修改任何前端或后端源码**；不实施 §3.3 / §4.3 的裁决；不写业务接口实现；不动导入基线。

## Acceptance criteria

- [x] 文档仅描述仓库中实际存在的行为，待实现项明确标注 `【待办】`
- [x] 前端 33 个期望端点逐一列出，并标注后端对应状态
- [x] 后端 14 个实际端点逐一列出
- [x] 至少记录 5 个结构性冲突（响应结构、认证前缀、登录路径、401 语义、token 有效期）
- [x] 待办清单按 P0/P1/P2 排序，并指明归属
- [x] 变更治理入口链接到 `AGENTS.md` / `specs/` / `tasks/` / `docs/adr/`

## Impact

- Apps/contracts/data/security: 无代码改动，无运行时影响。文档揭示了既有安全项（JWT 密钥硬编码）与契约缺口，已列入待办 T9。
- Risks and rollback: 文档为新增文件，不覆盖任何既有文件（符合 `AGENTS.md`）；回滚即删除新增文件与目录。

## Traceability

- Tasks: `tasks/features/CHG-20261120-001.md`
- Tests/evidence: 见 `docs/frontend-backend-contract.md` 附录 A（证据来源表）
- ADR: n/a（本变更不裁决架构；§3.3/§4.3 裁决后另开 ADR）
- Related changes: `specs/changes/2026-11-20-response-field-rename/`（响应字段 `model` → `data`，已同步到本文 §3/§4/§6）
