<template>
  <div>
    <Card shadow>
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span="4">
          <Row :gutter="8">
            <Col span="6">
              <Button type="primary"  icon="ios-add"  @click="add" >新增套餐</Button>
              <!--              <Button type="primary" long icon="md-add" @click="addReport">添加报告</Button>-->
            </Col>
          </Row>
        </Col>
        <Col span="20">
          <Row :gutter="4" type="flex" justify="end" class="code-row-bg">
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
          :data="mealList"
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

    <!--新增套餐-->
    <Modal v-model="modal1" width="40%" fullscreen footer-hide>
      <p slot="header">
        新增套餐
      </p>
      <div class="center">
        <Form :model="meal"  :rules="ruleValidate" :label-width="80" class="add_form">
          <Divider orientation="left">基本信息</Divider>
          <FormItem label="菜品图片">
            <div style="position: relative;">
              <div class="demo-upload-list" v-for="(item,index) in jySelfUploadList" :key="index" style="position: absolute; top: 0; z-index: 2; overflow:hidden;float: left" @click="jyUploadImg">
                <img :src="item.url" style="width: 100px;height: 100px">
                <!--<div class="demo-upload-list-cover">-->
                <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
                <!--</div>-->
              </div>
              <Upload ref="s_upload"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png']"
                      :max-size="2048"
                      :on-success="jyHandleSuccess"
                      :before-upload="jyHandleBeforeUpload"
                      :on-format-error="jyHandleFormatError"
                      :on-exceeded-size="jyHandleMaxSize"
                      type="drag"
                      :action="uploadUrl"
                      style="display: inline-block;width:100px; float: left">
                <div style="width: 100px;height:100px;line-height: 100px;float: left" >
                  <Icon type="md-camera" size="100" ref="uploadIcon"></Icon>
                </div>
              </Upload>
            </div>
          </FormItem>
          <FormItem label="套餐名称">
            <Row>
              <Col span="8">
                <Row>
                  <Col span="3">中文名称</Col>
                  <Col span="10">
                    <FormItem prop="priceCurrent">
                      <Input v-model.number="meal.nameCn" style="width: 300px">
                      </Input>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span="8">
                <Row>
                  <Col span="3">英文名称</Col>
                  <Col span="8">
                    <FormItem prop="price">
                      <Input v-model.number="meal.nameEn" style="width: 300px">
                      </Input>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span="8">
                <Row>
                  <Col span="3">菜品单位</Col>
                  <Col span="8">
                    <FormItem prop="priceCost">
                      <Select v-model="meal.unitCode" style="width:300px" @on-change="unitChange" clearable>
                        <Option v-for="item in unitList" :value="item.code" :key="item.id">{{ item.value }}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </FormItem>
          <FormItem >
            <Row>

              <Col span="8">
                <Row>
                  <Col span="3">助记码</Col>
                  <Col span="8">
                    <FormItem prop="price">
                      <Input v-model.number="meal.mnemonicCode" style="width: 300px">
                      </Input>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </FormItem>
          <Divider orientation="left">选择菜品</Divider>
          <FormItem  style="width: 60%;background-color:#CCCCCC;margin-left: 100px;margin-bottom: 20px">
            <Row style="margin-top: 10px;width: 90%" >
              <Table
                style="width: 100%"
                :border="true"
                :data="meal.dishesMealList"
                :columns="menuColumns"></Table>
            </Row>
            <Button icon="md-add" style="margin-top: 30px;margin-bottom: 10px" type="primary" @click="addFoodsWinClick">新增菜品</Button>
          </FormItem>

          <Divider orientation="left">套餐价格</Divider>
          <FormItem label="销售单价">
            <Row>
              <Col span="8">
                <Row>
                  <Col span="3"></Col>
                  <Col span="10">
                    <FormItem prop="priceCurrent">
                      <Input v-model.number="meal.salesPrice" style="width: 300px">
                      </Input>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span="8">
                <Row>
                  <Col span="3">餐盒费</Col>
                  <Col span="8">
                    <FormItem prop="price">
                      <Input v-model.number="meal.boxAmount" style="width: 300px">
                      </Input>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span="8">
                <Row>
                  <Col span="3">是否参与优惠</Col>
                  <Col span="8">
                    <FormItem prop="priceCost">
                      <RadioGroup ref="radioSelect" v-model="meal.enabledDiscount" @on-change="change">
                        <Radio label="1" >
                          <span>参与打折</span>
                        </Radio>
                        <Radio label="0" >
                          <span>不参与打折</span>
                        </Radio>
                      </RadioGroup>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </FormItem>

          <Divider orientation="left">限购与销量</Divider>
          <FormItem label="起点数量">
            <Row>
              <Col span="8">
                <Row>
                  <Col span="3"></Col>
                  <Col span="12">
                    <FormItem prop="priceCurrent">
                      <Input v-model.number="meal.minimumQuantity" style="width: 300px">
                      </Input>
                    </FormItem>
                  </Col>
                  <Col span="5">
                    （根据人数限购）
                  </Col>
                </Row>
              </Col>
              <Col span="8">
                <Row>
                  <Col span="3">单笔限购</Col>
                  <Col span="12">
                    <FormItem prop="price">
                      <Input v-model.number="meal.orderRestriction" style="width: 300px">
                      </Input>
                    </FormItem>
                  </Col>
                  <Col span="5">（根据订单笔数限购）</Col>
                </Row>
              </Col>
              <Col span="8">
                <Row>
                  <Col span="3">初始销量</Col>
                  <Col span="8">
                    <FormItem prop="price">
                      <Input v-model.number="meal.sales" style="width: 300px">
                      </Input>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </FormItem>

          <Divider orientation="left">可点端设置</Divider>
          <FormItem label="堂食可点" prop="isShowStock">
            <Row>
              <Col span="8">
                <Row>
                  <Col span="3"></Col>
                  <Col span="4">
                    <FormItem prop="price">
                      <i-switch v-model="meal.enabledDineIn" size="large">
                        <span slot="open">显示</span>
                        <span slot="close">关闭</span>
                      </i-switch>
                    </FormItem>
                  </Col>
                  <Col span="5">（关闭后堂食不可点）</Col>
                </Row>
              </Col>
              <Col span="8">
                <Row>
                  <Col span="3">外卖可点</Col>
                  <Col span="4">
                    <FormItem prop="price">
                      <i-switch v-model="meal.enabledTakeOut" size="large">
                        <span slot="open">显示</span>
                        <span slot="close">关闭</span>
                      </i-switch>
                    </FormItem>
                  </Col>
                  <Col span="6">（关闭后外卖点餐不可点）</Col>
                </Row>
              </Col>
            </Row>

          </FormItem>

          <Divider orientation="left">套餐介绍</Divider>
          <FormItem prop="price" >
            <Input type="textarea" v-model="meal.description"> </Input>
          </FormItem>
          <FormItem prop="priceCurrent">
            <Button  @click="modal1 = false" style="margin-right: 20px">取消</Button>
            <Button type="primary" :loading="selfModalLoading" v-show="saveOrEdit==1" @click="mealSave">保存</Button>
            <Button type="primary" :loading="selfModalLoading" v-show="saveOrEdit==2" @click="mealEditSave">修改</Button>
          </FormItem>
        </Form>
      </div>
    </Modal>
    <Modal v-model="addFoodsWin" @on-ok="saveSelectDishes">
      <p slot="header" >新增菜品</p>
      <Form :model="operator">
        <FormItem style="width: 100%">
          <Row style="margin: 5px">
            <Col span="10" style="margin-right: 5px">
              <Select v-model="dishesCatalog" placeholder="请选择菜品分类" style="width:200px" clearable>
                <Option v-for="item in catalogList" :value="item.code" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="8" style="margin-right: 5px">
              <Input placeholder="菜品名称" v-model="dishesName"></Input>
            </Col>
            <Col span="4">
              <Button type="primary" @click="initDishes">搜索</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Table :border="true"
                 ref="tables"
                 :columns="addFoodsColumns"
                 :data="dishesList"
                 @on-selection-change="selectDishes"
          >
          </Table>
        </FormItem>
      </Form>

    </Modal>
  </div>
</template>

<script>
import Language from '../main/components/language/language'
import Tables from '../../components/tables/tables'
import axios from '@/libs/api.request'

export default {
  components: {Tables, Language},
  data () {
    return {
      rangeTime: [],
      selection: [],
      total: 0,
      yanzhengma: '获取验证码',
      tagsList: [],
      modal1: false,
      modal2: false,
      mathCode: '',
      count: '',
      selfModalLoading: false,
      selfLoading: false,
      tableParams: {
        pageSize: 10,
        pageNum: 1
      },
      ruleValidate: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        yzm: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      operator: {
        userId: 0,
        state: '1',
        userName: '',
        companyName: '',
        phone: '',
        yzm: '',
        password: ''
      },
      phone: '',

      tableColumns: [
        {title: '套餐名称', key: 'nameCn', align: 'center'},
        {title: '套餐价格', key: 'salesPrice', align: 'center'},
        {title: '总销量', key: 'sales', align: 'center'},
        {title: '点餐中开启',
          key: 'enabledDineOpen',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.enabledDineOpen,
                  size: 'large'
                },
                scopedSlots: {
                  open: () => h('span', '是'),
                  close: () => h('span', '否')
                },
                on: {
                  'on-change': (value) => {
                    this.changeEnable(value, params.row)
                  }
                }
              })
            ])
          }},
        {
          title: '操作',
          key: 'action',
          width: 180,
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
                    this.deleteById(params.row.id)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.editData(params.row.id)
                  }
                }
              }, '编辑'),
              params.row.status == 1 && h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.gqDishes(params.row.status, params.row)
                  }
                }
              }, '估清'),
              params.row.status == 3 && h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.gqDishes(params.row.status, params.row)
                  }
                }
              }, '恢复')
            ])
          }
        }
      ],
      disabled: false,
      // my
      districtList: [],
      vipDaySettingVOS: [],
      selectBut: 0,
      // 图片
      uploadList: [],
      uploadPic: '',
      defaultList: [],
      selfGoodsInfoBaseVO: [],
      addFoodsWin: false,

      menuColumns: [
        {title: '菜品', key: 'name', align: 'center'},
        {title: '价格', key: 'price', align: 'center'},
        { title: '数量',
          key: 'amount',
          align: 'center',
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                type: 'text',
                value: params.row.amount
              },
              on: {
                'on-change': (val) => {
                  this.meal.dishesMealList[params.index].amount = val
                }
              }

            })
          }
        },
        {title: '规格',
          key: 'speName',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.speName == '' && h('div', '单一规格'),
              params.row.speName != '' && h('div', params.row.speName)
            ])
          }},
        {
          title: '操作',
          key: 'action',
          width: 180,
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
                    this.deleteDishes(params)
                  }
                }
              }, '删除')
            ])
          }
        }],
      addFoodsColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {title: '菜品', key: 'name', align: 'center'},
        {title: '规格',
          key: 'speName',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              params.row.speName == '' && h('div', '单一规格'),
              params.row.speName != '' && h('div', params.row.speName)
            ])
          }},
        {title: '价格', key: 'price', align: 'center'}
      ],
      meal: {
        id: 0,
        storeId: 0,
        image: '',
        nameCn: '',
        nameEn: '',
        mnemonicCode: '',
        salesPrice: '',
        boxAmount: '',
        unitCode: '',
        unitName: '',
        minimumQuantity: '',
        orderRestriction: '',
        enabledDineIn: false,
        enabledTakeOut: false,
        enabledDineOpen: false,
        enabledDiscount: '1',
        description: '',
        status: 1,
        sales: 0,
        dishesMealList: []
      },
      dishesMealListTemp: [],
      jySelfUploadList: [],
      unitList: [],
      catalogList: [],
      dishesCatalog: '',
      dishesName: '',
      dishesList: [],
      mealList: [],
      saveOrEdit: 1

    }
  },
  computed: {
    uploadUrl () {
      return this.$config.baseUrl.upload + '/upload/image'
    }
  },
  created () {
    this.initPage()
    this.initFormatter()
    this.initUnit()
    this.initCatalog()
  },
  methods: {
    // 编辑保存
    mealEditSave () {
      if (this.meal.nameCn == '') {
        this.warning('请填写套餐名称')
        return
      }
      if (this.meal.unitName == '') {
        this.warning('请选择菜品单位')
        return
      }
      if (this.meal.salesPrice == 0) {
        this.warning('请填写销售价格')
        return
      }
      if (this.meal.dishesMealList.length == 0) {
        this.warning('请选择菜品')
        return
      }
      axios.request({
        method: 'PUT',
        url: '/meal',
        data: this.meal
      }).then((res) => {
        if (res.data.success) {
          this.success('操作成功！')
          this.initPage()
          this.modal1 = false
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 编辑
    editData (id) {
      this.meal = {
        id: 0,
        storeId: 0,
        image: '',
        nameCn: '',
        nameEn: '',
        mnemonicCode: '',
        salesPrice: '',
        boxAmount: '',
        unitCode: '',
        unitName: '',
        minimumQuantity: '',
        orderRestriction: '',
        enabledDineIn: false,
        enabledTakeOut: false,
        enabledDineOpen: false,
        enabledDiscount: '1',
        description: '',
        status: 1,
        sales: 0,
        dishesMealList: []
      }
      this.jySelfUploadList = []
      this.saveOrEdit = 2
      axios.request({
        method: 'GET',
        url: '/meal/by-id',
        params: {
          id: id
        }
      }).then((res) => {
        if (res.data.success) {
          this.meal = res.data.data
          this.meal.enabledDiscount = this.meal.enabledDiscount + ''
          let img = {
            url: this.$config.baseUrl.display + res.data.data.image,
            name: ''
          }
          this.jySelfUploadList.push(img)
          console.log('meal=', this.meal)
          this.modal1 = true
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 估清
    gqDishes (status, params) {
      if (status == 1) {
        params.status = 3
      }
      if (status == 3) {
        params.status = 1
      }
      this.meal = params
      axios.request({
        method: 'PUT',
        url: '/meal/part',
        data: this.meal
      }).then((res) => {
        if (res.data.success) {
          this.initPage()
          this.success(res.data.message)
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 删除
    deleteById (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除吗?',
        onOk: () => {
          axios.request({
            method: 'DELETE',
            url: '/meal/by-id',
            params: {
              id: id
            }
          }).then((res) => {
            if (res.data.success) {
              this.initPage()
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
    // 状态改变
    changeEnable (value, params) {
      if (value) {
        params.enabledDineOpen = true
      } else {
        params.enabledDineOpen = false
      }
      this.meal = params
      axios.request({
        method: 'PUT',
        url: '/meal/part',
        data: this.meal
      }).then((res) => {
        if (res.data.success) {
          this.success(res.data.message)
          this.initPage()
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 查询页面信息
    initPage () {
      axios.request({
        method: 'GET',
        url: '/meal/list',
        params: this.tableParams
      }).then((res) => {
        if (res.data.success) {
          this.mealList = res.data.data.list
          this.total = res.data.data.total
          console.log('mealList=', this.mealList)
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 删除
    deleteDishes (e) {
      let _this = this
      setTimeout(function () {
        _this.deleteAfterSpecification(e.index)
      }, 200)
    },
    deleteAfterSpecification (index) {
      this.meal.dishesMealList.splice(index, 1)
    },
    saveSelectDishes () {
      let that = this
      if (that.meal.dishesMealList.length == 0) {
        this.meal.dishesMealList = that.dishesMealListTemp
      } else {
        for (let i = 0; i < that.dishesMealListTemp.length; i++) {
          let flag = true
          for (let j = 0; j < that.meal.dishesMealList.length; j++) {
            if (that.meal.dishesMealList[j].dishesId == that.dishesMealListTemp[i].dishesId && that.meal.dishesMealList[j].speId == that.dishesMealListTemp[i].speId) {
              that.meal.dishesMealList[j].amount += 1
              flag = false
            }
          }
          if (flag) {
            that.meal.dishesMealList.push(that.dishesMealListTemp[i])
          }
        }
      }
      this.addFoodsWin = false
    },
    // 选择菜品
    selectDishes (e) {
      console.log('eee==', e)
      this.dishesMealListTemp = e
    },
    // 查询菜品，区分规格
    initDishes () {
      if (!this.dishesCatalog) {
        this.dishesCatalog = ''
      }
      axios.request({
        method: 'GET',
        url: '/meal/dishes',
        params: {
          dishesCatalog: this.dishesCatalog,
          dishesName: this.dishesName
        }
      }).then((res) => {
        if (res.data.success) {
          this.dishesList = res.data.data
          console.log('dishesList=', this.dishesList)
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 套餐保存
    mealSave () {
      if (this.meal.nameCn == '') {
        this.warning('请填写套餐名称')
        return
      }
      if (this.meal.unitName == '') {
        this.warning('请选择菜品单位')
        return
      }
      if (this.meal.salesPrice == 0) {
        this.warning('请填写销售价格')
        return
      }
      if (this.meal.dishesMealList.length == 0) {
        this.warning('请选择菜品')
        return
      }

      console.log('meal=', this.meal)
      axios.request({
        method: 'POST',
        url: '/meal',
        data: this.meal
      }).then((res) => {
        if (res.data.success) {
          this.success(res.data.message)
          this.initPage()
          this.modal1 = false
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 单位change
    unitChange (e) {
      for (let i = 0; i < this.unitList.length; i++) {
        if (e == this.unitList[i].code) {
          this.meal.unitName = this.unitList[i].value
        }
      }
    },
    // 菜品分类
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
    // 菜品单位
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
    // 新增菜品
    addFoodsWinClick () {
      this.addFoodsWin = true
      this.dishesMealListTemp = []
      this.initDishes()
    },
    // 菜品分组
    // 添加
    addVipDayRange () {
      this.vipDaySettingVOS.push(
        {day: 1, rate: 0.1}
      )
    },
    deleteSelf (index) {
      let _this = this
      setTimeout(function () {
        _this.deleteSelfLater(index)
      }, 200)
    },
    deleteSelfLater (index) {
      this.vipDaySettingVOS.splice(index, 1)
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
      this.meal = {
        id: 0,
        storeId: 0,
        image: '',
        nameCn: '',
        nameEn: '',
        mnemonicCode: '',
        salesPrice: '',
        boxAmount: '',
        unitCode: '',
        unitName: '',
        minimumQuantity: '',
        orderRestriction: '',
        enabledDineIn: false,
        enabledTakeOut: false,
        enabledDineOpen: false,
        enabledDiscount: '1',
        description: '',
        status: 1,
        sales: 0,
        dishesMealList: []
      }
      // this.permsMethod()
      this.saveOrEdit = 1
      this.operator = {}
      this.modal1 = true
      this.jySelfUploadList = []
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
      this.meal.image = res.data[0]
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
