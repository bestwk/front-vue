<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="modify">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <modal v-model="showPerson">
      <div>
        个人信息
      </div>
    </modal>
    <modal v-model="showModify" title="修改密码" style="margin: 15px;padding: 10px" footer-hide>
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <FormItem label="原密码" prop="oldPasswd">
          <Input type="password" v-model="formCustom.oldPasswd" placeholder="请输入6到8位数字或英文密码"></Input>
        </FormItem>
        <FormItem label="新密码" prop="passwd">
          <Input type="password" v-model="formCustom.passwd" placeholder="请输入6到8位数字或英文密码"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="passwdCheck">
          <Input type="password" v-model="formCustom.passwdCheck" placeholder="请输入6到8位数字或英文密码"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formCustom')" style="float: right;margin-left: 18px;margin-right: 18px">提交</Button>
          <Button @click="handleReset('formCustom')" style="float: right;">清空</Button>
        </FormItem>
      </Form>
    </modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import {updateAdminPwd} from '../../../../api/user'
// import {updateAdminPwd} from '../../../../api/admin-manage/admin-manage'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.formCustom.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField('passwdCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认新密码'))
      } else if (value !== this.formCustom.passwd) {
        callback(new Error('两次填写的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      showPerson: false,
      showModify: false,
      formCustom: {
        passwd: '',
        passwdCheck: '',
        oldPasswd: ''
      },
      ruleCustom: {
        oldPasswd: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_]{6,8}$/, message: '密码格式不正确', trigger: 'blur' }
        ],
        passwd: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_]{6,8}$/, message: '密码格式不正确', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          { required: true, message: '确认新密码不能为空', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_]{6,8}$/, message: '密码格式不正确', trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'logon'
            })
          })
          break
        case 'modify':
          this.showModify = true
          break
      }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let admin = {
            oldPwd: this.formCustom.oldPasswd,
            newPwd: this.formCustom.passwd
          }
          updateAdminPwd(admin).then(res => {
            console.log(res)
            if (!res.data.success) {
              this.$Message.warning(res.data.message)
            } else {
              this.$Message.info({
                content: '修改成功,请重新登录',
                duration: 2
              })
              this.handleClick('logout')
            }
          })
        } else {
          this.$Message.error('提交失败')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
