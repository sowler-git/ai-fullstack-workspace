import React from 'react'
import PropTypes from 'prop-types'
import { Card, Table, Tag, Spin } from 'antd'
import moment from 'moment'
import Link from 'umi/link'

const statusMap = {
  published: { text: '已发布', color: 'green' },
  draft: { text: '草稿', color: 'orange' },
  archived: { text: '已归档', color: 'default' }
}

function RecentArticles({ list, loading }) {
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
      width: 80
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 160,
      render: v => (v ? moment(v).format('YYYY-MM-DD HH:mm') : '-')
    }
  ]

  return (
    <Card title="最新文章" bordered={false} style={{ marginTop: 24 }}>
      <Spin spinning={loading}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={false}
          size="middle"
        />
      </Spin>
    </Card>
  )
}

RecentArticles.propTypes = {
  list: PropTypes.array,
  loading: PropTypes.bool
}

RecentArticles.defaultProps = {
  list: []
}

export default RecentArticles
