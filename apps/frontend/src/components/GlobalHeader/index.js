import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Dropdown, Menu, Avatar } from 'antd'
import router from 'umi/router'
import Link from 'umi/link'
import { clearAuth } from '../../helpers/auth'
import './index.less'

function GlobalHeader({ collapsed, onToggle, userInfo }) {
  const handleLogout = () => {
    clearAuth()
    router.push('/o/login')
  }

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/settings">
          <Icon type="user" /> 个人设置
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        <Icon type="logout" /> 退出登录
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="global-header">
      <div className="global-header-left">
        <Icon
          className="trigger"
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={onToggle}
        />
      </div>
      <div className="global-header-right">
        <Dropdown overlay={menu} placement="bottomRight">
          <span className="user-info">
            <Avatar size="small" icon="user" style={{ marginRight: 8 }} />
            <span>{(userInfo && userInfo.name) || '管理员'}</span>
          </span>
        </Dropdown>
      </div>
    </div>
  )
}

GlobalHeader.propTypes = {
  collapsed: PropTypes.bool,
  onToggle: PropTypes.func,
  userInfo: PropTypes.object
}

export default GlobalHeader
