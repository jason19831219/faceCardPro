/**
 * @file store index
 * @author dora(doramart@qq.com)
 */

import Vue from 'vue'
import Vuex from 'vuex'
import Admin from './admin'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    admin: Admin
  }
})
