<style>
  .ivu-col{display: inline-block;}
  .ml15{margin: 0 15px;}

  .card div{color:white}
  .f16{font-size: 16px}
  .mid{font-size: 14px;text-align: center}
  .card{width: 40%;height: 150px;margin: 2%;padding:15px;display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;flex-flow: column;-webkit-box-pack: justify;justify-content: space-between;}
  .cont{display: flex;-webkit-box-pack: justify;justify-content: space-between;}
  .form-list{width: 14.3%;display: inline-block;}
  .ivu-form-item{margin: 12px 0 12px 2%}
  .modal-form-item{display: inline-block;width: 48%}
  .modal-form-input{width: 60%}
  .modal-form-select{display:inline-block;width: 48%}
  .ivu-modal-content{width: 650px}
</style>

<template>
  <div style="margin: 25px;position: relative" v-show="cont">
    <!--顶部-->
    <div v-show="btnArr">
      <i-button type="primary" class="ml15" @click="addClick">新增会员</i-button>
      <Select v-model="search.physicalStoreId" placeholder="店铺查询" filterable clearable style="width: 170px;float: left;" class="ml15">
        <Option v-for="item in mdList" :value="item.id" :key="item.id">{{item.name}}</Option>
      </Select>
      <Select v-model="search.operatorId" placeholder="员工查询" filterable clearable style="width: 170px;float:left;" class="ml15">
        <Option v-for="item in ygList" :value="item.id" :key="item.id">{{item.name}}</Option>
      </Select>
      <Select v-model="search.status" placeholder="会员状态" filterable clearable style="width: 170px;float:left;" class="ml15">
        <Option value="0">禁用</Option>
        <Option value="1">启用</Option>
      </Select>
      <i-input v-model="search.phone" placeholder="请输入手机号" style="width: 170px; float: left" class="ml15"></i-input>
      <Date-picker v-model="search.startTime" @on-change="getStartTime" format="yyyy-MM-dd" type="date" placement="bottom-end" placeholder="开始日期" style="width: 170px; float: left" class="ml15"></Date-picker>
      <Date-picker  v-model="search.endTime" @on-change="getEndTime" format="yyyy-MM-dd" type="date" placement="bottom-end" placeholder="结束日期" style="width: 170px; float: left" class="ml15"></Date-picker>
      <i-button type="primary" style="float: left" class="ml15" @click="chaxun"> 查询</i-button>
      <i-button type="primary" style="float: left" class="ml15"  @click="chongzhi"> 重置</i-button>
    </div>
    <div class="cont" v-show="cardArr">
      <div class="card" style="background: linear-gradient(-90deg, #d982c7 0%, #c49dce 100%);">
        <div class="f16">累计消费储值</div>
        <div class="mid"> <span class="f16">{{zje}}</span>元</div>
        <div>总消费订单 <span class="f16">{{dds}}</span>笔，平均消费 <span class="f16">{{pjxf}}</span>元 </div>
      </div>
      <div class="card" style="background: linear-gradient(-90deg, #cec662 0%, #d9d27a 100%);">
        <div class="f16">会员消费排行TOP3</div>
        <div v-for="(item,index) in hyxfjl" :key="index" class="f16">
          名称：<span>{{item.name}}</span> ,消费金额：<span>{{item.xfje}}</span>元
        </div>
      </div>
    </div>
    <!--新增按钮modal-->
    <Modal v-model="modal1" :loading="addLoading" title="新增会员" @on-ok="ok" @on-cancel="cancel">
      <Form :model="addUser" ref="addUser"  :rules="ruleValidate">
        <FormItem label="手机号码" class="modal-form-item" prop="phone">
          <Input v-model="addUser.phone" placeholder="请输入手机号" class="modal-form-input"></Input>
        </FormItem>
        <FormItem label="会员名称" class="modal-form-item" prop="vipName">
          <Input v-model="addUser.vipName" placeholder="请输入会员名" class="modal-form-input"></Input>
        </FormItem>
        <FormItem label="开卡金额" class="modal-form-item" prop="balance">
          <Input v-model="addUser.balance" placeholder="请输入金额" class="modal-form-input"></Input>
        </FormItem>
        <FormItem label="开卡员工" class="modal-form-select" prop="operatorId">
          <Select v-model="addUser.operatorId" class="modal-form-input" filterable clearable>
            <Option v-for="item in ygList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="生日日期" class="modal-form-item" prop="birthday">
          <DatePicker format="yyyy-MM-dd" v-model="addUser.birthday" type="date" placeholder="选择日期"  style="width: 60%;"></DatePicker>
        </FormItem>
        <FormItem label="选择门店" class="modal-form-select" prop="physicalStoreId">
          <Select v-model="addUser.physicalStoreId"  class="modal-form-input" filterable clearable>
            <Option v-for="item in mdList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
    <Button type="text" size="large" @click="addCancel">取消</Button>
    <Button type="primary" size="large" @click="addOk">确定</Button>
     </div>
    </Modal>
    <!--编辑modal-->
    <Modal v-model="updateModal"  title="编辑会员">
      <Form :model="updateMember" ref="updateUser"  :rules="ruleValidate2">
        <FormItem label="手机号码" class="modal-form-item" prop="phone">
          <Input v-model="updateMember.phone"  class="modal-form-input"></Input>
        </FormItem>
        <FormItem label="会员名称" class="modal-form-item" prop="vipName">
          <Input v-model="updateMember.vipName"  class="modal-form-input"></Input>
        </FormItem>
        <FormItem label="开卡金额" class="modal-form-item" prop="balance">
          <Input v-model="updateMember.balance" class="modal-form-input"></Input>
        </FormItem>
        <FormItem label="开卡员工" class="modal-form-select">
          <Input v-model="updateMember.operatorName" class="modal-form-input" disabled></Input>
        </FormItem>
        <FormItem label="开卡日期" class="modal-form-item">
          <Input v-model="updateMember.vipTime" class="modal-form-input" disabled></Input>
        </FormItem>
        <FormItem label="生日日期" class="modal-form-item">
          <Input v-model="updateMember.birthday" class="modal-form-input" disabled></Input>
        </FormItem>
        <FormItem label="所属门店" class="modal-form-item">
          <Input v-model="updateMember.storeName" class="modal-form-input" disabled></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="ok">确定</Button>
      </div>
    </Modal>
    <Modal v-model="deleteModal" title="删除理由" @on-ok="deleteOk">
      <Form>
      <FormItem label="禁用理由" class="modal-form-item">
        <Input v-model="deleteUser.deleteReason" class="modal-form-input" ></Input>
      </FormItem>
      <FormItem label="操作员工" class="modal-form-item">
        <Input v-model="deleteUser.deleteOperatorId" class="modal-form-input" ></Input>
      </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="reasonModel"
      title="禁用理由">
      <p>{{reason}}</p>
    </Modal>
    <Modal v-model="initModel" title="提示" :mask-closable="flag" :closable="flag">
      <p style="color: red">请启用会员配置</p>
      <div slot="footer">
       <Button type="primary" size="large" @click="initOk">确定</Button>
      </div>
    </Modal>
    <!--表格数据-->
    <i-table border :content="self" :columns="columns" :data="data" style="margin-top: 15px;text-align: center" v-show="myTable"></i-table>
    <Page :current="pageNum" :total="total" :page-size="pageSize" show-elevator show-total @on-change="onPageChange"/>
  </div>
</template>
<script>
import axios from '@/libs/api.request'
export default {
  data () {
    return {
      flag: false,
      initModel: false,
      reasonModel: false,
      reason: '',
      search: {},
      hyxfjl: [],
      zje: 0,
      dds: 0,
      pjxf: 0,
      addLoading: false,
      updateLoading: false,
      ruleValidate: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur,change', type: 'string' }
        ],
        vipName: [
          { required: true, message: '请输入会员名称', trigger: 'blur,change', type: 'string' }
        ],
        balance: [
          { required: true, message: '请输入金额', trigger: 'blur,change', type: 'string' }
        ],
        operatorId: [
          { required: true, message: '请选择门操作员工', trigger: 'blur,change', type: 'number' }
        ],
        birthday: [
          { required: true, message: '请选择生日', trigger: 'blur,change', type: 'date' }
        ],
        physicalStoreId: [
          { required: true, message: '请选择店铺', trigger: 'blur,change', type: 'string' }
        ]
      },
      ruleValidate2: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur,change', type: 'string' }
        ],
        vipName: [
          { required: true, message: '请输入会员名称', trigger: 'blur,change', type: 'string' }
        ],
        balance: [
          { required: true, message: '请输入金额', trigger: 'blur,change', type: 'string' }
        ]
      },
      addUser: {},
      mdList: [],
      ygList: [],
      deleteModal: false,
      deleteUser: {},
      updateMember: {},
      updateModal: false,
      pageNum: 1,
      total: 0,
      pageSize: 10,
      self: this,
      show: false,
      btnArr: true,
      cardArr: true,
      myTable: true,
      modal1: false,
      value: '',
      delMember: false,
      cont: true,
      districtList: [],
      formItem: {
        input: '',
        select: '',
        date: ''
      },
      columns: [
        {
          title: '会员卡号',
          key: 'vipCode',
          align: 'center'
        },
        {
          title: '会员名称',
          key: 'vipName',
          align: 'center'
        },
        {
          title: '电话号码',
          key: 'phone',
          align: 'center',
          width: 150
        },
        {
          title: '会员等级',
          key: 'vipGrade',
          align: 'center'
        },
        {
          title: '当前积分',
          key: 'integral',
          align: 'center'
        },
        {
          title: '储值余额',
          key: 'balance',
          align: 'center'
        }, {
          title: '所属门店',
          key: 'storeName',
          align: 'center'
        },
        {
          title: '开卡时间',
          key: 'vipTime',
          align: 'center',
          width: 150
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.status == 1 && h('div', '启用'),
              params.row.status == 0 && h('div', '禁用')
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            if (params.row.status == 1) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.updateMember = params.row
                      this.updateModal = true
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.deleteUser.id = params.row.id
                      this.deleteModal = true
                    }
                  }
                }, '禁用')
              ])
            }
            if (params.row.status == 0) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      this.reason = params.row.deleteReason
                      this.reasonModel = true
                    }
                  }
                }, '原因'),
                h('Button', {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: () => {
                      let id = params.row.id
                      this.qiyong(id)
                    }
                  }
                }, '启用')
              ])
            }
          }
        }
      ],
      column2: [
        {
          title: '会员名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '会员卡号',
          key: 'cardId',
          align: 'center'
        },
        {
          title: '电话号码',
          key: 'phone',
          align: 'center',
          width: 150
        },
        {
          title: '储值余额',
          key: 'balance',
          align: 'center'
        },
        {
          title: '开卡时间',
          key: 'openCardTime',
          align: 'center',
          width: 150
        },
        {
          title: '删除时间',
          key: 'delTime',
          align: 'center',
          width: 150
        },
        {
          title: '操作员工',
          key: 'person',
          align: 'center'
        },
        {
          title: '删除原因',
          key: 'delReason',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('a', {
                props: {
                  type: 'text'
                }
              }, '明细'),
              h('a', {
                props: {
                  type: 'text'
                }
              }, '审核')
            ])
          }
        }
      ],
      data: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      axios.request({
        method: 'GET',
        url: '/member/init',
        params: {}
      }).then((res) => {
        if (res.data.success) {
          let flag = res.data.data
          if (flag) {
            this.initParams()
            this.initPage()
          } else { // 未开启会员配置
            this.initModel = true
          }
        } else {
          this.warning('系统异常')
        }
      })
    },
    initOk () {
      this.$router.push('list-agent-member-setting')
    },
    initParams () {
      axios.request({
        method: 'GET',
        url: '/member/initParams',
        params: {}
      }).then((res) => {
        if (res.data.success) {
          this.mdList = res.data.data.mdList
          this.ygList = res.data.data.ygList
          this.dds = res.data.data.dds
          this.zje = res.data.data.zje
          this.pjxf = res.data.data.pjxf
          this.hyxfjl = res.data.data.hyxfjl
        } else {
          this.warning('系统异常')
        }
      })
    },
    initPage () {
      this.search.pageNum = this.pageNum
      this.search.pageSize = this.pageSize
      axios.request({
        method: 'GET',
        url: '/member/getMemberList',
        params: this.search
      }).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.warning('系统异常')
        }
      })
    },
    chongzhi () {
      this.pageNum = 1
      this.search = {}
      this.initPage()
    },
    chaxun () {
      this.pageNum = 1
      this.initPage()
    },
    remove (index) {
      this.data.splice(index, 1)
    },
    reback () {
      this.show = false
    },
    sxChange () {
      this.show = !this.show
    },
    showDel () {
      this.btnArr = false
      this.cardArr = false
      this.myTable = false
      this.delMember = true
      this.show = false
    },
    addClick () {
      this.addUser = {}
      this.modal1 = true
    },
    addCancel () {
      this.modal1 = false
    },
    addOk () {
      this.$refs['addUser'].validate((val) => {
        if (val) {
          axios.request({
            method: 'POST',
            url: '/member/addMember',
            data: this.addUser
          }).then((res) => {
            if (res.data.success) {
              this.success('操作成功')
              this.modal1 = false
              this.initPage()
            } else {
              this.warning('系统异常')
              this.modal1 = false
            }
          })
        } else {
          this.warning('请完善信息')
        }
      })
    },
    ok () {
      this.$refs['updateUser'].validate((val) => {
        if (val) {
          this.$Modal.confirm({
            title: '提示',
            content: '确认修改吗',
            onOk: () => {
              axios.request({
                method: 'POST',
                url: '/member/updateById',
                data: this.updateMember
              }).then((res) => {
                if (res.data.success) {
                  this.success('操作成功')
                  this.updateModal = false
                  this.initPage()
                } else {
                  this.warning('系统异常')
                  this.updateModal = false
                }
              })
            },
            onCancel: () => {
              this.warning('操作取消')
              this.updateModal = false
            }
          })
        } else {
          this.warning('请完善信息')
        }
      })
    },
    cancel () {
      this.updateModal = false
      this.initPage()
    },
    qiyong (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认启用吗',
        onOk: () => {
          axios.request({
            method: 'GET',
            url: '/member/qiyong',
            params: {id: id}
          }).then((res) => {
            if (res.data.success) {
              this.success('操作成功')
              this.initPage()
            } else {
              this.warning('系统异常')
            }
          })
        },
        onCancel: () => {
          this.warning('操作取消')
          this.updateModal = false
        }
      })
    },
    onPageChange (val) {
      this.pageNum = val
      this.initPage()
    },
    getEndTime (dateTime) {
      this.search.endTime = dateTime
    },
    getStartTime (dateTime) {
      this.search.startTime = dateTime
    },
    deleteOk () {
      if (!this.deleteUser.deleteReason) {
        this.warning('请填写删除理由')
      }
      if (!this.deleteUser.deleteOperatorId) {
        this.warning('请选择操作员')
      }
      axios.request({
        method: 'GET',
        url: '/member/deleteById',
        params: this.deleteUser
      }).then((res) => {
        if (res.data.success) {
          this.success('操作成功')
          this.initPage()
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
    }
  }
}
</script>
