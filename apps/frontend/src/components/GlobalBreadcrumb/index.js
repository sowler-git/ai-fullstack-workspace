import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb } from 'antd'

const routeMap = {
  '/dashboard': '仪表盘',
  '/articles': '文章管理',
  '/articles/list': '文章列表',
  '/articles/edit': '新建文章',
  '/categories': '分类管理',
  '/tags': '标签管理',
  '/comments': '评论管理',
  '/media': '媒体库',
  '/users': '用户管理',
  '/settings': '系统设置'
}

function GlobalBreadcrumb({ pathname }) {
  const paths = pathname.split('/').filter(Boolean)
  const items = paths.map((_, index) => {
    const path = '/' + paths.slice(0, index + 1).join('/')
    const name = routeMap[path]
    return name ? <Breadcrumb.Item key={path}>{name}</Breadcrumb.Item> : null
  }).filter(Boolean)

  return (
    <Breadcrumb style={{ margin: '12px 0' }}>
      <Breadcrumb.Item>首页</Breadcrumb.Item>
      {items}
    </Breadcrumb>
  )
}

GlobalBreadcrumb.propTypes = {
  pathname: PropTypes.string
}

export default GlobalBreadcrumb
