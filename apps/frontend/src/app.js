import router from 'umi/router'
import { message } from 'antd'
import debounce from 'lodash/debounce'

export const dva = {
  config: {
    onError: debounce(function(err) {
      if (err && err.response) {
        const { status, statusText } = err.response
        if (status === 401) {
          router.push('/o/login')
          return
        }
        message.error(statusText || `请求错误 (${status})`)
        return
      }
      message.error(err.message || '未知错误')
    }, 200)
  }
}
