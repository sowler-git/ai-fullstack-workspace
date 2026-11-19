import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Spin,
  message,
  Divider,
  Row,
  Col
} from 'antd'
import GlobalBreadcrumb from '../../components/GlobalBreadcrumb'
import './index.less'

const { TextArea } = Input

class SettingsPage extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    data: PropTypes.object,
    loading: PropTypes.bool,
    saving: PropTypes.bool
  }

  componentDidMount() {
    this.props.dispatch({ type: 'settings/fetch' })
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props
    if (data && data !== prevProps.data) {
      this.props.form.setFieldsValue({
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        siteUrl: data.siteUrl,
        seoTitle: data.seoTitle,
        seoKeywords: data.seoKeywords,
        seoDescription: data.seoDescription,
        commentEnabled: data.commentEnabled,
        commentAudit: data.commentAudit,
        registrationEnabled: data.registrationEnabled
      })
    }
  }

  handleSave = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      this.props.dispatch({
        type: 'settings/save',
        payload: values,
        callback: (success, error) => {
          if (success) {
            message.success('保存成功')
          } else {
            message.error(error ? error.message : '保存失败')
          }
        }
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { loading, saving } = this.props

    return (
      <div className="page-container settings-page">
        <GlobalBreadcrumb pathname="/settings" />
        <Spin spinning={loading}>
          <Row gutter={24}>
            <Col xs={24} md={16}>
              <Card bordered={false} title="站点信息" className="settings-card">
                <Form layout="vertical">
                  <Form.Item label="站点名称">
                    {getFieldDecorator('siteName', {
                      rules: [{ required: true, message: '请输入站点名称' }]
                    })(<Input placeholder="请输入站点名称" />)}
                  </Form.Item>
                  <Form.Item label="站点描述">
                    {getFieldDecorator('siteDescription')(
                      <TextArea rows={2} placeholder="一句话描述你的博客" />
                    )}
                  </Form.Item>
                  <Form.Item label="站点地址">
                    {getFieldDecorator('siteUrl', {
                      rules: [{ type: 'url', message: '请输入有效的URL' }]
                    })(<Input placeholder="https://example.com" />)}
                  </Form.Item>
                </Form>
              </Card>

              <Card bordered={false} title="SEO 设置" className="settings-card">
                <Form layout="vertical">
                  <Form.Item label="SEO 标题">
                    {getFieldDecorator('seoTitle')(
                      <Input placeholder="搜索引擎显示标题" />
                    )}
                  </Form.Item>
                  <Form.Item label="SEO 关键词">
                    {getFieldDecorator('seoKeywords')(
                      <Input placeholder="多个关键词用逗号分隔" />
                    )}
                  </Form.Item>
                  <Form.Item label="SEO 描述">
                    {getFieldDecorator('seoDescription')(
                      <TextArea rows={2} placeholder="搜索引擎显示描述" />
                    )}
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card bordered={false} title="功能开关" className="settings-card">
                <Form layout="vertical">
                  <Form.Item label="开启评论" extra="允许访客评论文章">
                    {getFieldDecorator('commentEnabled', {
                      valuePropName: 'checked'
                    })(<Switch />)}
                  </Form.Item>
                  <Divider />
                  <Form.Item label="评论审核" extra="新评论需要管理员审核后显示">
                    {getFieldDecorator('commentAudit', {
                      valuePropName: 'checked'
                    })(<Switch />)}
                  </Form.Item>
                  <Divider />
                  <Form.Item label="开放注册" extra="允许访客注册账户">
                    {getFieldDecorator('registrationEnabled', {
                      valuePropName: 'checked'
                    })(<Switch />)}
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>

          <div className="settings-footer">
            <Button type="primary" size="large" onClick={this.handleSave} loading={saving}>
              保存设置
            </Button>
          </div>
        </Spin>
      </div>
    )
  }
}

const WrappedSettingsPage = Form.create()(SettingsPage)

export default connect(({ settings }) => ({
  data: settings.data,
  loading: settings.loading,
  saving: settings.saving
}))(WrappedSettingsPage)
