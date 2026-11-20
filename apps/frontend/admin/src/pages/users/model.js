import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus
} from './service'

export default {
  namespace: 'users',
  state: {
    list: [],
    total: 0,
    loading: false,
    query: {
      page: 1,
      pageSize: 10,
      keyword: '',
      role: 'all'
    },
    modalVisible: false,
    editingRecord: null
  },
  effects: {
    *fetchList({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true })
      const query = yield select(state => state.users.query)
      const finalQuery = { ...query, ...payload }
      yield put({ type: 'setQuery', payload })
      const res = yield call(getUsers, finalQuery)
      yield put({ type: 'saveList', payload: res })
      yield put({ type: 'setLoading', payload: false })
    },
    *create({ payload, callback }, { call, put, select }) {
      yield call(createUser, payload)
      const query = yield select(state => state.users.query)
      yield put({ type: 'fetchList', payload: query })
      if (callback) callback()
    },
    *update({ payload, callback }, { call, put, select }) {
      yield call(updateUser, payload.id, payload)
      const query = yield select(state => state.users.query)
      yield put({ type: 'fetchList', payload: query })
      if (callback) callback()
    },
    *delete({ payload, callback }, { call, put, select }) {
      yield call(deleteUser, payload)
      const query = yield select(state => state.users.query)
      yield put({ type: 'fetchList', payload: query })
      if (callback) callback()
    },
    *toggleStatus({ payload, callback }, { call, put, select }) {
      const { id, enabled } = payload
      yield call(toggleUserStatus, id, enabled)
      const query = yield select(state => state.users.query)
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
    showModal(state, { payload }) {
      return { ...state, modalVisible: true, editingRecord: payload || null }
    },
    hideModal(state) {
      return { ...state, modalVisible: false, editingRecord: null }
    }
  }
}
