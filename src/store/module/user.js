import { login, logout, getUserInfo, loginPlatform } from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    account: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    success: false,
    success2: false,
    companyCode: '',
    fenxiaoshangRename: '',
    fenxiaoRename: '',
    invoiced: {}
  },
  mutations: {
    setIvoiced (state, invoiced) {
      state.invoiced = invoiced
    },
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setAccount (state, account) {
      state.accout = account
    },
    setAccess (state, access) {
      state.access = access
    },
    setMessage (state, Message) {
      sessionStorage.setItem('Message', '')
      sessionStorage.setItem('Message', Message)
      state.Message = Message
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHttpResult (state, result) {
      sessionStorage.setItem('RoleMall', result)
      state.success = result
    },
    setHttpResult2 (state, result) {
      sessionStorage.setItem('RolePlatform', result)
      state.success2 = result
    },
    setCompanyCode (state, companyCode) {
      sessionStorage.setItem('companyCode', companyCode)
      state.companyCode = companyCode
    },
    setFenxiaoshangRename (state, fenxiaoshangRename) {
      sessionStorage.setItem('fenxiaoshangRename', '')
      sessionStorage.setItem('fenxiaoshangRename', fenxiaoshangRename)
      state.fenxiaoshangRename = fenxiaoshangRename
    },
    setFenxiaoRename (state, fenxiaoRename) {
      sessionStorage.setItem('fenxiaoRename', '')
      sessionStorage.setItem('fenxiaoRename', fenxiaoRename)
      state.fenxiaoRename = fenxiaoRename
    }
  },
  getters: {
    getIvoiced: state => {
      if (state.invoiced === '') {
        state.invoiced = sessionStorage.getItem('invoiced')
      }
      return state.invoiced
    },
    getAccess: state => {
      if (state.access === '') {
        state.access = sessionStorage.getItem('access')
      }
      return state.access
    },
    httpResult: state => {
      if (state.success !== sessionStorage.getItem('RoleMall')) {
        state.success = sessionStorage.getItem('RoleMall')
      }
      return state.success
    },
    httpResult2: state => {
      if (state.success2 !== sessionStorage.getItem('RolePlatform')) {
        state.success2 = sessionStorage.getItem('RolePlatform')
      }
      return state.success2
    },
    Message: state => {
      if (state.Message === '') {
        state.Message = sessionStorage.getItem('Message')
      }
      return state.Message
    },
    getCompanyCode: state => {
      if (state.companyCode === '') {
        state.companyCode = sessionStorage.getItem('companyCode')
      }
      return state.companyCode
    },
    getFenxiaoshangRename: state => {
      if (state.fenxiaoshangRename === '') {
        state.fenxiaoshangRename = sessionStorage.getItem('fenxiaoshangRename')
      }
      return state.fenxiaoshangRename
    },
    getFenxiaoRename: state => {
      if (state.fenxiaoRename === '') {
        state.fenxiaoRename = sessionStorage.getItem('fenxiaoRename')
      }
      return state.fenxiaoRename
    }
  },
  actions: {
    handleLogin ({commit}, {account, password}) {
      account = account.trim()
      sessionStorage.tagNaveList = []
      // sessionStorage.fenxiaoshangRename = ''
      // sessionStorage.fenxiaoRename = ''
      if (!window.localStorage) {
        console.log('浏览器不支持localstorage')
        return false
      } else {
        let storage = window.localStorage
        console.log(storage)
      }
      return new Promise((resolve, reject) => {
        login({
          account,
          password
        }).then(res => {
          commit('setHttpResult', res.data.success)
          if (res.data.success) {
            const data = res.data.data
            console.log(data)
            commit('setToken', data.token)
            commit('setAccess', data.list)
          } else {
            commit('setMessage', res.data.message)
          }
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 登录平台
    handlePlatformLogin ({commit}, {account, password}) {
      account = account.trim()
      sessionStorage.tagNaveList = []
      if (!window.localStorage) {
        console.log('浏览器不支持localstorage')
        return false
      } else {
        let storage = window.localStorage
        console.log(storage)
      }
      return new Promise((resolve, reject) => {
        loginPlatform({
          account,
          password
        }).then(res => {
          commit('setHttpResult2', res.data.success)
          if (res.data.success) {
            const data = res.data.data
            commit('setToken', data.token)
            commit('setAccess', data.list)
          } else {
            commit('setMessage', res.data.message)
          }
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 退出登录
    handleLogOut ({state, commit}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          // commit('setFenxiaoshangRename', '')
          // commit('setFenxiaoRename', '')
          commit('setHttpResult', false)
          commit('setHttpResult2', false)
          sessionStorage.tagNaveList = []
          // sessionStorage.fenxiaoshangRename = ''
          // sessionStorage.fenxiaoRename = ''
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({state, commit}) {
      console.log('拉取用户信息')
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(res => {
          const data = res.data
          /* commit('setAvator', data.avator)
            commit('setAccount', data.account)
            commit('setUserId', data.user_id)
            commit('setAccess', data.access) */
          commit('setAccess', data.data)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
