<template>
  <div>
    <Card>
      <span style="font-size: large;font-weight: bolder">营业模式</span>
      <Divider></Divider>
      <Row>
        <Col span="2" style="line-height: 32px">店铺状态:</Col>
        <Col span="22">
          <RadioGroup v-model="BusinessModel.operatingStatus" :value="BusinessModel.operatingStatus" type="button" >
            <Radio :label="1">正常营业</Radio>
            <Radio :label="2">暂停营业</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">运营时间:</Col>
        <Col span="22">
          <TimePicker v-model="rangeTime"  type="timerange" format="hh点mm" placement="right-start" confirm placeholder="请选择营业时间" @on-clear="clearDate" @on-change="changeDate" style="width: 168px"></TimePicker>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">服务员是否自动接单:</Col>
        <Col span="22" style="line-height: 32px">
          <i-switch  v-model="BusinessModel.enabledAutoOrder" :true-value=1 :false-value=0>
            <span slot="open" >开</span>
            <span slot="close">关</span>
          </i-switch>
          <span  style="color:rgb(196, 196, 202);font-size: 14px;margin-left: 20px">关闭后，多人后支付点餐需要服务员确认即可下单</span>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">是否支持打包外带:</Col>
        <Col span="22" style="line-height: 32px">
          <i-switch  v-model="BusinessModel.enabledDoggyBag" :true-value=1 :false-value=0>
            <span slot="open" >开</span>
            <span slot="close">关</span>
          </i-switch>
          <span  style="color:rgb(196, 196, 202);font-size: 14px;margin-left: 20px">开启后用户可选择本次点餐是否打包</span>
        </Col>
      </Row>
      <br/>
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px">运营日期:</Col>-->
        <!--<Col span="22" style="line-height: 32px">-->
          <!--<CheckboxGroup v-model="BusinessModel.businessDate" >-->
            <!--<Checkbox :label="1" >星期一</Checkbox>-->
            <!--<Checkbox :label="2" >星期二</Checkbox>-->
            <!--<Checkbox :label="3" >星期三</Checkbox>-->
            <!--<Checkbox :label="4" >星期四</Checkbox>-->
            <!--<Checkbox :label="5" >星期五</Checkbox>-->
            <!--<Checkbox :label="6" >星期六</Checkbox>-->
            <!--<Checkbox :label="7" >星期日</Checkbox>-->
          <!--</CheckboxGroup>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<br/>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px">点餐模式:</Col>-->
        <!--<Col span="22" style="line-height: 32px">-->
          <!--<RadioGroup v-model="BusinessModel.orderMode" :value="BusinessModel.orderMode" @on-change="clickmode">-->
            <!--<Radio label="1" >单人点餐</Radio>-->
            <!--<Radio label="2" >多人点餐</Radio>-->
          <!--</RadioGroup>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<br/>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px">出单方式:</Col>-->
        <!--<Col span="22" style="line-height: 32px">-->
          <!--<RadioGroup v-model="BusinessModel.orderWay" :value="BusinessModel.orderWay">-->
            <!--<Radio label="1" >先下单后支付</Radio>-->
            <!--<Radio label="2" v-show="BusinessModel.orderMode == 2">先支付后下单</Radio>-->
          <!--</RadioGroup>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<Row v-show="BusinessModel.orderWay == 2">-->
        <!--<br/>-->
        <!--<Col span="2" style="line-height: 32px">是否启用加菜:</Col>-->
        <!--<Col span="22" style="line-height: 32px">-->
          <!--<i-switch  v-model="BusinessModel.isOpenAdd" :true-value=0 :false-value=1>-->
            <!--<span slot="open">开</span>-->
            <!--<span slot="close">关</span>-->
          <!--</i-switch>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<br/>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px">主页设置:</Col>-->
        <!--<Col span="22" style="line-height: 32px">-->
          <!--<RadioGroup v-model="BusinessModel.homePage" :value="BusinessModel.homePage">-->
            <!--<Radio label="1" >堂食页面</Radio>-->
            <!--<Radio label="2" >点餐页面</Radio>-->
          <!--</RadioGroup>-->
          <!--<span  style="color:rgb(196, 196, 202);font-size: 14px;">选择后，收银端结账后返回页面均为设置的主页</span>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<br/>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px"><span style="font-size: 18px">运营设置</span></Col>-->
      <!--</Row>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px">用户是否选择用餐人数:</Col>-->
        <!--<Col span="22" style="line-height: 32px">-->
          <!--<i-switch  v-model="BusinessModel.isChoosePeoleo" :true-value=0 :false-value=1>-->
            <!--<span slot="open" >开</span>-->
            <!--<span slot="close">关</span>-->
          <!--</i-switch>-->
          <!--<span  style="color:rgb(196, 196, 202);font-size: 14px;margin-left: 20px">关闭后，单人点餐不需要选择用餐人数</span>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<br/>-->

      <!--<br/>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px">快捷收款是否关联订单:</Col>-->
        <!--<Col span="22" style="line-height: 32px">-->
          <!--<i-switch  v-model="BusinessModel.isContactOrder" :true-value=0 :false-value=1>-->
            <!--<span slot="open" >开</span>-->
            <!--<span slot="close">关</span>-->
          <!--</i-switch>-->
          <!--<span  style="color:rgb(196, 196, 202);font-size: 14px;margin-left: 20px">开启后，快捷收款时可选择桌台收款</span>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<br/>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px"><span style="font-size: 18px">就餐方式</span></Col>-->
      <!--</Row>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px"><span style="font-size: 18px">叫号码取餐</span></Col>-->
      <!--</Row>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px">开启叫号取餐功能:</Col>-->
        <!--<Col span="22" style="line-height: 32px">-->
          <!--<i-switch  v-model="BusinessModel.isCallMeal" :true-value=0 :false-value=1>-->
            <!--<span slot="open" >开</span>-->
            <!--<span slot="close">关</span>-->
          <!--</i-switch>-->
          <!--<span  style="color:rgb(196, 196, 202);font-size: 14px;margin-left: 20px">开启后扫码点餐堂食订单流水号显示为取餐号</span>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<br/>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px">是否开启桌台必选功能:</Col>-->
        <!--<Col span="22" style="line-height: 32px">-->
          <!--<i-switch  v-model="BusinessModel.isTableSelect" :true-value=0 :false-value=1>-->
            <!--<span slot="open" >开</span>-->
            <!--<span slot="close">关</span>-->
          <!--</i-switch>-->
          <!--<span  style="color:rgb(196, 196, 202);font-size: 14px;margin-left: 20px">开启后直接点菜功能下单需选桌台才能生成正式订单</span>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<br/>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px"><span style="font-size: 18px">展示模式</span></Col>-->
      <!--</Row>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px">开启扫码点餐无图模式:</Col>-->
        <!--<Col span="22" style="line-height: 32px">-->
          <!--<i-switch  v-model="BusinessModel.isOpenImg" :true-value=0 :false-value=1>-->
            <!--<span slot="open" >开</span>-->
            <!--<span slot="close">关</span>-->
          <!--</i-switch>-->
          <!--<span  style="color:rgb(196, 196, 202);font-size: 14px;margin-left: 20px">开启后扫码点餐既不展示菜品图片，不影响点菜功能</span>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<br/>-->
      <!--<Row>-->
        <!--<Col span="2" style="line-height: 32px">自定义流水号标识:</Col>-->
        <!--<Col span="22" style="line-height: 32px">-->
          <!--<Input  v-model="BusinessModel.sign" style="width: 300px"></Input>-->
          <!--<span  style="color:rgb(196, 196, 202);font-size: 14px;margin-left: 20px">此处输入任何汉字、数字、符号、皆会在流水号后面展示；例如：输入“S”，则流水号会展示“S1、S2、S3”；</span>-->
        <!--</Col>-->
      <!--</Row>-->
      <!--<br/>-->
      <Row>
        <Col span="24">
          <Button type="warning" style="margin-left: 80px" @click="cancelSave">取消</Button>
          <Button type="primary" style="margin-left: 50px" @click="surelSave">保存</Button>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import {getBusinessModel, updateBusinessModel} from '../../api/system/business-model'
export default {
  name: 'business-model',
  data () {
    return {
      rangeTime: [],
      BusinessModel: {
        id: '',
        operatingStatus: 1,
        operatingTimeStart: '',
        operatingTimeFinish: '',
        enabledAutoOrder: 1, // 服务员是否自动接单
        enabledDoggyBag: 0 // 是否支持外卖打包
        // businessDate: [], // 营业日期
        // orderMode: 0, // 点餐模式
        // orderWay: 1, // 出单方式
        // homePage: 0, // 设置主页
        // isOpenAdd: 1, // 是否启用加菜
        // isChoosePeoleo: 1, // 用户是否选择用餐人数
        // isContactOrder: 0, // 快捷收款是否关联订单
        // isCallMeal: 0, // 是否开启叫号取餐
        // isTableSelect: 0, // 是否开启桌台必选功能
        // isOpenImg: 0, // 是否开启无图模式
        // sign: '' // 自定义流水标识
      }
    }
  },
  created: function () {
    this.initBusinessModel()
  },
  methods: {
    // 初始化方法
    initBusinessModel: function () {
      getBusinessModel().then(res => {
        if (res.data.success) {
          this.BusinessModel = res.data.data
          console.log(this.BusinessModel)
          this.$set(this.rangeTime, 0, this.BusinessModel.operatingTimeStart)
          this.$set(this.rangeTime, 1, this.BusinessModel.operatingTimeFinish)
          console.log(this.rangeTime)
        } else {
          this.$Message.success('请进行设置')
        }
        // this.BusinessModel.storeType = formatDate(new Date(this.BusinessModel.storeType), 'yyyy-MM-dd')
        // this.BusinessModel.city = formatDate(new Date(this.BusinessModel.city), 'yyyy-MM-dd')
      }).catch(err => {
        console.log(err)
      })
    },
    // clickmode () {
    //   console.log(this.BusinessModel.orderMode)
    //   if (this.BusinessModel.orderMode == 1) {
    //     this.BusinessModel.orderWay = '1'
    //   } else {
    //     this.BusinessModel.orderWay = '2'
    //   }
    // },
    clearDate () {
      this.BusinessModel.operatingTimeStart = ''
      this.BusinessModel.operatingTimeFinish = ''
    },
    changeDate () {
      console.log(this.rangeTime)
      if (this.rangeTime.length > 1 && this.rangeTime[0] != '') {
        // let operatingTimeStart = new Date(this.rangeTime[0]).toJSON()
        // operatingTimeStart = new Date(+new Date(operatingTimeStart) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')

        // let operatingTimeFinish = new Date(this.rangeTime[1]).toJSON()
        // operatingTimeFinish = new Date(+new Date(operatingTimeFinish) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')

        this.BusinessModel.operatingTimeStart = this.rangeTime[0]
        this.BusinessModel.operatingTimeFinish = this.rangeTime[1]
        console.log(this.BusinessModel.operatingTimeStart, this.BusinessModel.operatingTimeFinish)
      }
    },
    cancelSave: function () {
      this.initBusinessModel()
    },
    surelSave: function () {
      updateBusinessModel(this.BusinessModel).then(res => {
        if (res.data.success) {
          this.$Message.info('操作成功')
          this.initBusinessModel()
        } else {
          this.$Message.warning('操作失败')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
