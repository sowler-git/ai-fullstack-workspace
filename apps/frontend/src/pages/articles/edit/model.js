import { getArticleDetail, createArticle, updateArticle } from '../service'
import { getCategories } from '../../categories/service'
import { getTags } from '../../tags/service'

export default {
  namespace: 'articleEdit',
  state: {
    detail: null,
    categories: [],
    tags: [],
    loading: false,
    submitting: false
  },
  effects: {
    *fetchDetail({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true })
      const res = yield call(getArticleDetail, payload)
      yield put({ type: 'saveDetail', payload: res })
      yield put({ type: 'setLoading', payload: false })
    },
    *fetchCategories(_, { call, put }) {
      const res = yield call(getCategories)
      yield put({ type: 'saveCategories', payload: res.list || [] })
    },
    *fetchTags(_, { call, put }) {
      const res = yield call(getTags)
      yield put({ type: 'saveTags', payload: res.list || [] })
    },
    *submit({ payload, callback }, { call, put, select }) {
      yield put({ type: 'setSubmitting', payload: true })
      const detail = yield select(state => state.articleEdit.detail)
      try {
        if (detail && detail.id) {
          yield call(updateArticle, detail.id, payload)
        } else {
          yield call(createArticle, payload)
        }
        if (callback) callback(true)
      } catch (err) {
        if (callback) callback(false, err)
      }
      yield put({ type: 'setSubmitting', payload: false })
    },
    *init({ payload }, { put, all }) {
      yield all([
        put({ type: 'fetchCategories' }),
        put({ type: 'fetchTags' })
      ])
      if (payload && payload.id) {
        yield put({ type: 'fetchDetail', payload: payload.id })
      } else {
        yield put({ type: 'saveDetail', payload: null })
      }
    }
  },
  reducers: {
    saveDetail(state, { payload }) {
      return { ...state, detail: payload }
    },
    saveCategories(state, { payload }) {
      return { ...state, categories: payload }
    },
    saveTags(state, { payload }) {
      return { ...state, tags: payload }
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload }
    },
    setSubmitting(state, { payload }) {
      return { ...state, submitting: payload }
    }
  }
}
