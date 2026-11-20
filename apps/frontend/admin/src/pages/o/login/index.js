import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Card, Icon, message } from 'antd'
import { connect } from 'dva'
import { setToken, setUserInfo } from '../../../helpers/auth'
import './index.less'

class LoginPage extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    loading: PropTypes.bool
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      this.props.dispatch({
        type: 'login/submit',
        payload: values,
        callback: (res) => {
          if (res.success) {
            setToken(res.token)
            setUserInfo(res.user)
            message.success('登录成功')
            window.location.href = '/dashboard'
          } else {
            message.error(res.message || '登录失败')
          }
        }
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { loading } = this.props

    return (
      <div className="login-page">
        <Card className="login-card" bordered={false}>
          <div className="login-header">
            <Icon type="read" style={{ fontSize: 40, color: '#1890ff' }} />
            <h1>博客后台管理系统</h1>
            <p>请输入账号密码登录</p>
          </div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }]
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名 (默认 admin)"
                  size="large"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }]
              })(
                <Input.Password
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="密码 (默认 123456)"
                  size="large"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
}

const WrappedLoginPage = Form.create()(LoginPage)

export default connect(({ loading }) => ({
  loading: loading.effects['login/submit']
}))(WrappedLoginPage)
