import { getStats, getTrafficData, getRecentArticles } from './service'

export default {
  namespace: 'dashboard',
  state: {
    stats: {
      articleCount: 0,
      commentCount: 0,
      viewCount: 0,
      userCount: 0
    },
    traffic: [],
    recentArticles: [],
    loading: false
  },
  effects: {
    *fetchStats(_, { call, put }) {
      const res = yield call(getStats)
      yield put({ type: 'saveStats', payload: res })
    },
    *fetchTraffic({ payload }, { call, put }) {
      const res = yield call(getTrafficData, payload)
      yield put({ type: 'saveTraffic', payload: res })
    },
    *fetchRecentArticles(_, { call, put }) {
      const res = yield call(getRecentArticles)
      yield put({ type: 'saveRecentArticles', payload: res })
    },
    *init(_, { all, put }) {
      yield all([
        put({ type: 'fetchStats' }),
        put({ type: 'fetchTraffic' }),
        put({ type: 'fetchRecentArticles' })
      ])
    }
  },
  reducers: {
    saveStats(state, { payload }) {
      return { ...state, stats: payload }
    },
    saveTraffic(state, { payload }) {
      return { ...state, traffic: payload.list || [] }
    },
    saveRecentArticles(state, { payload }) {
      return { ...state, recentArticles: payload.list || [] }
    }
  }
}
