import { getUserInfo } from '../helpers/auth'

export default {
  namespace: 'app',
  state: {
    user: getUserInfo() || { name: '管理员', role: 'admin' },
    collapsed: false
  },
  reducers: {
    setUser(state, { payload }) {
      return { ...state, user: payload }
    },
    toggleCollapsed(state) {
      return { ...state, collapsed: !state.collapsed }
    }
  }
}
