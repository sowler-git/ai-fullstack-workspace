import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Avatar,
  Modal,
  Form,
  Radio,
  Switch,
  Popconfirm,
  message,
  Row,
  Col
} from 'antd'
import moment from 'moment'
import GlobalBreadcrumb from '../../components/GlobalBreadcrumb'
import './index.less'

const { Search } = Input
const { Option } = Select

const roleMap = {
  admin: { text: '管理员', color: 'red' },
  editor: { text: '编辑', color: 'blue' },
  author: { text: '作者', color: 'green' },
  reader: { text: '读者', color: 'default' }
}

class UsersPage extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    list: PropTypes.array,
    total: PropTypes.number,
    loading: PropTypes.bool,
    query: PropTypes.object,
    modalVisible: PropTypes.bool,
    editingRecord: PropTypes.object
  }

  componentDidMount() {
    this.props.dispatch({ type: 'users/fetchList' })
  }

  handleSearch = value => {
    this.props.dispatch({
      type: 'users/fetchList',
      payload: { keyword: value, page: 1 }
    })
  }

  handleRoleChange = value => {
    this.props.dispatch({
      type: 'users/fetchList',
      payload: { role: value, page: 1 }
    })
  }

  handlePageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'users/fetchList',
      payload: { page, pageSize }
    })
  }

  handleAdd = () => {
    this.props.dispatch({ type: 'users/showModal', payload: null })
  }

  handleEdit = record => {
    this.props.dispatch({ type: 'users/showModal', payload: record })
  }

  handleDelete = id => {
    this.props.dispatch({
      type: 'users/delete',
      payload: id,
      callback: () => message.success('删除成功')
    })
  }

  handleToggleStatus = (id, enabled) => {
    this.props.dispatch({
      type: 'users/toggleStatus',
      payload: { id, enabled: !enabled },
      callback: () => message.success(!enabled ? '已启用' : '已禁用')
    })
  }

  handleModalOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      const { editingRecord } = this.props
      const action = editingRecord ? 'users/update' : 'users/create'
      this.props.dispatch({
        type: action,
        payload: editingRecord ? { ...values, id: editingRecord.id } : values,
        callback: () => {
          message.success(editingRecord ? '更新成功' : '创建成功')
          this.props.dispatch({ type: 'users/hideModal' })
        }
      })
    })
  }

  handleModalCancel = () => {
    this.props.dispatch({ type: 'users/hideModal' })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, total, loading, query, modalVisible, editingRecord } = this.props

    const columns = [
      {
        title: '用户',
        dataIndex: 'username',
        width: 200,
        render: (text, record) => (
          <div className="user-cell">
            <Avatar size="small" icon="user" src={record.avatar} />
            <div className="user-info">
              <span className="username">{text}</span>
              <span className="email">{record.email}</span>
            </div>
          </div>
        )
      },
      { title: '昵称', dataIndex: 'nickname', width: 120 },
      {
        title: '角色',
        dataIndex: 'role',
        width: 100,
        render: v => {
          const r = roleMap[v] || roleMap.reader
          return <Tag color={r.color}>{r.text}</Tag>
        }
      },
      {
        title: '文章数',
        dataIndex: 'articleCount',
        width: 80
      },
      {
        title: '状态',
        dataIndex: 'enabled',
        width: 100,
        render: (enabled, record) => (
          <Switch
            checked={enabled}
            size="small"
            onChange={() => this.handleToggleStatus(record.id, enabled)}
          />
        )
      },
      {
        title: '注册时间',
        dataIndex: 'createdAt',
        width: 160,
        render: v => (v ? moment(v).format('YYYY-MM-DD HH:mm') : '-')
      },
      {
        title: '操作',
        width: 160,
        render: (_, record) => (
          <span className="table-actions">
            <Button type="link" size="small" onClick={() => this.handleEdit(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确定删除该用户吗？"
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
      <div className="page-container users-page">
        <GlobalBreadcrumb pathname="/users" />
        <Card bordered={false}>
          <Row gutter={16} className="filter-bar">
            <Col xs={24} sm={8}>
              <Search
                placeholder="搜索用户名或邮箱"
                onSearch={this.handleSearch}
                allowClear
              />
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder="按角色筛选"
                style={{ width: '100%' }}
                value={query.role}
                onChange={this.handleRoleChange}
              >
                <Option value="all">全部角色</Option>
                <Option value="admin">管理员</Option>
                <Option value="editor">编辑</Option>
                <Option value="author">作者</Option>
                <Option value="reader">读者</Option>
              </Select>
            </Col>
            <Col xs={24} sm={10} style={{ textAlign: 'right' }}>
              <Button type="primary" icon="plus" onClick={this.handleAdd}>
                添加用户
              </Button>
            </Col>
          </Row>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={list}
            loading={loading}
            pagination={{
              current: query.page,
              pageSize: query.pageSize,
              total,
              showTotal: t => `共 ${t} 个用户`,
              onChange: this.handlePageChange
            }}
          />
        </Card>

        <Modal
          title={editingRecord ? '编辑用户' : '添加用户'}
          visible={modalVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          okText="确定"
          cancelText="取消"
        >
          <Form layout="vertical">
            <Form.Item label="用户名">
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
                initialValue: editingRecord && editingRecord.username
              })(<Input placeholder="请输入用户名" disabled={!!editingRecord} />)}
            </Form.Item>
            <Form.Item label="昵称">
              {getFieldDecorator('nickname', {
                rules: [{ required: true, message: '请输入昵称' }],
                initialValue: editingRecord && editingRecord.nickname
              })(<Input placeholder="请输入昵称" />)}
            </Form.Item>
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '邮箱格式不正确' }
                ],
                initialValue: editingRecord && editingRecord.email
              })(<Input placeholder="请输入邮箱" />)}
            </Form.Item>
            {!editingRecord && (
              <Form.Item label="密码">
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6位' }
                  ]
                })(<Input.Password placeholder="请输入密码" />)}
              </Form.Item>
            )}
            <Form.Item label="角色">
              {getFieldDecorator('role', {
                initialValue: editingRecord ? editingRecord.role : 'reader'
              })(
                <Radio.Group>
                  <Radio value="admin">管理员</Radio>
                  <Radio value="editor">编辑</Radio>
                  <Radio value="author">作者</Radio>
                  <Radio value="reader">读者</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

const WrappedUsersPage = Form.create()(UsersPage)

export default connect(({ users }) => ({
  list: users.list,
  total: users.total,
  loading: users.loading,
  query: users.query,
  modalVisible: users.modalVisible,
  editingRecord: users.editingRecord
}))(WrappedUsersPage)
