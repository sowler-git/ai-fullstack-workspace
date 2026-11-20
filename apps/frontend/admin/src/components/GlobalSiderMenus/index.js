import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import Link from 'umi/link'
import { locationPathnameSelector } from '../../helpers/path'

const { SubMenu } = Menu

const menuConfig = [
  {
    key: '/dashboard',
    icon: 'dashboard',
    title: '仪表盘'
  },
  {
    key: '/articles',
    icon: 'file-text',
    title: '文章管理',
    children: [
      { key: '/articles/list', title: '文章列表' },
      { key: '/articles/edit', title: '新建文章' }
    ]
  },
  {
    key: '/categories',
    icon: 'appstore',
    title: '分类管理'
  },
  {
    key: '/tags',
    icon: 'tags',
    title: '标签管理'
  },
  {
    key: '/comments',
    icon: 'message',
    title: '评论管理'
  },
  {
    key: '/media',
    icon: 'picture',
    title: '媒体库'
  },
  {
    key: '/users',
    icon: 'team',
    title: '用户管理'
  },
  {
    key: '/settings',
    icon: 'setting',
    title: '系统设置'
  }
]

class GlobalSiderMenus extends React.Component {
  static propTypes = {
    collapsed: PropTypes.bool,
    location: PropTypes.shape({ pathname: PropTypes.string })
  }

  renderMenuItems() {
    return menuConfig.map(item => {
      if (item.children) {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {item.children.map(child => (
              <Menu.Item key={child.key}>
                <Link to={child.key}>{child.title}</Link>
              </Menu.Item>
            ))}
          </SubMenu>
        )
      }
      return (
        <Menu.Item key={item.key}>
          <Link to={item.key}>
            <Icon type={item.icon} />
            <span>{item.title}</span>
          </Link>
        </Menu.Item>
      )
    })
  }

  render() {
    const { collapsed } = this.props
    const pathname = locationPathnameSelector()
    const openKeys = menuConfig
      .filter(m => m.children && pathname.startsWith(m.key))
      .map(m => m.key)
    const selectedKey = menuConfig
      .flatMap(m => (m.children ? m.children.map(c => c.key) : [m.key]))
      .filter(key => pathname.startsWith(key))

    return (
      <div className="sider-menus">
        <div className="sider-logo">
          <Icon type="read" style={{ fontSize: 24, color: '#fff' }} />
          {!collapsed && <span className="logo-text">博客管理</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={openKeys}
          selectedKeys={selectedKey}
        >
          {this.renderMenuItems()}
        </Menu>
      </div>
    )
  }
}

export default GlobalSiderMenus
