import moment from 'moment'

const mediaData = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name: `image-${i + 1}.jpg`,
  url: `https://picsum.photos/300/200?random=${i + 1}`,
  size: `${(Math.random() * 3 + 0.5).toFixed(1)}MB`,
  type: 'image',
  createdAt: moment().subtract(i, 'days').format('YYYY-MM-DD HH:mm:ss')
}))

export default {
  'GET /api/media': (req, res) => {
    const { page = 1, pageSize = 24, type = 'all' } = req.query
    let list = [...mediaData]
    if (type !== 'all') {
      list = list.filter(m => m.type === type)
    }
    const total = list.length
    const start = (page - 1) * pageSize
    list = list.slice(start, start + Number(pageSize))
    res.json({ list, total })
  },
  'POST /api/media/upload': (req, res) => {
    res.json({
      url: `https://picsum.photos/300/200?random=${Date.now()}`,
      name: 'uploaded.jpg',
      size: '1.2MB'
    })
  },
  'DELETE /api/media/:id': (req, res) => {
    const id = Number(req.params.id)
    const idx = mediaData.findIndex(m => m.id === id)
    if (idx >= 0) {
      mediaData.splice(idx, 1)
      res.json({ success: true })
    } else {
      res.status(404).json({ message: '文件不存在' })
    }
  }
}
