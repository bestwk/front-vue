<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">云平台代理商登录</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ account, password }) {
      this.$Message.destroy()
      this.$Message.loading({duration: 0, content: '正在登录，请稍后.....'})
      this.handleLogin({account, password}).then(res => {
        this.$Message.destroy()
        if (typeof this.$store.getters.httpResult === 'string') {
          if (this.$store.getters.httpResult === 'true') {
            this.$router.push({
              name: 'index'
            })
          } else {
            this.$Message.destroy()
            this.$Message.error(this.$store.getters.Message)
          }
        } else {
          if (this.$store.getters.httpResult) {
            this.$router.push({
              name: 'index'
            })
          } else {
            this.$Message.destroy()
            this.$Message.error(this.$store.getters.Message)
          }
        }
      }).catch(err => {
        console.log(err)
        this.$Message.destroy()
        this.$Message.error(this.$store.getters.Message)
      })
    }
  },
  computed: {
    ...mapGetters([
      'httpResult'
    ])
  }
}
</script>

<style>

</style>
