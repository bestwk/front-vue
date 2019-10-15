<template>
  <div>
    <Card>
      <span style="font-size: large;font-weight: bolder">外卖设置</span>
      <Divider></Divider>
      <Row>
        <Col span="2">
          账户类型:
        </Col>
        <Col span="22" >
          <span>商户帐号</span>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">登录帐号:</Col>
        <Col span="22" >
          <!--<Input v-model="manageLogin.account" style="width: 300px" disabled></Input>-->
          <span>{{manageLogin.account}}</span>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">真实姓名:</Col>
        <Col span="22" >
          <!--<Input v-model="manageLogin.name" style="width: 300px" disabled></Input>-->
          <span>{{manageLogin.name}}</span>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">联系电话:</Col>
        <Col span="22" >
          <span>{{manageLogin.phone}}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button @click="xiugai">修改</Button>
        </Col>
      </Row>

      <!--<Row>-->
        <!--<Col span="24">-->
          <!--<Button type="warning" style="margin-left: 80px" @click="cancelSave">取消</Button>-->
          <!--<Button type="primary" style="margin-left: 50px" @click="surelSave">保存</Button>-->
        <!--</Col>-->
      <!--</Row>-->
    </Card>

    <modal v-model="modal1" title="修改手机号码" style="margin: 15px;padding: 10px;" width="400px" draggable scrollable footer-hide>
        <Row>
          <Col span="24">
            <span>为了保障你的账号安全，变更信息前需验证身份</span>
          </Col>
        </Row>
      <br/>
      <Row>
        <Col span="24" style="line-height: 32px">验证方式</Col>
      </Row>
      <Row>
        <Col span="24" >
          <!--<Input v-model="currentPhone" >{{manageLogin.phone}}</Input>-->
          <span>{{currentPhone}}</span>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="12" style="line-height: 32px">
          <Input v-model="currentCode"  placeholder="请输入验证码" search enter-button="确认" @on-search="checkcode">
          </Input>
        </Col>
        <Col span="6" offset="2" >
          <Button @click="getCode" >{{yanzhengma}}</Button>
        </Col>
      </Row>
    </modal>

    <modal v-model="modal2" title="修改手机号码" style="margin: 15px;padding: 10px" width="400px" draggable scrollable footer-hide>
      <Row>
        <Col span="24">
          <span>请输入你需要绑定的手机号,绑定后即可用该手机号登录所有产品</span>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="24" >
          <Input v-model="modifyPhone" placeholder="请输入需要更改的电话" ></Input>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="12" style="line-height: 32px">
          <Input v-model="modifyCode"  placeholder="请输入验证码" search enter-button="确认" @on-search="checkModifycode"></Input>
        </Col>
        <Col span="6" offset="2" >
          <Button @click="getModifyCode" >{{yanzhengma}}</Button>
        </Col>
      </Row>
      <br/>
      <Divider dashed />
      <Row>
        <Col span="24">
          <div><span>*你可能使用此手机找回密码及登录</span></div>
          <div><span>*请勿随意泄露手机号,以防被不法分子利用,骗取帐号信息</span></div>
        </Col>
      </Row>
    </modal>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
import {getManageLogin, updateAccount} from '../../api/system/account-settings'
export default {
  name: 'takeout-settings',
  data () {
    return {
      index: 0,
      manageLogin: {
        id: '',
        account: '', // 登录帐号
        name: '', // 真实姓名
        phone: '' // 账户电话
      },
      currentPhone: '', // 当前手机号
      currentCode: '', // 当前手机验证码
      modifyPhone: '', // 修改后的手机号
      modifyCode: '', // 修改后的手机号
      mathCode: '', // 验证码
      count: '', // 短信计时
      timer: '', // 定时器
      yanzhengma: '获取验证码',
      modal1: false,
      modal2: false
    }
  },
  created: function () {
    this.initaccount()
    this.initFormatter()
  },
  methods: {
    // 初始化方法
    initaccount: function () {
      getManageLogin().then(res => {
        if (res.data.success) {
          this.manageLogin = res.data.data
        }
        // this.takeout.storeType = formatDate(new Date(this.takeout.storeType), 'yyyy-MM-dd')
        // this.takeout.city = formatDate(new Date(this.takeout.city), 'yyyy-MM-dd')
      }).catch(err => {
        console.log(err)
      })
    },
    xiugai () {
      this.modal1 = true
      this.currentPhone = this.manageLogin.phone
    },
    setTime () {
      const TIME_COUNT = 60
      if (!this.timer) {
        console.log('进入定时器')
        this.count = TIME_COUNT
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
            this.yanzhengma = this.count + 's'
          } else {
            clearInterval(this.timer)
            this.timer = null
            this.yanzhengma = '获取验证码'
            this.mathCode = ''
            this.count = ''
          }
        }, 1000)
      }
    },
    success (msg) {
      this.$Message.success(msg)
    },
    warning (msg) {
      this.$Message.warning(msg)
    },
    checkcode () {
      console.log('currentCode:' + this.currentCode)
      console.log('mathCode:' + this.mathCode)
      if (this.yanzhengma == '获取验证码') {
        this.warning('请先获取验证码')
        return false
      }
      if (this.currentCode == '') {
        this.warning('验证码不能为空')
        return false
      }

      if (this.currentCode != this.mathCode && this.mathCode == '') {
        this.currentCode = ''
        this.warning('验证码错误或者过期,请重新发送')
        return false
      }

      if (this.currentCode == this.mathCode && this.currentCode != '') {
        this.modal1 = false
        this.modal2 = true
        clearInterval(this.timer)
        this.timer = null
        this.yanzhengma = '获取验证码'
        this.mathCode = ''
        this.count = ''
        this.currentCode = ''
      }
    },
    checkModifycode () {
      if (this.yanzhengma == '获取验证码') {
        this.warning('请先获取验证码')
        return false
      }
      if (this.modifyCode == '') {
        this.warning('验证码不能为空')
        return false
      }
      if (this.modifyCode != this.mathCode && this.mathCode == '') {
        this.modifyCode = ''
        this.warning('验证码错误或者过期,请重新发送')
        return false
      } else if (this.modifyCode == this.mathCode && this.modifyCode != '') {
        var phone = this.modifyPhone
        updateAccount(phone).then((res) => {
          if (res.data.success) {
            this.success(res.data.message)
            this.modal2 = false
            this.initaccount()
            clearInterval(this.timer)
            this.timer = null
            this.yanzhengma = '获取验证码'
            this.mathCode = ''
            this.count = ''
            this.modifyCode = ''
          } else {
            this.success(res.data.message)
            return false
          }
        })
      }
    },
    /** -------------------验证码--end---------------- */
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
        console.log(fmt)
        return fmt
      }
    },
    // 修改后的手机号发送验证码
    getModifyCode () {
      var phone = this.modifyPhone
      if (!(/^1[34578]\d{9}$/.test(phone))) {
        this.success('手机号码有误，请重填')
        return false
      }
      var i = Math.random() * (999999 - 100000) + 100000
      var j = parseInt(i, 10)
      this.mathCode = j
      console.log(this.mathCode)
      this.sendModifyMesCode()
    },
    // 发送验证码短信(绑定修改后的手机)
    sendModifyMesCode () {
      var phone = this.modifyPhone

      if (!(/^1[34578]\d{9}$/.test(phone))) {
        this.success('手机号码有误，请重填')
        return false
      }
      // 进行发送验证码
      var number = this.mathCode
      axios.request({
        method: 'GET',
        url: '/account/sendMes',
        params: {phone: phone, number: number}
      }).then((res) => {
        if (res.data.success) {
          this.success(res.data.message)
          this.setTime()
        } else {
          this.success(res.data.message)
          return false
        }
      })
    },
    // 获取验证码之前先获取我们发放的随机数
    getCode () {
      var phone = this.manageLogin.phone
      if (!(/^1[34578]\d{9}$/.test(phone))) {
        this.success('手机号码有误，请重填')
        return false
      }
      var i = Math.random() * (999999 - 100000) + 100000
      var j = parseInt(i, 10)
      this.mathCode = j
      console.log(this.mathCode)
      this.sendMesCode()
    },
    // 发送验证码短信(验证当前手机)
    sendMesCode () {
      var phone = this.manageLogin.phone

      if (!(/^1[34578]\d{9}$/.test(phone))) {
        this.success('手机号码有误，请重填')
        return false
      }
      // 进行发送验证码
      var number = this.mathCode
      axios.request({
        method: 'GET',
        url: '/account/sendMes',
        params: {phone: phone, number: number}
      }).then((res) => {
        if (res.data.success) {
          this.success(res.data.message)
          this.setTime()
        } else {
          this.success(res.data.message)
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
