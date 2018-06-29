/**
 * @file store index
 * @author dora(doramart@qq.com)
 */

import Vue from 'vue'
import Vuex from 'vuex'
import Admin from './admin'
import Star from './star'
import User from './user'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    admin: Admin,
    star: Star,
    user: User
  }
})
