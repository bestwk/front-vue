<style>
  .ivu-col{display: inline-block;}
  .ml15{margin: 0 15px;}

</style>

<template>
  <div style="margin: 25px;">

    <Date-picker v-model="startTime" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择开始日期" style="width: 200px" class="ml15"></Date-picker>
    <Date-picker v-model="endTime" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择截止日期" style="width: 200px" class="ml15"></Date-picker>

    <Select v-model="orderStatus" style="width:200px" class="ml15" clearable>
      <Option v-for="(item,index) in stateList" :key="index" :value="item.value">{{ item.label }}</Option>
    </Select>
    <Input v-model="orderCode" placeholder="请输入订单号" style="width: 200px" class="ml15"></Input>
    <Button type="primary" class="ml15"  @click="search">查询</Button>
    <Button type="primary" icon="md-refresh" @click="reload">刷新</Button>
    <!--<Alert show-icon style="margin-top: 10px;">共1条服务员点餐订单信息</Alert>-->
    <Table border  :columns="columns" :data="data" :loading="loading" style="margin-top: 15px;text-align: center"></Table>
    <Page :current="pageNum" :total="total" :page-size="pageSize" show-elevator show-total @on-change="onPageChange"/>

    <Modal title="订单详情" :transfer="false" fullscreen :closable="false" v-model="detailModal">
      <detail-order :id="orderId"></detail-order>
    </Modal>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
import DetailOrder from '@/view/order-list/detail-order.vue'
export default {
  components: {
    DetailOrder
  },
  data () {
    return {
      loading: false,
      // 订单详情
      orderId: '',
      detailModal: false,

      orderPlacerType: 1, // 服务员订单
      pageNum: 1,
      pageSize: 10,
      total: 0,
      startTime: '', // 订单开始时间
      endTime: '', // 订单结束时间
      orderCode: '', // 订单号
      orderStatus: '', // 选中订单状态
      stateList: [
        {value: 0, label: '待确认'},
        {value: 1, label: '待支付'},
        {value: 2, label: '已支付'},
        {value: 3, label: '已失效'},
        {value: 4, label: '已弃单'},
        {value: 5, label: '已退单'},
        {value: 6, label: '待派送'},
        {value: 7, label: '已完成'}
      ],
      columns: [
        {
          title: '订单编号',
          key: 'orderCode',
          align: 'center'
        },
        {
          title: '实收金额',
          key: 'payAmount',
          align: 'center',
          width: 150
        },
        {
          title: '桌台',
          key: 'tableName',
          align: 'center',
          width: 150
        },
        {
          title: '下单人',
          key: 'orderPlacerName',
          align: 'center'
        },
        {
          title: '下单时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '订单状态',
          key: 'orderStatus',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.orderStatus == 0 && h('div', '待确认'),
              params.row.orderStatus == 1 && h('div', '待支付'),
              params.row.orderStatus == 2 && h('div', '已支付'),
              params.row.orderStatus == 3 && h('div', '已失效'),
              params.row.orderStatus == 4 && h('div', '已弃单'),
              params.row.orderStatus == 5 && h('div', '已退单'),
              params.row.orderStatus == 6 && h('div', '待派送'),
              params.row.orderStatus == 7 && h('div', '已完成'),
              params.row.orderStatus == 8 && h('div', '待收货')
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    this.orderId = params.row.id
                    this.detailModal = true
                  }
                }
              }, '详情')
            ])
          }
        }
      ],
      data: []
    }
  },
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        startTime: this.startTime,
        endTime: this.endTime,
        orderStatus: this.orderStatus,
        orderCode: this.orderCode,
        orderPlacerType: this.orderPlacerType
      }
      this.loading = true
      axios.request({
        method: 'GET',
        url: '/getOrderList',
        params: data
      }).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.warning('系统异常')
        }
      })
      this.loading = false
    },
    search () {
      this.pageNum = 1
      this.initPage()
    },
    reload () {
      this.pageNum = 1
      this.pageSize = 10
      this.startTime = ''// 订单开始时间
      this.endTime = '' // 订单结束时间
      this.orderCode = '' // 订单号
      this.orderStatus = ''
      this.initPage()
    },
    onPageChange (val) {
      this.pageNum = val
      this.initPage()
    },
    remove (index) {
      this.data.splice(index, 1)
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
