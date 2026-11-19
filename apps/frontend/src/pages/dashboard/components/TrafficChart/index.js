import React from 'react'
import PropTypes from 'prop-types'
import { Card, Empty, Spin } from 'antd'
import ReactECharts from 'echarts-for-react'
import moment from 'moment'

function TrafficChart({ data, loading }) {
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: params => {
        let html = params[0].axisValue
        params.forEach(p => {
          html += `<br/>${p.marker}${p.seriesName}: ${p.value}`
        })
        return html
      }
    },
    legend: {
      data: ['访问量', '访客数'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(d => moment(d.date).format('MM-DD')),
      axisLine: { lineStyle: { color: '#e8e8e8' } },
      axisLabel: { color: 'rgba(0,0,0,0.45)' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(0,0,0,0.45)' },
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        data: data.map(d => d.views),
        itemStyle: { color: '#1890ff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24,144,255,0.25)' },
              { offset: 1, color: 'rgba(24,144,255,0)' }
            ]
          }
        }
      },
      {
        name: '访客数',
        type: 'line',
        smooth: true,
        data: data.map(d => d.visitors),
        itemStyle: { color: '#52c41a' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(82,196,26,0.2)' },
              { offset: 1, color: 'rgba(82,196,26,0)' }
            ]
          }
        }
      }
    ]
  }

  return (
    <Card title="流量趋势" bordered={false} style={{ marginTop: 24 }}>
      <Spin spinning={loading}>
        {data.length === 0 ? (
          <Empty description="暂无数据" />
        ) : (
          <ReactECharts option={option} style={{ height: 300 }} />
        )}
      </Spin>
    </Card>
  )
}

TrafficChart.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool
}

TrafficChart.defaultProps = {
  data: []
}

export default TrafficChart
