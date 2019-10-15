import axios from '@/libs/api.request'

// 查询销售情况
export const initOrderInfo = () => {
  return axios.request({
    url: '/select/home-index/article-course/number',
    method: 'get'
  })
}
// 初始化表格数据
export const initChartData = () => {
  return axios.request({
    url: '/select/home-index/chart',
    method: 'get'
  })
}
