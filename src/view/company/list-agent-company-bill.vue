<template>
  <div>
    <Card shadow>
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span="4">
          <Row :gutter="8">
            <Col span="6">
<!--              <Button type="primary" long icon="md-add" @click="addReport">添加报告</Button>-->
            </Col>
          </Row>
        </Col>
        <Col span="20">
          <Row :gutter="4" type="flex" justify="end" class="code-row-bg">

            <Col span="6">
              <DatePicker v-model="rangeTime" type="datetimerange" placement="bottom-start" style="width: 300px"
                          placeholder="选择下单时间" format="yyyy-MM-dd HH:mm:ss" @on-clear="clearDate" @on-change="changeDate"></DatePicker>
            </Col>
            <Col span="3">
              <Input v-model="tableParams.servantsName" placeholder="请输入企业名称/发票号码"></Input>
            </Col>
            <Col span="3">
              <Select v-model="tableParams.billTypeCode" placeholder="请选择发票类型" clearable @on-change="onclearBillType">
                <Option v-for="item in billTypeCodeSelecter" :value="item.id"
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
    <Modal v-model="orderNumTrackModel" title="快递信息">
      <div v-html="mailInfo">
      </div>
    </Modal>
<!--    <inspection-report-modal-->
<!--      :inspectionReportId="inspectionReportId"-->
<!--      :inspectionReportModal="inspectionReportModal"-->
<!--      :orderCode="orderCode"-->
<!--      @on-modal-close="close">-->
<!--    </inspection-report-modal>-->
  </div>
</template>

<script>
import {queryAgentCompanyBillList, queryMailByOrderNum} from '../../api/agent-manage/agent-company'
import orderNumTrack from './components/orderNumTrack'
export default {
  components: {
    orderNumTrack
  },
  data () {
    return {
      selection: [],
      total: 0,
      tagsList: [],
      rangeTime: [],
      orderNumTrackModel: false,
      mailInfo: '',
      billTypeCodeSelecter: [
        {id: '007', name: '普通发票'},
        {id: '004', name: '专用发票'},
        {id: '026', name: '电子发票'}
      ],
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        servantsName: '',
        billTypeCode: '',
        beginTime: '',
        endTime: ''
      },
      /*
                    , {align: 'center',  minWidth:'150',title: '开票结果',templet: '#creat_result'}
                    , {field: 'errMsg', align: 'center', width:'100', title: '失败原因'}
                    , { align: 'center', title: '详情', width: 120, toolbar: '#xiangqing'}
        * */
      tableColumns: [
        {title: '企业名称', key: 'companyName', align: 'center', width: 120},
        {title: '发票类型',
          key: 'billTypeCode',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('div', [
              (params.row.billTypeCode == '007') && h('div', '普通发票'),
              (params.row.billTypeCode == '004') && h('div', '专用发票'),
              (params.row.billTypeCode == '026') && h('div', '电子发票')
            ])
          }
        },
        {title: '发票来源',
          key: 'invoiceType',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('div', [
              (params.row.invoiceType == '1') && h('div', '快捷开票'),
              (params.row.invoiceType == '2') && h('div', '扫码台'),
              (params.row.invoiceType == '3') && h('div', '二维码电子票'),
              (params.row.invoiceType == '4') && h('div', '接口开票')
            ])
          }
        },
        {title: '发票代码', key: 'oldBillCode', align: 'center', width: 120},
        {title: '发票号码', key: 'oldBillNum', align: 'center', width: 120},
        // {title: '终端标识', key: 'deviceNum', align: 'center',width:120},
        {title: '金额', key: 'sumBillPrice', align: 'center', width: 120},
        {title: '收票手机号', key: 'phoneSk', align: 'center', width: 120},
        {title: '收票邮箱', key: 'emailSk', align: 'center', width: 120},
        {title: '申请时间', key: 'creatDate', align: 'center', width: 160},
        {title: '交易编号', key: 'dealNumber', align: 'center', width: 120},
        {title: '用户类型',
          key: 'userType',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('div', [
              (params.row.userType == '0') && h('div', '接口开票'),
              (params.row.userType == '1') && h('div', '微信（商家）'),
              (params.row.userType == '2') && h('div', '微信（购方）'),
              (params.row.userType == '3') && h('div', '税控开票服务器'),
              (params.row.userType == '4') && h('div', '税控盘共享服务器')
            ])
          }
        },
        {title: '购货单位识别号', key: 'buyCompanyCode', align: 'center', width: 120},
        {title: '购货单位名称', key: 'buyCompanyName', align: 'center', width: 120},
        {title: '购货单位地址和电话', key: 'buyCompanyAdrTel', align: 'center', width: 120},
        {title: '购货单位银行账号', key: 'buyCompanyBankCode', align: 'center', width: 120},
        {title: '快递公司',
          key: 'com',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('div', [
              (params.row.orderNumTrack != '' && params.row.orderNumTrack != null && params.row.userType != '100') &&
                h('div', '顺丰速运')
            ])
          }
        },
        {title: '快递单号', key: 'orderNumTrack', align: 'center', width: 120},
        {title: '快递信息',
          key: 'orderNumTrack',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('div', [
              (params.row.orderNumTrack != '' && params.row.orderNumTrack != null && params.row.userType != '100') && h('Button', {
                props: {
                  size: 'small',
                  type: 'primary'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showOrderNumTrack(params.row.orderNumTrack)
                  }
                }
              }, '快递信息')
            ])
          }
        },
        {title: '收款人', key: 'userSk', align: 'center', width: 120},
        {title: '复核人', key: 'userFh', align: 'center', width: 120},
        {title: '开票人', key: 'userKp', align: 'center', width: 120},
        {title: '开票结果',
          key: 'creatResult',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('div', [
              params.row.creatResult == 0 && params.row.userType != '100' &&
                h('span', {
                  style: {
                    color: 'green'
                  }
                }, '请求开票成功'),
              params.row.creatResult == 1 && params.row.userType != '100' &&
                h('span', {
                  style: {
                    color: 'blue'
                  }
                }, '成功'),
              params.row.creatResult == 2 && params.row.userType != '100' &&
                h('span', {
                  style: {
                    color: 'red'
                  }
                }, '失败')
            ])
          }
        },
        {title: '失败原因', key: 'errMsg', align: 'center', width: 120},
        {title: '详情',
          key: 'xiangqing',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('div', [
              (params.row.userType != '100') && h('Button', {
                props: {
                  size: 'small',
                  type: 'primary'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showDetails(params.row)
                  }
                }
              }, '查看详情')
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
    initPage () {
      this.tableParams = {
        pageSize: 10,
        pageNum: 1,
        servantsName: '',
        billTypeCode: '',
        beginTime: '',
        endTime: ''
      }
      this.initTable()
    },
    initTable () {
      this.disabled = false
      queryAgentCompanyBillList(this.tableParams).then(res => {
        console.log(res)
        if (res.data.success) {
          this.tagsList = res.data.data.list
          this.total = res.data.data.total
        }
      })
    },
    showOrderNumTrack (orderNumTrack) {
      queryMailByOrderNum(orderNumTrack).then(res => {
        if (res.data.success) {
          this.mailInfo = res.data.data
          this.orderNumTrackModel = true
        } else {
          this.$Message.error('快递查询接口异常')
        }
      })
    },
    showDetails (row) {
      // this.$store.commit('setInvoiced',JSON.stringify(row))
      sessionStorage.setItem('invoiced', JSON.stringify(row))
      console.log(JSON.stringify(row))
      let routeUrl = this.$router.resolve({
        path: '/invoiced_detail'
      })
      window.open(routeUrl.href, '_blank')
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
    },
    onclearBillType () {
      if (typeof this.tableParams.billTypeCode === 'undefined') {
        this.$set(this.tableParams, 'billTypeCode', '')
        this.initTable()
      }
    },
    formatDate (timestramp) {
      return new Date(timestramp).Format('yyyy-MM-dd hh-mm-ss')
    },
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
    }
  }
}
</script>

<style scoped>
  .admin-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
