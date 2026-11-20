import request from '../../helpers/request'

export function getComments(params) {
  return request.get('/comments', { params })
}

export function approveComment(id) {
  return request.patch(`/comments/${id}/approve`)
}

export function rejectComment(id) {
  return request.patch(`/comments/${id}/reject`)
}

export function deleteComment(id) {
  return request.delete(`/comments/${id}`)
}

export function batchApprove(ids) {
  return request.patch('/comments/batch-approve', { ids })
}
