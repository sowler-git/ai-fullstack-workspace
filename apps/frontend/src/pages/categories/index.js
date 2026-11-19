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
  InputNumber,
  Icon,
  Popconfirm,
  message,
  Tag
} from 'antd'
import GlobalBreadcrumb from '../../components/GlobalBreadcrumb'
import './index.less'

class CategoriesPage extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    list: PropTypes.array,
    loading: PropTypes.bool,
    modalVisible: PropTypes.bool,
    editingRecord: PropTypes.object
  }

  componentDidMount() {
    this.props.dispatch({ type: 'categories/fetchList' })
  }

  handleAdd = () => {
    this.props.dispatch({ type: 'categories/showModal', payload: null })
  }

  handleEdit = record => {
    this.props.dispatch({ type: 'categories/showModal', payload: record })
  }

  handleDelete = id => {
    this.props.dispatch({
      type: 'categories/delete',
      payload: id,
      callback: () => message.success('删除成功')
    })
  }

  handleModalOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      const { editingRecord } = this.props
      const action = editingRecord ? 'categories/update' : 'categories/create'
      this.props.dispatch({
        type: action,
        payload: editingRecord ? { ...values, id: editingRecord.id } : values,
        callback: () => {
          message.success(editingRecord ? '更新成功' : '创建成功')
          this.props.dispatch({ type: 'categories/hideModal' })
        }
      })
    })
  }

  handleModalCancel = () => {
    this.props.dispatch({ type: 'categories/hideModal' })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, loading, modalVisible, editingRecord } = this.props

    const columns = [
      { title: 'ID', dataIndex: 'id', width: 60 },
      { title: '分类名称', dataIndex: 'name', width: 200 },
      { title: '排序', dataIndex: 'sort', width: 80 },
      {
        title: '文章数',
        dataIndex: 'articleCount',
        width: 100,
        render: v => <Tag color="blue">{v || 0}</Tag>
      },
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
              title="确定删除该分类吗？"
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
      <div className="page-container categories-page">
        <GlobalBreadcrumb pathname="/categories" />
        <Card
          bordered={false}
          title="分类管理"
          extra={
            <Button type="primary" icon="plus" onClick={this.handleAdd}>
              新建分类
            </Button>
          }
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={list}
            loading={loading}
            pagination={false}
          />
        </Card>

        <Modal
          title={editingRecord ? '编辑分类' : '新建分类'}
          visible={modalVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          okText="确定"
          cancelText="取消"
        >
          <Form layout="vertical">
            <Form.Item label="分类名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入分类名称' }],
                initialValue: editingRecord && editingRecord.name
              })(<Input placeholder="请输入分类名称" />)}
            </Form.Item>
            <Form.Item label="排序（数字越小越靠前）">
              {getFieldDecorator('sort', {
                initialValue: editingRecord ? editingRecord.sort : 0
              })(<InputNumber min={0} style={{ width: '100%' }} />)}
            </Form.Item>
            <Form.Item label="描述">
              {getFieldDecorator('description', {
                initialValue: editingRecord && editingRecord.description
              })(<Input.TextArea rows={3} placeholder="分类描述（选填）" />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

const WrappedCategoriesPage = Form.create()(CategoriesPage)

export default connect(({ categories }) => ({
  list: categories.list,
  loading: categories.loading,
  modalVisible: categories.modalVisible,
  editingRecord: categories.editingRecord
}))(WrappedCategoriesPage)
