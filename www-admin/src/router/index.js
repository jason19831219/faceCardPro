import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/Home'
import User from '@/view/User'
import Admin from '@/view/Admin'
import Star from '@/view/Star'
import FaceCard from '@/view/FaceCard'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/user',
      name: 'User',
      component: User
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
    },
    {
      path: '/faceCard',
      name: 'FaceCard',
      component: FaceCard
    }
  ]
})
