import axios from '@/libs/api.request'
// 初始化查询所有门店
export const getStoreList = () => {
  return axios.request({
    url: '/tables/getStoreList',
    method: 'get'
  })
}

// 根据门店查询所有区域
export const getAllAreasList = (storeId) => {
  return axios.request({
    url: '/table/getAllAreasList',
    params: {
      storeId: storeId
    },
    method: 'get'
  })
}
// 根据查询条件查询所有桌台
export const getTableList = (data) => {
  return axios.request({
    url: '/table/getTableList',
    params: data,
    method: 'get'
  })
}
// 根据桌台id删除桌台(更改状态)
export const deleteTable = (tableId) => {
  return axios.request({
    url: '/table/deleteTableById',
    params: {
      tableId: tableId
    },
    method: 'get'
  })
}
// 添加桌台
export const addTable = (data) => {
  return axios.request({
    url: '/table/addTable',
    data: data,
    method: 'post'
  })
}
// 添加桌台
export const updateTable = (data) => {
  return axios.request({
    url: '/table/updateTable',
    data: data,
    method: 'post'
  })
}
// 更改启用状态.是否要必点菜
export const update = (value, method, id) => {
  return axios.request({
    url: '/table/update',
    params: {
      value: value,
      method: method,
      id: id
    },
    method: 'get'
  })
}
// 保存更新二维码短链信息
export const updateShortChain = (aaa) => {
  return axios.request({
    url: '/table/updateShortChain',
    data: aaa,
    method: 'post'
  })
}
