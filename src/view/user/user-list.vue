<template>
  <div>
    <Card shadow>
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span="4">
          <Row :gutter="8">
            <Col span="6">
              <Button type="primary"  icon="ios-add"  @click="add" >添加员工</Button>
              <!--              <Button type="primary" long icon="md-add" @click="addReport">添加报告</Button>-->
            </Col>
          </Row>
        </Col>
        <Col span="20">
          <Row :gutter="6" type="flex" justify="end" class="code-row-bg">
            <Col span="4">
              <Input v-model="tableParams.findName" placeholder="请输入员工名称"></Input>
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
          :data="userList"
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

    <!--添加员工-->
    <Modal v-model="modal1" width="40%" >
      <p slot="header">
        编辑员工
      </p>
      <div class="center">
        <Form :model="employees" ref="user" :rules="ruleValidate" :label-width="100" class="add_form">
          <FormItem label="姓名" placeholder="请输入姓名" prop="name">
            <Input v-model="employees.name" />
          </FormItem>
          <FormItem label="手机号" placeholder="请输入手机号" prop="phone">
            <Input v-model="employees.phone" />
          </FormItem>
          <FormItem label="所属门店" placeholder="请选择所属门店">

            <Select v-model="employees.physicalStoreId" style="width:200px" @on-change="storeChange">
              <Option v-for="item in storeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="员工号"  prop="type">
            <Input v-model="employees.empNo" />
          </FormItem>
          <FormItem label="职务"  prop="post">
            <Input v-model="employees.duty" />
          </FormItem>
          <FormItem label="生日"  prop="city">
            <DatePicker v-model="employees.birthday" type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="性别" placeholder="请输入" prop="gender">
            <RadioGroup v-model="employees.gender" type="button">
              <Radio label="1">男</Radio>
              <Radio label="2">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="角色"   prop="role">
            <RadioGroup v-model="employees.role" v-for="item in roleList" :value="item.value" :key="item.id" @on-change="roleChange">
              <Radio :label="item.code" >{{item.value}}</Radio>
            </RadioGroup>
          </FormItem>

        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click="modal1 = false">取消</Button>
        <Button type="primary" :loading="selfModalLoading" v-if="saveButton" @click="addUser">保存</Button>
        <Button type="primary" :loading="selfModalLoading" v-if="!saveButton" @click="saveEditData">修改</Button>
      </div>

    </Modal>
  </div>
</template>

<script>
import axios from '@/libs/api.request'

export default {
  name: 'gouser-list',
  data () {
    return {
      // rangeTime:[],
      selection: [],
      total: 0,
      yanzhengma: '获取验证码',
      storeList: [],
      roleList: [
      ],
      userList: [
      ],
      modal1: false,
      modal2: false,
      mathCode: '',
      count: '',
      selfModalLoading: false,
      selfLoading: false,
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        findName: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      employees: {
        id: 0,
        storeId: 1,
        name: '',
        phone: '',
        physicalStoreId: 0,
        physicalStoreName: '',
        empNo: '',
        duty: '',
        birthday: '',
        gender: '',
        role: 0,
        roleName: '',
        isEnabled: true
      },

      tableColumns: [
        {title: '姓名', key: 'name', align: 'center'},
        {title: '工号', key: 'empNo', align: 'center'},
        {title: '手机号', key: 'phone', align: 'center'},
        {title: '所属店铺', key: 'physicalStoreName', align: 'center'},
        {title: '角色', key: 'roleName', align: 'center'},
        {title: '状态',
          key: 'isEnabled',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.isEnabled,
                  size: 'large'
                },
                scopedSlots: {
                  open: () => h('span', '启用'),
                  close: () => h('span', '禁用')
                },
                on: {
                  'on-change': (value) => {
                    this.changeEnable(value, params.row)
                  }
                }
              })
            ])
          }
        },
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
                    this.modal1 = true
                    this.editData(params.row.id)
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
                    this.deleteUser(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      disabled: false,
      businessId: 1,
      findName: '',
      saveButton: true,
      editButton: false,
      shopName: ''
    }
  },
  created () {
    this.initPage()
    this.initStore()
    this.initRole()
  },
  methods: {
    // 保存编辑
    saveEditData () {
      axios.request({
        method: 'PUT',
        url: '/employees',
        data: this.employees
      }).then((res) => {
        if (res.data.success) {
          this.success(res.data.message)
          this.initPage()
          this.modal1 = false
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 编辑
    editData (id) {
      this.saveButton = false
      this.employees = {
        id: 0,
        storeId: 1,
        name: '',
        phone: '',
        physicalStoreId: 0,
        physicalStoreName: '',
        empNo: '',
        duty: '',
        birthday: '',
        gender: '',
        role: 0,
        roleName: '',
        isEnabled: true
      }
      axios.request({
        method: 'GET',
        url: '/employees/by-id',
        params: {
          id
        }
      }).then((res) => {
        if (res.data.success) {
          res.data.data.gender += ''
          this.employees = res.data.data
        } else {
          this.warning(res.data.message)
        }
      })
      // console.log("e==",params)
      // params.physicalStoreId+=''
      // params.gender +=''
      // this.employees = params
      // console.log("res=",this.employees.physicalStoreName)
      // console.log("res=",this.employees.gender)
      // console.log("res=",this.employees.role)
    },
    // 删除
    deleteUser (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认要删除吗',
        onOk: () => {
          axios.request({
            method: 'DELETE',
            url: '/employees/by-id',
            params: {
              id
            }
          }).then((res) => {
            if (res.data.success) {
              this.success(res.data.message)
              this.initPage()
            } else {
              this.warning(res.data.message)
            }
          })
        }
      })
    },
    // 启用禁用
    changeEnable (value, params) {
      console.log('value=', value)
      console.log('params=', params)
      if (value) {
        params.isEnabled = true
        this.employees = params
      }
      if (!value) {
        params.isEnabled = false
        this.employees = params
      }

      axios.request({
        method: 'PUT',
        url: '/employees',
        data: this.employees
      }).then((res) => {
        console.log('res=====', res)
        if (res.data.success) {
          this.success(res.data.message)
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 门店选择
    storeChange (e) {
      for (let i = 0; i < this.storeList.length; i++) {
        if (e == this.storeList[i].id) {
          this.employees.physicalStoreName = this.storeList[i].name
        }
      }
    },
    // 角色选择
    roleChange (e) {
      for (let i = 0; i < this.roleList.length; i++) {
        if (e == this.roleList[i].code) {
          this.employees.roleName = this.roleList[i].value
        }
      }
    },
    // 查询角色信息
    initRole () {
      axios.request({
        method: 'GET',
        url: '/employees/roles',
        params: {
          type: 'ygjs'
        }
      }).then((res) => {
        console.log('res=====', res)
        if (res.data.success) {
          this.roleList = res.data.data
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 查询门店信息
    initStore () {
      axios.request({
        method: 'GET',
        url: '/employees/business/info',
        params: {
          businessId: this.businessId,
          shopName: this.shopName
        }
      }).then((res) => {
        console.log('res=', res.data.success)
        if (res.data.success) {
          this.storeList = res.data.data
        } else {
          this.warning(res.data.message)
        }
      })
    },
    regCom () {
      axios.request({
        method: 'GET',
        url: '/user/com',
        params: {
          userName: this.regform.userName
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
    addUser () {
      console.log('res=', this.employees)
      if (!this.employees.physicalStoreId) {
        this.warning('请选择门店')
        return
      }
      this.$refs['user'].validate((valid) => {
        if (valid) {
          this.selfModalLoading = true
          axios.request({
            method: 'POST',
            url: '/employees',
            data: this.employees
          }).then((res) => {
            if (res.data.success) {
              this.modal1 = false
              this.success(res.data.message)
              this.initPage()
            } else {
              this.warning(res.data.message)
            }
            this.selfModalLoading = false
          })
        }
      })
    },
    add () {
      // this.permsMethod()
      this.saveButton = true
      this.user = {}
      this.modal1 = true
      this.employees = {
        id: 0,
        storeId: 1,
        name: '',
        phone: '',
        physicalStoreId: 0,
        physicalStoreName: '',
        empNo: '',
        duty: '',
        birthday: '',
        gender: '',
        role: 0,
        roleName: '',
        isEnabled: true
      }
    },
    initPage () {
      this.tableParams = {
        pageSize: 10,
        pageNum: 1,
        findName: ''
      }
      this.initTable()
    },
    initTable () {
      this.disabled = false
      axios.request({
        method: 'GET',
        url: '/employees/list',
        params: this.tableParams
      }).then((res) => {
        if (res.data.success) {
          console.log(res)
          this.userList = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.warning(res.data.message)
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
