import axios from '@/libs/api.request'

export const queryAgentCommissionList = (data) => {
  return axios.request({
    url: '/agent/manage/commission',
    params: data,
    method: 'get'
  })
}

export const queryTotalAgentCommission = () => {
  return axios.request({
    url: '/agent/manage/commission/total',
    method: 'get'
  })
}

export const queryAgentOrderList = (data) => {
  return axios.request({
    url: '/agent/manage/order/list',
    params: data,
    method: 'get'
  })
}
export const queryHomeOrder = () => {
  return axios.request({
    url: '/agent/manage/home/order',
    method: 'get'
  })
}
export const queryAgentUserList = (data) => {
  return axios.request({
    url: '/agent/manage/commission/user',
    params: data,
    method: 'get'
  })
}
export const queryAgentCustomList = (data) => {
  return axios.request({
    url: '/agent/manage/custom/user',
    params: data,
    method: 'get'
  })
}
export const queryAgentRemindOrderList = (data) => {
  return axios.request({
    url: '/agent/manage/remind/order',
    params: data,
    method: 'get'
  })
}
