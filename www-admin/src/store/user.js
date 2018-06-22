import api from '@/api'
import { Message } from 'element-ui'
import validatorUtil from '@/utils/validation'

const state = () => ({
  list: [],
  listPageInfo: {
    pageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    nameReg: ''
  },
  itemForm: {
    userName: '',
    password: '',
    passwordConfirmed: '',
    mobile: ''
  },
  itemDialog: {
    visable: false,
    title: ''
  }
})

var validateUserName = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else {
    if (!validatorUtil.checkUserName(value)) {
      callback(new Error('5-12个英文字符!'))
    }
    callback()
  }
}

var validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (!validatorUtil.checkPwd(value)) {
      callback(new Error('6-12位，只能包含字母、数字和下划线!'))
    }
    callback()
  }
}

// var validatePasswordConfirmed = (rule, value, callback) => {
//   if (value === '') {
//     callback(new Error('请输入确认密码'))
//   } else {
//     if (value !== this.state.itemForm.password) {
//       callback(new Error('两次输入密码不一致!'))
//     }
//     callback()
//   }
// }
//
// var validateMobile = (rule, value, callback) => {
//   if (value === '') {
//     callback(new Error('请输入手机号'))
//   } else {
//     if (!validatorUtil.checkMobilePhone(value)) {
//       callback(new Error('请输入正确的手机号'))
//     }
//     callback()
//   }
// }

const mutations = {
  'receiveList' (state, {list, pageInfo}) {
    state.list = list
    state.listPageInfo = pageInfo
    state.itemDialog.visable = false
  }
}

const actions = {
  async 'getAll' ({commit, state}) {
    const {data} = await api.get('admin/getAll', {...state.listPageInfo}, true)
    if (data.list && data.state === 'success') {
      commit('receiveList', {...data})
    }
  },
  async 'setPageSize' ({commit, dispatch, state}, val) {
    state.listPageInfo.pageSize = val
    dispatch('getAll')
  },
  async 'setPageNumber' ({commit, dispatch, state}, val) {
    state.listPageInfo.pageNumber = val
    dispatch('getAll')
  },
  async 'addOne' ({commit, dispatch, state}) {
    const {data} = await api.post('admin/addOne', {...state.itemForm}, true)
    if (data.state === 'success') {
      Message({
        message: '保存成功',
        type: 'success'
      })
      dispatch('getAll')
    } else {
      Message({
        message: data.message,
        type: 'error'
      })
    }
  },
  async 'updateOne' ({commit, dispatch, state}) {
    const {data} = await api.post('admin/updateOne', {...state.itemForm}, true)
    if (data.state === 'success') {
      dispatch('getAll')
      Message({
        message: '更新成功',
        type: 'success'
      })
    } else {
      Message({
        message: data.message,
        type: 'error'
      })
    }
  },
  async 'deleteOne' ({commit, dispatch, state}) {
    const {data} = await api.get('admin/deleteOne', {ids: state.itemForm._id}, true)
    if (data.state === 'success') {
      dispatch('getAll')
      Message({
        message: '删除成功',
        type: 'success'
      })
    } else {
      Message({
        message: data.message,
        type: 'error'
      })
    }
  },
  async 'setForm' ({commit, state}, index) {
    if (index === -1) {
      state.itemForm = {
        userName: '',
        password: '',
        passwordConfirmed: '',
        mobile: ''
      }
    } else {
      state.itemForm = state.list[index]
    }
  }
}

const getters = {
  'loginForm' (state) {
    return state.loginForm
  },
  'loginRule' (state) {
    return state.loginRule
  },
  'list' (state) {
    return state.list
  },
  'listPageInfo' (state) {
    return state.listPageInfo
  },
  'itemForm' (state) {
    return state.itemForm
  },
  'itemRule' (state) {
    return state.itemRule
  },
  'itemDialog' (state) {
    return state.itemDialog
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
