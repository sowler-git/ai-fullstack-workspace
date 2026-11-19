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
  Icon,
  Popconfirm,
  message,
  Row,
  Col
} from 'antd'
import moment from 'moment'
import Link from 'umi/link'
import router from 'umi/router'
import GlobalBreadcrumb from '../../../components/GlobalBreadcrumb'
import './index.less'

const { Search } = Input
const { Option } = Select

const statusMap = {
  published: { text: '已发布', color: 'green' },
  draft: { text: '草稿', color: 'orange' },
  archived: { text: '已归档', color: 'default' }
}

class ArticleList extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    list: PropTypes.array,
    total: PropTypes.number,
    loading: PropTypes.bool,
    query: PropTypes.object
  }

  componentDidMount() {
    this.props.dispatch({ type: 'articleList/fetchList' })
  }

  handleSearch = value => {
    this.props.dispatch({
      type: 'articleList/fetchList',
      payload: { keyword: value, page: 1 }
    })
  }

  handleStatusChange = value => {
    this.props.dispatch({
      type: 'articleList/fetchList',
      payload: { status: value, page: 1 }
    })
  }

  handlePageChange = (page, pageSize) => {
    this.props.dispatch({
      type: 'articleList/fetchList',
      payload: { page, pageSize }
    })
  }

  handleDelete = id => {
    this.props.dispatch({
      type: 'articleList/deleteArticle',
      payload: id,
      callback: () => message.success('删除成功')
    })
  }

  handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    this.props.dispatch({
      type: 'articleList/updateStatus',
      payload: { id, status: newStatus },
      callback: () => message.success('状态更新成功')
    })
  }

  render() {
    const { list, total, loading, query } = this.props

    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        ellipsis: true,
        render: (text, record) => (
          <Link to={`/articles/edit?id=${record.id}`}>{text}</Link>
        )
      },
      {
        title: '分类',
        dataIndex: 'categoryName',
        width: 120,
        render: v => v || '-'
      },
      {
        title: '标签',
        dataIndex: 'tags',
        width: 200,
        render: tags => (tags || []).map(t => (
          <Tag key={t} style={{ marginBottom: 4 }}>{t}</Tag>
        ))
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: v => {
          const s = statusMap[v] || statusMap.draft
          return <Tag color={s.color}>{s.text}</Tag>
        }
      },
      {
        title: '浏览',
        dataIndex: 'views',
        width: 80,
        sorter: (a, b) => a.views - b.views
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        width: 160,
        render: v => (v ? moment(v).format('YYYY-MM-DD HH:mm') : '-')
      },
      {
        title: '操作',
        width: 200,
        render: (_, record) => (
          <span className="table-actions">
            <Button
              type="link"
              size="small"
              onClick={() => router.push(`/articles/edit?id=${record.id}`)}
            >
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => this.handleToggleStatus(record.id, record.status)}
            >
              {record.status === 'published' ? '撤回' : '发布'}
            </Button>
            <Popconfirm
              title="确定删除这篇文章吗？"
              onConfirm={() => this.handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small" className="danger-link">
                删除
              </Button>
            </Popconfirm>
          </span>
        )
      }
    ]

    return (
      <div className="page-container article-list-page">
        <GlobalBreadcrumb pathname="/articles/list" />
        <Card bordered={false}>
          <Row gutter={16} className="filter-bar">
            <Col xs={24} sm={8}>
              <Search
                placeholder="搜索文章标题"
                onSearch={this.handleSearch}
                allowClear
              />
            </Col>
            <Col xs={24} sm={6}>
              <Select
                placeholder="按状态筛选"
                style={{ width: '100%' }}
                value={query.status}
                onChange={this.handleStatusChange}
              >
                <Option value="all">全部状态</Option>
                <Option value="published">已发布</Option>
                <Option value="draft">草稿</Option>
                <Option value="archived">已归档</Option>
              </Select>
            </Col>
            <Col xs={24} sm={10} style={{ textAlign: 'right' }}>
              <Button type="primary" icon="plus" onClick={() => router.push('/articles/edit')}>
                新建文章
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
              showSizeChanger: true,
              showTotal: t => `共 ${t} 篇文章`,
              onChange: this.handlePageChange,
              onShowSizeChange: this.handlePageChange
            }}
          />
        </Card>
      </div>
    )
  }
}

export default connect(({ articleList, loading }) => ({
  list: articleList.list,
  total: articleList.total,
  loading: articleList.loading,
  query: articleList.query
}))(ArticleList)
