<template>
  <div>
    <Card>
      <span style="font-size: large;font-weight: bolder">基本信息</span>
      <Divider></Divider>
      <Row>
        <Col span="2" style="line-height: 32px">店铺名称:</Col>
        <Col span="22">
          <Input v-model="store.name"  style="width: 300px"></Input>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">店铺logo</Col>
        <Col span="22">
          <div style="position: relative">
            <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index" style="z-index: 2; overflow:hidden;float: left" @click="uploadImg">
              <img :src="item.url" style="width: 100px;height: 100px">
            </div>
            <Upload
                    ref="upload"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-success="handleSuccess"
                    :before-upload="handleBeforeUpload"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :action="sendImgUrl"
                    type="drag"
                    style="display: inline-block;width:100px; float: left" v-show="this.uploadList.length == 0">
              <div style="width: 100px;height:100px;line-height: 100px;float: left" >
                <Icon type="md-camera" size="100" ref="uploadIcon"></Icon>
              </div>
            </Upload>
          </div>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">扫码点餐开屏页:</Col>
        <Col span="22">
          <i-switch size="large" v-model="store.enabledWelcomeScreen" :true-value=0 :false-value=1>
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </Col>
      </Row>
      <br/>
      <Row>
        <Row>
          <Col span="2" style="line-height: 32px">上传开屏页图片</Col>
          <Col span="22">
            <div style="position: relative">
              <div class="demo-upload-list" v-for="(item,index) in uploadList2" :key="index" style="z-index: 1000; overflow:hidden;float: left" @click="uploadImg2">
                <img :src="item.url" style="width: 100px;height: 100px">
                <!--<div class="demo-upload-list-cover">-->
                <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
                <!--</div>-->
              </div>
              <Upload v-show="this.uploadList2.length == 0"
                      ref="upload2"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png']"
                      :max-size="2048"
                      :on-success="handleSuccess2"
                      :before-upload="handleBeforeUploadImg"
                      :on-format-error="handleFormatError"
                      :on-exceeded-size="handleMaxSize"
                      :action="sendImgUrl2"
                      type="drag"
                      style="display: inline-block;width:100px; float: left">
                <div style="width: 100px;height:100px;line-height: 100px;float: left" >
                  <Icon type="md-camera" size="100" ref="uploadIcon"></Icon>
                </div>
              </Upload>
            </div>
          </Col>
        </Row>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">餐饮类型:</Col>
        <Col span="22" style="line-height: 32px">
          {{store.cateringTypeName}}
          <!--<Input v-model="store.cateringTypeName" readonly style="width: 300px"></Input>-->
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">所在城市:</Col>
        <Col span="22" style="line-height: 32px">
          {{store.provinceName}}{{store.cityName}} {{store.districtName}}
          <!--<Input  v-model="store.city" readonly style="width: 300px"></Input>-->
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">店铺位置:</Col>
        <Col span="22" style="line-height: 32px">
          <Input v-model="store.address"  readonly style="width: 300px"></Input>
          &nbsp;&nbsp;<Button @click="openmodal" >获取位置</Button>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">联系电话:</Col>
        <Col span="22" style="line-height: 32px">
          {{store.phone}}
          <!--<Input v-model="store.phone" readonly style="width: 300px"></Input>-->
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">联系人:</Col>
        <Col span="22" style="line-height: 32px">
          {{store.manager}}
          <!--<Input v-model="store.userName" readonly style="width: 300px"></Input>-->
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">店铺描述(介绍):</Col>
        <Col span="22" style="line-height: 32px">
          <Input type="textarea" placeholder="请输入备注"  style="width: 300px" v-model="store.description" />
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="24">
          <Button type="warning" style="margin-left: 80px" @click="cancelSave">取消</Button>
          <Button type="primary" style="margin-left: 50px" @click="surelSave">保存</Button>
        </Col>
      </Row>
    </Card>

    <modal v-model="modal1" title="定位" width="1300px" style="margin: 15px;padding: 10px" footer-hide>
      <div>
        <Input v-model="posAddress"  style="width: 300px"><Icon type="ios-search" slot="suffix" @click="searchKeyword" /></Input>
      </div>
      <div id="container2" style="width:1250px;height:700px;">
      </div>
    </modal>
  </div>

</template>
<script>
import {getdizhi, getStore, updateStore} from '../../api/system/basic-info'

export default {
  name: 'basic-info',
  data () {
    return {
      store: {
        id: '',
        name: '',
        logo: null,
        welcomeScreenImage: null,
        enabledWelcomeScreen: 0,
        cateringTypeNameName: '',
        cateringTypeName: '',
        description: '',
        latitude: 0,
        longitude: 0
      },
      modal1: false,
      longitude: 0, // 经度
      latitude: 0, // 纬度
      posAddress: '',
      searchService: null,
      logoImage: null,
      welcomeImage: null,
      // 上传开屏图片
      uploadList: [],
      uploadList2: []

    }
  },
  created: function () {
    this.initstore()
    // this.initMap()
    // this.getMyLocation()
  },
  methods: {
    // 初始化方法
    initstore: function () {
      getStore().then(res => {
        if (res.data.success) {
          this.store = res.data.data
          if (this.store.logo != null) {
            this.uploadList.push({
              url: this.$config.baseUrl.dev + this.store.logo
            })
          }
          if (this.store.welcomeScreenImage != null) {
            this.uploadList2.push({
              url: this.$config.baseUrl.dev + this.store.welcomeScreenImage
            })
          }
          console.log(this.store)
        } else {
          this.$Message.error('未设置初始门店')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    searchKeyword () {
      let region = new qq.maps.LatLng(this.latitude, this.longitude)
      this.searchService.setPageCapacity(1)
      this.searchService.searchNearBy(this.posAddress, region, 50000)// 根据中心点坐标、半径和关键字进行周边检索。
    },
    openmodal () {
      this.modal1 = true
      this.getMyLocation()
      // this.latitude = this.store.latitude
      // this.longitude = this.store.longitude
      //  this.searchKeyword()
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
    },

    cancelSave: function () {
      this.initstore()
      this.uploadList = []
      this.uploadList2 = []
    },
    // 保存店铺信息
    surelSave: function () {
      this.uploadList = []
      this.uploadList2 = []
      updateStore(this.store).then(res => {
        if (res.data.success) {
          this.$Message.info('操作成功')
          this.initstore()
        } else {
          this.$Message.warning('操作失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //* *******************************************************图片上传************************************************************
    // 文件上传成功后的回调函数
    handleSuccess (res, file) {
      // alert(11)
      file.url = this.$config.baseUrl.dev + res.data[0]
      console.log('file.url=' + file.url)
      file.name = ''
      this.store.logo = res.data[0]
      console.log(this.store.logo)
    },
    // 文件上传成功后的回调函数
    handleSuccess2 (res, file) {
      // alert(11)
      file.url = this.$config.baseUrl.dev + res.data[0]
      console.log('file.url=' + file.url)
      file.name = ''
      this.store.welcomeScreenImage = res.data[0]
      console.log(this.store.welcomeScreenImage)
    },
    handleBeforeUpload (file) {
      // 创建一个 FileReader 对象
      let reader = new FileReader()
      // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
      // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
      // 读取文件作为 URL 可访问地址
      reader.readAsDataURL(file)
      const _this = this
      reader.onloadend = function (e) {
        file.url = reader.result
        _this.uploadList = []
        _this.uploadList.push(file)
      }
    },
    // 上传开屏图片
    handleBeforeUploadImg (file) {
      // this.welcomeImage = Image
      // console.log(Image)
      // this.store.welcomeScreenImage = window.URL.createObjectURL(Image)
      // return false
      // 创建一个 FileReader 对象
      let reader = new FileReader()
      // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
      // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
      // 读取文件作为 URL 可访问地址
      reader.readAsDataURL(file)
      const _this = this
      reader.onloadend = function (e) {
        file.url = reader.result
        _this.uploadList2 = []
        _this.uploadList2.push(file)
      }
    },
    // 验证文件的格式---OK
    handleFormatError (file) {
      this.$Notice.warning({ title: '文件格式不正确', desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。' })
    },
    // 验证文件的大小---OK
    handleMaxSize (file) {
      this.$Notice.warning({ title: '超出文件大小限制', desc: '文件 ' + file.name + ' 太大，不能超过 2M。' })
    },
    // 选完图片后在点击上传的处理时间
    uploadImg () {
      this.$refs.upload.handleClick()
    },
    uploadImg2 () {
      this.$refs.upload2.handleClick()
    }
  },
  computed: {
    // 图片上传的地址
    sendImgUrl () {
      // let URL = this.$config.baseUrl.upload + '/cmz/upload/image'
      let URL = this.$config.baseUrl.dev + '/upload/image'
      // console.log('图片上传的地址-this.$config.baseUrl.upload=' + URL)
      console.log(URL)
      return URL
    },
    sendImgUrl2 () {
      // let URL = this.$config.baseUrl.upload + '/cmz/upload/image'
      let URL = this.$config.baseUrl.dev + '/upload/image'
      // console.log('图片上传的地址-this.$config.baseUrl.upload=' + URL)
      console.log(URL)
      return URL
    }

  }
}
</script>

<style scoped>

</style>
