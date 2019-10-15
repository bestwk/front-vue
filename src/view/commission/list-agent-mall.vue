<template>
  <div>
    <Card shadow>
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span="8">
          <Row :gutter="8">
            <Col span="6">
<!--              <Button type="primary" long icon="md-add" @click="addReport">添加报告</Button>-->
            </Col>
          </Row>
        </Col>
        <Col span="16">
          <Row :gutter="4" type="flex" justify="end" class="code-row-bg">

<!--            <Col span="6">-->
<!--              <Input v-model="tableParams.orderCode" placeholder="请输入订单号"></Input>-->
<!--            </Col>-->
            <Col span="6">
              <Input v-model="tableParams.servantsName" placeholder="请输入用户名"></Input>
            </Col>

            <Col span="3">
              <Button type="primary" icon="ios-search" @click="search">搜索</Button>
            </Col>
            <Col span="3">
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
  </div>
</template>

<script>
import {queryAgentUserList} from '../../api/agent-manage/agent-commission'

export default {
  data () {
    return {
      selection: [],
      total: 0,
      tagsList: [],
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        servantsName: ''
      },
      tableColumns: [
        {title: '微信头像',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.headUrl,
                  style: 'width: 50px;height: 50px;'
                }
              })
            ])
          }
        },
        {title: '公司名称', key: 'companyName', align: 'center'},
        {title: '微信昵称', key: 'nickName', align: 'center'},
        {title: '余额', key: 'agentBalance', align: 'center'},
        {title: '订单数量', key: 'orderNum', align: 'center'},
        {title: '电话', key: 'phone', align: 'center'},
        // {title:'订单',key:'createTime',align:'center'},
        {title: '注册时间',
          key: 'createTime',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', new Date(params.row.createTime).Format('yyyy-MM-dd hh:mm:ss'))
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
        servantsName: ''
      }
      this.initTable()
    },
    initTable () {
      this.disabled = false
      queryAgentUserList(this.tableParams).then(res => {
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
