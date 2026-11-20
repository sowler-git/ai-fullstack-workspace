import {
  getArticleList,
  deleteArticle,
  updateArticleStatus
} from '../service'

export default {
  namespace: 'articleList',
  state: {
    list: [],
    total: 0,
    loading: false,
    query: {
      page: 1,
      pageSize: 10,
      status: 'all',
      keyword: '',
      categoryId: null
    }
  },
  effects: {
    *fetchList({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true })
      const query = yield select(state => state.articleList.query)
      const finalQuery = { ...query, ...payload }
      yield put({ type: 'setQuery', payload })
      const res = yield call(getArticleList, finalQuery)
      yield put({ type: 'saveList', payload: res })
      yield put({ type: 'setLoading', payload: false })
    },
    *deleteArticle({ payload }, { call, put, select }) {
      yield call(deleteArticle, payload)
      const query = yield select(state => state.articleList.query)
      yield put({ type: 'fetchList', payload: query })
    },
    *updateStatus({ payload }, { call, put, select }) {
      const { id, status } = payload
      yield call(updateArticleStatus, id, status)
      const query = yield select(state => state.articleList.query)
      yield put({ type: 'fetchList', payload: query })
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
    }
  }
}
