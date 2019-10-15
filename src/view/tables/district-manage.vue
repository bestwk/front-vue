<!--suppress ALL -->
<template>
  <div>
    <Card shadow>
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span="4">
          <Row :gutter="8">
            <Col span="6">
              <Button type="primary"  icon="ios-add"  @click="add" >新增区域</Button>
              <!--              <Button type="primary" long icon="md-add" @click="addReport">添加报告</Button>-->
            </Col>
          </Row>
        </Col>
        <Col span="20">
          <Row :gutter="4" type="flex" justify="end" class="code-row-bg">
            <Col span="4">
              <Select  style="width:200px" placeholder="请选择门店" v-model="store" clearable>
                <Option v-for="item in storeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>

            <Col span="2">
              <Button type="primary" icon="ios-search" style="margin-left: 10px" @click="initTable">搜索</Button>
            </Col>
            <!--<Col span="2">-->
              <!--<Button type="primary" icon="md-refresh" @click="reload">刷新</Button>-->
            <!--</Col>-->
          </Row>
        </Col>
      </Row>

      <Divider/>
      <Row>
        <Alert show-icon>共{{areasNumber}}个区域</Alert>
        <Table
          :border="true"
          ref="tables"
          :columns="tableColumns"
          :data="areasList"
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
                    <Page :current="pageNum" :total="total" :page-size="pageSize" show-elevator show-total @on-change="onPageChange"/>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Table>
      </Row>
    </Card>

    <!--添加区域-->
    <Modal v-model="modal1" width="30%">
      <p slot="header">
        添加区域
      </p>
      <div class="center">
        <Form :model="areas" :rules="ruleValidate" ref="ruleValidate" :label-width="80" class="add_form">
          <FormItem label="区域名称"  prop="name">
            <Input v-model="areas.name" />
          </FormItem>
          <FormItem label="选择门店"  prop="physicalStoreId">
            <Select  style="width:200px" placeholder="请选择门店" v-model="areas.physicalStoreId" clearable>
              <Option v-for="item in storeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="排序"  prop="sort">
            <Input v-model="areas.sort" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click="modal1 = false">取消</Button>
        <Button type="primary" :loading="selfModalLoading" @click="addAreas('ruleValidate')">保存</Button>
      </div>

    </Modal>
    <Modal v-model="modal2" width="40%" >

      <p slot="header" >编辑区域</p>
      <Form :model="areas" :rules="ruleValidate" ref="ruleValidate" :label-width="100">
        <FormItem label="区域名称"  prop="name">
          <Input v-model="areas.name" />
        </FormItem>
        <FormItem label="选择门店"  prop="physicalStoreId">
          <Select  style="width:200px" placeholder="请选择门店" v-model="areas.physicalStoreId" clearable>
            <Option v-for="item in storeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="排序"  prop="sort">
          <Input v-model="areas.sort" />
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="primary" @click="cancel">取消</Button>
        <Button type="primary" :loading="selfLoading"  @click="update()">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Language from '../main/components/language/language'
import { getStoreList } from '../../api/tables/tables.js'
import { addAreas, updateAreas, getAreasList, deleteAreas } from '../../api/tables/areas.js'

export default {
  components: {Language},
  data () {
    return {
      areasNumber: 0, // 区域个数
      total: 0,
      selection: [],
      areasList: [],
      modal1: false,
      modal2: false,
      selfModalLoading: false,
      selfLoading: false,
      pageSize: 10,
      pageNum: 1,
      // 获取默认门店
      storeList: [],
      store: '',
      ruleValidate: {
        name: [
          { required: true, message: '请输入区域名称', trigger: 'blur', type: 'string' }
        ],
        physicalStoreId: [
          { required: true, message: '请选择门店', trigger: 'blur', type: 'string' }
        ],
        sort: [
          { required: true, message: '请输入排序号', trigger: 'blur', type: 'string' }
        ]
      },
      areas: {
        physicalStoreId: '',
        name: '',
        sort: ''
      },

      tableColumns: [
        {title: '区域名称', key: 'name', align: 'center'},
        {title: '排序', key: 'sort', align: 'center'},
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
                    this.delete(params.row.id)
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
                    this.areas = params.row
                    let id = params.row.physicalStoreId + ''
                    this.areas.physicalStoreId = id
                    console.log(this.areas.physicalStoreId)
                    this.modal2 = true
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      disabled: false

    }
  },
  created () {
    this.init()
  },
  methods: {
    // 获取门店集合.选中默认门店,初始化区域
    init () {
      getStoreList().then(res => {
        this.storeList = res.data.data
        console.log(this.storeList)
        for (var i = 0; i < this.storeList.length; i++) {
          if (this.storeList[i].isHeadquarters == '1') {
            this.store = this.storeList[i].id
          }
        }
        this.initTable()
      }).catch(err => {
        console.log(err)
      })
    },
    initTable () {
      //  查询当前门店的所有区域
      let pageNum = this.pageNum
      let pageSize = this.pageSize
      if (this.store === undefined) {
        this.store = ''
      }
      let storeId = this.store
      console.log(this.store)
      getAreasList(pageNum, pageSize, storeId).then(res => {
        this.areasList = res.data.data.list
        this.total = res.data.data.total
        this.areasNumber = this.areasList.length
      }).catch(err => {
        console.log(err)
      })
    },

    // 删除区域
    delete (id) {
      this.$Modal.confirm({
        title: '提示信息',
        content: '确认删除此区域吗?',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          deleteAreas(id).then(res => {
            if (res.data.success) {
              this.$Message.success(res.data.message)
              this.initTable()
            } else {
              this.$Message.error(res.data.message)
            }
          })
        }
      })
    },

    onSelectionChange (selection) {
      this.disabled = selection.length > 0
      this.selection = selection
    },
    onPageChange (val) {
      this.pageNum = val
      this.initTable()
    },
    // changeStore (id) {
    //   this.store = id
    //   console.log(this.store)
    //   this.initTable()
    // },
    cancel () {
      this.modal2 = false
      this.areas = {}
      this.initTable()
    },
    add () {
      this.areas = {}
      this.modal1 = true
    },

    addAreas (name) {
      console.log(name)
      this.$refs['ruleValidate'].validate((valid) => {
        if (valid) {
          this.areas.physicalStoreId = this.store
          addAreas(this.areas).then(res => {
            console.log(res)
            if (!res.data.success) {
              this.$Message.warning(res.data.message)
            } else {
              this.$Message.info({
                content: '添加成功',
                duration: 2
              })
              this.areas = {}
              this.initTable()
            }
          })
          this.modal1 = false
        } else {
          this.$Message.error('提交失败')
        }
      })
    },

    update () {
      this.$refs['ruleValidate'].validate((valid) => {
        if (valid) {
          updateAreas(this.areas).then(res => {
            console.log(res)
            if (!res.data.success) {
              this.$Message.warning(res.data.message)
            } else {
              this.$Message.info({
                content: '修改成功',
                duration: 2
              })
              this.initTable()
            }
          })
          this.modal2 = false
        } else {
          this.$Message.error('提交失败')
        }
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
</style>
