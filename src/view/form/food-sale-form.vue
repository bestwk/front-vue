<style>
  .ivu-col{display: inline-block;}
  .mlb{margin: 0 5px 10px 5px;}
  .ivu-col-span-12{width:200px}
  .mlr5{margin:0 5px}
  p{color: #9ea7b4;}
</style>
<!--菜品销售-->
<template>
  <div style="margin: 25px;">
    <i-col>
      <Date-picker v-model="startTime" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px;margin: 0 5px 10px 0;"></Date-picker>
      —<Date-picker v-model="endTime" format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择日期" style="width: 200px" class="mlb"></Date-picker>
    </i-col>
    <i-select v-model="physicalStoreIdList" multiple style="width:200px" placeholder="请选择门店">
      <i-option v-for="(item,index) in physicalStoreList" :key="index" :value="item.id">{{ item.name }}</i-option>
    </i-select>
    <i-select v-model="catalogsIdList" multiple style="width:200px" placeholder="请选择分类">
      <i-option v-for="(item,index) in catalogsList" :key="index" :value="item.id">{{ item.name }}</i-option>
    </i-select>
    <i-button type="primary" icon="ios-search" class="mlr5" @click="search">查询</i-button>
    <Button type="primary" icon="md-cloud-download" :loading="exportLoading" @click="exportExcel">
      <span :disabled="exportDisabled" v-if="!exportLoading" >导出</span>
      <span v-else>正在导出，请稍后...</span>
    </Button>
    <p>销售数量：销售数量=单点数量=赠送数量+售卖数量</p>
    <p>赠送数量：套餐不能赠送单个菜品，所以赠送数量仅且只会包含单点</p>
    <p>单点销售总额：所有单点菜品订单菜品售价之和（优惠前价格）</p>
    <p>销售占比：销售总额 / 当前筛选下所有销售总额之和</p>
    <Tabs type="card"  v-model="tabValue">
      <TabPane label="按菜品" name="1">
        <i-table border  :columns="foodColumns" :data="foodData" :loading="loading" style="margin-top: 15px;text-align: center"></i-table>
        <Page :current="foodPageNum" :total="foodTotal" :page-size="pageSize" show-elevator show-total @on-change="foodOnPageChange"/>
      </TabPane>
      <TabPane label="按分类" name="2">
        <i-table border  :columns="tagColumns" :data="tagData" :loading="loading" style="margin-top: 15px;text-align: center"></i-table>
        <Page :current="tagPageNum" :total="tagTotal" :page-size="pageSize"  show-elevator show-total @on-change="tagOnPageChange"/>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
import excel from '@/libs/excel'
export default {
  data () {
    return {
      exportDisabled: false,
      loading: false,
      exportLoading: false, // 导出
      tabValue: '1',
      foodPageNum: 1,
      foodTotal: 0,
      pageSize: 10,
      tagPageNum: 1,
      tagTotal: 0,
      startTime: '',
      endTime: '',
      physicalStoreList: [], // 门店列表
      physicalStoreIdList: [], // 选中的门店列表id
      catalogsList: [], // 菜品分类列表
      catalogsIdList: [], // 选中的菜品分类id
      foodColumns: [
        {
          title: '菜品名称',
          key: 'dishesName',
          align: 'center'
        },
        {
          title: '菜品分类',
          key: 'catelogsName',
          align: 'center',
          width: 150
        },
        {
          title: '销售数量',
          key: 'dishesNum',
          align: 'center',
          width: 150
        },
        {
          title: '赠送数量',
          key: 'giveNum',
          align: 'center'
        },
        {
          title: '销售总额',
          key: 'subtotal',
          align: 'center'
        },
        {
          title: '销售占比',
          key: 'xszb',
          align: 'center'
        }
      ],
      foodData: [],
      tagColumns: [
        {
          title: '菜品分类',
          key: 'catelogsName',
          align: 'center'
        },
        {
          title: '销售数量',
          key: 'dishesNum',
          align: 'center',
          width: 150
        },
        {
          title: '赠送数量',
          key: 'giveNum',
          align: 'center',
          width: 150
        },
        {
          title: '销售总额',
          key: 'subtotal',
          align: 'center'
        },
        {
          title: '销售占比',
          key: 'xszb',
          align: 'center'
        }
        // {
        //   title: '操作',
        //   key: 'orderStatus',
        //   align: 'center'
        // }
      ],
      tagData: []
    }
  },
  created () {
    this.initPage()
    this.initParams()
  },
  methods: {
    initPage () {
      let data = {
        foodPageNum: this.foodPageNum,
        tagPageNum: this.tagPageNum,
        pageSize: this.pageSize,
        startTime: this.startTime,
        endTime: this.endTime,
        physicalStoreIdList: this.physicalStoreIdList.toString(),
        catalogsIdList: this.catalogsIdList.toString()
      }
      this.loading = true
      axios.request({
        method: 'GET',
        url: '/foodStatement/initPage',
        params: data
      }).then((res) => {
        if (res.data.success) {
          this.foodData = res.data.data.foodPage.list
          this.foodTotal = res.data.data.foodPage.total
          this.tagData = res.data.data.tagPage.list
          this.tagTotal = res.data.data.tagPage.total
        } else {
          this.warning('系统异常')
        }
      })
      this.loading = false
    },
    initParams () {
      axios.request({
        method: 'GET',
        url: '/foodStatement/initParams',
        params: {}
      }).then((res) => {
        if (res.data.success) {
          this.physicalStoreList = res.data.data.physicalStoreList
          this.catalogsList = res.data.data.catalogsList
        } else {
          this.warning('系统异常')
        }
      })
    },
    foodOnPageChange (val) {
      this.foodPageNum = val
      this.initPage()
    },
    tagOnPageChange (val) {
      this.tagPageNum = val
      this.initPage()
    },
    search () {
      this.foodPageNum = 1
      this.tagPageNum = 1
      this.initPage()
    },
    remove (index) {
      this.data.splice(index, 1)
    },
    success (msg) {
      this.$Message.success(msg)
    },
    warning (msg) {
      this.$Message.warning(msg)
    },
    exportExcel: function () {
      this.$Modal.confirm({
        title: '提示',
        content: '确认导出数据吗？',
        onOk: () => {
          this.exportLoading = true
          if (this.tabValue == '1') {
            if (this.foodData.length > 0) {
              const params = {
                title: ['菜品名称', '菜品分类', '销售数量', '赠送数量', '销售总额', '销售占比'],
                key: ['dishesName', 'catelogsName', 'dishesNum', 'giveNum', 'subtotal', 'xszb'],
                data: this.foodData,
                autoWidth: true,
                filename: '菜品统计'
              }
              excel.export_array_to_excel(params)
              this.exportLoading = false
            } else {
              this.$Message.info('表格数据不能为空！')
              this.exportLoading = false
            }
          } else {
            if (this.tagData.length > 0) {
              const params = {
                title: ['菜品分类', '销售数量', '赠送数量', '销售总额', '销售占比'],
                key: ['catelogsName', 'dishesNum', 'giveNum', 'subtotal', 'xszb'],
                data: this.tagData,
                autoWidth: true,
                filename: '分类统计'
              }
              excel.export_array_to_excel(params)
              this.exportLoading = false
            } else {
              this.$Message.info('表格数据不能为空！')
              this.exportLoading = false
            }
          }
        }
      })
    }
  }
}
</script>
