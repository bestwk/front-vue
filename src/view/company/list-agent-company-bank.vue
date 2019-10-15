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
                          placeholder="选择交易时间" format="yyyy-MM-dd HH:mm:ss" @on-clear="clearDate" @on-change="changeDate"></DatePicker>
            </Col>
            <Col span="3">
              <Input v-model="tableParams.parameter" placeholder="请输入企业/商品名称/操作人"></Input>
            </Col>
            <Col span="3">
              <Select v-model="tableParams.bankCode" placeholder="请选择银行" clearable @on-change="onClearBankCode">
                <Option v-for="item in bankCodeSelecter" :value="item.id"
                        :key="item.id">{{ item.name }}
                </Option>
              </Select>
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
  </div>
</template>

<script>
import {queryAgentBankList} from '../../api/agent-manage/agent-company'

export default {
  data () {
    return {
      loading: false,
      selection: [],
      total: 0,
      tagsList: [],
      rangeTime: [],
      bankCodeSelecter: [
        {id: '001', name: '中国银行'},
        {id: '002', name: '民生银行'},
        {id: '003', name: '浦发银行'},
        {id: '004', name: '泰隆银行'},
        {id: '006', name: '农行银行'},
        {id: '007', name: '浙商银行'},
        {id: '009', name: '招商银行'},
        {id: '010', name: '泰隆V2'}
      ],
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        parameter: '',
        bankCode: '',
        beginTime: '',
        endTime: ''
      },
      tableColumns: [
        {title: '企业名称', key: 'companyName', align: 'center'},
        {title: '交易流水号', key: 'svrId', align: 'center'},
        {title: '交易金额', key: 'amount', align: 'center'},
        {title: '交易后余额', key: 'balance', align: 'center'},

        {title: '付款人', key: 'acntName', align: 'center'},
        {title: '付款账号', key: 'acntNo', align: 'center'},
        {title: '付款人开户银行', key: 'bankName', align: 'center'},

        {title: '收款人', key: 'toAcntName', align: 'center'},
        {title: '收款账号', key: 'toAcntNo', align: 'center'},
        {title: '收款人开户银行', key: 'toBankName', align: 'center'},

        {title: '入账日期', key: 'txnDate', align: 'center'},
        {title: '入账时间', key: 'txnTime', align: 'center'},

        {title: '摘要', key: 'transferExplain', align: 'center'},
        {title: '交易类型',
          key: 'transferType',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              (params.row.transferType == '1') && h('div', '支出'),
              (params.row.transferType == '2') && h('div', '收入')
            ])
          }
        }
      ],
      disabled: false
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
        bankCode: '',
        beginTime: '',
        endTime: ''
      }
      this.initTable()
    },
    initTable () {
      this.loading = true
      this.disabled = false
      queryAgentBankList(this.tableParams).then(res => {
        console.log(res)
        if (res.data.success) {
          this.tagsList = res.data.data.list
          this.total = res.data.data.total
        }
        this.loading = false
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
    onClearBankCode () {
      if (typeof this.tableParams.bankCode === 'undefined') {
        this.$set(this.tableParams, 'bankCode', '')
        this.initTable()
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
