import axios from '@/libs/api.request'

export const addAreas = (areas) => {
  return axios.request({
    url: '/areas/addAreas',
    data: areas,
    method: 'post'
  })
}
export const updateAreas = (areas) => {
  return axios.request({
    url: '/areas/updateAreas',
    data: areas,
    method: 'post'
  })
}

// 查询所有区域(带分页)
export const getAreasList = (pageNum, pageSize, storeId) => {
  return axios.request({
    url: '/areas/getAllAreas',
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      storeId: storeId
    },
    method: 'get'
  })
}
// 删除一个区域
export const deleteAreas = (id) => {
  return axios.request({
    url: '/areas/deleteAreas',
    params: {
      areasId: id
    },
    method: 'get'
  })
}
