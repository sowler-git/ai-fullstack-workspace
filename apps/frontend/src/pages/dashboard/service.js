import request from '../../helpers/request'

export function getStats() {
  return request.get('/dashboard/stats')
}

export function getTrafficData(params) {
  return request.get('/dashboard/traffic', { params })
}

export function getRecentArticles() {
  return request.get('/dashboard/recent-articles')
}
