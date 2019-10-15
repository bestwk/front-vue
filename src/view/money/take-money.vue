<template>
  <div>
    <Card shadow>
  <div>
              <Input v-model="tableParams.storeName" placeholder="请输入商铺名称" style="width: 18%;margin-right: 2%"></Input>

              <Input v-model="tableParams.userName" placeholder="请输入员工名称" style="width: 18%;margin-right: 2%"></Input>

              <Select v-model="tableParams.applystate" placeholder="请选择审核状态" clearable style="width:18%;margin-right:2%">
                <Option v-for="item in applystateList" :value="item.id"
                        :key="item.id">{{ item.value }}
                </Option>
              </Select>
  </div>
            <Date-picker :value="value1" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择日期" style="width: 18%;margin: 10px 2% 0 0" ></Date-picker>
            <Date-picker :value="value2" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择日期" style="width: 18%;margin: 10px 2% 0 0"></Date-picker>

          <Button type="primary" style="margin-right: 2%">查询</Button>
          <Button type="primary" style="margin-right: 2%">刷新</Button>
      <Divider/>
      <Row>
        <Table
          :border="true"
          ref="tables"
          :columns="tableColumns"
          :data="takeMoneyList"
          @on-selection-change="onSelectionChange">
          <div slot="header">
            <Row style="padding-left:20px;">
              <Col span="24">
                <!--                <Button icon="md-trash" :disabled="!disabled" @click="batchDelete">删除</Button>-->
                <!--                <Button icon="md-trash" :disabled="!disabled" @click="batchRecover">恢复</Button>-->
              </Col>
            </Row>
          </div>
          <div slot="loading">
            <Spin fix>
              <Icon type="ios-loading" size=54 class="admin-spin-icon-load"></Icon>
              <div>加载中...</div>
            </Spin>
          </div>
          <div slot="footer">
            <Row style="padding-left:20px;">
              <Col span="6">
              </Col>
              <Col span="18">
                <Row type="flex" justify="end">
                  <Col span="13">
                    <Page :current="tableParams.pageNum" :total="total" :page-size="tableParams.pageSize" show-elevator show-total @on-change="onPageChange"/>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Table>
      </Row>
    </Card>
    <!--添加员工-->
    <Modal v-model="modal1" width="40%" >
      <p slot="header">
        审核
      </p>
      <div class="center">
        <Row>
          <Col span="4">
            提现状态:
          </Col>
          <Col span="20" >
            <RadioGroup v-model="applystate">
              <Radio label="1">银行处理中</Radio>
              <Radio label="2">提现完成</Radio>
            </RadioGroup>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="text" @click="modal1 = false">取消</Button>
        <Button type="primary" :loading="selfModalLoading" @click="uodateState">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {queryUserList} from '../../api/user/user-list'
import axios from '@/libs/api.request'
export default {
  name: 'take-money',
  data () {
    return {
      applystateList: [
        {
          id: 1,
          value: '已审核'
        },
        {
          id: 2,
          value: '审核中'
        }
      ],
      applystate: 1, // 默认审核状态
      selection: [],
      total: 0,
      storeList: [],
      roleList: [
        { name: '店长', value: '0' },
        { name: '员工', value: '1' },
        { name: '经理', value: '2' }
      ],
      takeMoneyList: [
        {
          applyNumber: 1000,
          applyState: '1',
          applyName: 'wk',
          store: '百川大厦',
          applyAmount: '10000',
          applyTime: '2019-9-4',
          applyAccounts: '123456789',
          openBank: '石家庄长安区建设银行',
          applyPhone: '15227133803',
          Auditor: 'kw',
          AuditTime: '2019-9-4 ',
          finishTime: '2019-9-3'
        }
      ],
      modal1: false,
      mathCode: '',
      count: '',
      selfModalLoading: false,
      selfLoading: false,
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        userName: '',
        storeName: '',
        applyState: '',
        startTime: '',
        endTime: ''
      },
      tableColumns: [
        {title: '申请单号', key: 'applyNumber', align: 'center'},
        {title: '提现状态', key: 'applyState', align: 'center'},
        {title: '申请人姓名', key: 'applyName', align: 'center'},
        {title: '所属店铺', key: 'store', align: 'center'},
        {title: '提现金额', key: 'applyAmount', align: 'center'},
        {title: '申请时间', key: 'applyTime', align: 'center'},
        {title: '提现帐号', key: 'applyAccounts', align: 'center'},
        {title: '开户行', key: 'openBank', align: 'center'},
        {title: '申请人电话', key: 'applyPhone', align: 'center'},
        {title: '审核人', key: 'Auditor', align: 'center'},
        {title: '审核时间', key: 'AuditTime', align: 'center'},
        {title: '处理完成时间', key: 'finishTime', align: 'center'},

        // {title:'订单',key:'createTime',align:'center'},
        //   <i-switch v-model="formItem.switch" size="large">
        // <span slot="open">On</span>
        // <span slot="close">Off</span>
        // </i-switch>
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.id = params.row.id
                    this.modal1 = true
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.Reject(params.row.id)
                  }
                }
              }, '驳回')
            ])
          }
        }
      ],
      disabled: false
    }
  },
  created () {
    this.initPage()
    // this.initFormatter()
  },
  methods: {
    cancel () {
      this.modal2 = false
      this.modal1 = false
    },
    uodateState () {
      console.log(this.applystate)
    },
    // 驳回请求
    Reject (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要驳回吗',
        onOk: () => {
          Reject(id).then(res => {
            console.log(res.data, '====================')
            if (res.data.status === true) {
              this.initUserList()
              this.$Message.info(res.data.message)
            } else {
              this.$Message.warning('订阅失败')
            }
          })
        }
      })
    },
    update () {
      if (this.user.userName == '') {
        this.warning('请输入客户名称')
        return false
      }
      if (this.user.userName == '') {
        this.warning('请输入企业名称')
        return false
      }
      this.$Modal.confirm({
        title: '提示',
        content: '确认提交吗',
        onOk: () => {
          this.selfLoading = true
          axios.request({
            method: 'POST',
            url: '/agent/manage/custom/update',
            data: this.user
          }).then((res) => {
            let data = res.data
            if (data.status) {
              this.success(data.message)
              this.modal2 = false
              this.initPage()
            } else {
              this.warning(data.message)
              this.initPage()
            }
            this.selfLoading = false
          })
        },
        onCancel: () => {
        }
      })
    },
    initPage () {
      this.tableParams = {
        pageSize: 10,
        pageNum: 1,
        userName: ''
      }
      this.initTable()
    },
    initTable () {
      this.disabled = false
      queryUserList(this.tableParams).then(res => {
        if (res.data.success) {
          console.log(res)
          this.takeMoneyList = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },

    onSelectionChange (selection) {
      this.disabled = selection.length > 0
      this.selection = selection
    },
    onPageChange (val) {
      this.tableParams.pageNum = val
      this.initTable()
    },
    search () {
      this.initTable()
    },
    reload: function () {
      this.$bus.$emit('content-reload')
    },
    formatDate (timestramp) {
      return new Date(timestramp).Format('yyyy-MM-dd hh:mm:ss')
    },
    /** -------------------验证码--start---------------- */
    // 获取验证码之前先获取我们发放的随机数
    /* getCode () {
          var phone = this.user.phone
          if (!(/^1[34578]\d{9}$/.test(phone))) {
            this.success('手机号码有误，请重填')
            return false
          }
          var i = Math.random() * (999999 - 100000) + 100000
          var j = parseInt(i, 10)
          this.mathCode = j
          this.sendMesCode()
        }, */
    // 发送验证码短信
    sendMesCode () {
      var phone = this.user.phone

      if (!(/^1[34578]\d{9}$/.test(phone))) {
        this.success('手机号码有误，请重填')
        return false
      }
      // 进行发送验证码
      var number = this.mathCode
      axios.request({
        method: 'GET',
        url: '/agent/manage/custom/send',
        params: {phone: phone, number: number}
      }).then((res) => {
        if (res.data.status) {
          this.success(res.data.message)
          this.setTime()
        } else {
          this.success(res.data.message)
          return false
        }
      })
    },
    success (msg) {
      this.$Message.success(msg)
    },
    warning (msg) {
      this.$Message.warning(msg)
    },
    setTime () {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
            this.yanzhengma = this.count + 's'
          } else {
            clearInterval(this.timer)
            this.timer = null
            this.yanzhengma = '获取验证码'
            this.mathCode = ''
            this.count = ''
          }
        }, 1000)
      }
    },
    checkyzm () {
      if (this.user.yzm != this.mathCode) {
        this.user.phone = ''
        this.user.yzm = ''
        this.warning('验证码错误或者过期,请重新发送')
        return false
      }
    },
    /** -------------------验证码--end---------------- */
    initFormatter () {
      Date.prototype.Format = function (fmt) {
        let o = {
          'M+': this.getMonth() + 1, // 月份
          'd+': this.getDate(), // 日
          'h+': this.getHours(), // 小时
          'm+': this.getMinutes(), // 分
          's+': this.getSeconds(), // 秒
          'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
          'S': this.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
        }
        return fmt
      }
    },
    clearDate () {
      this.tableParams.beginTime = ''
      this.tableParams.endTime = ''
    },
    changeDate () {
      if (this.rangeTime.length > 1 && this.rangeTime[0] != '') {
        let beginTime = new Date(this.rangeTime[0]).toJSON()
        beginTime = new Date(+new Date(beginTime) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')

        let endTime = new Date(this.rangeTime[1]).toJSON()
        endTime = new Date(+new Date(endTime) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')

        this.tableParams.beginTime = beginTime
        this.tableParams.endTime = endTime
      }
    }
  }
}
</script>

<style scoped>
  .admin-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
