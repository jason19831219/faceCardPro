<template>
  <el-menu
    class="el-menu-vertical-demo"
    router
    unique-opened
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">

    <el-submenu index="1">
      <template slot="title">
        <span>导航一</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/">用户</el-menu-item>
        <el-menu-item index="/">参考图</el-menu-item>
        <el-menu-item index="/admin">管理员</el-menu-item>
      </el-menu-item-group>
    </el-submenu>

  </el-menu>
</template>

<style scoped>
  .over-hide {
    overflow: hidden;
  }
</style>

<script>

export default {
  data () {
    return {}
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
