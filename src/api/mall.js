import axios from '@/libs/api.request'

export const saveMall = (mall) => {
  return axios.request({
    url: 'mall',
    method: 'post',
    data: mall
  })
}

export const editMall = (mall) => {
  return axios.request({
    url: 'mall/edit',
    method: 'post',
    data: mall
  })
}
export const loadMallList = (pageNum, pageSize) => {
  return axios.request({
    url: 'mall',
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}
export const loadMallById = (id) => {
  return axios.request({
    url: 'mall/by/id',
    method: 'get',
    params: {
      id
    }
  })
}

export const removeMalls = (ids) => {
  return axios.request({
    url: 'mall',
    method: 'delete',
    params: {
      ids
    }
  })
}

export const removeAdmins = (codes) => {
  return axios.request({
    url: 'mall/admins',
    method: 'delete',
    params: {
      codes
    }
  })
}
