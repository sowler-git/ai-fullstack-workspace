import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Spin,
  message,
  Icon,
  Upload
} from 'antd'
import router from 'umi/router'
import RichTextEditor from '../../../components/RichTextEditor'
import GlobalBreadcrumb from '../../../components/GlobalBreadcrumb'
import './index.less'

const { TextArea } = Input
const { Option } = Select

class ArticleEdit extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    detail: PropTypes.object,
    categories: PropTypes.array,
    tags: PropTypes.array,
    loading: PropTypes.bool,
    submitting: PropTypes.bool,
    location: PropTypes.shape({ query: PropTypes.object })
  }

  state = {
    content: '',
    coverUrl: ''
  }

  componentDidMount() {
    const id = this.props.location.query && this.props.location.query.id
    this.props.dispatch({ type: 'articleEdit/init', payload: { id } })
  }

  componentDidUpdate(prevProps) {
    const { detail } = this.props
    if (detail && detail !== prevProps.detail) {
      this.props.form.setFieldsValue({
        title: detail.title,
        summary: detail.summary,
        categoryId: detail.categoryId,
        tagIds: detail.tagIds || [],
        status: detail.status || 'draft'
      })
      this.setState({
        content: detail.content || '',
        coverUrl: detail.coverUrl || ''
      })
    }
  }

  handleContentChange = html => {
    this.setState({ content: html })
  }

  handleCoverUpload = info => {
    if (info.file.status === 'done') {
      const url = info.file.response && info.file.response.url
      if (url) {
        this.setState({ coverUrl: url })
      }
    }
  }

  handleSubmit = status => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      const { content, coverUrl } = this.state
      if (!content || content.replace(/<[^>]+>/g, '').trim() === '') {
        message.warning('请输入文章正文内容')
        return
      }
      const payload = {
        ...values,
        content,
        coverUrl,
        status
      }
      this.props.dispatch({
        type: 'articleEdit/submit',
        payload,
        callback: (success, error) => {
          if (success) {
            message.success(status === 'published' ? '发布成功' : '保存草稿成功')
            router.push('/articles/list')
          } else {
            message.error(error ? error.message : '操作失败')
          }
        }
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { categories, tags, loading, submitting } = this.props
    const { content, coverUrl } = this.state

    const uploadButton = (
      <div className="upload-cover-btn">
        <Icon type="plus" />
        <div>上传封面</div>
      </div>
    )

    return (
      <div className="page-container article-edit-page">
        <GlobalBreadcrumb pathname="/articles/edit" />
        <Spin spinning={loading}>
          <Row gutter={24}>
            <Col xs={24} md={17}>
              <Card bordered={false} className="edit-main-card">
                <Form layout="vertical">
                  <Form.Item label="文章标题">
                    {getFieldDecorator('title', {
                      rules: [{ required: true, message: '请输入文章标题' }]
                    })(
                      <Input placeholder="请输入标题" size="large" />
                    )}
                  </Form.Item>
                  <Form.Item label="正文内容">
                    <RichTextEditor
                      value={content}
                      onChange={this.handleContentChange}
                      height={500}
                    />
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} md={7}>
              <Card bordered={false} title="发布设置" className="edit-side-card">
                <Form layout="vertical">
                  <Form.Item label="摘要">
                    {getFieldDecorator('summary')(
                      <TextArea rows={3} placeholder="文章摘要（选填）" />
                    )}
                  </Form.Item>
                  <Form.Item label="分类">
                    {getFieldDecorator('categoryId', {
                      rules: [{ required: true, message: '请选择分类' }]
                    })(
                      <Select placeholder="选择分类">
                        {categories.map(c => (
                          <Option key={c.id} value={c.id}>{c.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="标签">
                    {getFieldDecorator('tagIds')(
                      <Select mode="multiple" placeholder="选择标签">
                        {tags.map(t => (
                          <Option key={t.id} value={t.id}>{t.name}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="封面图">
                    <Upload
                      name="file"
                      action="/api/media/upload"
                      listType="picture-card"
                      showUploadList={false}
                      onChange={this.handleCoverUpload}
                      accept="image/*"
                    >
                      {coverUrl ? (
                        <img src={coverUrl} alt="cover" style={{ width: '100%' }} />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </Form.Item>
                  <Form.Item>
                    <input type="hidden" />
                    {getFieldDecorator('status', { initialValue: 'draft' })(<Input type="hidden" />)}
                  </Form.Item>
                </Form>
                <div className="edit-actions">
                  <Button
                    type="default"
                    block
                    loading={submitting}
                    onClick={() => this.handleSubmit('draft')}
                    style={{ marginBottom: 8 }}
                  >
                    保存草稿
                  </Button>
                  <Button
                    type="primary"
                    block
                    loading={submitting}
                    onClick={() => this.handleSubmit('published')}
                  >
                    发布文章
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    )
  }
}

const WrappedArticleEdit = Form.create()(ArticleEdit)

export default connect(({ articleEdit, loading }) => ({
  detail: articleEdit.detail,
  categories: articleEdit.categories,
  tags: articleEdit.tags,
  loading: articleEdit.loading,
  submitting: articleEdit.submitting
}))(WrappedArticleEdit)
