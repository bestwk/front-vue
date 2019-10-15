<template>
  <div>
    <Card shadow>
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span="4">
          <Row :gutter="8">
            <Col span="6">
              <Button type="primary"  icon="ios-add"  @click="add" >添加客户</Button>
<!--              <Button type="primary" long icon="md-add" @click="addReport">添加报告</Button>-->
            </Col>
          </Row>
        </Col>
        <Col span="20">
          <Row :gutter="4" type="flex" justify="end" class="code-row-bg">

<!--            <Col span="6">-->
<!--              <Input v-model="tableParams.orderCode" placeholder="请输入订单号"></Input>-->
<!--            </Col>-->
            <Col span="4">
              <Input v-model="tableParams.servantsName" placeholder="请输入用户名"></Input>
            </Col>
            <Col span="4">
              <Input v-model="tableParams.phone" placeholder="请输入手机号"></Input>
            </Col>
            <Col span="6">
              <DatePicker v-model="rangeTime" type="datetimerange" placement="bottom-start" style="width: 300px"
                          placeholder="选择起止时间" format="yyyy-MM-dd HH:mm:ss" @on-clear="clearDate" @on-change="changeDate"></DatePicker>
            </Col>

            <Col span="2">
              <Button type="primary" icon="ios-search" @click="search">搜索</Button>
            </Col>
            <Col span="2">
              <Button type="primary" icon="md-refresh" @click="reload">刷新</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider/>
      <Row>
        <Table
          :border="true"
          ref="tables"
          :columns="tableColumns"
          :data="tagsList"
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
<!--    <inspection-report-modal-->
<!--      :inspectionReportId="inspectionReportId"-->
<!--      :inspectionReportModal="inspectionReportModal"-->
<!--      :orderCode="orderCode"-->
<!--      @on-modal-close="close">-->
<!--    </inspection-report-modal>-->

    <!--添加客户-->
    <Modal v-model="modal1" width="40%">
      <p slot="header">
        添加客户
      </p>
      <div class="center">
        <Form :model="operator" ref="operator" :rules="ruleValidate" :label-width="80" class="add_form">
          <FormItem label="姓名"  prop="userName">
            <Input v-model="operator.userName" />
          </FormItem>
          <FormItem label="企业名称"  prop="companyName">
            <Input v-model="operator.companyName" />
          </FormItem>
          <FormItem label="密码"  prop="password">
            <Input type="password" v-model="operator.password" />
          </FormItem>
          <FormItem label="手机号"  prop="phone">
            <Input v-model="operator.phone" />
          </FormItem>
          <FormItem prop="yzm">
            <Input  v-model="operator.yzm" style="width: 50%" placeholder="请输入验证码" @on-blur="checkyzm"/>
            <Button  style="width: 30%;margin-left: 20px" @click="getCode">{{yanzhengma}}</Button>
          </FormItem>

        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click="modal1 = false">取消</Button>
        <Button type="primary" :loading="selfModalLoading" @click="addUser">保存</Button>
      </div>

    </Modal>
    <Modal v-model="modal2" width="40%" >

      <p slot="header" >编辑客户</p>
      <Form :model="operator" :label-width="100">
<!--        <FormItem label="姓名：">-->
<!--          <Input v-model="operator.userName" ></Input>-->
<!--        </FormItem>-->
        <FormItem label="企业名称：">
          <Input v-model="operator.companyName" ></Input>
        </FormItem>
        <FormItem label="手机号：">
          <span>{{operator.phone}}</span>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="primary" @click="cancel">取消</Button>
        <Button type="primary" :loading="selfLoading"  @click="update()">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {queryAgentCustomList} from '../../api/agent-manage/agent-commission'
import axios from '@/libs/api.request'

export default {
  data () {
    const btcPassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入企业名称'))
      } else {
        axios.request({
          method: 'GET',
          url: '/user/com',
          params: {
            companyName: value
          }
        }).then((res) => {
          if (res.data.status) {
            callback()
          } else {
            callback(new Error(res.data.message))
          }
        })
      }
    }
    return {
      rangeTime: [],
      selection: [],
      total: 0,
      yanzhengma: '获取验证码',
      tagsList: [],
      modal1: false,
      modal2: false,
      mathCode: '',
      count: '',
      selfModalLoading: false,
      selfLoading: false,
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        servantsName: '',
        phone: '',
        beginTime: '',
        endTime: ''
      },
      ruleValidate: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        companyName: [
          { validator: btcPassCheck, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        yzm: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      operator: {
        userId: 0,
        state: '1',
        userName: '',
        companyName: '',
        phone: '',
        yzm: '',
        password: ''
      },

      tableColumns: [
        {title: '公司名称', key: 'companyName', align: 'center'},
        {title: '电话', key: 'phone', align: 'center'},
        {title: '订单数量', key: 'orderNum', align: 'center'},
        {title: '状态',
          key: 'companyState',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.companyState == 0 && h('div', '待认证'),
              params.row.companyState == 1 && h('div', '待审核'),
              params.row.companyState == 2 && h('div', '已审核'),
              params.row.companyState == 3 && h('div', '已驳回')
            ])
          }},

        // {title: '姓名', key: 'userName', align: 'center'},
        // {title: '余额', key: 'agentBalance', align: 'center'},

        // {title:'订单',key:'createTime',align:'center'},
        {title: '注册时间',
          key: 'createTime',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm:ss'))
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 180,
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
                    this.operator = params.row
                    this.modal2 = true
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      disabled: false
    }
  },
  created () {
    this.initPage()
    this.initFormatter()
  },
  methods: {

    regCom () {
      axios.request({
        method: 'GET',
        url: '/user/com',
        params: {
          companyName: this.regform.companyName
        }
      }).then((res) => {
        if (res.data.status) {
          this.success(res.data.message)
        } else {
          this.warning(res.data.message)
        }
      })
    },
    cancel () {
      this.modal2 = false
      this.modal1 = false
    },
    update () {
      if (this.operator.userName == '') {
        this.warning('请输入客户名称')
        return false
      }
      if (this.operator.companyName == '') {
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
            data: this.operator
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
    addUser () {
      this.$refs['operator'].validate((valid) => {
        if (valid) {
          this.selfModalLoading = true
          axios.request({
            method: 'POST',
            url: '/agent/manage/custom/add',
            data: this.operator
          }).then((res) => {
            let data = res.data
            if (data == '' || data == null || data == undefined) {
              return
            }
            if (data.status) {
              this.modal1 = false
              this.operator = {}
              this.success(data.message)
              this.initPage()
            } else {
              this.warning(data.message)
            }
            this.selfModalLoading = false
          })
        }
      })
    },
    add () {
      // this.permsMethod()
      this.operator = {}
      this.modal1 = true
    },
    initPage () {
      this.tableParams = {
        pageSize: 10,
        pageNum: 1,
        servantsName: '',
        phone: '',
        beginTime: '',
        endTime: ''
      }
      this.initTable()
    },
    initTable () {
      this.disabled = false
      queryAgentCustomList(this.tableParams).then(res => {
        if (res.data.success) {
          console.log(res)
          this.tagsList = res.data.data.list
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
    getCode () {
      var phone = this.operator.phone
      if (!(/^1[34578]\d{9}$/.test(phone))) {
        this.success('手机号码有误，请重填')
        return false
      }
      var i = Math.random() * (999999 - 100000) + 100000
      var j = parseInt(i, 10)
      this.mathCode = j
      this.sendMesCode()
    },
    // 发送验证码短信
    sendMesCode () {
      var phone = this.operator.phone

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
      if (this.operator.yzm != this.mathCode) {
        this.operator.phone = ''
        this.operator.yzm = ''
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
