<template>
    <el-row>
      <el-col :span="6" :offset="9">
        <el-form :model="loginForm" :rules="loginRule" ref="loginForm" label-width="80px">
          <el-form-item prop="userName" label="用户名">
            <el-input placeholder="请填写用户名" v-model="loginForm.userName"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input placeholder="请输入密码" type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item class="submit-btn">
            <el-button type="primary" @click="login('loginForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
</template>
<script>
import api from '@/api'
import { mapGetters } from 'vuex'

export default {
  name: 'AdminLogin',
  data: function () {
    return {}
  },
  computed: {
    ...mapGetters({
      loginForm: 'admin/loginForm',
      loginRule: 'admin/loginRule'
    })
  },
  methods: {
    login (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.loginForm
          api
            .post('admin/login', params, true)
            .then(result => {
              console.log(result.data.state)
              if (result.data.state === 'success') {
                this.$message({
                  message: '登录成功',
                  type: 'success',
                  onClose: () => {
                    this.$router.push({path: '/admin'})
                  }
                })
              } else {
                this.$message({
                  message: result.data.message,
                  type: 'error'
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style>

</style>
