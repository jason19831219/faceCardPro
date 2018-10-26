import Vue from 'vue'
import Router from 'vue-router'
// import Home from  '@/view/Home'
const Home = () => import(/* webpackChunkName: "Home" */ '@/view/Home')
const User = () => import(/* webpackChunkName: "User" */ '@/view/User')
const Admin = () => import(/* webpackChunkName: "Admin" */ '@/view/Admin')
const Star = () => import(/* webpackChunkName: "Star" */ '@/view/Star')
const FaceCard = () => import(/* webpackChunkName: "FaceCard" */ '@/view/FaceCard')
const Record = () => import(/* webpackChunkName: "Record" */ '@/view/Record')
// import User from '@/view/User'
// import Admin from '@/view/Admin'
// import Star from '@/view/Star'
// import FaceCard from '@/view/FaceCard'
//
// const Home = require('@/view/Home')
//
// Home.chunkName = 'ddd'

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
    },
    {
      path: '/record',
      name: 'Record',
      component: Record
    }
  ]
})
