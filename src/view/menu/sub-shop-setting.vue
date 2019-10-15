<template>
  <div>
      <Form>
        <FormItem prop="isShowStock">
          <Row style="margin-left: 50px">
            <Col span="12">
              <Row>
                <Col span="7" style="font-size: 14px">菜品删除权限：</Col>
                <Col span="5">
                  <FormItem prop="price">
                    <i-switch v-model="showButton" size="large">
                      <span slot="open">显示</span>
                      <span slot="close">关闭</span>
                    </i-switch>
                  </FormItem>
                </Col>
                <Col span="12" style="margin-top: 3px">若关闭,则子店无法删除菜品权限;</Col>
              </Row>
            </Col>
          </Row>
        </FormItem>
        <FormItem prop="isShowStock">
          <Row style="margin-left: 50px">
            <Col span="12">
              <Row>
                <Col span="7" style="font-size: 14px">菜品下架权限：</Col>
                <Col span="5">
                  <FormItem prop="price">
                    <i-switch v-model="showButton" size="large">
                      <span slot="open">显示</span>
                      <span slot="close">关闭</span>
                    </i-switch>
                  </FormItem>
                </Col>
                <Col span="12" style="margin-top: 3px">若关闭,则子店无法对菜品下架;</Col>
              </Row>
            </Col>
          </Row>
        </FormItem>
        <FormItem prop="isShowStock">
          <Row style="margin-left: 50px">
            <Col span="12">
              <Row>
                <Col span="7" style="font-size: 14px">参与折扣权限：</Col>
                <Col span="5">
                  <FormItem prop="price">
                    <i-switch v-model="showButton" size="large">
                      <span slot="open">显示</span>
                      <span slot="close">关闭</span>
                    </i-switch>
                  </FormItem>
                </Col>
                <Col span="12" style="margin-top: 3px">若关闭,则子店无法修改菜品参与折扣状态;</Col>
              </Row>
            </Col>
          </Row>
        </FormItem>
        <FormItem prop="isShowStock">
          <Row style="margin-left: 50px">
            <Col span="12">
              <Row>
                <Col span="7" style="font-size: 14px">菜品编辑权限：</Col>
                <Col span="5">
                  <FormItem prop="price">
                    <i-switch v-model="showButton" size="large">
                      <span slot="open">显示</span>
                      <span slot="close">关闭</span>
                    </i-switch>
                  </FormItem>
                </Col>
                <Col span="12" style="margin-top: 3px">若关闭，则子店无法编辑菜品;</Col>
              </Row>
            </Col>
          </Row>
        </FormItem>
        <FormItem prop="isShowStock">
          <Row style="margin-left: 50px">
            <Col span="12">
              <Row>
                <Col span="7" style="font-size: 14px">菜品新增权限：</Col>
                <Col span="5">
                  <FormItem prop="price">
                    <i-switch v-model="showButton" size="large">
                      <span slot="open">显示</span>
                      <span slot="close">关闭</span>
                    </i-switch>
                  </FormItem>
                </Col>
                <Col span="12" style="margin-top: 3px">若关闭,则子店无法新增菜品;</Col>
              </Row>
            </Col>
          </Row>
        </FormItem>
      </Form>
  </div>
</template>

<script>
import Language from '../main/components/language/language'
import Tables from '../../components/tables/tables'

export default {
  components: {Tables, Language},
  data () {
    return {
      showButton: true
    }
  },
  created () {
    // this.initPage()
    this.initFormatter()
  },
  methods: {
    // 新增菜品
    addFoodsWinClick () {
      this.addFoodsWin = true
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
    //
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
    /** ***************高级图片上传*******************/
    handleRemove (file) {
      const fileList = this.$refs.uploadButton.fileList
      this.$refs.uploadButton.fileList.splice(fileList.indexOf(file), 1)
      const afterList = this.$refs.uploadButton.fileList

      let photos = []
      afterList.forEach((file) => {
        photos.push(file.url.replace(this.$config.baseUrl.display, ''))
      })
      this.selfGoodsInfoBaseVO.photos = photos
    },
    handleSuccess (res, file) {
      const fileList = this.$refs.uploadButton.fileList
      file.url = this.$config.baseUrl.display + res.data[0]
      file.name = getGuid()

      this.selfUploadList = this.$refs.uploadButton.fileList
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
      const check = this.selfUploadList.length < 10
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传 10 张图片。'
        })
      }
      return check
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
