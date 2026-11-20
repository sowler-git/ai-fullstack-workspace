/**
 * 环境判断 - 判断是否为开放页面（不需要登录）
 */

const OPEN_PAGES = ['/o/login', '/o/404', '/o/register']

export function isOpenPages(pathname) {
  return OPEN_PAGES.some(p => pathname.startsWith(p))
}

export function isLoginPath(pathname) {
  return pathname === '/o/login'
}
