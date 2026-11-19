import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Spin } from 'antd'
import { connect } from 'dva'
import GlobalHeader from '../../components/GlobalHeader'
import GlobalSiderMenus from '../../components/GlobalSiderMenus'
import GlobalFooter from '../../components/GlobalFooter'
import { isAuthenticated } from '../../helpers/auth'
import router from 'umi/router'
import './index.less'

const { Sider, Header, Content, Footer } = Layout

class AuthRequiredLayout extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    location: PropTypes.shape({ pathname: PropTypes.string }),
    appUser: PropTypes.object
  }

  state = {
    collapsed: false,
    ready: false
  }

  componentDidMount() {
    if (!isAuthenticated()) {
      router.push('/o/login')
      return
    }
    this.setState({ ready: true })
  }

  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    const { collapsed, ready } = this.state
    if (!ready) {
      return (
        <div className="auth-loading">
          <Spin size="large" tip="加载中..." />
        </div>
      )
    }
    return (
        <Layout className="auth-layout">
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={220}
            className="auth-sider"
          >
            <GlobalSiderMenus collapsed={collapsed} />
          </Sider>
          <Layout style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Header className="auth-header">
              <GlobalHeader
                collapsed={collapsed}
                onToggle={this.toggle}
                userInfo={this.props.appUser}
              />
            </Header>
            <Content className="auth-content">{this.props.children}</Content>
            <Footer className="auth-footer">
              <GlobalFooter />
            </Footer>
          </Layout>
        </Layout>
    )
  }
}

export default connect(({ app }) => ({
  appUser: app.user
}))(AuthRequiredLayout)
