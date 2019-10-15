<template>
  <div>
    <Card shadow>
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span="4">
          <Row :gutter="16">
            <Col span="16">
              <Select v-model="tableParams.physicalStoreId" style="width:200px" @on-change="searchById" >
                <Option v-for="item in storeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>
          </Row>
        </Col>
        <Col span="20">
          <Row :gutter="4" type="flex" justify="end" class="code-row-bg">
            <Col span="4">
              <Select v-model="tableParams.dishesCatalog" placeholder="请选择菜品分类" style="width:200px" clearable @on-change="catalogChange">
                <Option v-for="item in catalogList" :value="item.code" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <Input v-model="tableParams.dishesName" placeholder="请输入菜品名" ></Input>
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
        <Alert show-icon>共{{gqNumber}}个估清菜品</Alert>
        <Table
          :border="true"
          ref="tables"
          :columns="tableColumns"
          :data="dishesList"
          @on-selection-change="onSelectionChange">
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
import Language from '../main/components/language/language'
import axios from '@/libs/api.request'
export default {
  components: {Language},
  data () {
    return {
      rangeTime: [],
      selection: [],
      total: 0,
      yanzhengma: '获取验证码',
      dishesList: [],
      modal1: false,
      modal2: false,
      mathCode: '',
      count: '',
      selfModalLoading: false,
      selfLoading: false,
      groupName: '',
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        dishesCatalog: '',
        dishesName: '',
        physicalStoreId: 0
      },
      tableColumns: [
        {title: '菜品', key: 'nameCn', align: 'center'},
        {title: '菜品分类', key: 'catalogName', align: 'center'},
        {title: '价格',
          key: '',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', params.row.specification.salesPrice + '/' + params.row.unitName)
            ])
          }},
        {title: '排序', key: 'sort', align: 'center'},
        {title: '总销量', key: 'sales', align: 'center'},
        {title: '库存', key: 'totalStock', align: 'center'},
        {title: '参与打折',
          key: 'enabledDiscount',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.enabledDiscount == 1,
                  size: 'large'
                },
                scopedSlots: {
                  open: () => h('span', '是'),
                  close: () => h('span', '否')
                },
                on: {
                  'on-change': (value) => {
                    this.changeEnable(value, '1', params.row)
                  }
                }
              })
            ])
          }},
        {title: '销售状态',
          key: 'orderNum',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.dishesStatus,
                  size: 'large'
                },
                scopedSlots: {
                  open: () => h('span', '是'),
                  close: () => h('span', '否')
                },
                on: {
                  'on-change': (value) => {
                    this.changeEnable(value, '2', params.row)
                  }
                }
              })
            ])
          }},
        {title: '估清',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.status == 3,
                  size: 'large'
                },
                scopedSlots: {
                  open: () => h('span', '恢复'),
                  close: () => h('span', '估清')
                },
                on: {
                  'on-change': (value) => {
                    this.changeEnable(value, '3', params.row)
                  }
                }
              })
            ])
          }},
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
                    this.deleteData(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      disabled: false,
      // my
      districtList: [],
      addMenuWin: false,
      jySelfUploadList: [],
      gjSelfUploadList: [],
      vipDaySettingVOS: [],
      vipDateSettingVOS: [],
      // 图片
      uploadList: [],
      uploadPic: '',
      defaultList: [],
      selfGoodsInfoBaseVO: [],
      dishesCatalog: '',
      dishesName: '',
      dishes: {
        id: 0,
        nameCn: '',
        nameEn: '',
        mnemonicCode: '',
        sort: 0,
        image: '',
        catalogCode: '',
        catalogName: '',
        unitCode: '',
        unitName: '',
        typeCode: '',
        typeName: '',
        makeTime: '',
        enabledSpecifications: '1',
        enabledDiscount: '1',
        boxAmount: 0,
        totalStock: 0,
        dayStock: 0,
        orderRestriction: 0,
        personRestriction: 0,
        sales: 0,
        enabledDineIn: false,
        enabledTakeOut: false,
        dishesTag: '',
        specification: {
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        },
        specificationList: [{
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        }],
        additiveList: [{
          dishesId: 0,
          name: '',
          salesPrice: 0,
          costPrice: 0
        }]
      },
      catalogList: [],
      unitList: [],
      typeList: [],
      saveOrEdit: '1',
      tagWin: false,
      tagList: [],
      gqNumber: 0,
      storeList: [],
      businessId: 1,
      shopName: ''
    }
  },
  computed: {
    uploadUrl () {
      return this.$config.baseUrl.upload + '/upload/image'
    }
  },
  created () {
    this.initFormatter()
    this.initCatalog()
    this.initUnit()
    this.initType()
    this.initStore()
  },
  methods: {
    // 根据子店查询
    searchById () {
      this.search()
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
        if (res.data.success) {
          this.storeList = res.data.data
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 查询估清菜品
    initGqList () {
      axios.request({
        method: 'GET',
        url: '/dishes/GQ',
        params: {
          physicalStoreId: this.tableParams.physicalStoreId
        }
      }).then((res) => {
        if (res.data.success) {
          this.gqNumber = res.data.data.length
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 编辑保存
    editSaveData () {
      axios.request({
        method: 'PUT',
        url: '/dishes',
        data: this.dishes
      }).then((res) => {
        if (res.data.success) {
          this.success('修改成功')
          this.addMenuWin = false
          this.search()
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 编辑
    editData (id) {
      this.$refs.tabs.activeKey = 'name1'
      this.saveOrEdit = '2'
      this.dishes = {
        id: 0,
        nameCn: '',
        nameEn: '',
        mnemonicCode: '',
        sort: 0,
        image: '',
        catalogCode: '',
        catalogName: '',
        unitCode: '',
        unitName: '',
        typeCode: '',
        typeName: '',
        makeTime: '',
        enabledSpecifications: '1',
        enabledDiscount: '1',
        boxAmount: 0,
        totalStock: 0,
        dayStock: 0,
        orderRestriction: 0,
        personRestriction: 0,
        sales: 0,
        enabledDineIn: false,
        enabledTakeOut: false,
        dishesTag: '',
        specification: {
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        },
        specificationList: [{
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        }],
        additiveList: [{
          dishesId: 0,
          name: '',
          salesPrice: 0,
          costPrice: 0
        }]
      }
      // 查询by-id
      axios.request({
        method: 'GET',
        url: '/dishes/by-id',
        params: {
          id: id
        }
      }).then((res) => {
        if (res.data.success) {
          res.data.data.enabledDiscount += ''
          res.data.data.enabledSpecifications += ''
          this.dishes = res.data.data
        } else {
          this.warning(res.data.message)
        }
        this.addMenuWin = true
      })
    },
    tagChange (e) {
      this.dishes.dishesTag = e
    },
    searchTag () {
      this.initTags()
    },
    // 查询标签
    initTags () {
      axios.request({
        method: 'GET',
        url: '/dishes/tag',
        params: {
          name: this.groupName
        }
      }).then((res) => {
        if (res.data.success) {
          this.tagList = res.data.data
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 删除
    deleteData (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除吗',
        onOk: () => {
          axios.request({
            method: 'DELETE',
            url: '/dishes/by-id',
            params: {
              id: id
            }
          }).then((res) => {
            if (res.data.success) {
              this.search()
              this.success(res.data.message)
            } else {
              this.warning(res.data.message)
            }
          })
        },
        onCancel: () => {
        }
      })
    },
    // 标签
    addTaps () {
      this.tagWin = true
    },
    // tab点击
    tabClick () {
      // 保存
      if (this.saveOrEdit == '1') {
        this.jySelfUploadList = []
        this.dishes = {
          id: 0,
          nameCn: '',
          nameEn: '',
          mnemonicCode: '',
          sort: 0,
          image: '',
          catalogCode: '',
          catalogName: '',
          unitCode: '',
          unitName: '',
          typeCode: '',
          typeName: '',
          makeTime: '',
          enabledSpecifications: '1',
          enabledDiscount: '1',
          boxAmount: 0,
          totalStock: 0,
          dayStock: 0,
          orderRestriction: 0,
          personRestriction: 0,
          sales: 0,
          enabledDineIn: false,
          enabledTakeOut: false,
          dishesTag: '',
          specification: {
            dishesId: 0,
            name: '',
            salesPrice: 0,
            originalPrice: 0,
            costPrice: 0
          },
          specificationList: [{
            dishesId: 0,
            name: '',
            salesPrice: 0,
            originalPrice: 0,
            costPrice: 0
          }],
          additiveList: [{
            dishesId: 0,
            name: '',
            salesPrice: 0,
            costPrice: 0
          }]
        }
      }
      // 编辑
      if (this.saveOrEdit == '2') {

      }
    },
    // 状态改变
    changeEnable (value, type, params) {
      // 参与打折
      if (value && type == '1') {
        params.enabledDiscount = 1
        this.dishes = params
      }
      if (!value && type == '1') {
        params.enabledDiscount = 0
        this.dishes = params
      }
      // 销售状态
      if (value && type == '2') {
        params.dishesStatus = true
        this.dishes = params
      }
      if (!value && type == '2') {
        params.dishesStatus = false
        this.dishes = params
      }
      // 估清
      if (value && type == '3') {
        params.status = 3
        this.dishes = params
      }
      if (!value && type == '3') {
        params.status = 1
        this.dishes = params
      }
      axios.request({
        method: 'PUT',
        url: '/dishes/part',
        data: this.dishes
      }).then((res) => {
        if (res.data.success) {
          this.success(res.data.message)
          this.search()
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 查询
    search () {
      if (this.tableParams.physicalStoreId === 0) {
        this.warning('请选择门店')
        return
      }
      if (!this.tableParams.dishesCatalog) {
        this.tableParams.dishesCatalog = ''
      }

      this.selfModalLoading = true
      axios.request({
        method: 'GET',
        url: '/dishes/list',
        params: this.tableParams
      }).then((res) => {
        if (res.data.success) {
          this.selfModalLoading = false
          this.dishesList = res.data.data.list
          this.total = res.data.data.total
          this.initGqList()
        } else {
          this.warning(res.data.message)
          this.selfModalLoading = false
        }
      })
    },
    // 保存并添加
    saveAndAdd () {
      this.selfModalLoading = true
      if (this.dishes.nameCn == '') {
        this.warning('请填写菜品中文名')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.catalogCode == '') {
        this.warning('请选择菜品分类')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.unitCode == '') {
        this.warning('请选择菜品单位')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.specification.salesPrice == 0) {
        this.warning('请填写菜品价格')
        this.selfModalLoading = false
        return
      }
      axios.request({
        method: 'POST',
        url: '/dishes',
        data: this.dishes
      }).then((res) => {
        if (res.data.success) {
          this.success(res.data.message)
          this.selfModalLoading = false
          this.dishes = {
            id: 0,
            nameCn: '',
            nameEn: '',
            mnemonicCode: '',
            sort: 0,
            image: '',
            catalogCode: '',
            catalogName: '',
            unitCode: '',
            unitName: '',
            typeCode: '',
            typeName: '',
            makeTime: '',
            enabledSpecifications: '1',
            enabledDiscount: '1',
            boxAmount: 0,
            totalStock: 0,
            dayStock: 0,
            orderRestriction: 0,
            personRestriction: 0,
            sales: 0,
            enabledDineIn: false,
            enabledTakeOut: false,
            dishesTag: '',
            specification: {
              dishesId: 0,
              name: '',
              salesPrice: 0,
              originalPrice: 0,
              costPrice: 0
            },
            specificationList: [{
              dishesId: 0,
              name: '',
              salesPrice: 0,
              originalPrice: 0,
              costPrice: 0
            }],
            additiveList: [{
              dishesId: 0,
              name: '',
              salesPrice: 0,
              costPrice: 0
            }]
          }
          this.search()
        } else {
          this.warning(res.data.message)
          this.selfModalLoading = false
        }
      })
    },
    // 保存
    saveData () {
      this.selfModalLoading = true
      if (this.dishes.nameCn == '') {
        this.warning('请填写菜品中文名')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.catalogCode == '') {
        this.warning('请选择菜品分类')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.unitCode == '') {
        this.warning('请选择菜品单位')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.specification.salesPrice == 0 && this.dishes.specificationList[0].salesPrice == 0) {
        this.warning('请填写菜品价格')
        this.selfModalLoading = false
        return
      }
      axios.request({
        method: 'POST',
        url: '/dishes',
        data: this.dishes
      }).then((res) => {
        if (res.data.success) {
          this.success(res.data.message)
          this.selfModalLoading = false
          this.addMenuWin = false
          this.search()
        } else {
          this.warning(res.data.message)
          this.selfModalLoading = false
        }
      })
    },
    initCatalog () {
      axios.request({
        method: 'GET',
        url: '/dishes/catalogs',
        params: {}
      }).then((res) => {
        if (res.data.success) {
          this.catalogList = res.data.data
        } else {
          this.warning(res.data.message)
        }
      })
    },
    initUnit () {
      axios.request({
        method: 'GET',
        url: '/employees/roles',
        params: {
          type: 'cpdw'
        }
      }).then((res) => {
        if (res.data.success) {
          this.unitList = res.data.data
        } else {
          this.warning(res.data.message)
        }
      })
    },
    initType () {
      axios.request({
        method: 'GET',
        url: '/employees/roles',
        params: {
          type: 'cplx'
        }
      }).then((res) => {
        if (res.data.success) {
          this.typeList = res.data.data
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 分类change
    catalogChange (e) {
      if (e == undefined) {
        this.tableParams.dishesCatalog = ''
      }
    },
    // 单位change
    unitChange (e) {
      for (let i = 0; i < this.unitList.length; i++) {
        if (e == this.unitList[i].code) {
          this.dishes.unitName = this.unitList[i].value
        }
      }
    },
    // 类型change
    typeChange (e) {
      for (let i = 0; i < this.typeList.length; i++) {
        if (e == this.typeList[i].code) {
          this.dishes.typeName = this.typeList[i].value
        }
      }
    },
    // 添加规格
    addSpecification () {
      this.dishes.specificationList.push(
        {
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        }
      )
    },
    // 删除规格
    deleteSpecification (index) {
      let _this = this
      setTimeout(function () {
        _this.deleteAfterSpecification(index)
      }, 200)
    },
    deleteAfterSpecification (index) {
      this.dishes.specificationList.splice(index, 1)
    },
    // 添加加料
    addAdditive () {
      this.dishes.additiveList.push(
        {
          dishesId: 0,
          name: '',
          salesPrice: 0,
          costPrice: 0
        }
      )
    },
    // 删除加料
    deleteAdditive (index) {
      let _this = this
      setTimeout(function () {
        _this.deleteAfterAdditive(index)
      }, 200)
    },
    deleteAfterAdditive (index) {
      this.dishes.additiveList.splice(index, 1)
    },
    success (msg) {
      this.$Message.success(msg)
    },
    warning (msg) {
      this.$Message.warning(msg)
    },
    /** ***************简易图片上传*******************/
    jyHandleBeforeUpload (file) {
      // 创建一个 FileReader 对象
      let reader = new FileReader()
      // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
      // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
      // 读取文件作为 URL 可访问地址
      reader.readAsDataURL(file)
      const _this = this
      reader.onloadend = function (e) {
        file.url = reader.result
        _this.jySelfUploadList = []
        _this.jySelfUploadList.push(file)
      }
    },
    jyHandleSuccess (res, file) {
      // 因为上传过程为实例，这里模拟添加 url
      file.url = this.$config.baseUrl.display + res.data[0]
      file.name = ''
      this.dishes.image = res.data[0]
    },
    jyHandleRemove (file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1)
    },
    jyHandleFormatError (file) {
      this.$Notice.warning({ title: '文件格式不正确', desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。' })
    },
    jyHandleMaxSize (file) {
      this.$Notice.warning({ title: '超出文件大小限制', desc: '文件 ' + file.name + ' 太大，不能超过 2M。' })
    },
    jyUploadImg () {
      this.$refs.s_upload.handleClick()
    },
    /** ***************图片上传结束*******************/
    /** ***************高级图片上传*******************/
    handleRemove (file) {
      const fileList = this.$refs.h_upload.fileList
      this.$refs.h_upload.fileList.splice(fileList.indexOf(file), 1)
      const afterList = this.$refs.h_upload.fileList

      let photos = []
      afterList.forEach((file) => {
        photos.push(file.url.replace(this.$config.baseUrl.display, ''))
      })
      this.selfGoodsInfoBaseVO.photos = photos
    },
    handleSuccess (res, file) {
      const fileList = this.$refs.h_upload.fileList
      file.url = this.$config.baseUrl.display + res.data[0]
      file.name = getGuid()

      this.gjSelfUploadList = this.$refs.h_upload.fileList
      let photos = []
      fileList.forEach((file) => {
        photos.push(file.url.replace(this.$config.baseUrl.display, ''))
      })
      this.selfGoodsInfoBaseVO.photos = photos
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '图片格式不正确',
        desc: '图片 ' + file.name + ' 格式不正确，请上传 [jpg | gif | png] 格式的图片'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出图片大小限制',
        desc: '图片 ' + file.name + ' 太大，不能超过 5M'
      })
    },
    handleBeforeUpload () {
      const check = this.gjSelfUploadList.length < 10
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传 10 张图片。'
        })
      }
      return check
    },
    /** ***************图片上传结束*******************/
    // 新增菜品
    addMenu () {
      this.$refs.tabs.activeKey = 'name1'
      this.saveOrEdit = '1'
      this.jySelfUploadList = []
      this.dishes = {
        id: 0,
        nameCn: '',
        nameEn: '',
        mnemonicCode: '',
        sort: 0,
        image: '',
        catalogCode: '',
        catalogName: '',
        unitCode: '',
        unitName: '',
        typeCode: '',
        typeName: '',
        makeTime: '',
        enabledSpecifications: '1',
        enabledDiscount: '1',
        boxAmount: 0,
        totalStock: 0,
        dayStock: 0,
        orderRestriction: 0,
        personRestriction: 0,
        sales: 0,
        enabledDineIn: false,
        enabledTakeOut: false,
        dishesTag: '',
        specification: {
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        },
        specificationList: [{
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        }],
        additiveList: [{
          dishesId: 0,
          name: '',
          salesPrice: 0,
          costPrice: 0
        }]
      }
      this.addMenuWin = true
    },
    onSelectionChange (selection) {
      this.disabled = selection.length > 0
      this.selection = selection
    },
    onPageChange (val) {
      this.tableParams.pageNum = val
      this.initTable()
    },
    change (status) {

    },
    cancel () {
      this.modal2 = false
      this.modal1 = false
    },
    add () {
      // this.permsMethod()
      this.operator = {}
      this.modal1 = true
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
