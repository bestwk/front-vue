import axios from '@/libs/api.request'

// 查询会员信息
export const initMemberDatas = () => {
  return axios.request({
    url: 'query/home/members',
    method: 'get'
  })
}

// 查询商品信息
export const initGoodsDatas = () => {
  return axios.request({
    url: 'query/home/goods',
    method: 'get'
  })
}
// 查询销售情况
export const initSaleInfo = () => {
  return axios.request({
    url: 'query/home/sale/info',
    method: 'get'
  })
}
// 初始化表格数据
export const initChartData = () => {
  return axios.request({
    url: 'query/home/chart',
    method: 'get'
  })
}
