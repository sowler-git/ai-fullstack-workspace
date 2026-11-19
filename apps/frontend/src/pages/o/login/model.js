import { login } from './service'

export default {
  namespace: 'login',
  state: {
    loading: false
  },
  effects: {
    *submit({ payload, callback }, { call }) {
      const res = yield call(login, payload)
      if (callback) callback(res)
    }
  },
  reducers: {}
}
