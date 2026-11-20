import {
  getTags,
  createTag,
  updateTag,
  deleteTag
} from './service'

export default {
  namespace: 'tags',
  state: {
    list: [],
    loading: false,
    modalVisible: false,
    editingRecord: null
  },
  effects: {
    *fetchList(_, { call, put }) {
      yield put({ type: 'setLoading', payload: true })
      const res = yield call(getTags)
      yield put({ type: 'saveList', payload: res.list || [] })
      yield put({ type: 'setLoading', payload: false })
    },
    *create({ payload, callback }, { call, put }) {
      yield call(createTag, payload)
      yield put({ type: 'fetchList' })
      if (callback) callback()
    },
    *update({ payload, callback }, { call, put }) {
      yield call(updateTag, payload.id, payload)
      yield put({ type: 'fetchList' })
      if (callback) callback()
    },
    *delete({ payload, callback }, { call, put }) {
      yield call(deleteTag, payload)
      yield put({ type: 'fetchList' })
      if (callback) callback()
    }
  },
  reducers: {
    saveList(state, { payload }) {
      return { ...state, list: payload }
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload }
    },
    showModal(state, { payload }) {
      return { ...state, modalVisible: true, editingRecord: payload || null }
    },
    hideModal(state) {
      return { ...state, modalVisible: false, editingRecord: null }
    }
  }
}
