<style scoped>
  .ipt{display: inline-block;width: 8%}
  .set-block .text{height:60px;line-height: 60px;}
  .set-block{position: relative;background: white;margin-top: 25px;padding: 10px;}
  .ivu-switch{position: absolute;right: 10px;top: 20px;}
  .main .content-wrapper{background: #ededed;}
  ::-webkit-scrollbar{display: none;}
</style>

<template>
    <div>
      <!--第一个选项默认关闭，开启后显示剩余选项-->
      <div class="set-block">
        <span class="text">是否开启会员功能：开启会员功能后,相关会员配置才会生效</span>
        <i-switch v-model="memberSettings.isEnable" @on-change="change" >
          <span slot="open">开</span>
          <span slot="close">关</span>
        </i-switch>
      </div>
      <!--剩余的选项默认关闭-->
      <div v-show="memberSettings.isEnable">
        <div class="set-block">
          <span class="text">消费积分规则：会员积分会依据本规则自动累加</span>
          <i-switch v-model="memberSettings.enabledIntegralRules"  >
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
          <div v-show="memberSettings.enabledIntegralRules">
          每消费&nbsp;&nbsp;
          <i-input placeholder="" v-model="memberSettings.integralRules.expenseAmount" class="ipt"></i-input>&nbsp;&nbsp;元&nbsp;&nbsp;=&nbsp;&nbsp;
          <i-input placeholder="" v-model="memberSettings.integralRules.integral" class="ipt"></i-input>&nbsp;&nbsp;积分
          </div>
        </div>

        <div class="set-block">
          <span class="text">充值额度和赠送金额设置：请谨慎设置充值金额</span>
          <i-switch  v-model="memberSettings.enabledRecharge"  >
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>
          <Form  ref="give" v-show="memberSettings.enabledRecharge">
            <FormItem >
            <div v-for="(item, index) in memberSettings.rechargeArray"
                 :key="index"
                 >
              充值&nbsp;&nbsp;
              <Input v-model="item.rechargeAmount" placeholder="" class="ipt"></Input> &nbsp;&nbsp;送&nbsp;&nbsp;
              <Input v-model="item.presentAmount" placeholder="" class="ipt"></Input> &nbsp;&nbsp;且送&nbsp;&nbsp;
              <Input v-model="item.presentIntegral" placeholder="" class="ipt"></Input>&nbsp;&nbsp;积分&nbsp;&nbsp;
              <Button style="margin-left: 15px" @click="giveRemove(index)" v-show="memberSettings.rechargeArray.length > 1">删除</Button>
            </div>
            </FormItem>
            <FormItem >
              <Button type="dashed" long @click="giveAdd" style="width: 60px;margin-left: 20px">添加</Button>
            </FormItem>

          </Form>
        </div>
        <!--<div class="set-block">-->
          <!--<span class="text">营销语句设置：最多可输入20字，设置后用户会在扫码点餐付款时看见，用户点击这句话可前往注册或充值，用于促进用户注册会员和充值</span>-->
          <!--<i-input placeholder="比如:充值满100送20" style="width: 25%;display: block"></i-input>-->
        <!--</div>-->
        <!--<div class="set-block">-->
          <!--<span style="display: block" class="text">余额支付设置：启用该设置后，则会员在使用余额支付时，不享受对应的会员折扣</span>-->
          <!--<span class="text">使用会员余额支付时，不享受会员折扣</span>-->
          <!--<i-switch></i-switch>-->
        <!--</div>-->
        <!--<div class="set-block">-->
          <!--<div class="text">标签设置：为更好的表述会员的特征，精准服务会员(点击标签可以修改)</div>-->
          <!--<div v-for="(item, index) in tagList" :value="item.value" :key="index" style="display: inline-block">-->
            <!--<Tag checkable closable @on-close="close" @on-change="changeValue" :name="item.value">{{item.value}}</Tag>-->
          <!--</div>-->
          <!--<Button type="dashed"  @click="spanAdd" style="display: block;margin-top: 15px" v-show="tagsBtn">添加标签</Button>-->
          <!--<div v-show="addBlock">-->
          <!--<Input v-show="tagsInput" v-model="inputVal" style="width: 30%;margin-top: 15px"></Input>-->
          <!--<Input v-show="sooo" v-model="text" style="width: 30%;margin-top: 15px"></Input>-->
          <!--<Button @click="box" type="primary" v-show="sureToAdd" style="margin-left: 15px;margin-top: 15px">确认添加</Button>-->
          <!--<Button @click="test" v-show="sureToChange" style="margin-left: 15px;margin-top: 15px"> 保存修改</Button>-->
          <!--</div>-->
        <!--</div>-->

      </div>
      <div class="set-block">
        <Button type="warning" style="margin-left: 80px" @click="cancelSave">取消</Button>
        <Button type="primary" style="margin-left: 50px" @click="surelSave">提交修改</Button>
      </div>
    </div>
</template>

<script>
import {updateMemberSettings, getMemberSettings} from '../../api/member/member-settings'
export default {
  data () {
    return {
      isshow: false,
      codeshow: false,
      addBlock: false,
      valInput: false,
      sureToAdd: false, // 确认添加输入框
      sooo: false, // 修改标签输入框
      sureToChange: false, // 确认修改输入框
      giveshow: false,
      tagsInput: false, // 添加标签输入框
      tagsBtn: true, // 添加标签按钮
      tagList: [],
      inputVal: '',
      valueIndex: '', // 更改数据的索引
      text: '', // 修改框的数据
      count: [],
      index: 0,
      // my
      memberSettings: {
        id: '',
        storeId: '',
        isEnable: false, // 是否开启会员设置
        enabledIntegralRules: false, // 是否开启积分规则
        enabledRecharge: false, // 是否开启充值规则
        // 积分规则
        integralRules: {
          expenseAmount: '', // 消费金额
          integral: '' // 所得积分
        },
        // 充值规则
        rechargeArray: [
          {
            index: 0,
            rechargeAmount: '', // 充值金额
            presentAmount: '', // 赠送金额
            presentIntegral: '' // 赠送积分
          }
        ]
      }
    }
  },
  created: function () {
    this.initMemberSettings()
  },
  methods: {
    initMemberSettings () {
      getMemberSettings().then(res => {
        if (res.data.success) {
          this.memberSettings.rechargeArray = []
          this.memberSettings = res.data.data
          if (!this.memberSettings.isEnable) {
            this.memberSettings.integralRules = {
              expenseAmount: '', // 消费金额
              integral: '' // 所得积分
            }
            this.memberSettings.rechargeArray = [
              {
                index: 0,
                rechargeAmount: '', // 充值金额
                presentAmount: '', // 赠送金额
                presentIntegral: '' // 赠送积分
              }
            ]
          } else {
            if (!this.memberSettings.enabledIntegralRules) {
              this.memberSettings.integralRules = {
                expenseAmount: '', // 消费金额
                integral: '' // 所得积分
              }
            }
            if (!this.memberSettings.enabledRecharge) {
              this.memberSettings.rechargeArray = [
                {
                  index: 0,
                  rechargeAmount: '', // 充值金额
                  presentAmount: '', // 赠送金额
                  presentIntegral: '' // 赠送积分
                }
              ]
            } else {
              for (let i = 0; i < this.memberSettings.rechargeArray.length; i++) {
                this.memberSettings.rechargeArray[i].index = i
              }
            }
          }
        } else {
          this.$Message.success('请进行设置')
        }
      })
    },
    surelSave () {
      console.log(this.memberSettings.rechargeArray)
      if (this.memberSettings.enabledIntegralRules) {
        if (this.memberSettings.integralRules.integral == '') {
          this.$Message.warning('数据不能为空1')
          return false
        }
        if (this.memberSettings.integralRules.expenseAmount == '') {
          this.$Message.warning('数据不能为空2')
          return false
        }
      }
      if (this.memberSettings.enabledRecharge) {
        for (let i = 0; i < this.memberSettings.rechargeArray.length; i++) {
          if (this.memberSettings.rechargeArray[i].rechargeAmount == '') {
            this.$Message.warning('数据不能为空3')
            return false
          }
          if (this.memberSettings.rechargeArray[i].presentAmount == '') {
            this.$Message.warning('数据不能为空4')
            return false
          }
          if (this.memberSettings.rechargeArray[i].presentIntegral == '') {
            this.$Message.warning('数据不能为空5')
            return false
          }
        }
      }
      updateMemberSettings(this.memberSettings).then(res => {
        if (res.data.success) {
          this.$Message.info('操作成功')
          this.initMemberSettings()
        } else {
          this.$Message.warning('操作失败')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    cancelSave () {
      this.initMemberSettings()
    },
    change (status) {
      if (status == 0) {
        // 关闭时
        this.memberSettings.enabledIntegralRules = false // 是否开启积分规则
        this.memberSettings.enabledRecharge = false // 是否开启充值规则
      }
    },
    // codeChange (status) {
    //   if (status == 0) {
    //     this.memberSettings.integralRules={
    //       expenseAmount: '', //消费金额
    //         integral: '' // 所得积分
    //     }
    //   }
    // },
    // giveChange (status) {
    //   if (status == 0) {
    //
    //     this.memberSettings.rechargeArray= [
    //       {
    //         index: 0,
    //         rechargeAmount: '', // 充值金额
    //         presentAmount: '', // 赠送金额
    //         presentIntegral: '' // 赠送积分
    //       }
    //     ]
    //   }
    // },
    giveAdd () {
      this.index = this.memberSettings.rechargeArray.length
      this.memberSettings.rechargeArray.push({
        index: this.index,
        rechargeAmount: '', // 充值金额
        presentAmount: '', // 赠送金额
        presentIntegral: '' // 赠送积分
      })
    },
    giveRemove (index) {
      this.memberSettings.rechargeArray.splice(index, 1)
    },
    spanAdd () {
      this.inputVal = ''
      this.tagsInput = true
      this.tagsBtn = false
      this.addBlock = true
      this.sureToChange = false
      this.sureToAdd = true
    },
    box () {
      this.tagList.push({
        value: this.inputVal
      })
      this.addBlock = false
      this.tagsBtn = true
    },
    close (event, name) {
      this.tagsInput = false
      this.sooo = false
      this.sureToAdd = false
      this.tagsBtn = true
      var j = ''
      for (var i = 0; i < this.tagList.length; i++) {
        var flag = false
        if (name == this.tagList[i].value) {
          j = i
          flag = true
        }
        if (flag) {
          break
        }
      }
      this.tagList.splice(j, 1)
      this.$Message.success('删除成功')
    },
    changeValue (event, name) {
      this.tagsBtn = false
      this.tagsInput = false
      this.sureToAdd = false
      this.text = name
      this.addBlock = true
      this.sooo = true
      this.sureToChange = true
      var j = ''
      for (var i = 0; i < this.tagList.length; i++) {
        var flag = false
        if (name == this.tagList[i].value) {
          j = i
          flag = true
        }
        if (flag) {
          break
        }
      }
      this.valueIndex = j
    }

  }
}
</script>
