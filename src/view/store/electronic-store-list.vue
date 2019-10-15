<template>
  <div>
    <Card shadow>
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span="4">
          <Row :gutter="8">
            <Col span="6">
              <Button type="primary"  icon="ios-add"  @click="add" >添加门店</Button>
            </Col>
          </Row>
        </Col>
        <Col span="20">
          <Row :gutter="4" type="flex" justify="end" class="code-row-bg">
            <Col span="4">
              <Input v-model="tableParams.name" placeholder="请输入门店名称"></Input>
            </Col>
            <Col span="4">
              <Input v-model="tableParams.phone" placeholder="请输入手机号"></Input>
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
          :data="storeList"
          :loading="loading"
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
    <!--添加门店-->
    <Modal v-model="modal1" width="40%" >
      <p slot="header">
        添加门店
      </p>
      <div class="center">
        <Form :model="store" ref="addstore" :rules="ruleValidate" :label-width="100" class="add_form">
          <FormItem label="门店名称" placeholder="请输入" prop="name">
            <Input v-model="store.name" />
          </FormItem>
          <FormItem label="店长" placeholder="请输入" prop="manager">
            <Input v-model="store.manager" />
          </FormItem>
          <FormItem label="联系电话" placeholder="电话号码既门店登录帐号" prop="phone">
            <Input v-model="store.phone" />
          </FormItem>
          <FormItem label="餐饮类型"  prop="cateringTypeCode">
            <Select v-model="store.cateringTypeCode" style="width:200px" label-in-value @on-change="cateringTypeChange">
              <Option v-for="item in cylxList" :value="item.code" :key="item.code">{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem label="门店类型"  prop="shopTypeCode">
            <Select v-model="store.shopTypeCode" style="width:200px" label-in-value @on-change="shopTypeChange">
              <Option v-for="item in mdlxList" :value="item.code" :key="item.code">{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem label="店铺位置"  prop="address">
            <Input prefix="ios-pin" v-model="store.address" disabled/> <Button @click="openmodal" >获取位置</Button>
          </FormItem>
          <FormItem label="店铺描述(可选)"   prop="remark">
            <Input type="textarea" placeholder="请输入备注" v-model="store.description" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click="modal1 = false">取消</Button>
        <Button type="primary" :loading="selfModalLoading" @click="addStore()">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modal2" width="40%" >
      <p slot="header" >编辑门店</p>
      <Form :model="store" ref="updatestore"  :rules="ruleValidate" :label-width="100" class="add_form">
        <FormItem label="门店名称" placeholder="请输入" prop="name">
          <Input v-model="store.name" />
        </FormItem>
        <FormItem label="店长" placeholder="请输入" prop="manager">
          <Input v-model="store.manager" />
        </FormItem>
        <FormItem label="联系电话" placeholder="电话号码既门店登录帐号" prop="phone">
          <Input v-model="store.phone" />
        </FormItem>
        <FormItem label="餐饮类型"  prop="cateringTypeCode">
          <Select v-model="store.cateringTypeCode" style="width:200px" label-in-value @on-change="cateringTypeChange">
            <Option v-for="item in cylxList" :value="item.code" :key="item.code">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="门店类型"  prop="shopTypeCode">
          <Select v-model="store.shopTypeCode" style="width:200px" label-in-value @on-change="shopTypeChange">
            <Option v-for="item in mdlxList" :value="item.code" :key="item.code">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="店铺位置"  prop="address">
          <Input prefix="ios-pin" v-model="store.address" disabled/> <Button @click="openmodal" >获取位置</Button>
        </FormItem>
        <FormItem label="店铺描述(可选)"   prop="remark">
          <Input type="textarea" placeholder="请输入备注" v-model="store.description" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="cancel">取消</Button>
        <Button type="primary" :loading="selfLoading"  @click="update">保存</Button>
      </div>
    </Modal>
    <Modal v-model="posModal" title="定位" width="1300px;height:900px" style="margin: 15px;padding: 10px" footer-hide>
      <div>
        <Input v-model="posAddress"  style="width: 300px"><Icon type="ios-search" slot="suffix" @click="searchKeyword" /></Input>
      </div>
      <div id="container2" style="width:1250px;height:700px;">
      </div>
    </Modal>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
import {getdizhi} from '../../api/system/basic-info'
export default {
  name: 'goelectronic-store-list',
  data () {
    return {
      loading: false,
      rangeTime: [],
      selection: [],
      total: 0,
      storeList: [],
      posModal: false,
      modal1: false,
      modal2: false,
      mathCode: '',
      count: '',
      selfModalLoading: false,
      selfLoading: false,
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        name: '',
        phone: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur,change', type: 'string' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur,change', type: 'string' }
        ],
        manager: [
          { required: true, message: '请输入店长名称', trigger: 'blur,change', type: 'string' }
        ],
        cateringTypeCode: [
          { required: true, message: '请选择餐饮类型', trigger: 'blur,change', type: 'string' }
        ],
        shopTypeCode: [
          { required: true, message: '请选择门店类型', trigger: 'blur,change', type: 'string' }
        ],
        address: [
          { required: true, message: '请输入店铺位置', trigger: 'blur,change', type: 'string' }
        ]
      },
      // 门店
      store: {},
      tableColumns: [
        {title: '门店名称', key: 'name', align: 'center'},
        {title: '今日销售额', key: 'jrsr', align: 'center'},
        {title: '营业状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.status == 1,
                  size: 'large'
                },
                scopedSlots: {
                  open: () => h('span', '营业'),
                  close: () => h('span', '打烊')
                },
                on: {
                  'on-change': (value) => {
                    if (value) {
                      this.updateStatus(1, params.row.id)
                    } else {
                      this.updateStatus(0, params.row.id)
                    }
                  }
                }
              })
            ])
          }
        },

        {title: '姓名', key: 'manager', align: 'center'},

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
                    let id = params.row.id
                    this.beforEdite(id)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      disabled: false,
      longitude: 0, // 经度
      latitude: 0, // 纬度
      locationName: '', // 小区
      posAddress: '', // 详细地址
      cylxList: [], // 餐饮类型
      mdlxList: []// 门店类型
    }
  },
  created () {
    this.initPage()
    this.initParams()
  },
  methods: {

    cancel () {
      this.modal2 = false
      this.modal1 = false
    },
    update () {
      this.$refs['updatestore'].validate((val) => {
        if (val) {
          this.$Modal.confirm({
            title: '提示',
            content: '确认提交吗',
            onOk: () => {
              this.selfLoading = true
              axios.request({
                method: 'POST',
                url: 'updatePhysicalStore',
                data: this.store
              }).then((res) => {
                let data = res.data
                if (data.success) {
                  this.success('操作成功')
                  // this.store = {}
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
        } else {
          this.warning('请完善信息')
        }
      })
    },
    updateStatus (status, id) {
      axios.request({
        method: 'POST',
        url: 'updatePhysicalStoreStatus',
        data: {
          id: id,
          status: status
        }
      }).then((res) => {
        let data = res.data
        if (data.success) {
          this.success('操作成功')
        } else {
          this.warning(data.message)
        }
      })
    },
    add () {
      // this.permsMethod()
      this.store = {}
      this.modal1 = true
    },
    initPage () {
      this.tableParams = {
        pageSize: 10,
        pageNum: 1,
        storeName: '',
        phone: ''
      }
      this.initTable()
    },
    initTable () {
      this.loading = true
      axios.request({
        method: 'GET',
        url: '/getPhysicalStoreList',
        params: this.tableParams
      }).then((res) => {
        if (res.data.success) {
          this.storeList = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.warning('系统异常')
        }
      })
      this.loading = false
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
    success (msg) {
      this.$Message.success(msg)
    },
    warning (msg) {
      this.$Message.warning(msg)
    },
    clearDate () {
      this.tableParams.beginTime = ''
      this.tableParams.endTime = ''
    },
    // 添加门店
    addStore () {
      this.$refs['addstore'].validate((val) => {
        if (val) {
          axios.request({
            method: 'POST',
            url: '/insertPhysicalStore',
            data: this.store
          }).then((res) => {
            if (res.data.success) {
              this.success('操作成功')
              this.modal1 = false
              this.store = {}
              this.initPage()
            } else {
              this.warning('系统异常')
            }
          })
        } else {
          this.warning('请完善信息')
        }
      })
    },
    beforEdite (id) {
      axios.request({
        method: 'GET',
        url: '/getPhysicalStoreById',
        params: {id}
      }).then((res) => {
        if (res.data.success) {
          this.store = res.data.data
          this.modal2 = true
        } else {
          this.warning('系统异常')
        }
      })
    },
    shopTypeChange (option) {
      if (option) {
        this.store.shopTypeCode = option.value
        this.store.shopTypeName = option.label
      }
    },
    cateringTypeChange (option) {
      if (option) {
        this.store.cateringTypeCode = option.value
        this.store.cateringTypeName = option.label
      }
    },
    initParams () {
      axios.request({
        method: 'GET',
        url: '/getParamsList',
        params: {}
      }).then((res) => {
        if (res.data.success) {
          this.mdlxList = res.data.data.mdlxList
          this.cylxList = res.data.data.cylxList
        } else {
          this.warning('系统异常')
        }
      })
    },
    searchKeyword () {
      let region = new qq.maps.LatLng(this.latitude, this.longitude)
      this.searchService.setPageCapacity(1)
      this.searchService.searchNearBy(this.posAddress, region, 50000)// 根据中心点坐标、半径和关键字进行周边检索。
    },
    openmodal () {
      this.posModal = true
      this.getMyLocation()
      // this.searchKeyword()
    },
    // 第一部分
    // 定位获得当前位置信息
    getMyLocation () {
      var geolocation = new qq.maps.Geolocation('S5UBZ-27AK2-Z7CUQ-CYBMM-AL7WZ-GZFIB', 'wk-web定位')
      geolocation.getIpLocation(this.showPosition, this.showErr)
    },
    showPosition (position) {
      this.latitude = position.lat
      this.longitude = position.lng
      // var adCode = position.adCode// 邮政编码
      // var nation = position.nation// 中国
      // var city = position.city // 城市
      // var addr = position.addr // 详细地址
      // this.address = city + addr
      // this.city = position.city
      this.setMap()
    },
    showErr () {
      this.getMyLocation()// 定位失败再请求定位，测试使用
    },
    // 第二部分
    // 位置信息在地图上展示
    setMap () {
      let that = this
      // 步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
      // 设置地图中心点
      var myLatlng = new qq.maps.LatLng(that.latitude, that.longitude)
      // 定义工厂模式函数
      var myOptions = {
        zoom: 13, // 设置地图缩放级别
        center: myLatlng, // 设置中心点样式
        mapTypeId: qq.maps.MapTypeId.ROADMAP // 设置地图样式详情参见MapType
      }
      // //获取dom元素添加地图信息
      var map = new qq.maps.Map(document.getElementById('container2'), myOptions)
      // 第三部分
      // 给定位的位置添加图片标注
      var marker = new qq.maps.Marker({
        position: myLatlng,
        map: map
      })
      // 给定位的位置添加文本标注
      /* var marker1 = new qq.maps.Label({
        position: myLatlng,
        map: map,
        content: '000'
      }) */
      //= ==================搜索
      qq.maps.event.addListener(map, 'click', function (event) {
        let lat = event.latLng.getLat()
        let lon = event.latLng.getLng()
        myLatlng = new qq.maps.LatLng(lat, lon)
        marker.setPosition(myLatlng)
        that.longitude = lon
        that.latitude = lat
        // vm.modifyPoint(lat,lon)

        // 掉接口查询坐标信息

        var data = {
          location: lat + ',' + lon,
          /* 换成自己申请的key */
          key: 'S5UBZ-27AK2-Z7CUQ-CYBMM-AL7WZ-GZFIB',
          get_poi: 0
        }
        getdizhi(data).then(res => {
          let data = res.data.result
          console.log(data)
          that.posAddress = data.address
          that.store.latitude = data.location.lat
          that.store.longitude = data.location.lng
          that.store.provinceName = data.address_component.province
          that.store.cityName = data.address_component.city
          that.store.districtName = data.address_component.district
          that.store.address = data.address
        }).catch(err => {
          console.log(err)
        })
      })
      let latlngBounds = new qq.maps.LatLngBounds()
      // 调用Poi检索类
      this.searchService = new qq.maps.SearchService({
        complete: function (results) {
          let pois = results.detail.pois
          marker.setPosition(pois[0].latLng)
          latlngBounds.extend(pois[0].latLng)
          map.fitBounds(latlngBounds)
          map.panTo(pois[0].latLng)
          that.latitude = pois[0].latLng.lat
          that.longitude = pois[0].latLng.lng
        }
      })
    }
  }
}
</script>

<style scoped>
  .admin-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
