import request from '../../helpers/request'

export function getUsers(params) {
  return request.get('/users', { params })
}

export function createUser(data) {
  return request.post('/users', data)
}

export function updateUser(id, data) {
  return request.put(`/users/${id}`, data)
}

export function deleteUser(id) {
  return request.delete(`/users/${id}`)
}

export function toggleUserStatus(id, enabled) {
  return request.patch(`/users/${id}/status`, { enabled })
}
