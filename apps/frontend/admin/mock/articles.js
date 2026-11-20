import moment from 'moment'

const articleData = [
  {
    id: 1,
    title: 'React Hooks 最佳实践指南',
    summary: '深入探讨 React Hooks 的使用技巧和最佳实践',
    content: '<p>React Hooks 是 React 16.8 引入的特性...</p>',
    categoryId: 1,
    categoryName: '前端技术',
    tags: ['React', 'Hooks'],
    tagIds: [1, 2],
    status: 'published',
    views: 3421,
    coverUrl: '',
    createdAt: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 2,
    title: '前端性能优化策略总结',
    summary: '从加载、渲染、运行时三个维度优化前端性能',
    content: '<p>性能优化是前端工程化的重要环节...</p>',
    categoryId: 1,
    categoryName: '前端技术',
    tags: ['性能优化', 'Webpack'],
    tagIds: [3, 4],
    status: 'published',
    views: 2156,
    coverUrl: '',
    createdAt: moment().subtract(10, 'days').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().subtract(5, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 3,
    title: 'UmiJS 约定式路由详解',
    summary: 'UmiJS 的约定式路由让开发更高效',
    content: '<p>UmiJS 提供了约定式路由...</p>',
    categoryId: 2,
    categoryName: '框架工具',
    tags: ['UmiJS', '路由'],
    tagIds: [5, 6],
    status: 'draft',
    views: 892,
    coverUrl: '',
    createdAt: moment().subtract(5, 'days').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 4,
    title: 'DVA 数据流管理入门',
    summary: 'DVA 是基于 Redux 和 Redux-Saga 的数据流方案',
    content: '<p>DVA 提供了简洁的数据流管理方案...</p>',
    categoryId: 2,
    categoryName: '框架工具',
    tags: ['DVA', 'Redux'],
    tagIds: [5, 7],
    status: 'published',
    views: 1567,
    coverUrl: '',
    createdAt: moment().subtract(15, 'days').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().subtract(8, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 5,
    title: 'Antd 3.x 组件定制主题',
    summary: '通过 Less 变量定制 Ant Design 主题',
    content: '<p>Ant Design 支持通过 Less 变量定制主题...</p>',
    categoryId: 1,
    categoryName: '前端技术',
    tags: ['Antd', 'Less'],
    tagIds: [8, 9],
    status: 'archived',
    views: 432,
    coverUrl: '',
    createdAt: moment().subtract(20, 'days').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().subtract(15, 'days').format('YYYY-MM-DD HH:mm:ss')
  }
]

export default {
  'GET /api/articles': (req, res) => {
    const { page = 1, pageSize = 10, status = 'all', keyword = '' } = req.query
    let list = [...articleData]
    if (status !== 'all') {
      list = list.filter(a => a.status === status)
    }
    if (keyword) {
      list = list.filter(a => a.title.toLowerCase().includes(keyword.toLowerCase()))
    }
    const total = list.length
    const start = (page - 1) * pageSize
    list = list.slice(start, start + Number(pageSize))
    res.json({ list, total })
  },
  'GET /api/articles/:id': (req, res) => {
    const id = Number(req.params.id)
    const article = articleData.find(a => a.id === id)
    if (article) {
      res.json(article)
    } else {
      res.status(404).json({ message: '文章不存在' })
    }
  },
  'POST /api/articles': (req, res) => {
    const newArticle = {
      id: articleData.length + 1,
      ...req.body,
      views: 0,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    articleData.unshift(newArticle)
    res.json(newArticle)
  },
  'PUT /api/articles/:id': (req, res) => {
    const id = Number(req.params.id)
    const idx = articleData.findIndex(a => a.id === id)
    if (idx >= 0) {
      articleData[idx] = { ...articleData[idx], ...req.body, updatedAt: moment().format('YYYY-MM-DD HH:mm:ss') }
      res.json(articleData[idx])
    } else {
      res.status(404).json({ message: '文章不存在' })
    }
  },
  'DELETE /api/articles/:id': (req, res) => {
    const id = Number(req.params.id)
    const idx = articleData.findIndex(a => a.id === id)
    if (idx >= 0) {
      articleData.splice(idx, 1)
      res.json({ success: true })
    } else {
      res.status(404).json({ message: '文章不存在' })
    }
  },
  'PATCH /api/articles/:id/status': (req, res) => {
    const id = Number(req.params.id)
    const idx = articleData.findIndex(a => a.id === id)
    if (idx >= 0) {
      articleData[idx].status = req.body.status
      articleData[idx].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
      res.json({ success: true })
    } else {
      res.status(404).json({ message: '文章不存在' })
    }
  }
}
