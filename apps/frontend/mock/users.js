import moment from 'moment'

const userData = [
  {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    email: 'admin@blog.com',
    avatar: '',
    role: 'admin',
    articleCount: 45,
    enabled: true,
    createdAt: moment().subtract(90, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 2,
    username: 'editor01',
    nickname: '张编辑',
    email: 'editor01@blog.com',
    avatar: '',
    role: 'editor',
    articleCount: 23,
    enabled: true,
    createdAt: moment().subtract(60, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 3,
    username: 'writer_li',
    nickname: '李作者',
    email: 'li@blog.com',
    avatar: '',
    role: 'author',
    articleCount: 18,
    enabled: true,
    createdAt: moment().subtract(45, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 4,
    username: 'writer_wang',
    nickname: '王作者',
    email: 'wang@blog.com',
    avatar: '',
    role: 'author',
    articleCount: 12,
    enabled: false,
    createdAt: moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 5,
    username: 'reader_zhao',
    nickname: '赵读者',
    email: 'zhao@example.com',
    avatar: '',
    role: 'reader',
    articleCount: 0,
    enabled: true,
    createdAt: moment().subtract(15, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 6,
    username: 'reader_sun',
    nickname: '孙读者',
    email: 'sun@example.com',
    avatar: '',
    role: 'reader',
    articleCount: 0,
    enabled: true,
    createdAt: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
  },
  {
    id: 7,
    username: 'editor02',
    nickname: '刘编辑',
    email: 'liu@blog.com',
    avatar: '',
    role: 'editor',
    articleCount: 8,
    enabled: true,
    createdAt: moment().subtract(20, 'days').format('YYYY-MM-DD HH:mm:ss')
  }
]

export default {
  'GET /api/users': (req, res) => {
    const { page = 1, pageSize = 10, keyword = '', role = 'all' } = req.query
    let list = [...userData]
    if (role !== 'all') {
      list = list.filter(u => u.role === role)
    }
    if (keyword) {
      list = list.filter(u =>
        u.username.toLowerCase().includes(keyword.toLowerCase()) ||
        u.email.toLowerCase().includes(keyword.toLowerCase())
      )
    }
    const total = list.length
    const start = (page - 1) * pageSize
    list = list.slice(start, start + Number(pageSize))
    res.json({ list, total })
  },
  'POST /api/users': (req, res) => {
    const newUser = {
      id: userData.length + 1,
      avatar: '',
      articleCount: 0,
      enabled: true,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      ...req.body
    }
    userData.push(newUser)
    res.json(newUser)
  },
  'PUT /api/users/:id': (req, res) => {
    const id = Number(req.params.id)
    const idx = userData.findIndex(u => u.id === id)
    if (idx >= 0) {
      userData[idx] = { ...userData[idx], ...req.body }
      res.json(userData[idx])
    } else {
      res.status(404).json({ message: '用户不存在' })
    }
  },
  'DELETE /api/users/:id': (req, res) => {
    const id = Number(req.params.id)
    const idx = userData.findIndex(u => u.id === id)
    if (idx >= 0) {
      userData.splice(idx, 1)
      res.json({ success: true })
    } else {
      res.status(404).json({ message: '用户不存在' })
    }
  },
  'PATCH /api/users/:id/status': (req, res) => {
    const id = Number(req.params.id)
    const idx = userData.findIndex(u => u.id === id)
    if (idx >= 0) {
      userData[idx].enabled = req.body.enabled
      res.json({ success: true })
    } else {
      res.status(404).json({ message: '用户不存在' })
    }
  }
}
