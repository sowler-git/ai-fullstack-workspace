import {
  getComments,
  approveComment,
  rejectComment,
  deleteComment
} from './service'

export default {
  namespace: 'comments',
  state: {
    list: [],
    total: 0,
    loading: false,
    selectedRowKeys: [],
    query: {
      page: 1,
      pageSize: 10,
      status: 'all'
    }
  },
  effects: {
    *fetchList({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true })
      const query = yield select(state => state.comments.query)
      const finalQuery = { ...query, ...payload }
      yield put({ type: 'setQuery', payload })
      const res = yield call(getComments, finalQuery)
      yield put({ type: 'saveList', payload: res })
      yield put({ type: 'setLoading', payload: false })
      yield put({ type: 'clearSelection' })
    },
    *approve({ payload, callback }, { call, put, select }) {
      yield call(approveComment, payload)
      const query = yield select(state => state.comments.query)
      yield put({ type: 'fetchList', payload: query })
      if (callback) callback()
    },
    *reject({ payload, callback }, { call, put, select }) {
      yield call(rejectComment, payload)
      const query = yield select(state => state.comments.query)
      yield put({ type: 'fetchList', payload: query })
      if (callback) callback()
    },
    *delete({ payload, callback }, { call, put, select }) {
      yield call(deleteComment, payload)
      const query = yield select(state => state.comments.query)
      yield put({ type: 'fetchList', payload: query })
      if (callback) callback()
    }
  },
  reducers: {
    saveList(state, { payload }) {
      return { ...state, list: payload.list || [], total: payload.total || 0 }
    },
    setQuery(state, { payload }) {
      return { ...state, query: { ...state.query, ...payload } }
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload }
    },
    setSelectedKeys(state, { payload }) {
      return { ...state, selectedRowKeys: payload }
    },
    clearSelection(state) {
      return { ...state, selectedRowKeys: [] }
    }
  }
}
