import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/Home'
import Admin from '@/view/Admin'
import Star from '@/view/Star'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/star',
      name: 'Star',
      component: Star
    }
  ]
})
