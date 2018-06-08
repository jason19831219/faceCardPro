<template>
    <el-form label-position="top" :model="loginForm" :rules="loginRule" ref="adminLoginForm" label-width="0px"
             class="demo-ruleForm login-container">
      <h3 class="title">
        <span>登录</span>
      </h3>
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
</template>
<script>
import api from '@/api'
import { mapGetters } from 'vuex'

export default {
  name: 'AdminLogin',
  metaInfo () {
    return {
      title: '管理员登录'
    }
  },
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
    // login (formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       let params = this.adminLoginForm
    //       api
    //         .post('admin/login', params, true)
    //         .then(result => {
    //           if (result.data.state === 'success') {
    //             this.$message({
    //               message: '登录成功',
    //               type: 'success',
    //               onClose: () => {
    //                 this.$router.push({path: '/moji-admin/moji'})
    //               }
    //             })
    //           } else {
    //             this.$message({
    //               message: result.data.message,
    //               type: 'error'
    //             })
    //           }
    //         })
    //         .catch(err => {
    //           this.$message.error(err.response.data.error)
    //         })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // }
  }
}
</script>

<style>

</style>
