/**
 * 路径工具 - 获取当前路由路径
 * 在非组件环境中安全获取 window.location.pathname
 */
export function locationPathnameSelector() {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.pathname
  }
  return '/'
}
