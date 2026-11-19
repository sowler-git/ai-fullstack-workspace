import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {
  Card,
  Table,
  Button,
  Select,
  Tag,
  Avatar,
  Popconfirm,
  message,
  Row,
  Col
} from 'antd'
import moment from 'moment'
import GlobalBreadcrumb from '../../components/GlobalBreadcrumb'
import './index.less'

const { Option } = Select

const statusMap = {
  approved: { text: '已通过', color: 'green' },
  pending: { text: '待审核', color: 'orange' },
  rejected: { text: '已拒绝', color: 'red' }
}

class CommentsPage extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    list: PropTypes.array,
    total: PropTypes.number,
    loading: PropTypes.bool,
    query: PropTypes.object,
    selectedRowKeys: PropTypes.array
  }

  componentDidMount() {
    this.props.dispatch({ type: 'comments/fetchList' })
  }

  handleStatusChange = value => {
    this.props.dispatch({
      type: 'comments/fetchList',
      payload: { status: value, page: 1 }
    })
  }

  handlePageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'comments/fetchList',
      payload: { page, pageSize }
    })
  }

  handleApprove = id => {
    this.props.dispatch({
      type: 'comments/approve',
      payload: id,
      callback: () => message.success('已通过审核')
    })
  }

  handleReject = id => {
    this.props.dispatch({
      type: 'comments/reject',
      payload: id,
      callback: () => message.success('已拒绝')
    })
  }

  handleDelete = id => {
    this.props.dispatch({
      type: 'comments/delete',
      payload: id,
      callback: () => message.success('删除成功')
    })
  }

  render() {
    const { list, total, loading, query, selectedRowKeys } = this.props

    const columns = [
      {
        title: '评论者',
        dataIndex: 'author',
        width: 150,
        render: (text, record) => (
          <div className="comment-author">
            <Avatar size="small" icon="user" src={record.avatar} />
            <span>{text}</span>
          </div>
        )
      },
      {
        title: '评论内容',
        dataIndex: 'content',
        ellipsis: true
      },
      {
        title: '文章',
        dataIndex: 'articleTitle',
        width: 180,
        ellipsis: true
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: v => {
          const s = statusMap[v] || statusMap.pending
          return <Tag color={s.color}>{s.text}</Tag>
        }
      },
      {
        title: '时间',
        dataIndex: 'createdAt',
        width: 160,
        render: v => (v ? moment(v).format('YYYY-MM-DD HH:mm') : '-')
      },
      {
        title: '操作',
        width: 220,
        render: (_, record) => (
          <span className="table-actions">
            {record.status === 'pending' && (
              <>
                <Button type="link" size="small" onClick={() => this.handleApprove(record.id)}>
                  通过
                </Button>
                <Button type="link" size="small" onClick={() => this.handleReject(record.id)}>
                  拒绝
                </Button>
              </>
            )}
            <Popconfirm
              title="确定删除该评论吗？"
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

    const rowSelection = {
      selectedRowKeys,
      onChange: keys => this.props.dispatch({ type: 'comments/setSelectedKeys', payload: keys })
    }

    return (
      <div className="page-container comments-page">
        <GlobalBreadcrumb pathname="/comments" />
        <Card bordered={false}>
          <Row gutter={16} className="filter-bar">
            <Col xs={24} sm={8}>
              <Select
                placeholder="按状态筛选"
                style={{ width: '100%' }}
                value={query.status}
                onChange={this.handleStatusChange}
              >
                <Option value="all">全部状态</Option>
                <Option value="approved">已通过</Option>
                <Option value="pending">待审核</Option>
                <Option value="rejected">已拒绝</Option>
              </Select>
            </Col>
          </Row>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={list}
            loading={loading}
            rowSelection={rowSelection}
            pagination={{
              current: query.page,
              pageSize: query.pageSize,
              total,
              showTotal: t => `共 ${t} 条评论`,
              onChange: this.handlePageChange
            }}
          />
        </Card>
      </div>
    )
  }
}

export default connect(({ comments }) => ({
  list: comments.list,
  total: comments.total,
  loading: comments.loading,
  query: comments.query,
  selectedRowKeys: comments.selectedRowKeys
}))(CommentsPage)
