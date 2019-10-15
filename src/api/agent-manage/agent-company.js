import axios from '@/libs/api.request'

export const queryAgentCompanyBillList = (data) => {
  return axios.request({
    url: '/agent/manage/company/list/bill',
    params: data,
    method: 'get'
  })
}

export const queryMailByOrderNum = (orderNumTrack) => {
  return axios.request({
    url: '/agent/manage/receipt/bill/kdxx',
    params: {orderNumTrack},
    method: 'get'
  })
}
export const queryAgentSourceList = (data) => {
  return axios.request({
    url: '/agent/manage/company/list/source',
    params: data,
    method: 'get'
  })
}
export const queryAgentBankList = (data) => {
  return axios.request({
    url: '/agent/manage/company/list/bank',
    params: data,
    method: 'get'
  })
}
export const queryAgentCompanyInto = (data) => {
  return axios.request({
    url: '/agent/manage/company/list/into',
    params: data,
    method: 'get'
  })
}
export const updateAgentCompanyIntoState = (data) => {
  return axios.request({
    url: '/agent/manage/company/list/into',
    data: data,
    method: 'put'
  })
}
export const queryTbintoByid = (id) => {
  return axios.request({
    url: '/agent/manage/company/into/' + id,
    method: 'get'
  })
}
export const queryAgentCompanyPersonnel = (data) => {
  return axios.request({
    params: data,
    url: '/userpt/list',
    method: 'get'
  })
}

export const resetPwd = (data) => {
  return axios.request({
    data: data,
    url: '/userpt/updateDepositPwd',
    method: 'put'
  })
}
export const updatePersonnel = (data) => {
  return axios.request({
    data: data,
    url: '/user/update',
    method: 'put'
  })
}
export const updateUserstate = (data) => {
  return axios.request({
    params: data,
    url: '/user/updateEnableDisable',
    method: 'get'
  })
}
export const deletePersonnel = (userId) => {
  return axios.request({
    params: {
      userId: userId
    },
    url: '/user/del',
    method: 'put'
  })
}
export const queryProvinceList = () => {
  return axios.request({
    url: 'mini/my/proviceList',
    method: 'get'
  })
}
export const queryCompanyList = () => {
  return axios.request({
    url: 'agent/manage/my/commercial',
    method: 'get'
  })
}

export const updataIncome = (data) => {
  return axios.request({
    data: data,
    url: 'invoice/xcx/saveinto',
    method: 'post'
  })
}
