import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import StatOverview from './components/StatOverview'
import TrafficChart from './components/TrafficChart'
import RecentArticles from './components/RecentArticles'
import GlobalBreadcrumb from '../../components/GlobalBreadcrumb'
import './index.less'

class Dashboard extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    stats: PropTypes.object,
    traffic: PropTypes.array,
    recentArticles: PropTypes.array,
    loading: PropTypes.bool
  }

  componentDidMount() {
    this.props.dispatch({ type: 'dashboard/init' })
  }

  render() {
    const { stats, traffic, recentArticles, loading } = this.props
    return (
      <div className="page-container dashboard-page">
        <GlobalBreadcrumb pathname="/dashboard" />
        <StatOverview stats={stats} loading={loading} />
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <TrafficChart data={traffic} loading={loading} />
          </Col>
          <Col xs={24} md={8}>
            <RecentArticles list={recentArticles} loading={loading} />
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(({ dashboard, loading }) => ({
  stats: dashboard.stats,
  traffic: dashboard.traffic,
  recentArticles: dashboard.recentArticles,
  loading: loading.effects['dashboard/init']
}))(Dashboard)
