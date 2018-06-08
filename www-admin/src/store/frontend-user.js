import api from '../../api'
import validatorUtil from '../../utils/validation'

const state = () => ({
  mobileAuth: {
    mobile: ''
  },
  mobileAuthRule: {
    mobile: [
      {validator: validateMobile, trigger: 'blur'}
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

const mutations = {
  GETSmsCode (state, phoneNum) {
    console.log(phoneNum)
  },

  ReceiveSmsCode (state, { userInfo }) {
    console.log(state, userInfo)
  },

  UPTATEMobile (state, phoneNum) {
    state.mobile.phoneNum = phoneNum
  }
}

const actions = {
  async getSmsCode ({ commit }, value) {
    const { data } = await api.post('users/getSmsCode', { mobile: value })
    if (data.state === 'success') {
      commit('ReceiveSmsCode', {
        ...data
      })
    }
  },
  async doReg ({ commit }, value) {
    const { data } = await api.post('users/doReg', { mobile: value })
    if (data.state === 'success') {
      commit('ReceiveSmsCode', {
        ...data
      })
    }
  }
}

const getters = {
  'regForm' (state) {
    return state.regForm
  },
  'regRule' (state) {
    return state.regRule
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
