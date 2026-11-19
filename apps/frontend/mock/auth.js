export default {
  'POST /api/auth/login': (req, res) => {
    const { username, password } = req.body
    if (username === 'admin' && password === '123456') {
      res.json({
        success: true,
        token: 'mock-token-' + Date.now(),
        user: {
          id: 1,
          name: '管理员',
          username: 'admin',
          role: 'admin',
          avatar: ''
        }
      })
    } else {
      res.json({
        success: false,
        message: '用户名或密码错误'
      })
    }
  },
  'GET /api/auth/logout': (req, res) => {
    res.json({ success: true })
  }
}
