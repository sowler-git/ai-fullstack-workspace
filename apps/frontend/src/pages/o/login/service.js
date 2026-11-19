import request from '../../../helpers/request'

export function login(data) {
  return request.post('/auth/login', data)
}
