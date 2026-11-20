# 前后端对接契约（现状基线 + 待对齐项）

- 文档状态：`draft`（待 sowler 评审）
- 适用版本：前端 `blog-admin` 基线 / 后端 `spring-cloud-base` 基线（见 `docs/baseline-inventory.md`）
- 覆盖范围：`apps/frontend` ⇄ `apps/backend` 的 HTTP 对接面（传输、认证、响应、端点、数据形状）
- 关联变更：`specs/changes/2026-11-20-api-contract-baseline/`

> **阅读约定**：本文只描述仓库里实际存在的行为，不虚构已实现能力。
> 标记为 `【待办】` 的条目表示**目标状态尚未实现**，不得当作现成接口使用。
> 标记为 `【冲突】` 的条目表示前后端当前定义互相矛盾，必须先行裁决。

---

## 1. 为什么要这份文档

前端与后端是两份**独立导入、各自可运行的基线**（见 README）。当前状态是：

- 前端所有数据来自 `apps/frontend/mock/`，请求打到本地 mock，**没有真正调用后端**；
- 后端暴露的是一套 Spring Cloud 微服务接口，**与前端 service 层定义几乎不对齐**；
- `README` 要求"API 调用必须指向版本化契约或批准的 delta 规格"，但 `specs/changes/`、`tests/contract/` 目前为空。

这份文档补上这个缺口：把**前端实际期望什么、后端实际提供什么、差在哪**一次说清，作为后续所有对接变更的基线。

---

## 2. 传输层基线

| 项 | 前端现状 | 后端现状 | 状态 |
| --- | --- | --- | --- |
| 请求基址 | `axios baseURL = /api`（`src/helpers/request.js`） | 网关 `gateway-module` 监听 `:8081`，路由规则下发在 Nacos `dev` 命名空间，**仓库内无路由配置文件** | 【冲突】`/api` 前缀与网关实际路由前缀未知，需确认 Nacos 配置 |
| 超时 | 30000 ms | 未约定 | 待统一 |
| Content-Type | `application/json` | `@RequestBody` 接口期望 JSON | 一致 |
| 参数序列化 | `qs.stringify(params, {arrayFormat:'brackets'})` | 后端按 Spring MVC 默认绑定 | 基本一致，数组参数需联调验证 |
| 认证头 | `Authorization: Bearer <token>` | 网关 `AuthorizeFilter` 读取 `Authorization` 后**直接交给 `JwtUtils` 解析**（无 `Bearer ` 前缀处理） | 【冲突】见 §4 |
| 401 处理 | 拦截响应 `status===401` → 清 Cookie + 跳 `/o/login` | 网关鉴权失败返回 `Response.fail(...)` **业务码**（如 10404），HTTP 状态仍为 200 | 【冲突】见 §4.3 |

---

## 3. 统一响应结构

### 3.1 后端实际结构

`com.itmy.entity.base.Response<T>`（`common-module`）：

```json
{
  "code": 200,
  "msg": "success",
  "data": { "...": "业务数据" }
}
```

- 成功码：`200`（`ErrorEnum.OK`）；失败码见 `ErrorEnum`，如 `100001` 参数错误、`10404` 未登录、`10402` token 无效。
- 数据字段名为 **`data`**，消息字段名为 **`msg`**。
- 注：数据字段在基线中原名 `model`，现已改为 `data`（见 `specs/changes/2026-11-20-response-field-rename/`）；两处旧引用已同步修复并通过编译。

### 3.2 前端实际期望

- 请求拦截器 `request.interceptors.response.use(response => response.data)` —— 原样返回整个响应体，不做解包；
- 页面 model 直接读 `res.list`、`res.total`（如 `articles/list/model.js`、`users/model.js`）；
- 登录页读 `res.success`、`res.token`、`res.user`、`res.message`（`pages/o/login/index.js`）；
- 错误分支读 `response.data.message`（`helpers/request.js`）。

### 3.3 冲突结论

【冲突】前端期待**扁平业务对象**（`{list,total}` / `{success,token,user}`），后端返回**包装对象**（`{code,msg,data}`）；字段名 `message` vs `msg` 也不一致。

**裁决选项（待 sowler 确认其一）：**

- **方案 A（推荐）**：后端为准，前端增加一层响应适配器，统一解包 `Response`：`code===200` 时返回 `data`，否则抛出带 `code/msg` 的错误。改动集中在 `helpers/request.js` 一处。
- **方案 B**：前端为准，后端新增扁平响应切面。改动面大，且要动所有 controller，不建议。
- **方案 C**：新增网关层响应改写过滤器，统一转换。增加运行时复杂度，不建议。

> 【待办】裁决后，把选定方案写成 ADR（`docs/adr/`），并更新本节约。未裁决前，任何前后端联调都会失败。

---

## 4. 认证契约

### 4.1 后端登录接口（实际存在）

| 项 | 值 |
| --- | --- |
| 路径 | `POST /user/account/login` |
| 请求体 | `Request<LoginReqVO>` 包装：`{ "model": { "account":"", "password":"", "tenantId":"", "code":"", "deviceType":0 } }` |
| 响应 | `Response.success(LoginResVO)` → `data` 内含 `{ token, isFirstLogin, isMiddleLogin }` |
| token 生成 | `JwtUtils.geneJsonWebToken`，HS256，claim 含 `userId/userName/account/email/phoneNumber/loginDeviceType`，有效期 1 小时 |
| 白名单 | 网关 `AuthorizeFilter.EXCLUDE_PATHS` 含 `/user/account/login`、`/user/account/login/user/captcha` |

后端还要求 Redis 中存在 `ACCOUNT_LOGIN_TOKEN + deviceType + "." + userId` 的键才会放行后续请求（30 分钟有效期）。

### 4.2 前端登录接口（实际存在）

| 项 | 值 |
| --- | --- |
| 路径 | `POST /auth/login`（`pages/o/login/service.js`） |
| 请求体 | 直接发送 `data`，**无 `model` 包装** |
| 期望响应 | `{ success: true, token: "...", user: {...} }` |
| token 存储 | Cookie：`blog_admin_token`（7 天） |

### 4.3 冲突与裁决

| # | 冲突点 | 说明 |
| --- | --- | --- |
| C1 | 路径 `/auth/login` vs `/user/account/login` | 前端路径在网关白名单中不存在，必被鉴权拦截 |
| C2 | 请求体包装 | 前端裸对象 vs 后端 `Request<model>` 包装 |
| C3 | token 前缀 | 前端 `Bearer <token>` vs 后端裸 token 解析。**当前后端会把 `Bearer ` 当 JWT 字符串解析并失败** |
| C4 | 401 语义 | 前端靠 HTTP 401 触发登出；网关鉴权失败返回 HTTP 200 + 业务码 `10404`，前端不登出、也不提示 |
| C5 | token 有效期 | 后端 1 小时，前端 Cookie 7 天，不一致 |

**裁决建议（待确认）：**

- 前端对齐后端：登录改调 `/user/account/login` 并按 `{model:...}` 包装；请求头去掉 `Bearer ` 前缀；响应适配器识别业务码 `10404/10402` 并触发登出（不依赖 HTTP 401）；Cookie 有效期与 token 一致或实现刷新。
- 或后端增加兼容：`Authorization` 同时接受 `Bearer ` 前缀；新增 `/auth/login` 路由别名与扁平响应。**这属于新增契约，需走增量 SDD。**

> 【待办】C1–C5 必须全部裁决后才能做登录联调。安全提示：`JwtUtils.APPSECRET` 目前硬编码在源码中，上线前必须外置到配置/密钥管理。

---

## 5. 端点对照全景

### 5.1 前端期望的端点（全部来自 `service.js`，数据目前由 mock 提供）

`baseURL = /api`，下表路径省略前缀。

| # | 方法 | 路径 | 前端函数 | 后端对应 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 1 | POST | `/auth/login` | login | `/user/account/login`（语义对应） | 【冲突】路径/包装/响应全不同 |
| 2 | GET | `/users` | getUsers | `/user/list`（`UserController`） | 【冲突】路径不同，参数对象不同 |
| 3 | POST | `/users` | createUser | `POST /user` | 【冲突】路径单复数不同 |
| 4 | PUT | `/users/{id}` | updateUser | `PUT /user` | 【冲突】id 位置不同 |
| 5 | DELETE | `/users/{id}` | deleteUser | `DELETE /user/{id}` | 【冲突】路径单复数不同 |
| 6 | PATCH | `/users/{id}/status` | toggleUserStatus | 无 | 【待办】后端未实现 |
| 7 | GET | `/articles` | getArticleList | `GET /blog`（语义近似） | 【冲突】资源命名不同 |
| 8 | GET | `/articles/{id}` | getArticleDetail | 无 | 【待办】 |
| 9 | POST | `/articles` | createArticle | 无 | 【待办】 |
| 10 | PUT | `/articles/{id}` | updateArticle | 无 | 【待办】 |
| 11 | DELETE | `/articles/{id}` | deleteArticle | 无 | 【待办】 |
| 12 | PATCH | `/articles/{id}/status` | updateArticleStatus | 无 | 【待办】 |
| 13 | GET | `/categories` | getCategories | 无 | 【待办】 |
| 14 | POST | `/categories` | createCategory | 无 | 【待办】 |
| 15 | PUT | `/categories/{id}` | updateCategory | 无 | 【待办】 |
| 16 | DELETE | `/categories/{id}` | deleteCategory | 无 | 【待办】 |
| 17 | GET | `/tags` | getTags | 无 | 【待办】 |
| 18 | POST | `/tags` | createTag | 无 | 【待办】 |
| 19 | PUT | `/tags/{id}` | updateTag | 无 | 【待办】 |
| 20 | DELETE | `/tags/{id}` | deleteTag | 无 | 【待办】 |
| 21 | GET | `/comments` | getComments | 无 | 【待办】 |
| 22 | PATCH | `/comments/{id}/approve` | approveComment | 无 | 【待办】 |
| 23 | PATCH | `/comments/{id}/reject` | rejectComment | 无 | 【待办】 |
| 24 | DELETE | `/comments/{id}` | deleteComment | 无 | 【待办】 |
| 25 | PATCH | `/comments/batch-approve` | batchApprove | 无 | 【待办】 |
| 26 | GET | `/media` | getMediaList | 无 | 【待办】 |
| 27 | GET | `/media/categories` | getMediaCategories | 无 | 【待办】 |
| 28 | DELETE | `/media/{id}` | deleteMedia | 无 | 【待办】 |
| 29 | GET | `/settings` | getSettings | 无 | 【待办】 |
| 30 | PUT | `/settings` | updateSettings | 无 | 【待办】 |
| 31 | GET | `/dashboard/stats` | getStats | 无 | 【待办】 |
| 32 | GET | `/dashboard/traffic` | getTrafficData | 无 | 【待办】 |
| 33 | GET | `/dashboard/recent-articles` | getRecentArticles | 无 | 【待办】 |

> 另有遗留文件 `src/services/index.js` 定义 `/stats`、`/stats/traffic`、`/stats/recent-articles`，与 `pages/dashboard/service.js` 的 `/dashboard/*` 重复且不一致。当前无页面引用，**建议删除或对齐**（见待办 T7）。

### 5.2 后端实际提供的端点（来自 Controller 源码）

| 服务 | 路径 | 方法 | Controller |
| --- | --- | --- | --- |
| user `:8801` | `/user/account/login` | POST | `AccountController` |
| user `:8801` | `/user/account/login/user/captcha` | GET | `AccountController`（推断，白名单引用） |
| user `:8801` | `/user` | GET | `UserController.findAll` |
| user `:8801` | `/user/nacos` | GET | `UserController.findNacosConfig` |
| user `:8801` | `/user/list` | GET | `UserController.selectUser` |
| user `:8801` | `/user` | POST | `UserController.saveUser` |
| user `:8801` | `/user` | PUT | `UserController.updateUser` |
| user `:8801` | `/user/{id}` | DELETE | `UserController.deleteUser` |
| order `:8810` | `/blog` | GET | `BlogController.findAll` |
| order `:8810` | `/blog/redis` | GET | `BlogController.redisFind`（Sentinel 限流） |
| order `:8810` | `/blog/sentinelTest` | GET | `BlogController.sentinelFind` |
| picture | `/files/oss` | POST | `FileController.uploadOSS` |
| picture | `/file/oss` | POST | `FileMongoController.ssoFile` |
| picture | `/file/download/{id}` | GET | `FileMongoController.downloadFile` |

> `gateway :8081` 的路由规则在 Nacos 配置中心，仓库内无静态文件。上表路径是**服务本地路径**，经网关暴露时可能带 service 前缀，需以 Nacos 实际配置为准。
> `zipkin-module` 为空模块（0 个 Java 文件），`sms-model` 无 Controller，均不提供 HTTP 契约。

---

## 6. 数据形状对照

| 资源 | 前端期望（mock 定义） | 后端实体 | 状态 |
| --- | --- | --- | --- |
| 文章 | `{id,title,summary,content,categoryId,categoryName,tags[],tagIds[],status,views,coverUrl,createdAt,updatedAt}` | `com.itmy.entity.Blog`（字段需核对） | 【待办】映射未定义 |
| 用户 | 见 `mock/users.js` | `com.itmy.entity.User` / `UserAdd` / `UserUpdate` | 【待办】映射未定义 |
| 列表响应 | `{list:[...], total:number}` | `Response.data`（内部结构由 controller 决定） | 【冲突】见 §3 |
| 登录响应 | `{success, token, user}` | `{code, msg, data:{token,isFirstLogin,isMiddleLogin}}` | 【冲突】见 §4 |

---

## 7. 待办清单（按优先级）

| ID | 优先级 | 事项 | 归属 |
| --- | --- | --- | --- |
| T1 | P0 | 裁决响应结构方案（§3.3），写 ADR | 双方 |
| T2 | P0 | 裁决认证对齐方案（§4.3），解决 C1–C5 | 双方 |
| T3 | P0 | 从 Nacos 导出网关路由配置，纳入版本管理，确认 `/api` 前缀与 service 前缀 | 后端 |
| T4 | P1 | 在 `helpers/request.js` 实现统一响应适配器（按 T1 裁决） | 前端 |
| T5 | P1 | 实现登录端到端联调（按 T2 裁决） | 双方 |
| T6 | P1 | 逐资源确定目标端点：是前端改路径、后端加别名，还是新增接口。至少覆盖 users/articles | 双方 |
| T7 | P2 | 删除或对齐遗留 `src/services/index.js` | 前端 |
| T8 | P2 | categories/tags/comments/media/settings/dashboard 七个资源后端整体缺失，需立项 | 后端 |
| T9 | P2 | JWT 密钥外置，token 有效期与 Cookie 有效期统一 | 后端 |
| T10 | P2 | 契约稳定后在 `tests/contract/` 增加契约测试 | 双方 |

---

## 8. 变更治理

本仓库为规格驱动工作流（见 `AGENTS.md`、`docs/architecture.md`）：

1. 每条对接变更先在 `specs/changes/` 建变更记录（模板 `specs/templates/change-request.md`）；
2. 契约变更属 `incremental-sdd`，需填 `delta-spec.md`，列明 baseline / proposed delta / scenarios / migration；
3. 在 `tasks/` 建任务与 DAG，实施后补 `tests/` 证据；
4. 生命周期事件写入 `.ai-engineering/events/pending/`，由归档 worker 迁入只读 archive；
5. 重大裁决（响应结构、认证方案）必须留 ADR 于 `docs/adr/`。

> 本文是**基线文档，不是已批准契约**。§3.3、§4.3 的裁决完成并经 ADR 固化后，才会产生可执行的版本化接口契约。

---

## 附录 A：证据来源

| 结论 | 源文件 |
| --- | --- |
| 前端端点清单 | `apps/frontend/src/pages/*/service.js`、`apps/frontend/src/services/index.js` |
| 前端响应消费 | `apps/frontend/src/helpers/request.js`、`src/pages/*/model.js`、`src/pages/o/login/index.js` |
| 前端认证存储 | `apps/frontend/src/helpers/auth.js` |
| 后端响应结构 | `apps/backend/common-module/.../entity/base/Response.java` |
| 后端错误码 | `apps/backend/common-module/.../enums/ErrorEnum.java` |
| 后端登录认证 | `apps/backend/user-module/.../controller/AccountController.java`、`common-module/.../utils/JwtUtils.java` |
| 网关鉴权 | `apps/backend/gateway-module/.../filter/AuthorizeFilter.java` |
| 后端端点 | 各模块 `*Controller.java`、`bootstrap*.yml` |
| 技术栈与导入边界 | `README.md`、`docs/baseline-inventory.md`、`apps/*/SOURCE-README.md` |
