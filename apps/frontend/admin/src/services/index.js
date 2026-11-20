import request from '../helpers/request'

export function getStats() {
  return request.get('/stats')
}

export function getTrafficData(params) {
  return request.get('/stats/traffic', { params })
}

export function getRecentArticles(params) {
  return request.get('/stats/recent-articles', { params })
}
