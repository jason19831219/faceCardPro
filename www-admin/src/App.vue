<template>
  <div id="app">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="220px">
          <nav-menu></nav-menu>
        </el-aside>
        <el-main width="220px" justify="left">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import NavMenu from '@/components/NavMenu'

export default {
  name: 'App',
  data: function () {
    return {
      count: 0
    }
  },
  components: {
    'nav-menu': NavMenu
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  .el-main{
    text-align: left;
  }
  * {
    margin: 0;
    padding: 0;
    border: 0;
  }
</style>
