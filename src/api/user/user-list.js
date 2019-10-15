import axios from '@/libs/api.request'

export const queryUserList = (data) => {
  return axios.request({
    url: '/user/user-list',
    params: data,
    method: 'get'
  })
}
