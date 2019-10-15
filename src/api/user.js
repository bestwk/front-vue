import axios from '@/libs/api.request'

export const login = ({ account, password }) => {
  const data = {
    account,
    password
  }
  return axios.request({
    url: '/agent/manage/login',
    data: data,
    method: 'post'
  })
}
export const getUserInfo = (token) => {
  return axios.request({
    url: '/agent/manage/get/info',
    method: 'post'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'agent/manage/logout',
    method: 'post'
  })
}
export const updateAdminPwd = (data) => {
  return axios.request({
    url: 'agent/manage/password',
    data: data,
    method: 'put'
  })
}
