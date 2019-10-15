<style scoped>
  .search-cont{-webkit-box-flex: 4;flex: 4;border: 1px solid #e8e8e8;overflow: hidden;overflow-y: auto;height: 520px;margin-top: 15px;}
  .search-cont-bot{font-size: 16px;text-align: center;height: 45px;line-height: 45px;background: #ecf6fd;}
  .infor{display: flex;flex-flow: column;flex: 0 0 25%;justify-content: space-between;height: 30px;line-height: 30px;}
  ul{list-style: none}
  .search-cont li{display: flex;padding:15px;justify-content: space-between;border-bottom: 1px solid #dddfe3;}
  .bak_ground{background: #f9f9f9}
  .li_cont_mid{display: flex;flex-direction: column;width: 50%;margin-left:-75px;}
  .li_cont_right{display: flex;flex-direction: column;position: relative}
  .li_cont_right_top{text-align: center;background: #348EED;color:#fff;position: absolute;top:0;right:0;width:50px}
  .li_cont_right_bottom{position: absolute;bottom:0;right:0}
</style>

<template>
    <Tabs value="name1">
      <TabPane label="会员充值" name="name1">
        <!--左边查询框-->
        <div style="width: 25%;display: inline-block;padding: 0 25px; background: white;padding-top: 15px">
          <i-input placeholder="请输入会员手机号" style="width: 70%;"></i-input>
          <i-button type="primary" style="margin-left: 13%" @click="search">查询</i-button>
          <ul class="search-cont">
            <li v-for="(item,idx) in member" @click="selectClick(item,idx)" :class="idx==index?'bak_ground':''" :key="idx">
              <Avatar icon="ios-person" size="large" />
              <!--<img src="" alt="" style="width:45px;height:45px;border-radius: 50%">-->
              <div class="li_cont_mid">
                <span>{{item.vipName}}</span>
                <span>储值:{{item.balance}}</span>
              </div>
              <div class="li_cont_right">
                <span class="li_cont_right_top">会员</span>
                <span class="li_cont_right_bottom">{{item.phone}}</span>
              </div>
            </li>

          </ul>
          <div class="search-cont-bot">共匹配到 <span>{{total}}</span>位会员</div>
        </div>
        <!--右边个人信息-->
        <div style="float: right;width: 72%;">
        <div style="display: flex;flex:1 1 0%;height:50px;background: white">
          <div class="demo-avatar" style="width: 10%;margin: 1% 1% 1% 4%;">
            <Avatar icon="ios-person" size="large" />
          </div>

          <span class="infor">
            <span>会员等级:{{selectMember.vipGrade}}</span>
            <span>会员生日:{{selectMember.birthday}}</span>
          </span>
          <span class="infor">
            <span>会员手机号:{{selectMember.phone}}</span>
            <span>会员余额:{{selectMember.balance}}</span>
          </span>
          <span class="infor">
            <span>当前积分:{{selectMember.integral}}</span>
            <span>累计消费:{{selectMember.totalAmount==null?0:selectMember.totalAmount}}</span>
          </span>
        </div>
        <!--右边中间form-->
        <Form style="padding: 15px;background: white">
          <FormItem label="操作类型">
          <RadioGroup v-model="recharge.operatorType">
            <Radio label="1">充值</Radio>
            <Radio label="2">扣费</Radio>
          </RadioGroup>
        </FormItem>
          <FormItem v-show="recharge.operatorType==1" label="充值金额" style="width: 50%;display: inline-block">
            <InputNumber v-model="recharge.czAmount" placeholder="请填写充值金额" style="width: 75%"></InputNumber>
          </FormItem>
          <FormItem v-show="recharge.operatorType==2" label="扣费金额" style="width: 50%;display: inline-block">
            <InputNumber v-model="recharge.amount" placeholder="请填写扣费金额" style="width: 75%"></InputNumber>
          </FormItem>
          <FormItem v-show="recharge.operatorType==1" label="赠送金额" style="width: 50%;display: inline-block">
            <InputNumber v-model="recharge.zsAmount" placeholder="请填写赠送金额" style="width: 75%"></InputNumber>
          </FormItem>
          <FormItem v-show="recharge.operatorType==1" label="选择类型" style="width: 50%;display: inline-block">
            <Button type="primary">现金</Button>
          </FormItem>
          <FormItem v-show="recharge.operatorType==2" label="选择类型" style="width: 50%;display: inline-block">
            <Button type="primary">余额</Button>
          </FormItem>
          <FormItem label="操作员工" style="width: 50%;display: inline-block">
            <Select v-model="recharge.operatorId" style="width:200px">
              <Option v-for="item in employeesList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="备注信息">
            <Input v-model="recharge.notes" type="textarea" :autosize="{minRows: 2}" placeholder="请输入备注信息"></Input>
          </FormItem>
          <FormItem v-show="recharge.operatorType==1" label="合计充值" style="display: inline-block;width: 50%">
            <span>{{Number(recharge.czAmount)+Number(recharge.zsAmount)}}</span>
          </FormItem>
          <FormItem style="display: inline-block">
            <Button type="primary" @click="saveRecharge">确定</Button>
          </FormItem>
        </Form>
          <i-table border :content="self" :columns="column1" :data="rechargeList" style="margin-top: 15px;text-align: center"></i-table>
        </div>
      </TabPane>

      <TabPane label="充值消费记录" name="name2">
        <RadioGroup type="button" v-model="chooseNow" @on-change="searchAll">
          <Radio :label="1" >全部</Radio>
          <Radio :label="2" >最近7天</Radio>
          <Radio :label="3" >最近30天</Radio>
          <Radio :label="4" >最近90天</Radio>
        </RadioGroup>
        <Col style="margin-left: 15px;display: inline-block">
          <DatePicker type="daterange" v-model="timeArray"  confirm  placement="bottom-end" placeholder="请选择日期" @on-ok="searchAllByTime" style="width: 200px"></DatePicker>
        </Col>
        <Button type="primary" style="margin-left: 15px;" @click="exportData(1)"> 导出充值表</Button>
        <Button type="primary" style="margin-left: 15px;" @click="exportData(2)"> 导出消费表</Button>
        <i-table border :content="self" :columns="column2" ref="table" :data="allRechargeList" style="margin-top: 15px;text-align: center"></i-table>
        <Page :current="pageNumTwo" :total="totalTwo" :page-size="pageSizeTwo" show-elevator show-total @on-change="onPageChange"/>
      </TabPane>
    </Tabs>
</template>

<script>
import axios from '@/libs/api.request'
import excel from '@/libs/excel'
export default {
  data () {
    return {
      self: this,
      formItem: {
        input: '',
        select: '',
        radio: 'recharge',
        textarea: ''
      },
      column1: [
        {
          title: '操作类型',
          key: 'operatorType',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.operatorType == 1 && h('div', '充值'),
              params.row.operatorType == 2 && h('div', '扣费')
            ])
          }
        },
        {
          title: '支付类型',
          key: 'payType',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.operatorType == 1 && h('div', '现金'),
              params.row.operatorType == 2 && h('div', '余额')
            ])
          }
        },
        {
          title: '变动前余额',
          key: 'beforeBalance',
          align: 'center'
        },
        {
          title: '充值/消费',
          key: 'amount',
          align: 'center'
        },
        {
          title: '赠送金额',
          key: 'zsAmount',
          align: 'center'
        },
        {
          title: '变动后金额',
          key: 'afterBalance',
          align: 'center'
        },
        {
          title: '充值时间',
          key: 'creatAt',
          align: 'center'
        }, {
          title: '备注',
          key: 'notes',
          align: 'center'
        }
      ],
      //  第二页表格
      column2: [
        {
          title: '会员名称',
          key: 'vipName',
          align: 'center'
        },
        {
          title: '会员卡号',
          key: 'vipCode',
          align: 'center'
        },
        {
          title: '电话号码',
          key: 'phone',
          align: 'center',
          width: 120
        },
        {
          title: '操作类型',
          key: 'operatorType',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.operatorType == 1 && h('div', '充值'),
              params.row.operatorType == 2 && h('div', '扣费')
            ])
          }
        },
        {
          title: '支付类型',
          key: 'payType',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.operatorType == 1 && h('div', '现金'),
              params.row.operatorType == 2 && h('div', '余额')
            ])
          }
        },
        {
          title: '变动前余额',
          key: 'beforeBalance',
          align: 'center'
        },
        {
          title: '充值/消费',
          key: 'amount',
          align: 'center'
        },
        {
          title: '赠送金额',
          key: 'zsAmount',
          align: 'center'
        },
        {
          title: '变动后金额',
          key: 'afterBalance',
          align: 'center'
        },
        {
          title: '充值时间',
          key: 'creatAt',
          align: 'center'
        }, {
          title: '备注',
          key: 'notes',
          align: 'center'
        }
      ],
      timeArray: [],
      pageNum: 1,
      total: 0,
      pageSize: 10,
      /* 页签2分页 */
      pageNumTwo: 1,
      totalTwo: 0,
      pageSizeTwo: 10,
      member: [],
      selectMember: [],
      index: 0,
      recharge: {
        operatorType: '1',
        amount: 0,
        zsAmount: 0,
        czAmount: 0,
        payType: 1,
        operatorId: 0,
        notes: '',
        memberId: 0
      },
      employeesList: [],
      rechargeList: [],
      allRechargeList: [],
      chooseNow: 1,
      exportList: []

    }
  },
  created () {
    this.search()
    this.initEmployees()
    this.searchAll(1)
  },
  methods: {
    // 插入充值记录
    saveRecharge () {
      if (this.recharge.operatorType == 2) {
        if (this.selectMember.balance < this.recharge.amount) {
          this.warning('余额不足，扣费失败')
          return
        }
      }
      this.recharge.memberId = this.selectMember.id
      if (this.recharge.operatorType == 1) {
        this.recharge.amount = Number(this.recharge.czAmount) + Number(this.recharge.zsAmount)
      }
      console.log('recharge=', this.recharge)
      axios.request({
        method: 'POST',
        url: '/recharge',
        data: this.recharge
      }).then((res) => {
        if (res.data.success) {
          this.recharge = {
            operatorType: '1',
            amount: 0,
            zsAmount: 0,
            czAmount: 0,
            payType: 1,
            operatorId: 0,
            notes: '',
            memberId: 0
          }
          this.search()
          this.success('操作成功')
        } else {
          this.warning('系统异常')
        }
      })
    },
    // 查询充值记录
    initRecharge (memberId) {
      console.log('2222222')
      axios.request({
        method: 'GET',
        url: '/recharge',
        params: {memberId}
      }).then((res) => {
        if (res.data.success) {
          this.rechargeList = res.data.data
          console.log('rechargeList=', res)
        } else {
          this.warning('系统异常')
        }
      })
    },
    // 查询员工
    initEmployees () {
      axios.request({
        method: 'GET',
        url: '/recharge/employees',
        params: {}
      }).then((res) => {
        if (res.data.success) {
          this.employeesList = res.data.data
          console.log('employee=', res)
        } else {
          this.warning('系统异常')
        }
      })
    },
    // 点击
    selectClick (item, idx) {
      this.index = idx
      this.selectMember = this.member[idx]
      this.initRecharge(this.selectMember.id)
      console.log('res=', this.selectMember)
    },
    searchAllByTime () {
      this.pageNumTwo = 1
      let data = {
        startTime: this.timeArray[0],
        endTime: this.timeArray[1],
        pageNumTwo: this.pageNumTwo,
        pageSizeTwo: this.pageSizeTwo
      }
      axios.request({
        method: 'POST',
        url: '/recharge/searchAllByTime',
        data: data
      }).then((res) => {
        if (res.data.success) {
          this.totalTwo = res.data.data.total
          this.allRechargeList = res.data.data.list
        } else {
          this.warning('系统异常')
        }
      })
    },
    // 第二页签查询所有记录
    searchAll () {
      // console.log(this.chooseNow)
      this.timeArray = []
      this.pageNumTwo = 1
      let data = {
        pageNumTwo: this.pageNumTwo,
        pageSizeTwo: this.pageSizeTwo,
        type: this.chooseNow
      }
      axios.request({
        method: 'POST',
        url: '/recharge/searchAll',
        data: data
      }).then((res) => {
        if (res.data.success) {
          this.totalTwo = res.data.data.total
          this.allRechargeList = res.data.data.list
        } else {
          this.warning('系统异常')
        }
      })
    },
    onPageChange (val) {
      this.pageNumTwo = val
      let data = {
        pageNumTwo: this.pageNumTwo,
        pageSizeTwo: this.pageSizeTwo,
        type: this.chooseNow
      }
      axios.request({
        method: 'POST',
        url: '/recharge/searchAll',
        data: data
      }).then((res) => {
        if (res.data.success) {
          this.totalTwo = res.data.data.total
          this.allRechargeList = res.data.data.list
        } else {
          this.warning('系统异常')
        }
      })
    },
    search () {
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      axios.request({
        method: 'GET',
        url: '/member/getMemberList',
        params: data
      }).then((res) => {
        if (res.data.success) {
          this.member = res.data.data.list
          this.selectMember = this.member[this.index]
          console.log('selectMember=', this.selectMember)
          if (this.selectMember) {
            this.initRecharge(this.selectMember.id)
          }
          this.total = res.data.data.total
        } else {
          this.warning('系统异常')
        }
      })
    },
    success (msg) {
      this.$Message.success(msg)
    },
    warning (msg) {
      this.$Message.warning(msg)
    },
    reload: function () {
      this.$bus.$emit('content-reload')
    },
    exportData (type) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认导出数据吗？',
        onOk: () => {
          var data = {}
          if (this.timeArray.length > 0) {
            data = {
              startTime: this.timeArray[0],
              endTime: this.timeArray[1],
              type: type
            }
          } else {
            data = {
              chooseNow: this.chooseNow,
              type: type
            }
          }
          axios.request({
            method: 'POST',
            url: '/recharge/exportData',
            params: data
          }).then((res) => {
            this.exportList = res.data.data
            console.log(res)
            if (this.exportList.length) {
              const params = {
                title: ['会员名称', '会员卡号', '电话号码', '操作类型', '支付类型', '变动前余额', '充值/消费', '赠送金额', '变动后余额', '充值时间', '备注'],
                key: ['vipName', 'vipCode', 'phone', 'operatorName', 'payName', 'beforeBalance', 'amount', 'zsAmount', 'afterBalance', 'creatAt', 'notes'],
                data: this.exportList,
                autoWidth: true,
                filename: '臻票掌柜会员操作记录'
              }
              excel.export_array_to_excel(params)
            } else {
              this.$Message.info('表格数据不能为空！')
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>
