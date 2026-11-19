import moment from 'moment'

const articles = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  title: [
    'React Hooks 最佳实践指南',
    '前端性能优化策略总结',
    'UmiJS 约定式路由详解',
    'DVA 数据流管理入门',
    'Antd 3.x 组件定制主题'
  ][i],
  categoryName: ['技术', '技术', '前端', '前端', '前端'][i],
  status: i % 3 === 0 ? 'draft' : 'published',
  views: Math.floor(Math.random() * 5000) + 100,
  updatedAt: moment().subtract(i, 'days').format('YYYY-MM-DD HH:mm:ss')
}))

const traffic = Array.from({ length: 14 }, (_, i) => ({
  date: moment().subtract(13 - i, 'days').format('YYYY-MM-DD'),
  views: Math.floor(Math.random() * 3000) + 500,
  visitors: Math.floor(Math.random() * 1500) + 200
}))

export default {
  'GET /api/dashboard/stats': (req, res) => {
    res.json({
      articleCount: 128,
      commentCount: 356,
      viewCount: 89642,
      userCount: 1248
    })
  },
  'GET /api/dashboard/traffic': (req, res) => {
    res.json({ list: traffic })
  },
  'GET /api/dashboard/recent-articles': (req, res) => {
    res.json({ list: articles })
  }
}
