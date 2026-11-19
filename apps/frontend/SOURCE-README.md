# 博客后台管理系统

基于 UmiJS 2.x + React + DVA + Ant Design 3.x 的博客后台管理系统。

## 快速开始

```bash
# 安装依赖
yarn install

# 启动开发服务器（内置 Mock 数据）
yarn start

# 构建生产包
yarn build
```

启动后访问 http://localhost:8000，使用以下账号登录：

- 用户名：`admin`
- 密码：`123456`

## 技术栈

| 技术 | 说明 |
|------|------|
| UmiJS 2.x | 企业级前端框架 |
| React 16 | UI 库 |
| DVA 2.x | 数据流管理（Redux + Redux-Saga） |
| Ant Design 3.x | UI 组件库 |
| Less | CSS 预处理器 |
| Axios | HTTP 客户端 |
| Braft Editor | 富文本编辑器 |
| ECharts | 数据可视化图表 |

## 项目结构

```
blog-admin/
├── mock/                        ← Mock API 数据
├── src/
│   ├── app.js                   ← DVA 全局配置
│   ├── global.js / global.less  ← 全局脚本和样式
│   ├── components/              ← 全局公共组件
│   │   ├── GlobalHeader/        ← 顶部导航
│   │   ├── GlobalSiderMenus/    ← 侧边菜单
│   │   ├── GlobalFooter/        ← 页脚
│   │   ├── GlobalBreadcrumb/    ← 面包屑
│   │   └── RichTextEditor/      ← 富文本编辑器
│   ├── layouts/                 ← 布局层
│   ├── helpers/                 ← 工具函数
│   ├── models/                  ← 全局 DVA Model
│   ├── pages/                   ← 业务页面
│   │   ├── dashboard/           ← 仪表盘
│   │   ├── articles/            ← 文章管理
│   │   ├── categories/          ← 分类管理
│   │   ├── tags/                ← 标签管理
│   │   ├── comments/            ← 评论管理
│   │   ├── media/               ← 媒体库
│   │   ├── users/               ← 用户管理
│   │   ├── settings/            ← 系统设置
│   │   └── o/                   ← 开放页面（登录/404）
│   ├── services/                ← 全局 API 服务
│   └── themes/                  ← 主题配置
└── .umirc.ts                    ← UmiJS 配置
```

## 架构模式

每个业务模块遵循 DVA 三层架构：

```
module/
├── index.js        ← 页面组件
├── model.js        ← DVA Model（state + effects + reducers）
├── service.js      ← API 调用
└── index.less      ← 页面样式
```

## 功能模块

| 模块 | 路由 | 功能 |
|------|------|------|
| 仪表盘 | /dashboard | 统计概览、流量趋势图、最新文章 |
| 文章列表 | /articles/list | 筛选、搜索、分页、发布/撤回/删除 |
| 文章编辑 | /articles/edit | 富文本编辑、封面图、分类标签 |
| 分类管理 | /categories | CRUD、排序 |
| 标签管理 | /tags | CRUD、标签云 |
| 评论管理 | /comments | 审核、拒绝、删除、批量操作 |
| 媒体库 | /media | 上传、预览、复制链接、删除 |
| 用户管理 | /users | CRUD、角色分配、启用/禁用 |
| 系统设置 | /settings | 站点信息、SEO、功能开关 |
