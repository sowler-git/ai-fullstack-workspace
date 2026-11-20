# Change request: 前端多端目录结构

- Change ID: `CHG-20261120-003`
- Classification: `incremental-sdd`
- Owner: sowler
- Status: `verified`

## Outcome and scope

将 `apps/frontend/` 从"单一后台管理系统"重组为多端容器：现有 `blog-admin` 归位到 `admin/`，新增 `web/`、`h5/`、`shells/`、`shared/` 四个占位目录（各带 README 说明职责与边界）。

用户确认的决策：
1. 执行范围 = admin 归位 + 建最小骨架
2. Web 桌面与 H5 手机 = **两套独立应用**（非同一套响应式）
3. 壳工程 = 只建 `shells/` 一层 + README，不建各端子目录，不生成空壳代码

- In scope: 83 个跟踪文件 `git mv` 至 `admin/`；node_modules 随迁；5 份 README；路径引用同步。
- Out of scope: 不改任何前端源码逻辑；不创建 web/h5/shells 的工程代码；不改后端；不裁决具体技术栈选型。

## Acceptance criteria

- [x] 83 个文件以 `git mv` 迁移，git 识别为 rename（历史保留）
- [x] node_modules 迁移至 `admin/`，`npm run build` 在新路径通过（EXIT 0）
- [x] `web/`、`h5/`、`shells/`、`shared/` 各只有 README，无空壳代码
- [x] `web/` 与 `h5/` 明确为两套独立应用
- [x] 壳工程审核风险（微信小程序主体/白名单、App Store 4.2）写入 `shells/README.md`
- [x] 全仓旧路径引用（`apps/frontend/src`、`apps/frontend/mock` 等）无残留
- [x] `dist/`、`node_modules/` 仍被忽略，未入库
- [x] 符合 `AGENTS.md`：未从骨架生成产品，未覆盖既有文件，archive 未动

## Impact

- Apps/contracts/data/security: 改变前端目录边界与文档路径引用；无代码行为变更。`docs/frontend-backend-contract.md` 描述对象仍为 admin，路径已更新。
- Risks and rollback: 迁移是纯路径移动，回滚为反向 `git mv`。未来端接入前必须先开变更记录。

## Traceability

- Tasks: 本文件内验证清单
- Tests/evidence: `npm run build` @ `apps/frontend/admin` EXIT 0；`git status` 显示 83 项 R（rename）
- ADR: n/a（目录结构约定，未涉及技术栈裁决；web/h5 分层已在 README 记录为项目约定）
