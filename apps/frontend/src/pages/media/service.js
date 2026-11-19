import request from '../../helpers/request'

export function getMediaList(params) {
  return request.get('/media', { params })
}

export function deleteMedia(id) {
  return request.delete(`/media/${id}`)
}

export function getMediaCategories() {
  return request.get('/media/categories')
}
