<template>
  <div>
    <Card shadow>
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span="4">
          <Row :gutter="8">
            <Col span="12">
              <Button type="primary" long icon="md-add" @click="addIncome">添加企业进件</Button>
            </Col>
          </Row>
        </Col>
        <Col span="20">
          <Row :gutter="4" type="flex" justify="end" class="code-row-bg">

            <!--            <Col span="6">-->
            <!--              <DatePicker v-model="rangeTime" type="datetimerange" placement="bottom-start" style="width: 300px"-->
            <!--                          placeholder="选择下单时间" format="yyyy-MM-dd HH:mm:ss" @on-clear="clearDate" @on-change="changeDate"></DatePicker>-->
            <!--            </Col>-->
            <Col span="4">
              <Input v-model="tableParams.parameter" placeholder="请输入商户名称/纳税人识别号"></Input>
            </Col>
            <Col span="4">
              <Select v-model="tableParams.state" placeholder="请选择状态" clearable @on-change="onclearState">
                <Option v-for="item in stateSelecter" :value="item.id"
                        :key="item.id">{{ item.name }}
                </Option>
              </Select>
            </Col>
            <!--            <Col span="3">-->
            <!--              <Input v-model="tableParams.paymentSerialNumber" placeholder="请输入支付流水号"></Input>-->
            <!--            </Col>-->
            <!--            <Col span="3">-->
            <!--              <Input v-model="tableParams.servantsName" placeholder="请输入用户或企业名称"></Input>-->
            <!--            </Col>-->
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
          :loading="loading"
          @on-selection-change="onSelectionChange">
          <div slot="header">
            <Row style="padding-left:20px;">
              <Col span="24">
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
    <Modal v-model="intoModel" title="详情" fullscreen>
      <Form ref="intoData"  :model="intoData" :label-width="120" :rules="ruleValidate">
        <FormItem label="企业名称" prop="companyCode">
          <Select v-model="intoData.companyCode" placeholder="请选择客户" :label-in-value="true" clearable @on-change="changeCompany">
            <Option v-for="item in companySelecter" :value="item.companyCode"
                    :key="item.companyCode">{{ item.companyName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="纳税人识别号" prop="nsrsbh">
          <Input v-model="intoData.nsrsbh" ></Input>
        </FormItem>
        <FormItem label="所属省份" prop="proviceCode">
          <Select v-model="intoData.proviceCode" placeholder="请选择省份" clearable @on-change="changeProvince">
            <Option v-for="item in proviceSelecter" :value="item.proviceCode"
                    :key="item.proviceCode">{{ item.proviceName }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="注册地址" prop="businessAddress">
          <Input v-model="intoData.businessAddress" ></Input>
        </FormItem>
        <FormItem label="电话" prop="tel">
          <Input v-model="intoData.tel" ></Input>
        </FormItem>
        <FormItem label="开户银行" prop="openBank">
          <Input v-model="intoData.openBank" ></Input>
        </FormItem>
        <FormItem label="银行帐号" prop="accountNo">
          <Input v-model="intoData.accountNo" ></Input>
        </FormItem>
        <FormItem label="联系人手机号" prop="phone">
          <Input v-model="intoData.phone" ></Input>
        </FormItem>
        <FormItem v-show="intoData.provinceno==44000000" label="默认商品名称" prop="defautGoods">
          <Input v-model="intoData.defautGoods" ></Input>
        </FormItem>
        <FormItem v-show="intoData.provinceno==44000000" label="项目名称" prop="xmmc">
          <Input v-model="intoData.xmmc" ></Input>
        </FormItem>
        <FormItem v-show="intoData.provinceno==44000000" label="开票人" prop="kpr">
          <Input v-model="intoData.kpr" ></Input>
        </FormItem>
        <FormItem v-show="intoData.provinceno==44000000" label="设备编号或白钥匙编号" prop="sbbh">
          <Input v-model="intoData.sbbh" ></Input>
        </FormItem>
        <FormItem v-show="intoData.provinceno==44000000" label="核心板编号" prop="hxbbh">
          <Input v-model="intoData.hxbbh" ></Input>
        </FormItem>

      </Form>
      <div slot="footer">
        <Button type="text" @click="goback">取消</Button>
        <Button type="primary" @click="saveData">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  queryAgentCompanyInto, queryCompanyList, queryProvinceList,
  queryTbintoByid, updataIncome,
  updateAgentCompanyIntoState
} from '../../api/agent-manage/agent-company'

export default {
  data () {
    const validateNotNull = (rule, value, callback) => {
      if (this.intoData.provinceno == 44000000) {
        if (value == '') {
          callback(new Error('请补全信息'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      selectStateForCompany: false,
      companySelecter: [],
      proviceSelecter: [],
      selection: [],
      total: 0,
      loading: false,
      tagsList: [],
      rangeTime: [],
      intoModel: false,
      intoData: {
        provinceno: '',
        companyCode: '',
        nsrsbh: '',
        proviceCode: '',
        businessAddress: '',
        tel: '',
        openBank: '',
        accountNo: '',
        phone: '',
        defautGoods: '',
        xmmc: '',
        kpr: '',
        sbbh: '',
        hxbbh: '',
        channelId: '658',
        clientName: '',
        salerMobile: ''
      },
      stateSelecter: [
        {id: '0', name: '未审核'},
        {id: '1', name: '已审核'}
      ],
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        parameter: '',
        state: ''
      },
      tableColumns: [
        {title: '企业名称', key: 'companyName', align: 'center'},
        {title: '纳税人识别号', key: 'nsrsbh', align: 'center'},
        {title: '注册地址', key: 'businessAddress', align: 'center'},
        {title: '开户银行', key: 'openBank', align: 'center'},
        {title: '银行账号', key: 'accountNo', align: 'center'},
        {title: '联系人手机号', key: 'phone', align: 'center'},
        {title: '税率', key: 'taxRate', align: 'center'},
        {title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.state == 0 && h('Button', {
                props: {
                  size: 'small',
                  type: 'primary'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.updateState(params.row.id)
                  }
                }
              }, '通过'),
              params.row.state == 1 && h('Button', {
                props: {
                  size: 'small',
                  type: 'success',
                  disabled: true
                },
                style: {
                  marginRight: '5px'
                }
              }, '已审核'),
              params.row.state != 1 && h('Button', {
                props: {
                  size: 'small',
                  type: 'info'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showDetails(params.row.id)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      disabled: false,
      ruleValidate: {
        companyCode: [
          { required: true, message: '请选择客户', trigger: 'blur' }
        ],
        nsrsbh: [
          { required: true, message: '请输入纳税人识别号', trigger: 'blur' }
        ],
        proviceCode: [
          { required: true, message: '请选择省份', trigger: 'blur' }
        ],
        businessAddress: [
          { required: true, message: '请输入注册地址', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        openBank: [
          { required: true, message: '请输入开户行', trigger: 'blur' }
        ],
        accountNo: [
          { required: true, message: '请输入银行账号', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系人手机号', trigger: 'blur' }
        ],
        defautGoods: [
          { validator: validateNotNull, trigger: 'blur' }
        ],
        xmmc: [
          { validator: validateNotNull, trigger: 'blur' }
        ],
        kpr: [
          { validator: validateNotNull, trigger: 'blur' }
        ],
        sbbh: [
          { validator: validateNotNull, trigger: 'blur' }
        ],
        hxbbh: [
          { validator: validateNotNull, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
      this.tableParams = {
        pageSize: 10,
        pageNum: 1,
        parameter: '',
        state: ''
      }
      this.initTable()
    },
    initTable () {
      this.disabled = false
      this.loading = true
      queryAgentCompanyInto(this.tableParams).then(res => {
        console.log(res)
        if (res.data.success) {
          this.tagsList = res.data.data.list
          this.total = res.data.data.total
        }
        this.loading = false
      })
    },
    addIncome () {
      this.selectStateForCompany = false
      this.intoData.companyCode = null
      this.intoModel = true
      this.$refs['intoData'].resetFields()
    },
    showDetails (id) {
      this.selectStateForCompany = true
      this.loading = true
      queryTbintoByid(id).then(res => {
        console.log(res)
        if (res.data.success) {
          this.intoModel = true
          this.intoData = res.data.data
          this.intoData.proviceCode = res.data.data.provinceno
        } else {
          this.$Message.error(res.data.message)
        }
        this.loading = false
      })
    },
    updateState (id) {
      this.$Modal.confirm({
        title: '提示信息',
        content: '确认审核通过本条记录?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let TBillInto = {
            id: id,
            state: 1
          }
          this.loading = true
          updateAgentCompanyIntoState(TBillInto).then(res => {
            console.log(res)
            if (res.data.success) {
              this.$Message.success(res.data.message)
              this.initTable()
            } else {
              this.$Message.error(res.data.message)
            }
            this.loading = false
          })
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
    onclearState () {
      if (typeof this.tableParams.billTypeCode === 'undefined') {
        this.$set(this.tableParams, 'billTypeCode', '')
        this.initTable()
      }
    },
    closeModel () {
      this.intoModel = false
      this.intoData = null
    },
    initProvince () {
      // 查询省份
      queryProvinceList().then(res => {
        console.log(res)
        this.proviceSelecter = res.data
      })
    },
    initCompanyList () {
      queryCompanyList().then(res => {
        console.log(res)
        this.companySelecter = res.data.data
      })
    },
    goback () {
      this.intoModel = false
      this.$refs['intoData'].resetFields()
    },
    saveData () {
      this.$refs.intoData.validate(valid => {
        if (!valid) {
          this.$Message.warning('请补全信息!')
        } else {
          updataIncome(this.intoData).then(res => {
            console.log(res)
            if (res.data.status) {
              this.$Message.success(res.data.message)
              this.goback()
              this.initTable()
            } else {
              this.$Message.error(res.data.message)
            }
          })
        }
      })
    },
    changeCompany (val) {
      this.intoData.clientName = val.label
    },
    changeProvince (val) {
      this.intoData.provinceno = val
      if (val != 44000000) {
        this.intoData.defautGoods = ''
        this.intoData.xmmc = ''
        this.intoData.kpr = ''
        this.intoData.sbbh = ''
        this.intoData.hxbbh = ''
      }
    }
  },
  watch: {
    intoModel: {
      deep: true,
      handler (val) {
        if (val) {
          this.initProvince()
          this.initCompanyList()
        }
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
