import axios from '@/libs/api.request'

// 查询默认门店
export const getManageLogin = () => {
  return axios.request({
    url: '/account/getManageLogin',
    method: 'get'
  })
}

// 修改帐号
export const updateAccount = (phone) => {
  return axios.request({
    method: 'GET',
    url: '/account/updateAccount',
    params: {phone: phone}
  })
}
