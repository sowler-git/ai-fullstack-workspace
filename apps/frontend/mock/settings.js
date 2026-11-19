const settingsData = {
  siteName: '我的技术博客',
  siteDescription: '分享前端开发、框架工具、后端技术的个人博客',
  siteUrl: 'https://blog.example.com',
  seoTitle: '我的技术博客 - 前端 / 后端 / 全栈开发',
  seoKeywords: '前端开发,React,Vue,Node.js,前端框架,技术博客',
  seoDescription: '专注于前端开发技术分享，涵盖 React、Vue、Node.js 等技术栈的实践经验',
  commentEnabled: true,
  commentAudit: true,
  registrationEnabled: false
}

export default {
  'GET /api/settings': (req, res) => {
    res.json(settingsData)
  },
  'PUT /api/settings': (req, res) => {
    Object.assign(settingsData, req.body)
    res.json(settingsData)
  }
}
