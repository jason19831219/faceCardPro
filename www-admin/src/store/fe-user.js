import api from '@/api'
import validatorUtil from '@/utils/validation'

const state = () => ({
  jwt_local_name: 'MOJI_ANYWAY_TOKEN',
  mobileForm: {
    mobile: ''
  },
  mobileFormRule: {
    mobile: [
      {validator: validateMobile, trigger: 'blur'}
    ]
  },
  smsForm: {
    code: ''
  },
  smsFormRule: {
    code: [
      {validator: validateSmsCode, trigger: 'blur'}
    ]
  }
})

var validateMobile = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else {
    if (!validatorUtil.checkMobilePhoneNum(value)) {
      callback(new Error('请输入正确的手机号'))
    }
    callback()
  }
}
var validateSmsCode = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机验证码'))
  } else {
    if (!validatorUtil.checkSmsCode(value)) {
      callback(new Error('请输入正确的手机验证码'))
    }
    callback()
  }
}

const mutations = {
  GETSmsCode (state, phoneNum) {
    console.log(phoneNum)
  },

  ReceiveSmsCode (state, {userInfo}) {
    console.log(state, userInfo)
  },

  mobileAuth (state, phoneNum) {
    state.mobile.mobile = phoneNum
  }
}

const actions = {
  async getSmsCode ({commit}, value) {
    const {data} = await api.post('users/getSmsCode', {mobile: value})
    if (data.state === 'success') {
      commit('ReceiveSmsCode', {
        ...data
      })
    }
  },
  async 'loginForm' ({
    commit
  }, params) {
    commit('recevieUserLoginForm', {
      ...params
    })
  }
}

const getters = {
  'mobileForm' (state) {
    return state.mobileForm
  },
  'mobileFormRule' (state) {
    return state.mobileFormRule
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
