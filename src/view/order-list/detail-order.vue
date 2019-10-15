<style scoped>
  .page-header-group .ivu-steps{
    padding:20px;
  }
  .page-content-group .ivu-col-span-8{
    height: 300px;
    padding: 30px 20px;
    border: 1px solid #eee;
  }
  .page-content-group p{
    height: 26px;
    line-height: 26px;
    font-size: 12px;
    color: #666666;
  }
  .page-content-group p span{
    color: #000000;
  }
  .page-list-group .ivu-table-footer{
    height: 80px!important;
    text-align: right;
  }
  .page-list-group .ivu-table-footer p{
    height: 25px;
    line-height: 25px;
    text-align: right;
    padding-right: 20px;
  }
</style>
<template>
  <div>
    <Content :style="{padding: '0 10px'}">
      <Card shadow>
        <div style="height: 800px">
          <div class="page-header-group">
            <div class="page-header">
              当前位置：<span class="text-primary">订单详情</span>
            </div>
            <!--步骤条-->
            <Steps :current="stepCurrent" v-if="orderInfo.orderType == 1 ">
              <Step title="顾客下单" :content="orderInfo.createTime" ></Step>
              <Step title="订单确认" :content="orderInfo.createTime"></Step>
              <Step title="已完成" :content="orderInfo.finishTime"></Step>
            </Steps>

            <Steps :current="stepCurrent" v-if="orderInfo.orderType == 2 && orderInfo.orderStatus != 5 ">
              <Step title="下单时间" :content="orderInfo.createTime" ></Step>
              <Step title="支付时间" :content="orderInfo.payTime"></Step>
              <Step title="发货时间" :content="orderInfo.deliveryTime"></Step>
              <Step title="完成时间" :content="orderInfo.finishTime"></Step>
            </Steps>
          </div>
          <div class="page-content-group">
            <Row>
              <Col span="8" v-if="orderInfo.orderType == 1 ">
                <p>基本信息</p>
                <p>桌台号：<span>{{orderInfo.tableName}}</span></p>
                <p> 用餐人数： <span>{{orderInfo.peopleCount}}</span></p>
                <p> 下单人：<span>{{orderInfo.orderPlacerName}}</span></p>
                <p> 电话：<span>{{orderInfo.orderPlacerName}}</span></p>
                <p> 订单类型：<span>{{orderInfo.orderPlacerType == 1?'服务员订单':'用户自主下单'}}</span></p>
                <p> 下单时间：<span>{{orderInfo.createTime}}</span></p>
                <p> 订单金额：<span>{{orderInfo.payableAmount}}</span></p>
                <p> 订单状态：
                  <span v-if="orderInfo.orderStatus==0" style="color: red">待确认</span>
                  <span v-if="orderInfo.orderStatus==1" style="color: red">待支付</span>
                  <span v-if="orderInfo.orderStatus==2" style="color: red">已支付</span>
                  <span v-if="orderInfo.orderStatus==3" style="color: red">已失效</span>
                  <span v-if="orderInfo.orderStatus==4" style="color: red">已弃单</span>
                  <span v-if="orderInfo.orderStatus==5" style="color: red">已退单</span>
                  <span v-if="orderInfo.orderStatus==6" style="color: red">待派送</span>
                  <span v-if="orderInfo.orderStatus==7" style="color: red">已完成</span>
                  <span v-if="orderInfo.orderStatus==8" style="color: red">待收货</span>
                </p>
                <p> 备注信息：<span>{{orderInfo.buyerMemo}}</span></p>
              </Col>
              <!--外卖订单-->
              <Col span="8" v-if="orderInfo.orderType == 2 ">
                <p>基本信息</p>
                <p>地址：<span>{{orderInfo.consigneeName}}</span></p>
                <!--<p> 用餐人数： <span>{{orderInfo.peopleCount}}</span></p>-->
                <p> 下单人：<span>{{orderInfo.orderPlacerName}}</span></p>
                <p> 电话：<span>{{orderInfo.orderPlacerName}}</span></p>
                <p> 订单类型：<span>外卖订单</span></p>
                <p> 下单时间：<span>{{orderInfo.createTime}}</span></p>
                <p> 订单金额：<span>{{orderInfo.payableAmount}}</span></p>
                <p> 订单状态：
                  <span v-if="orderInfo.orderStatus==0" style="color: red">待确认</span>
                  <span v-if="orderInfo.orderStatus==1" style="color: red">待支付</span>
                  <span v-if="orderInfo.orderStatus==2" style="color: red">已支付</span>
                  <span v-if="orderInfo.orderStatus==3" style="color: red">已失效</span>
                  <span v-if="orderInfo.orderStatus==4" style="color: red">已弃单</span>
                  <span v-if="orderInfo.orderStatus==5" style="color: red">已退单</span>
                  <span v-if="orderInfo.orderStatus==6" style="color: red">待派送</span>
                  <span v-if="orderInfo.orderStatus==7" style="color: red">已完成</span>
                  <span v-if="orderInfo.orderStatus==8" style="color: red">待收货</span>
                </p>
                <p> 备注信息：<span>{{orderInfo.buyerMemo}}</span></p>
              </Col>

              <Col span="8">
                <p>支付信息</p>
                <p>付款方式：
                  <span v-if="orderInfo.payType==0">现金支付</span>
                  <span v-if="orderInfo.payType==1">微信支付</span>
                  <span v-if="orderInfo.payType==2">支付宝支付</span>
                </p>
                <p> 支付时间： <span> {{orderInfo.payTime}} </span></p>
                <p> 实付金额：<span>{{orderInfo.payAmount}}</span></p>
                <p> 店家备注：<span>{{orderInfo.salerMemo}}</span></p>
                <p> 优惠信息<span></span></p>
                <p> 赠菜优惠：<span>{{orderInfo.giveFoodAmount}}</span></p>
                <!--<p> 团购券：<span>{{orderInfo.storeActivityAmount}}</span></p>-->
                <!--<p> 优惠券：<span>{{orderInfo.couponAmount}}</span></p>-->
                <!--<p> 会员折扣：<span>{{orderInfo.vipAmount}}</span></p>-->
                <!--<p> 店铺折扣：<span>{{orderInfo.couponAmount}}</span></p>-->
                <p> 抹零金额：<span>{{orderInfo.smallMoneyAmount}}</span></p>
              </Col>
              <Col span="8">
                <p>订单状态 </p>
                <p>
                <span v-if="orderInfo.orderStatus==0" style="color: red">待确认</span>
                <span v-if="orderInfo.orderStatus==1" style="color: red">待支付</span>
                <span v-if="orderInfo.orderStatus==2" style="color: red">已支付</span>
                <span v-if="orderInfo.orderStatus==3" style="color: red">已失效</span>
                <span v-if="orderInfo.orderStatus==4" style="color: red">已弃单</span>
                <span v-if="orderInfo.orderStatus==5" style="color: red">已退单</span>
                <span v-if="orderInfo.orderStatus==6" style="color: red">待派送</span>
                <span v-if="orderInfo.orderStatus==7" style="color: red">已完成</span>
                <span v-if="orderInfo.orderStatus==8" style="color: red">待收货</span>
                </p>
               <Button @click="model1=true">订单操作日志</Button>
              </Col>
            </Row>
          </div>
          <!--商品信息-->
          <div class="page-list-group">
            <h3>商品信息</h3>
            <div style="margin-bottom:15px;">
              <Table ref="tables" border :columns="pageColumns" :data="orderInfo.deatailsList"></Table>
            </div>
          </div>
        </div>
      </Card>
    </Content>

    <Modal title="订单操作日志"  v-model="model1">
      <Table  :columns="logColumns" :data="orderInfo.orderActionLogList"></Table>
    </Modal>
  </div>
</template>

<script>
import axios from '../../libs/api.request'
export default {
  name: 'detail-order',
  props: {
    id: [String, Number]
  },
  data: function () {
    return {
      model1: false,
      orderId: 0,
      stepCurrent: 0,
      orderInfo: {},
      pageColumns: [
        {
          title: '商品名称',
          key: 'dishesName'

        },
        {
          title: '规格',
          key: 'specAttr'
        },
        {
          title: '加料',
          key: 'additive'
        },
        {
          title: '口味',
          key: 'dishesTag'
        },
        {
          title: '数量',
          key: 'dishesNum'
        },
        {
          title: '菜价',
          key: 'price'
        },
        {
          title: '总价',
          key: 'subtotal'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              params.row.status == 1 && h('div', '已确认'),
              params.row.status == 2 && h('div', '赠菜'),
              params.row.status == 3 && h('div', '退菜'),
              params.row.status == 4 && h('div', '部分退菜')
            ])
          }
        }
      ],
      logColumns: [
        {
          title: '时间',
          key: 'createAt'

        },
        {
          title: '操作员名称',
          key: 'userName'
        },
        {
          title: '日志详情',
          key: 'action'
        }
      ]
    }
  },
  watch: {// 刷新页面
    id: {
      deep: true,
      handler (val) {
        this.orderId = val
        if (this.orderId != 0 && this.orderId != '') {
          this.init()
        }
      }
    }
  },
  mounted () {
    // this.init()
  },
  methods: {
    init () { // 页面初始化
      this.setSpin(true)
      axios.request({
        method: 'GET',
        url: '/getOrderById',
        params: {orderId: this.orderId}
      }).then((res) => {
        if (res.data.success) {
          this.orderInfo = res.data.data
          let status = this.orderInfo.orderStatus
          let orderType = this.orderInfo.orderType
          if (orderType == 1) {
            if (status > 0 && status < 7) {
              this.stepCurrent = 1
            }
            if (status == 7) {
              this.stepCurrent = 2
            }
          } else { // 外卖订单
            if (status == 8) {
              this.stepCurrent = 2
            }
            if (status == 7) {
              this.stepCurrent = 3
            }
            if (status == 2) {
              this.stepCurrent = 1
            }
          }
        } else {
          this.warning('系统异常')
        }
      })
      this.setSpin(false)
    },
    setSpin (state) {
      if (state) {
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                'class': 'admin-spin-icon-load',
                props: {
                  type: 'ios-loading',
                  fix: true,
                  size: 54
                }
              }),
              h('div', '加载中...')
            ])
          }
        })
      } else {
        this.$Spin.hide()
      }
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
<style scoped>
  .admin-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
