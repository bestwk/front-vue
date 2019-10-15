<template>
  <div>
    <Card shadow>
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span="4">
          <Row :gutter="8">
            <Col span="6">
              <Button type="primary"  icon="ios-add"  @click="add" >新增桌台</Button>
              <!--              <Button type="primary" long icon="md-add" @click="addReport">添加报告</Button>-->
            </Col>
          </Row>
        </Col>
        <Col span="20">
          <Row :gutter="4" type="flex" justify="end" class="code-row-bg">
            <Col span="4">
              <Select  style="width:200px" placeholder="请选择门店" v-model="tableParams.store" clearable @on-change="changeStore">
                <Option v-for="item in storeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <Select  style="width:200px" placeholder="请选择区域" v-model="tableParams.areas" clearable @on-change="changeAreas">
                <Option v-for="item in areasList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <Input style="width:200px" v-model="tableParams.tableName" placeholder="桌台名称"></Input>
            </Col>

            <Col span="2">
              <Button type="primary" icon="ios-search" style="margin-left: 10px" @click="initTable">搜索</Button>
            </Col>
            <Col span="2">
              <Button type="primary" icon="md-refresh" @click="reload">刷新</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider/>
      <Row>
        <Alert show-icon >共{{tableNumber}}个桌台</Alert>
        <Table
          :border="true"
          ref="tables"
          :columns="tableColumns"
          :data="tableList"
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

    <!--添加客户-->
    <Modal v-model="modal1" width="55%">
      <p slot="header">
        添加桌台
      </p>
      <div class="center">
        <Form :model="table" :rules="ruleValidate" ref="ruleValidate" :label-width="80" class="add_forms">
          <FormItem label="桌台名称"  prop="name">
            <Input v-model="table.name" placeholder="请输入名称"/>
          </FormItem>
          <FormItem label="所属区域"  prop="areaId">
            <Select  placeholder="请选择区域" v-model="table.areaId" clearable @on-change="addChangeAreas">
              <Option v-for="item in areasList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="餐位数"  prop="seating">
            <Input v-model="table.seating" placeholder="标准用餐人数" />
          </FormItem>
          <FormItem label="最低消费"  prop="minimumAmount">
            <Input v-model="table.minimumAmount" placeholder="订单总金额不低于最低消费金额，低于最低则无法下单"/>
          </FormItem>
          <FormItem label="台位费" prop="tableAmount">
            <Input v-model="table.tableAmount" placeholder="按桌台收费，开台既收，如：包厢费20元"/>
          </FormItem>
          <FormItem label="餐位费" prop="seatAmount">
            <Input v-model="table.seatAmount" placeholder="按照用餐人员收费，如：每人2元"/>
          </FormItem>

          <FormItem label="必点菜" >
            <i-switch v-model="table.isOrderdish" :true-value="1" :false-value="0" size="large">
              <span slot="open" >要</span>
              <span slot="close">不要</span>
            </i-switch>
          </FormItem>
          <FormItem label="特殊桌台" >

              <i-switch v-model="table.isSpecial" :true-value="1" :false-value="0" size="large">
                <span slot="open" >开</span>
                <span slot="close">关</span>
              </i-switch>

            <RadioGroup v-if="table.isSpecial == 1" v-model="table.specialType" style="margin-left: 10px;display: flex;flex-direction: row;position: absolute;top: 0;left: 18%;">
              <Radio :label="1" >
                <span>收款桌台</span>
              </Radio>
              <Radio :label="2" >
                <span>外卖桌台</span>
              </Radio>
              <Radio :label="3" >
                <span>预约桌台</span>
              </Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click="modal1 = false">取消</Button>
        <Button type="primary" :loading="selfModalLoading" @click="addTable">保存</Button>
      </div>

    </Modal>
    <Modal v-model="modal2" width="55%" >

      <p slot="header" >编辑客户</p>
      <Form :model="table" :rules="ruleValidate" ref="ruleValidate" :label-width="80" class="add_forms">
        <FormItem label="桌台名称"  prop="name">
          <Input v-model="table.name" placeholder="请输入名称"/>
        </FormItem>
        <FormItem label="所属区域"  prop="areaId">
          <Select  placeholder="请选择区域" v-model="table.areaId" clearable @on-change="addChangeAreas">
            <Option v-for="item in areasList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="餐位数"  prop="seating">
          <Input v-model="table.seating" placeholder="标准用餐人数" />
        </FormItem>
        <FormItem label="最低消费"  prop="minimumAmount">
          <Input v-model="table.minimumAmount" placeholder="订单总金额不低于最低消费金额，低于最低则无法下单"/>
        </FormItem>
        <FormItem label="台位费" prop="tableAmount">
          <Input v-model="table.tableAmount" placeholder="按桌台收费，开台既收，如：包厢费20元"/>
        </FormItem>
        <FormItem label="餐位费" prop="seatAmount">
          <Input v-model="table.seatAmount" placeholder="按照用餐人员收费，如：每人2元"/>
        </FormItem>

        <FormItem label="必点菜" >
          <i-switch v-model="table.isOrderdish" :true-value='1' :false-value='0' size="large">
            <span slot="open" >要</span>
            <span slot="close">不要</span>
          </i-switch>
        </FormItem>
        <FormItem label="特殊桌台" >

          <i-switch v-model="table.isSpecial" :true-value='1' :false-value='0' size="large">
            <span slot="open" >开</span>
            <span slot="close">关</span>
          </i-switch>

          <RadioGroup v-if="table.isSpecial" v-model="table.specialType" style="margin-left: 10px;display: flex;flex-direction: row;position: absolute;top: 0;left: 18%;">
            <Radio :label="1" >
              <span>收款桌台</span>
            </Radio>
            <Radio :label="2" >
              <span>外卖桌台</span>
            </Radio>
            <Radio :label="3" >
              <span>预约桌台</span>
            </Radio>
          </RadioGroup>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="primary" @click="cancel">取消</Button>
        <Button type="primary" :loading="selfLoading"  @click="updateTable()">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modal3" width="30%" >

      <p slot="header" >添加二维码</p>
      <Row>
        <Col span="4" style="line-height: 32px">绑定二维码</Col>
        <Col span="20">
          <Form  :label-width="1"   label-position="right">
            <FormItem
              v-for="(item, index) in shortChainArray"
              :key="index"
              :label="''"
            >
              <Row>
                <Col span="18">
                  <Input v-model="item.value" confirm />
                </Col>
                <Col span="4" offset="1">
                  <Button v-show="shortChainArray.length > 1" @click="handleRemove(index)">删除</Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Row>
                <Col span="6">
                  <Button type="dashed" long @click="handleAdd" icon="md-add">添加</Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" @click="cancelModal3">取消</Button>
        <Button type="primary"  @click="updateShortChain()">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modal4" width="450px" title="二维码" v-show="modal4">
      <!--<Carousel loop  v-if="modal4" @on-change="change">-->
        <!--<CarouselItem  v-if="modal4" v-for="(item,index) in shortChainArray" :key="index" >-->
          <!--<div v-if="modal4" :id="`qrcode${index}`" class="demo-carousel" ></div>-->
        <!--</CarouselItem>-->
      <!--</Carousel>-->
      <div v-for="(item,index) in shortChainArray"  :key="index" :id="`qrcode${index}`" class="resize-drag"  style="width: 100px;display: inline-block;margin:5px 19px"></div>
      <!--<div id="qrcode" class="qrcode" ref="qrcodeContainer"></div>-->
    </Modal>
  </div>
</template>

<script>
import Language from '../main/components/language/language'
import {getStoreList, getAllAreasList, getTableList, deleteTable, addTable, updateTable, update, updateShortChain} from '../../api/tables/tables.js'
import QRCode from 'qrcodejs2'
export default {
  components: {Language},
  data () {
    return {
      shortChainArray: [
        {
          index: 0,
          value: ''
        }
      ], // 二维码短链集合
      storeList: [], // 门店集合
      rangeTime: [],
      selection: [],
      total: 0,
      tableList: [],
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      selfModalLoading: false,
      selfLoading: false,
      tableNumber: 0, // 桌台总数量
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        store: '',
        tableName: '',
        areas: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入桌台名称' }
        ],
        areaId: [
          { required: true, message: '请选择区域' }
        ],
        seating: [
          { required: true, message: '请输入用餐人数' }
        ]
      },
      table: {
        name: '',
        areaId: '',
        areaName: '',
        seating: '',
        minimumAmount: '',
        seatAmount: '', // 餐位费
        tableAmount: '', // 桌台费
        isOrderdish: 1, // 是否为必点菜
        isSpecial: 0, // 是否开启特殊桌台
        specialType: '', // 特殊桌台类型
        shortChain: ''
      },

      tableColumns: [
        {title: '桌台名称', key: 'name', align: 'center'},
        {title: '所属区域', key: 'areaName', align: 'center'},
        {title: '餐位数', key: 'seating', align: 'center'},
        {title: '短链', key: 'shortChain', align: 'center'},
        {title: '是否启用',
          key: 'isEnabled',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.isEnabled == 1,
                  size: 'large'
                },
                scopedSlots: {
                  open: () => h('span', '开启'),
                  close: () => h('span', '停用')
                },
                on: {
                  'on-change': (value) => {
                    this.table = params.row
                    if (value) {
                      this.update(1, 1, params.row.id)
                    } else {
                      this.update(0, 1, params.row.id)
                    }
                  }
                }
              })
            ])
          }},
        {title: '必点菜',
          key: 'isOrderdish',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.isOrderdish == 1,
                  size: 'large'
                  // 'true-value': '1',
                  // 'false-value': '0'
                },
                scopedSlots: {
                  open: () => h('span', '开启'),
                  close: () => h('span', '停用')
                },
                on: {
                  'on-change': (value) => {
                    if (value) {
                      this.update(1, 0, params.row.id)
                    } else {
                      this.update(0, 0, params.row.id)
                    }
                  }
                }
              })
            ])
          }},
        {
          title: '操作',
          key: 'action',
          width: 250,
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
                    this.deleteTable(params.row.id)
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
                    this.table = params.row
                    console.log(this.table)
                    this.modal2 = true
                  }
                }
              }, '编辑'),
              params.row.shortChain != '' && h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.modal4 = true
                    this.table = params.row
                    this.showQRCode()
                  }
                }
              }, '二维码'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.table = params.row
                    this.initshortChain()
                    this.modal3 = true
                  }
                }
              }, '管理二维码')
            ])
          }
        }
      ],
      disabled: false,
      // my
      areasList: [],
      qrcode: null // 二维码
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      // 初始化门店.首次选默认门店
      getStoreList().then(res => {
        this.storeList = res.data.data
        if (this.storeList != null) {
          for (var i = 0; i < this.storeList.length; i++) {
            if (this.storeList[i].isHeadquarters == '1') {
              this.tableParams.store = this.storeList[i].id
            }
          }
          this.changeStore(this.tableParams.store)
        }
        this.initTable()
      }).catch(err => {
        console.log(err)
      })
    },
    initTable () {
      //  查询当前门店的所有区域
      let data = this.tableParams
      if (this.tableParams.areas === undefined) {
        this.tableParams.areas = ''
      }
      if (this.tableParams.store === undefined) {
        this.tableParams.store = ''
      }
      getTableList(data).then(res => {
        this.tableList = res.data.data.list
        console.log(this.tableList)
        this.total = res.data.data.total
        this.tableNumber = this.tableList.length
      }).catch(err => {
        console.log(err)
      })
    },
    update (value, method, id) {
      update(value, method, id).then(res => {
        if (!res.data.success) {
          this.$Message.error('修改失败')
        } else {
          this.$Message.success('修改成功')
        }
        this.initTable()
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
    change (o, v) {
      console.log(o, v)
    },
    initshortChain () {
      if (this.table.shortChain !== '') {
        this.shortChainArray = []
        let aa = this.table.shortChain.split(',')
        for (let a of aa) {
          this.index = this.shortChainArray.length
          console.log(this.index)
          this.shortChainArray.push({
            value: a,
            index: this.index
          })
        }
        console.log(this.shortChainArray)
      } else {
        this.shortChainArray = []
        this.shortChainArray.push({
          value: '',
          index: 0
        })
      }
    },

    showQRCode () {
      this.initshortChain()
      this.$nextTick(function () {
        console.log(this.shortChainArray.length)
        for (let j = 0; j < this.shortChainArray.length; j++) {
          console.log('qrcode' + j)
          document.getElementById('qrcode' + j).innerHTML = ''// 置空
          let contentStr = this.shortChainArray[j].value// 二维码内容
          console.log(contentStr)
          let qrcode = new QRCode(document.getElementById('qrcode' + j), {
            text: contentStr,
            width: 100,
            height: 100,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          })
          this.qrcode = qrcode
        }
        // document.getElementById('qrcode').innerHTML = ''
        //
        // let qrcode = new QRCode(this.$refs.abc, {
        //   text: this.table.shortChain,
        //   width: 100,
        //   height: 100,
        //   colorDark: '#000000',
        //   colorLight: '#ffffff',
        //   correctLevel: QRCode.CorrectLevel.H
        // })
        // console.log(this.qrcode)
      })
    },
    // this.$nextTick(() => {
    //   var qrcode = new QRCode(this.$refs.qrcodeContainer, {
    //     text: 'https://wallimn.iteye.com',
    //     width: 100,
    //     height: 100,
    //     colorDark: '#000000',
    //     colorLight: '#ffffff',
    //     correctLevel: QRCode.CorrectLevel.H
    //   })
    // })
    // 保存二维码短链
    updateShortChain () {
      let aaa = {
        array: this.shortChainArray,
        id: this.table.id
      }
      updateShortChain(aaa).then(res => {
        if (res.data.success) {
          this.$Message.success('保存成功')
        } else {
          this.$Message.success('保存失败')
        }
        this.initTable()
        this.modal3 = false
      })
    },
    // 关闭modal3
    cancelModal3 () {
      this.modal3 = false
    },
    // modal3删除二维码
    handleRemove (index) {
      this.shortChainArray.splice(index, 1)
    },
    handleAdd () {
      this.index = this.shortChainArray.length
      this.shortChainArray.push({
        value: '',
        index: this.index
      })
    },
    // 添加桌台.更改区域
    addChangeAreas (value) {
      for (let item of this.areasList) {
        if (item.id == value) {
          this.table.areaName = item.name
        }
      }
    },
    // 删除桌台(更改state)
    deleteTable (id) {
      this.$Modal.confirm({
        title: '提示信息',
        content: '确认删除此桌台吗?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          deleteTable(id).then(res => {
            if (res.data.success) {
              this.$Message.success(res.data.message)
              this.initTable()
            } else {
              this.$Message.error('删除失败')
            }
          }).catch(err => {
            console.log(err)
            this.$Message.error('操作失败')
          })
        }
      })
    },
    changeStore (store) {
      // 清空区域集合
      this.areasList = []
      this.tableParams.areas = ''
      getAllAreasList(store).then(res => {
        this.areasList = res.data.data
      }).catch(err => {
        console.log(err)
      })
      // this.initTable()
    },
    // 选择区域,刷新界面
    changeAreas (areas) {
      this.tableParams.areas = areas
      // this.initTable()
    },
    cancel () {
      this.modal2 = false
      this.initTable()
    },
    add () {
      // this.permsMethod()
      this.table = {
        name: '',
        areaId: '',
        areaName: '',
        seating: '',
        minimumAmount: '',
        seatAmount: '', // 餐位费
        tableAmount: '', // 桌台费
        isOrderdish: 1, // 是否为必点菜
        isSpecial: 0, // 是否开启特殊桌台
        specialType: '' // 特殊桌台类型
      }
      this.modal1 = true
    },
    // 编辑桌台
    updateTable () {
      this.$refs['ruleValidate'].validate((valid) => {
        if (valid) {
          this.selfLoading = true
          console.log(this.table)
          let data = this.table
          updateTable(data).then(res => {
            if (res.data.success) {
              this.selfLoading = false
              this.$Message.success(res.data.message)
              this.modal2 = false
            } else {
              this.selfLoading = false
              this.$Message.error(res.data.message)
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$Message.error('提交失败')
        }
      })
    },
    addTable () {
      this.selfModalLoading = true
      console.log(this.table)
      let data = this.table
      addTable(data).then(res => {
        if (res.data.success) {
          this.selfModalLoading = false
          this.$Message.success(res.data.message)
          this.modal1 = false
        } else {
          this.selfModalLoading = false
          this.$Message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    reload: function () {
      this.$bus.$emit('content-reload')
    },
    formatDate (timestramp) {
      return new Date(timestramp).Format('yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>

<style scoped>
  .admin-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .add_forms .ivu-form-item{width: 45%;display: inline-block;}
</style>
