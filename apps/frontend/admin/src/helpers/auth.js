/**
 * 认证工具 - token 管理与登录状态判断
 */

import Cookies from 'js-cookie'

const TOKEN_KEY = 'blog_admin_token'
const USER_KEY = 'blog_admin_user'

export function getToken() {
  return Cookies.get(TOKEN_KEY)
}

export function setToken(token, expires = 7) {
  Cookies.set(TOKEN_KEY, token, { expires })
}

export function removeToken() {
  Cookies.remove(TOKEN_KEY)
}

export function getUserInfo() {
  const raw = Cookies.get(USER_KEY)
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setUserInfo(user, expires = 7) {
  Cookies.set(USER_KEY, JSON.stringify(user), { expires })
}

export function clearAuth() {
  removeToken()
  Cookies.remove(USER_KEY)
}

export function isAuthenticated() {
  return !!getToken()
}
