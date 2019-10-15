import axios from '@/libs/api.request'

// 保存会员设置
export const updateMemberSettings = (data) => {
  return axios.request({
    url: '/membersetting/updateSetting',
    data: data,
    method: 'post'
  })
}

// 查询设置
export const getMemberSettings = () => {
  return axios.request({
    url: '/membersetting/getMemberSettings',
    method: 'get'
  })
}
