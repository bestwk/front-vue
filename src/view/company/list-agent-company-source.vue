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
                          placeholder="选择起止时间" format="yyyy-MM-dd HH:mm:ss" @on-clear="clearDate" @on-change="changeDate"></DatePicker>
            </Col>
            <Col span="3">
              <Input v-model="tableParams.parameter" placeholder="请输入企业/商品名称/操作人"></Input>
            </Col>
            <Col span="3">
              <Select v-model="tableParams.sourceState" placeholder="请选择状态" clearable @on-change="onclearSourceState">
                <Option v-for="item in sourceStateSelecter" :value="item.id"
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
<!--    <inspection-report-modal-->
<!--      :inspectionReportId="inspectionReportId"-->
<!--      :inspectionReportModal="inspectionReportModal"-->
<!--      :orderCode="orderCode"-->
<!--      @on-modal-close="close">-->
<!--    </inspection-report-modal>-->
  </div>
</template>

<script>
import {queryAgentSourceList} from '../../api/agent-manage/agent-company'

export default {
  data () {
    return {
      selection: [],
      total: 0,
      tagsList: [],
      rangeTime: [],
      sourceStateSelecter: [
        {id: '0', name: '未上链'},
        {id: '1', name: '已上链'},
        {id: '-1', name: '已删除'}
      ],
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        parameter: '',
        sourceState: '',
        beginTime: '',
        endTime: ''
      },
      tableColumns: [
        {title: '企业名称', key: 'companyName', align: 'center'},
        {title: '二维码信息', key: 'uuid', align: 'center'},
        {title: '商品名称', key: 'goodsName', align: 'center'},
        {title: '商品编码', key: 'goodsCode', align: 'center'},
        {title: '商品规格', key: 'goodsSpec', align: 'center'},
        {title: '批次号', key: 'batchNumber', align: 'center'},
        {title: '节点名称', key: 'nodeName', align: 'center'},
        {title: '城市名称', key: 'cityName', align: 'center'},
        {title: '经度', key: 'x', align: 'center'},
        {title: '纬度', key: 'y', align: 'center'},
        {title: '设备号', key: 'deviceMark', align: 'center'},
        {title: '操作人', key: 'userName', align: 'center'},
        {title: '创建时间', key: 'createTime', align: 'center'},
        {title: '状态',
          key: 'sourceState',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              (params.row.sourceState == 0) && h('div', '未上链'),
              (params.row.sourceState == 1) && h('div', '已上链'),
              (params.row.sourceState == -1) && h('div', '已删除')
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
        parameter: '',
        sourceState: '',
        beginTime: '',
        endTime: ''
      }
      this.initTable()
    },
    initTable () {
      this.disabled = false
      queryAgentSourceList(this.tableParams).then(res => {
        console.log(res)
        if (res.data.success) {
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
    onclearSourceState () {
      if (typeof this.tableParams.sourceState === 'undefined') {
        this.$set(this.tableParams, 'sourceState', '')
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
