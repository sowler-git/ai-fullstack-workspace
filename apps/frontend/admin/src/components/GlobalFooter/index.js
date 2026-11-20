import React from 'react'

export default function GlobalFooter() {
  return (
    <div className="global-footer">
      <span>博客后台管理系统 &copy; {new Date().getFullYear()} Blog Admin</span>
    </div>
  )
}
