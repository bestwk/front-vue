<template>
  <div>
    <Card shadow>
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span="4">
          <Row :gutter="8">
            <Col span="6">
              <Button type="primary"  icon="ios-add"  @click="add" >新增分类</Button>
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
          :data="catalogsList"
          @on-selection-change="onSelectionChange">
          <div slot="loading">
            <Spin fix>
              <Icon type="ios-loading" size=54 class="admin-spin-icon-load"></Icon>
              <div>加载中...</div>
            </Spin>
          </div>
        </Table>
      </Row>
    </Card>

    <!--添加分类-->
    <Modal v-model="modal1" width="40%">
      <p slot="header">
        新增分类
      </p>
      <div class="center">
        <Form  :model="catalogs" ref="category" :rules="ruleValidate" :label-width="80" class="add_form">
          <FormItem label="分类名称"  prop="name">
            <Input v-model="catalogs.name" />
          </FormItem>
          <FormItem label="菜品图片" prop="image">
            <div style="position: relative;">
              <div class="demo-upload-list" v-for="(item,index) in jySelfUploadList" :key="index" style="z-index: 2; overflow:hidden;float: left" @click="jyUploadImg">
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
                      style="display: inline-block;width:100px; float: left" v-show="this.jySelfUploadList.length == 0">
                <div style="width: 100px;height:100px;line-height: 100px;float: left" >
                  <Icon type="md-camera" size="100" ref="uploadIcon"></Icon>
                </div>
              </Upload>
            </div>
          </FormItem>
          <FormItem label="排序"  prop="companyName">
            <InputNumber v-model="catalogs.sort" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click="modal1 = false">取消</Button>
        <Button type="primary" :loading="selfModalLoading" v-show="saveOrEdit==1" @click="saveData">保存</Button>
        <Button type="primary" :loading="selfModalLoading" v-show="saveOrEdit==2" @click="editSaveData">修改</Button>
      </div>

    </Modal>
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
      tagsList: [],
      modal1: false,
      modal2: false,
      mathCode: '',
      count: '',
      selfModalLoading: false,
      selfLoading: false,
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        servantsName: '',
        phone: '',
        beginTime: '',
        endTime: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      phone: '',
      uploadflag: true,
      tableColumns: [
        {title: '分类名称', key: 'name', align: 'center'},
        {title: '分类照片',
          key: 'image',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: this.$config.baseUrl.display + params.row.image,
                  style: 'width: 40px;height: 40px;'
                }
              })
            ])
          }},
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
                    this.deleteData(params.row.id)
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
              }, '编辑')
            ])
          }
        }
      ],
      disabled: false,
      // 注意添加storeId
      // my
      districtList: [],
      catalogs: {
        dishesId: 0,
        code: '',
        name: '',
        image: '',
        sort: 999,
        storeId: 1
      },
      catalogsList: [],
      jySelfUploadList: [],
      saveOrEdit: 1
    }
  },
  computed: {
    uploadUrl () {
      // return this.$config.baseUrl.upload + '/upload/image'
      return this.$config.baseUrl.dev + '/upload/image'
    }
  },
  created () {
    this.initPage()
    this.initFormatter()
  },
  methods: {
    // 编辑保存
    editSaveData () {
      if (this.uploadflag) {
        this.$refs['category'].validate((valid) => {
          if (valid) {
            axios.request({
              method: 'PUT',
              url: '/dishes/catalogs',
              data: this.catalogs
            }).then((res) => {
              if (res.data.success) {
                this.success('操作成功')
                this.modal1 = false
                this.initPage()
              } else {
                this.warning(res.data.message)
              }
            })
          } else {
            this.warning('请填写正确信息')
            return false
          }
        })
      } else {
        this.warning('请上传正确图片')
        return false
      }
    },
    // 编辑
    editData (id) {
      this.uploadflag = true
      this.saveOrEdit = 2
      this.jySelfUploadList = []
      this.catalogs = {
        dishesId: 0,
        code: '',
        name: '',
        image: '',
        sort: 999,
        storeId: 1
      }
      this.modal1 = true
      axios.request({
        method: 'GET',
        url: '/dishes/catalogs/by-id',
        params: {id: id}
      }).then((res) => {
        if (res.data.success) {
          this.catalogs = res.data.data
          let img = {
            url: this.$config.baseUrl.display + res.data.data.image,
            name: ''
          }
          this.jySelfUploadList.push(img)
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 删除
    deleteData (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除吗?',
        onOk: () => {
          axios.request({
            method: 'DELETE',
            url: '/dishes/catalogs',
            params: {id: id}
          }).then((res) => {
            if (res.data.success) {
              this.success('操作成功！')
              this.initPage()
            } else {
              this.warning(res.data.message)
            }
          })
        },
        onCancel: () => {
        }
      })
    },
    // 查询
    initPage () {
      axios.request({
        method: 'GET',
        url: '/dishes/catalogs',
        params: {}
      }).then((res) => {
        if (res.data.success) {
          this.catalogsList = res.data.data
          console.log('res=', res.catalogsList)
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 保存
    saveData () {
      if (this.uploadflag && this.jySelfUploadList.length > 0) {
        this.$refs['category'].validate((valid) => {
          if (valid) {
            console.log('res=', this.catalogs)
            axios.request({
              method: 'POST',
              url: '/dishes/save/catalogs',
              data: this.catalogs
            }).then((res) => {
              if (res.data.success) {
                this.success('操作成功！')
                this.initPage()
                this.modal1 = false
              } else {
                this.warning(res.data.message)
              }
            })
          } else {
            this.warning('请填写正确信息')
            return false
          }
        })
      } else {
        this.warning('请上传正确图片')
        return false
      }
    },
    success (msg) {
      this.$Message.success(msg)
    },
    warning (msg) {
      this.$Message.warning(msg)
    },
    onSelectionChange (selection) {
      this.disabled = selection.length > 0
      this.selection = selection
    },
    onPageChange (val) {
      this.tableParams.pageNum = val
      this.initTable()
    },
    cancel () {
      this.modal2 = false
      this.modal1 = false
    },
    add () {
      this.uploadflag = true
      this.saveOrEdit = 1
      this.jySelfUploadList = []
      this.catalogs = {
        dishesId: 0,
        code: '',
        name: '',
        image: '',
        sort: 999,
        storeId: 1
      }
      this.modal1 = true
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
      this.catalogs.image = res.data[0]
    },
    jyHandleRemove (file) {
      this.uploadList.splice(this.jySelfUploadList.indexOf(file), 1)
    },
    jyHandleFormatError (file) {
      this.$Notice.warning({ title: '文件格式不正确', desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。' })
      this.jySelfUploadList = []
      this.uploadflag = false
    },
    jyHandleMaxSize (file) {
      this.$Notice.warning({ title: '超出文件大小限制', desc: '文件 ' + file.name + ' 太大，不能超过 2M。' })
      this.jySelfUploadList = []
      this.uploadflag = false
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
