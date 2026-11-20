# Frontend — multi-platform workspace

本目录承载博客系统的所有前端形态。当前只有 `admin/` 含有可运行代码；其余目录是**约定好的位置**，等对应端真正立项时才填入实现。

## 目录职责

| 目录 | 职责 | 当前状态 |
| --- | --- | --- |
| `admin/` | 博客后台管理系统（UmiJS 2 / React 16 / DVA / Ant Design 3），从 `sowler-blogs-front` 导入的基线 | 可运行，数据走 mock |
| `web/` | 面向公众的桌面 Web 访问站点 | 占位，仅 README |
| `h5/` | 面向手机的 H5 应用，**所有壳工程最终加载的目标** | 占位，仅 README |
| `shells/` | 小程序与 APP 的壳工程容器（微信 / 飞书 / 钉钉 / Android / iOS） | 占位，仅 README |
| `shared/` | 跨端共享的接口契约、类型定义、工具函数 | 占位，仅 README |

## 端到端关系

```
浏览器(桌面) ──────────────────────→ web/
浏览器(手机) ──────────────────────→ h5/
微信小程序 / 飞书 / 钉钉 ──Webview──→ h5/
Android / iOS App ──────Webview────→ h5/
运营人员 ──────────────────────────→ admin/
```

**关键约定**：`h5/` 是业务唯一内核。壳工程不实现业务逻辑，只负责平台容器能力（登录、分享、推送、支付等原生桥接）与 Webview 承载。

## 工程约定

1. **不预先生成空壳代码**。每个目录在对应端立项前只保留 README。理由见 `AGENTS.md`：不从骨架生成完整产品。
2. 各端应用**独立构建**（各自 `package.json` 或原生工程配置），不共享构建产物；共享的只有 `shared/` 中的契约与纯逻辑。
3. 新增端必须先在 `specs/changes/` 建变更记录，并在本文档表格中登记，再创建目录。
4. 接口契约以 `docs/frontend-backend-contract.md` 为基线，任何端的 API 调用都不得绕过它。
5. 导入基线（`admin/`）的原始指令保留在 `admin/SOURCE-README.md`，不得改写。

## 环境提示

`admin/` 使用 Node 22 时需 `npm ci --legacy-peer-deps` 安装（UmiJS 2 与 npm 7+ 的 peer 依赖冲突）；启动脚本已内置 `NODE_OPTIONS=--openssl-legacy-provider`。详见 `admin/README.md`。
