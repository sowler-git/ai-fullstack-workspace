const categoryData = [
  { id: 1, name: '前端技术', sort: 1, articleCount: 45, description: '前端开发技术文章' },
  { id: 2, name: '框架工具', sort: 2, articleCount: 23, description: '前端框架和开发工具' },
  { id: 3, name: '后端开发', sort: 3, articleCount: 18, description: '后端开发相关' },
  { id: 4, name: '数据库', sort: 4, articleCount: 12, description: '数据库设计与优化' },
  { id: 5, name: '运维部署', sort: 5, articleCount: 9, description: 'DevOps 与部署' },
  { id: 6, name: '产品设计', sort: 6, articleCount: 7, description: '产品设计思考' },
  { id: 7, name: '随笔杂谈', sort: 7, articleCount: 14, description: '个人随笔' }
]

export default {
  'GET /api/categories': (req, res) => {
    res.json({ list: categoryData })
  },
  'POST /api/categories': (req, res) => {
    const newCat = {
      id: categoryData.length + 1,
      articleCount: 0,
      ...req.body
    }
    categoryData.push(newCat)
    res.json(newCat)
  },
  'PUT /api/categories/:id': (req, res) => {
    const id = Number(req.params.id)
    const idx = categoryData.findIndex(c => c.id === id)
    if (idx >= 0) {
      categoryData[idx] = { ...categoryData[idx], ...req.body }
      res.json(categoryData[idx])
    } else {
      res.status(404).json({ message: '分类不存在' })
    }
  },
  'DELETE /api/categories/:id': (req, res) => {
    const id = Number(req.params.id)
    const idx = categoryData.findIndex(c => c.id === id)
    if (idx >= 0) {
      categoryData.splice(idx, 1)
      res.json({ success: true })
    } else {
      res.status(404).json({ message: '分类不存在' })
    }
  }
}
