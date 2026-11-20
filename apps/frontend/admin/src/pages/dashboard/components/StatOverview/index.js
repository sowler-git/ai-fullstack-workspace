import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Card, Icon, Spin } from 'antd'

function StatCard({ title, value, icon, color }) {
  return (
    <Card className="stat-card" bordered={false} style={{ borderTop: `3px solid ${color}` }}>
      <div className="stat-card-body">
        <div className="stat-icon" style={{ background: color + '15', color }}>
          <Icon type={icon} style={{ fontSize: 28 }} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{value}</div>
          <div className="stat-title">{title}</div>
        </div>
      </div>
    </Card>
  )
}

StatCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  icon: PropTypes.string,
  color: PropTypes.string
}

function StatOverview({ stats, loading }) {
  const cards = [
    { title: '文章总数', value: stats.articleCount, icon: 'file-text', color: '#1890ff' },
    { title: '评论总数', value: stats.commentCount, icon: 'message', color: '#52c41a' },
    { title: '总访问量', value: stats.viewCount, icon: 'eye', color: '#faad14' },
    { title: '用户总数', value: stats.userCount, icon: 'team', color: '#722ed1' }
  ]
  return (
    <Spin spinning={loading}>
      <Row gutter={24}>
        {cards.map((c, i) => (
          <Col key={i} xs={24} sm={12} md={6}>
            <StatCard {...c} />
          </Col>
        ))}
      </Row>
    </Spin>
  )
}

StatOverview.propTypes = {
  stats: PropTypes.object,
  loading: PropTypes.bool
}

export default StatOverview
