<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator"/>
          <language @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div>
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view  v-if="isRouterAlive"/>
            </keep-alive>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import { mapMutations, mapActions } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual, hasChild } from '@/libs/util'
import { forEach } from '@/libs/tools'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo.png'
import './main.less'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    User
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false,
      isRouterAlive: true
    }
  },
  computed: {
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      return this.$store.state.user.avatorImgPath
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () {
      let _this = this
      return _this.replaceMenus(_this.$store.getters.menuList)
    },
    local () {
      return this.$store.state.app.local
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    replaceMenus (list) {
      let _this = this
      let menus = []
      forEach(list, item => {
        // console.log('需要替换的分销商文字::::::::::::::', sessionStorage.fenxiaoshangRename)
        // console.log('需要替换的分销文字::::::::::::::', sessionStorage.fenxiaoRename)
        if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
          if (item.meta.title.indexOf('分销商') >= 0) {
            if (sessionStorage.fenxiaoshangRename !== '' && sessionStorage.fenxiaoshangRename != 'undefined') {
              item.meta.title = item.meta.title.replace('分销商', sessionStorage.fenxiaoshangRename)
            }
          }

          if (item.meta.title.indexOf('分销') >= 0) {
            if (sessionStorage.fenxiaoRename !== '' && sessionStorage.fenxiaoRename != 'undefined') {
              item.meta.title = item.meta.title.replace('分销', sessionStorage.fenxiaoRename)
            }
          }

          let obj = {
            icon: (item.meta && item.meta.icon) || '',
            name: item.name,
            meta: item.meta
          }
          if ((hasChild(item) || (item.meta && item.meta.showAlways))) {
            obj.children = _this.replaceMenus(item.children)
          }

          menus.push(obj)
        }
      })

      return menus
    },
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      let openName = ''
      if (type === 'all') {
        if (this.$store.getters.httpResult) {
          this.turnToPage('index')
          openName = 'index'
        } else {
          this.turnToPage('home')
          openName = 'home'
        }
      } else if (routeEqual(this.$route, route)) {
        if (type === 'others') {
          openName = route.name
        } else {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
          openName = nextRoute.name
        }
      }
      this.setTagNavList(res)
      this.$refs.sideMenu.updateOpenName(openName)
    },
    handleClick (item) {
      this.turnToPage(item)
    }
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute.matched)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route.matched)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    this.$bus.$on('content-reload', () => {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    })
    // 文档提示
    // this.$Notice.info({
    //   title: '想快速上手，去看文档吧',
    //   duration: 0,
    //   render: (h) => {
    //     return h('p', {
    //       style: {
    //         fontSize: '13px'
    //       }
    //     }, [
    //       '点击',
    //       h('a', {
    //         attrs: {
    //           href: 'https://lison16.github.io/iview-admin-doc/#/',
    //           target: '_blank'
    //         }
    //       }, 'iview-admin2.0文档'),
    //       '快速查看'
    //     ])
    //   }
    // })
  }
}
</script>
<style>
  .page-list-group .ivu-table-footer{
    height:120px !important;
  }
  .search-group .ivu-select-selection ,.search-group .ivu-input{
    border-radius: 0 !important;
    border-right:none;
    margin-right: -4px;
  }
  .search-group .ivu-btn{
    border-radius: 0 !important;
  }
  .search-group .ivu-date-picker{
    margin-right: -4px;
  }
  .table-group-list.ivu-row{
    border:1px solid #ddd;
    border-right: none;
  }
  .table-group-list.ivu-row .ivu-col{
    height:auto;
    padding:15px 10px;
    border-right:1px solid #ddd;
    margin-bottom: 0!important;
  }
  .shou_table{border: 1px solid #eeeeee;}
.shou_table tr td{border-right: 1px solid #eeeeee; padding: 5px;}
</style>
