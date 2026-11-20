const tagData = [
  { id: 1, name: 'React', articleCount: 18, description: 'React 生态' },
  { id: 2, name: 'Hooks', articleCount: 8, description: 'React Hooks' },
  { id: 3, name: '性能优化', articleCount: 12, description: '前端性能优化' },
  { id: 4, name: 'Webpack', articleCount: 6, description: '构建工具' },
  { id: 5, name: 'UmiJS', articleCount: 5, description: 'UmiJS 框架' },
  { id: 6, name: '路由', articleCount: 4, description: '前端路由' },
  { id: 7, name: 'Redux', articleCount: 7, description: '状态管理' },
  { id: 8, name: 'Antd', articleCount: 9, description: 'Ant Design' },
  { id: 9, name: 'Less', articleCount: 3, description: 'CSS 预处理器' },
  { id: 10, name: 'TypeScript', articleCount: 11, description: 'TypeScript' },
  { id: 11, name: 'Node.js', articleCount: 6, description: 'Node.js 后端' },
  { id: 12, name: 'Docker', articleCount: 4, description: '容器化部署' }
]

export default {
  'GET /api/tags': (req, res) => {
    res.json({ list: tagData })
  },
  'POST /api/tags': (req, res) => {
    const newTag = {
      id: tagData.length + 1,
      articleCount: 0,
      ...req.body
    }
    tagData.push(newTag)
    res.json(newTag)
  },
  'PUT /api/tags/:id': (req, res) => {
    const id = Number(req.params.id)
    const idx = tagData.findIndex(t => t.id === id)
    if (idx >= 0) {
      tagData[idx] = { ...tagData[idx], ...req.body }
      res.json(tagData[idx])
    } else {
      res.status(404).json({ message: '标签不存在' })
    }
  },
  'DELETE /api/tags/:id': (req, res) => {
    const id = Number(req.params.id)
    const idx = tagData.findIndex(t => t.id === id)
    if (idx >= 0) {
      tagData.splice(idx, 1)
      res.json({ success: true })
    } else {
      res.status(404).json({ message: '标签不存在' })
    }
  }
}
