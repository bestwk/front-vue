import { getBreadCrumbList, setTagNavListInSessionstorage, getMenuByRouter, getTagNavListFromSessionstorage, getHomeRoute, routeHasExist } from '@/libs/util'
import routers from '@/router/routers'
export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers),
    local: ''
  },
  getters: {
    menuList: (state, getters, rootState) => {
      console.log(state.role)
      return getMenuByRouter(routers, rootState.user.access)
    }
  },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
    },
    setTagNavList (state, list) {
      if (list) {
        state.tagNavList = [...list]
        setTagNavListInSessionstorage([...list])
      } else state.tagNavList = getTagNavListFromSessionstorage()
    },
    addTag (state, { route, type = 'unshift' }) {
      if (!routeHasExist(state.tagNavList, route)) {
        if (route.name === 'index' || route.name === 'home') {
          // 从导航列表中删除index 和 home
          state.tagNavList.splice(state.tagNavList.findIndex(item => item.name === 'index'), 1)
          state.tagNavList.splice(state.tagNavList.findIndex(item => item.name === 'home'), 1)
        }

        if (type === 'push') state.tagNavList.push(route)
        else {
          if (route.name === 'home' || route.name === 'index') state.tagNavList.unshift(route)
          else state.tagNavList.splice(1, 0, route)
        }
        setTagNavListInSessionstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      state.local = lang
    }
  }
}
