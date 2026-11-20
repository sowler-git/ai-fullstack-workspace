import moment from 'moment'

const commentData = [
  {
    id: 1,
    author: '张三',
    avatar: '',
    content: '这篇文章写得非常好，受益匪浅！',
    articleTitle: 'React Hooks 最佳实践指南',
    articleId: 1,
    status: 'approved',
    createdAt: moment().subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 2,
    author: '李四',
    avatar: '',
    content: '请问有关于 TypeScript 的更多资料吗？',
    articleTitle: '前端性能优化策略总结',
    articleId: 2,
    status: 'pending',
    createdAt: moment().subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 3,
    author: '王五',
    avatar: '',
    content: 'DVA 的 model 设计真的很优雅，学习了。',
    articleTitle: 'DVA 数据流管理入门',
    articleId: 4,
    status: 'approved',
    createdAt: moment().subtract(6, 'hours').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 4,
    author: '赵六',
    avatar: '',
    content: '希望能出一篇关于 UmiJS 4.x 升级指南的文章',
    articleTitle: 'UmiJS 约定式路由详解',
    articleId: 3,
    status: 'pending',
    createdAt: moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 5,
    author: '匿名用户',
    avatar: '',
    content: '广告内容，请删除',
    articleTitle: 'React Hooks 最佳实践指南',
    articleId: 1,
    status: 'rejected',
    createdAt: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 6,
    author: '钱七',
    avatar: '',
    content: 'Antd 主题定制那篇可以更详细一些吗？',
    articleTitle: 'Antd 3.x 组件定制主题',
    articleId: 5,
    status: 'approved',
    createdAt: moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 7,
    author: '孙八',
    avatar: '',
    content: '感谢分享，收藏了！',
    articleTitle: 'DVA 数据流管理入门',
    articleId: 4,
    status: 'pending',
    createdAt: moment().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss')
  }
]

export default {
  'GET /api/comments': (req, res) => {
    const { page = 1, pageSize = 10, status = 'all' } = req.query
    let list = [...commentData]
    if (status !== 'all') {
      list = list.filter(c => c.status === status)
    }
    const total = list.length
    const start = (page - 1) * pageSize
    list = list.slice(start, start + Number(pageSize))
    res.json({ list, total })
  },
  'PATCH /api/comments/:id/approve': (req, res) => {
    const id = Number(req.params.id)
    const item = commentData.find(c => c.id === id)
    if (item) {
      item.status = 'approved'
      res.json({ success: true })
    } else {
      res.status(404).json({ message: '评论不存在' })
    }
  },
  'PATCH /api/comments/:id/reject': (req, res) => {
    const id = Number(req.params.id)
    const item = commentData.find(c => c.id === id)
    if (item) {
      item.status = 'rejected'
      res.json({ success: true })
    } else {
      res.status(404).json({ message: '评论不存在' })
    }
  },
  'DELETE /api/comments/:id': (req, res) => {
    const id = Number(req.params.id)
    const idx = commentData.findIndex(c => c.id === id)
    if (idx >= 0) {
      commentData.splice(idx, 1)
      res.json({ success: true })
    } else {
      res.status(404).json({ message: '评论不存在' })
    }
  }
}
