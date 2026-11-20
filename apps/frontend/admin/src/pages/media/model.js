import { getMediaList, deleteMedia } from './service'

export default {
  namespace: 'media',
  state: {
    list: [],
    total: 0,
    loading: false,
    query: {
      page: 1,
      pageSize: 24,
      type: 'all'
    },
    previewVisible: false,
    previewImage: ''
  },
  effects: {
    *fetchList({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true })
      const query = yield select(state => state.media.query)
      const finalQuery = { ...query, ...payload }
      yield put({ type: 'setQuery', payload })
      const res = yield call(getMediaList, finalQuery)
      yield put({ type: 'saveList', payload: res })
      yield put({ type: 'setLoading', payload: false })
    },
    *delete({ payload, callback }, { call, put, select }) {
      yield call(deleteMedia, payload)
      const query = yield select(state => state.media.query)
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
    showPreview(state, { payload }) {
      return { ...state, previewVisible: true, previewImage: payload }
    },
    hidePreview(state) {
      return { ...state, previewVisible: false, previewImage: '' }
    }
  }
}
