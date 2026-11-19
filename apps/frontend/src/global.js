/**
 * 全局脚本 - 在应用启动时执行
 */

// 设置全局 less 变量到 CSS 变量，方便 JS 读取
window.addEventListener('error', e => {
  console.error('Global error:', e.error)
})
