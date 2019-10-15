<style>
  .ivu-col{display: inline-block;}
  .ml15{margin: 0 15px;}

</style>

<template>
  <div style="margin: 25px;">

      <Date-picker v-model="startTime" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择开始日期" style="width: 200px" class="ml15"></Date-picker>
      <Date-picker v-model="endTime" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择截止日期" style="width: 200px" class="ml15"></Date-picker>

    <Select v-model="orderState" style="width:200px" class="ml15">
      <Option v-for="(item,index) in stateList" :key="index" :value="item.value">{{ item.label }}</Option>
    </Select>
    <Input v-model="orderNumber" placeholder="请输入订单号" style="width: 200px" class="ml15"></Input>
    <Button type="primary" class="ml15">查询</Button>
    <Alert show-icon style="margin-top: 10px;">共1条服务员点餐订单信息</Alert>
    <Table border  :columns="columns" :data="data" style="margin-top: 15px;text-align: center"></Table>
  </div>
</template>

<script>

export default {
  data () {
    return {
      startTime: '', // 订单开始时间
      endTime: '', // 订单结束时间
      orderNumber: '', // 订单号
      orderState: '', // 选中订单状态
      stateList: [
        {value: 0, label: '待确认'},
        {value: 1, label: '待支付'},
        {value: 2, label: '已支付'},
        {value: 3, label: '已失效'},
        {value: 4, label: '已弃单'},
        {value: 5, label: '已退单'},
        {value: 6, label: '待派送'}
      ],
      columns: [
        {
          title: '订单编号',
          key: 'num',
          align: 'center'
        },
        {
          title: '实收金额',
          key: 'money',
          align: 'center',
          width: 150
        },
        {
          title: '桌台',
          key: 'table',
          align: 'center',
          width: 150
        },
        {
          title: '下单人',
          key: 'orderPerson',
          align: 'center'
        },
        {
          title: '下单时间',
          key: 'orderCount',
          align: 'center'
        },
        {
          title: '订单状态',
          key: 'orderStatus',
          align: 'center'
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
                }
              }, '明细'),
              h('Button', {
                props: {
                  type: 'text'
                }
              }, '审核')
            ])
          }
        }
      ],
      data: [
        {
          num: 1,
          money: '200元',
          table: '2号桌',
          orderPerson: '李铭',
          orderCount: '2019-08-22 11:40:20',
          orderStatus: '已完成'
        },
        {
          num: 2,
          money: '130元',
          table: '3号桌',
          orderPerson: '小明',
          orderCount: '2019-08-26 11:45:20',
          orderStatus: '已完成'
        },
        {
          num: 3,
          money: '212元',
          table: '6号桌',
          orderPerson: '李力',
          orderCount: '2019-08-26 11:50:10',
          orderStatus: '已完成'
        }
      ]
    }
  },
  methods: {

    remove (index) {
      this.data.splice(index, 1)
    }
  }
}
</script>
