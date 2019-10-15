import axios from '@/libs/api.request'
// axios.defaults.withCredentials = true
export const getdizhi = (data) => {
  return axios.request({
    // url: 'https://apis.map.qq.com/ws/geocoder/v1/?',
    url: '/tx/ws/geocoder/v1',
    params: data,
    method: 'GET',
    // changeOrigin: true,
    // mode: 'no-cors',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    }
    // withCredentials: true,
    // credentials: 'same-origin',
  })
}

// 查询默认门店
export const getStore = () => {
  return axios.request({
    url: '/baseinfo/getStore',
    method: 'get'
  })
}

// 更新默认门店
export const updateStore = data => {
  return axios.request({
    url: '/baseinfo/updateStore',
    data: data,
    method: 'POST'
  })
}
