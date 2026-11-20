import { getSettings, updateSettings } from './service'

export default {
  namespace: 'settings',
  state: {
    data: null,
    loading: false,
    saving: false
  },
  effects: {
    *fetch(_, { call, put }) {
      yield put({ type: 'setLoading', payload: true })
      const res = yield call(getSettings)
      yield put({ type: 'save', payload: res })
      yield put({ type: 'setLoading', payload: false })
    },
    *save({ payload, callback }, { call, put }) {
      yield put({ type: 'setSaving', payload: true })
      try {
        const res = yield call(updateSettings, payload)
        yield put({ type: 'save', payload: res })
        if (callback) callback(true)
      } catch (err) {
        if (callback) callback(false, err)
      }
      yield put({ type: 'setSaving', payload: false })
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, data: payload }
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload }
    },
    setSaving(state, { payload }) {
      return { ...state, saving: payload }
    }
  }
}
