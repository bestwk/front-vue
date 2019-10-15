import axios from '@/libs/api.request'

// 查询默认门店
export const getTakeout = () => {
  return axios.request({
    url: '/TakeOut/getTakeout',
    method: 'get'
  })
}

// 更新营业模式
export const updateTakeOut = (data) => {
  return axios.request({
    url: '/TakeOut/updateTakeOut',
    data: data,
    method: 'post'
  })
}
