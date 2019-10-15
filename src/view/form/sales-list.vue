<style>
  .ivu-col{display: inline-block;}
  .mlb{margin: 0 5px 10px 5px;}
  .ivu-col-span-12{width:200px}
  .mlr5{margin:0 5px}
</style>
<!--营业统计表-->
<template>
  <div style="margin: 25px;">
    选择日期范围：
    <i-col>
      <Date-picker v-model="startTime" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择日期" style="width: 140px" class="mlb"></Date-picker>
      —<Date-picker v-model="endTime" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择日期" style="width: 140px" class="mlb"></Date-picker>
    </i-col>
    <TimePicker v-model="rangeTime" format="HH:mm"  type="timerange" placement="bottom-end" placeholder="选择时间范围" style="width: 120px" class="mlb"></TimePicker>
    订单类型：
    <i-select v-model="orderState" style="width:140px" clearable>
      <i-option v-for="(item,index) in typeList" :key="index" :value="item.value">{{ item.label }}</i-option>
    </i-select>
    选择门店：
    <i-select :value="treeValue" placeholder="请选择" style="width:176px">
      <i-option v-for="item of list" :value="item.value" :key="item.value" style="display: none;">
        {{ item.title  }}
      </i-option>
      <Tree :data="treeData" @on-check-change="handleCheckChange" show-checkbox></Tree>
    </i-select>
    <i-button type="primary" icon="ios-search" class="mlr5" @click="search">查询</i-button>
    <i-button type="primary" icon="md-print" class="mlr5">打印</i-button>

    <Tabs type="card" v-model="tabValue">
      <TabPane label="按日期" name="1">
        <i-table border :columns="column1" :data="data1" :loading="loading" style="margin-top: 15px;text-align: center"></i-table>
        <Page :current="rqPageNum" :total="rqTotal" :page-size="pageSize" show-elevator show-total @on-change="rqOnPageChange"/>
      </TabPane>
      <TabPane label="按店铺" name="2">
        <i-table border :columns="column2" :data="data2"  :loading="loading" style="margin-top: 15px;text-align: center"></i-table>
        <Page :current="dpPageNum" :total="dpTotal" :page-size="pageSize" show-elevator show-total @on-change="dpOnPageChange"/>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import axios from '@/libs/api.request'
export default {
  data () {
    return {
      loading: false,
      rqPageNum: 1,
      rqTotal: 0,
      dpPageNum: 1,
      dpTotal: 0,
      pageSize: 10,
      tabValue: '1',
      list: [],
      rangeTime: [],
      typeList: [
        {
          label: '服务员订单',
          value: '1'
        },
        {
          label: '扫码点餐',
          value: '2'
        },
        {
          label: '外卖订单',
          value: '3'
        }
      ],
      orderState: '', // 选择订单状态
      startTime: '',
      endTime: '',
      column1: [
        {
          title: '日期',
          key: 'rq',
          align: 'center'
        },
        {
          title: '订单数',
          key: 'dds',
          align: 'center'
        },
        {
          title: '营业额（￥）',
          key: 'yye',
          align: 'center'
        },
        // {
        //   title: '优惠金额（￥）',
        //   key: 'yhje',
        //   align: 'center'
        // },
        {
          title: '抹零金额（￥）',
          key: 'mlje',
          align: 'center'
        },
        {
          title: '营业收入（￥）',
          key: 'yysr',
          align: 'center'
        },
        // {
        //   title: '快捷收入（￥）',
        //   key: 'kjsr',
        //   align: 'center'
        // },
        {
          title: '充值收入（￥）',
          key: 'czsr',
          align: 'center'
        },
        {
          title: '合计收入（￥）',
          key: 'hjsr',
          align: 'center'
        }

      ],
      column2: [
        {
          title: '城市',
          key: 'cs',
          align: 'center'
        },
        {
          title: '门店',
          key: 'md',
          align: 'center'
        },
        {
          title: '订单数',
          key: 'dds',
          align: 'center'
        },
        {
          title: '营业额（￥）',
          key: 'yye',
          align: 'center'
        },
        // {
        //   title: '优惠金额（￥）',
        //   key: 'yhje',
        //   align: 'center'
        // },
        {
          title: '抹零金额（￥）',
          key: 'mlje',
          align: 'center'
        },
        {
          title: '营业收入（￥）',
          key: 'yysr',
          align: 'center'
        },
        // {
        //   title: '快捷收入（￥）',
        //   key: 'kjsr',
        //   align: 'center'
        // },
        {
          title: '充值收入（￥）',
          key: 'czsr',
          align: 'center'
        },
        {
          title: '合计收入（￥）',
          key: 'hjsr',
          align: 'center'
        }

      ],
      data1: [], // 按日期
      data2: [], // 按店铺
      treeValue: '', // 选择的门店
      treeData: []
    }
  },
  created () {
    this.initPage()
    this.initParams()
  },
  methods: {
    initPage () {
      let value = ''
      let rangeTime = this.rangeTime
      rangeTime.forEach((item, index) => {
        value += `${item},`
      })
      let data = {
        rqPageNum: this.rqPageNum,
        dpPageNum: this.dpPageNum,
        pageSize: this.pageSize,
        startTime: this.startTime,
        endTime: this.endTime,
        rangeTime: value,
        orderState: this.orderState,
        physicalStoreIdList: this.treeValue
      }
      this.loading = true
      axios.request({
        method: 'GET',
        url: '/salesStatement/initPage',
        params: data
      }).then((res) => {
        if (res.data.success) {
          this.data1 = res.data.data.rqPageInfo.list
          this.rqTotal = res.data.data.rqPageInfo.total
          this.data2 = res.data.data.dpPageInfo.list
          this.dpTotal = res.data.data.dpPageInfo.total
        } else {
          this.warning('系统异常')
        }
      })
      this.loading = false
    },
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
    rqOnPageChange (val) {
      this.rqPageNum = val
      this.initPage()
    },
    dpOnPageChange (val) {
      this.dpPageNum = val
      this.initPage()
    },
    search () {
      this.dpPageNum = 1
      this.rqPageNum = 1
      this.initPage()
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
