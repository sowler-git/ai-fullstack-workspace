import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  Popconfirm,
  message,
  Row,
  Col
} from 'antd'
import GlobalBreadcrumb from '../../components/GlobalBreadcrumb'
import './index.less'

const tagColors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']

class TagsPage extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    list: PropTypes.array,
    loading: PropTypes.bool,
    modalVisible: PropTypes.bool,
    editingRecord: PropTypes.object
  }

  componentDidMount() {
    this.props.dispatch({ type: 'tags/fetchList' })
  }

  handleAdd = () => {
    this.props.dispatch({ type: 'tags/showModal', payload: null })
  }

  handleEdit = record => {
    this.props.dispatch({ type: 'tags/showModal', payload: record })
  }

  handleDelete = id => {
    this.props.dispatch({
      type: 'tags/delete',
      payload: id,
      callback: () => message.success('删除成功')
    })
  }

  handleModalOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      const { editingRecord } = this.props
      const action = editingRecord ? 'tags/update' : 'tags/create'
      this.props.dispatch({
        type: action,
        payload: editingRecord ? { ...values, id: editingRecord.id } : values,
        callback: () => {
          message.success(editingRecord ? '更新成功' : '创建成功')
          this.props.dispatch({ type: 'tags/hideModal' })
        }
      })
    })
  }

  handleModalCancel = () => {
    this.props.dispatch({ type: 'tags/hideModal' })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, loading, modalVisible, editingRecord } = this.props

    const columns = [
      { title: 'ID', dataIndex: 'id', width: 60 },
      {
        title: '标签名称',
        dataIndex: 'name',
        width: 200,
        render: (text, _, index) => (
          <Tag color={tagColors[index % tagColors.length]}>{text}</Tag>
        )
      },
      { title: '文章数', dataIndex: 'articleCount', width: 100 },
      { title: '描述', dataIndex: 'description', ellipsis: true },
      {
        title: '操作',
        width: 160,
        render: (_, record) => (
          <span className="table-actions">
            <Button type="link" size="small" onClick={() => this.handleEdit(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确定删除该标签吗？"
              onConfirm={() => this.handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small" className="danger-link">删除</Button>
            </Popconfirm>
          </span>
        )
      }
    ]

    return (
      <div className="page-container tags-page">
        <GlobalBreadcrumb pathname="/tags" />
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Card
              bordered={false}
              title="标签列表"
              extra={
                <Button type="primary" icon="plus" onClick={this.handleAdd}>
                  新建标签
                </Button>
              }
            >
              <Table
                rowKey="id"
                columns={columns}
                dataSource={list}
                loading={loading}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} title="标签云" className="tag-cloud-card">
              <div className="tag-cloud">
                {list.map((tag, i) => (
                  <Tag
                    key={tag.id}
                    color={tagColors[i % tagColors.length]}
                    style={{ marginBottom: 8, fontSize: 13 + (tag.articleCount > 10 ? 3 : 0) }}
                  >
                    {tag.name} ({tag.articleCount || 0})
                  </Tag>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        <Modal
          title={editingRecord ? '编辑标签' : '新建标签'}
          visible={modalVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          okText="确定"
          cancelText="取消"
        >
          <Form layout="vertical">
            <Form.Item label="标签名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入标签名称' }],
                initialValue: editingRecord && editingRecord.name
              })(<Input placeholder="请输入标签名称" />)}
            </Form.Item>
            <Form.Item label="描述">
              {getFieldDecorator('description', {
                initialValue: editingRecord && editingRecord.description
              })(<Input.TextArea rows={2} placeholder="标签描述（选填）" />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

const WrappedTagsPage = Form.create()(TagsPage)

export default connect(({ tags }) => ({
  list: tags.list,
  loading: tags.loading,
  modalVisible: tags.modalVisible,
  editingRecord: tags.editingRecord
}))(WrappedTagsPage)
