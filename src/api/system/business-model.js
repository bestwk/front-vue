import axios from '@/libs/api.request'

// 查询默认门店
export const getBusinessModel = () => {
  return axios.request({
    url: '/businessmodal/getStore',
    method: 'get'
  })
}

// 更新营业模式
export const updateBusinessModel = (data) => {
  return axios.request({
    url: '/businessmodal/updateBusinessModel',
    data: data,
    method: 'post'
  })
}
