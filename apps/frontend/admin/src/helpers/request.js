/**
 * HTTP 请求封装 - 基于 axios
 */

import axios from 'axios'
import qs from 'qs'
import { getToken, clearAuth } from './auth'
import router from 'umi/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
})

request.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

request.interceptors.response.use(
  response => response.data,
  error => {
    const { response } = error
    if (response) {
      if (response.status === 401) {
        clearAuth()
        router.push('/o/login')
        return Promise.reject(new Error('登录已过期，请重新登录'))
      }
      const msg = response.data && response.data.message
        ? response.data.message
        : `请求错误 (${response.status})`
      return Promise.reject(new Error(msg))
    }
    return Promise.reject(new Error('网络异常，请检查网络连接'))
  }
)

export default request
