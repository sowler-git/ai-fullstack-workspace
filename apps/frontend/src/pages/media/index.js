import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {
  Card,
  Upload,
  Icon,
  Button,
  Select,
  Modal,
  Row,
  Col,
  Spin,
  Popconfirm,
  message,
  Empty
} from 'antd'
import moment from 'moment'
import GlobalBreadcrumb from '../../components/GlobalBreadcrumb'
import './index.less'

const { Option } = Select
const { Meta } = Card

class MediaPage extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    list: PropTypes.array,
    total: PropTypes.number,
    loading: PropTypes.bool,
    query: PropTypes.object,
    previewVisible: PropTypes.bool,
    previewImage: PropTypes.string
  }

  state = {
    copiedId: null
  }

  componentDidMount() {
    this.props.dispatch({ type: 'media/fetchList' })
  }

  handleTypeChange = value => {
    this.props.dispatch({
      type: 'media/fetchList',
      payload: { type: value, page: 1 }
    })
  }

  handleUploadChange = info => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`)
      this.props.dispatch({ type: 'media/fetchList' })
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`)
    }
  }

  handleCopyUrl = url => {
    const input = document.createElement('textarea')
    input.value = url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    message.success('链接已复制')
  }

  handleDelete = id => {
    this.props.dispatch({
      type: 'media/delete',
      payload: id,
      callback: () => message.success('删除成功')
    })
  }

  handlePreview = url => {
    this.props.dispatch({ type: 'media/showPreview', payload: url })
  }

  handlePreviewClose = () => {
    this.props.dispatch({ type: 'media/hidePreview' })
  }

  handleLoadMore = () => {
    const { query } = this.props
    this.props.dispatch({
      type: 'media/fetchList',
      payload: { page: query.page + 1 }
    })
  }

  render() {
    const { list, total, loading, query, previewVisible, previewImage } = this.props
    const hasMore = list.length < total

    const uploadButton = (
      <div className="upload-trigger">
        <Icon type="plus" />
        <div className="upload-text">上传图片</div>
      </div>
    )

    return (
      <div className="page-container media-page">
        <GlobalBreadcrumb pathname="/media" />
        <Card
          bordered={false}
          className="media-card"
          extra={
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              onChange={this.handleTypeChange}
            >
              <Option value="all">全部类型</Option>
              <Option value="image">图片</Option>
              <Option value="file">文件</Option>
            </Select>
          }
        >
          <Upload
            name="file"
            action="/api/media/upload"
            listType="picture-card"
            showUploadList={false}
            multiple
            onChange={this.handleUploadChange}
            accept="image/*"
          >
            {uploadButton}
          </Upload>

          <Spin spinning={loading}>
            {list.length === 0 ? (
              <Empty description="暂无媒体文件" style={{ marginTop: 48 }} />
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {list.map(item => (
                    <Col key={item.id} xs={12} sm={8} md={6} lg={4}>
                      <Card
                        hoverable
                        className="media-item"
                        cover={
                          <img
                            alt={item.name}
                            src={item.url}
                            onClick={() => this.handlePreview(item.url)}
                          />
                        }
                        actions={[
                          <Icon
                            type="copy"
                            key="copy"
                            onClick={() => this.handleCopyUrl(item.url)}
                          />,
                          <Popconfirm
                            key="delete"
                            title="确定删除该文件吗？"
                            onConfirm={() => this.handleDelete(item.id)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Icon type="delete" />
                          </Popconfirm>
                        ]}
                      >
                        <Meta
                          title={
                            <span className="media-name" title={item.name}>
                              {item.name}
                            </span>
                          }
                          description={
                            <span className="media-date">
                              {item.size ? `${item.size} · ` : ''}
                              {moment(item.createdAt).format('MM-DD')}
                            </span>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
                {hasMore && (
                  <div className="load-more">
                    <Button onClick={this.handleLoadMore} loading={loading}>
                      加载更多
                    </Button>
                  </div>
                )}
              </>
            )}
          </Spin>
        </Card>

        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handlePreviewClose}
          width={800}
        >
          <img alt="preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

export default connect(({ media }) => ({
  list: media.list,
  total: media.total,
  loading: media.loading,
  query: media.query,
  previewVisible: media.previewVisible,
  previewImage: media.previewImage
}))(MediaPage)
