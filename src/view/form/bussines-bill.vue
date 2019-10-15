<style>
  .ivu-col{display: inline-block;}
  .ml15{margin: 0 5px 10px 5px;}
  .ivu-col-span-12{width:200px}
</style>
<!--营业对账-->
<template>
  <div style="margin: 25px;">
    <i-col>
      <Date-picker v-model="startTime" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px;margin: 0 5px 10px 0;"></Date-picker> —
      <Date-picker v-model="endTime" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px" class="ml15"></Date-picker>
    </i-col>
    <i-select :value="treeValue" placeholder="请选择" style="width:176px">
      <i-option v-for="item of list" :value="item.value" :key="item.value" style="display: none;">
        {{ item.title  }}
      </i-option>
      <Tree :data="treeData" @on-check-change="handleCheckChange" show-checkbox></Tree>
    </i-select>
    <i-button type="primary" style="margin: 0 5px;" icon="ios-search" @click="search">查询</i-button>
    <!--<i-button type="primary" style="margin: 0 5px;" icon="md-print">打印</i-button>-->
    <i-table border  :columns="columns" :data="data" :loading="loading" style="margin-top: 15px;text-align: center"></i-table>
    <i-table border  :columns="column" :data="data"  :loading="loading" style="margin-top: 15px;text-align: center"></i-table>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
export default {
  data () {
    return {
      loading: false,
      list: [],
      isShow: true,
      startTime: '',
      endTime: '',
      switch1: '',
      columns: [
        {
          title: '营业总额',
          key: 'yyze',
          align: 'center'
        },
        {
          title: '营业收入',
          key: 'yyze',
          align: 'center'
        },
        // {
        //   title: '优惠金额',
        //   key: 'discount',
        //   align: 'center'
        // },
        {
          title: '抹零',
          key: 'ml',
          align: 'center'
        }
      ],
      column: [
        {
          title: '订单数',
          key: 'dds',
          align: 'center'
        },
        {
          title: '堂食订单数',
          key: 'tsdds',
          align: 'center'
        },
        {
          title: '堂食订单金额',
          key: 'tsddje',
          align: 'center'
        },
        {
          title: '外卖订单数',
          key: 'wmdds',
          align: 'center'
        },
        {
          title: '外卖订单金额',
          key: 'wmddje',
          align: 'center'
        },
        {
          title: '单均',
          key: 'dj',
          align: 'center'
        },
        {
          title: '就餐人数',
          key: 'jcrs',
          align: 'center'
        },
        {
          title: '人均消费',
          key: 'rjxf',
          align: 'center'
        },
        {
          title: '桌台数',
          key: 'zts',
          align: 'center'
        },
        {
          title: '桌均',
          key: 'zj',
          align: 'center'
        }
      ],
      data: [],
      treeValue: '',
      treeData: []
    }
  },
  created () {
    this.initPage()
    this.initParams()
  },
  methods: {
    initParams () {
      axios.request({
        method: 'GET',
        url: '/bussessStatement/initParams',
        params: {}
      }).then((res) => {
        if (res.data.success) {
          this.treeData = res.data.data
        } else {
          this.warning('系统异常')
        }
      })
    },
    initPage () {
      let data = {
        startTime: this.startTime,
        endTime: this.endTime,
        physicalStoreIdList: this.treeValue
      }
      this.loading = true
      axios.request({
        method: 'GET',
        url: '/bussessStatement/initPage',
        params: data
      }).then((res) => {
        if (res.data.success) {
          this.data = res.data.data
        } else {
          this.warning('系统异常')
        }
      })
      this.loading = false
    },
    search () {
      this.initPage()
    },
    handleCheckChange (data) {
      let value = ''
      let title = ''
      this.list = []
      this.treeValue = ''
      data.forEach((item, index) => {
        if (item.value > 0) {
          value += `${item.value},`
          title += `${item.title},`
        }
      })
      value = value.substring(0, value.length - 1)
      title = title.substring(0, title.length - 1)
      this.list.push({
        value,
        title
      })
      this.treeValue = value
    },
    success (msg) {
      this.$Message.success(msg)
    },
    warning (msg) {
      this.$Message.warning(msg)
    }
  }
}
</script>
<style lang="less">
  .ivu-select-dropdown-list {
    padding-left: 5px;
  }
</style>
