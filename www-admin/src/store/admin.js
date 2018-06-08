import api from '@/api'
import validatorUtil from '@/utils/validation'

const state = () => ({
  adminAddForm: {
    userName: '',
    password: '',
    passwordConfirmed: '',
    mobile: ''
  },
  loginForm: {
    userName: '',
    password: ''
  },
  loginRule: {
    userName: [
      {validator: validateUserName, trigger: 'blur'}
    ],
    password: [
      {validator: validatePassword, trigger: 'blur'}
    ]
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

// var validateMobile = (rule, value, callback) => {
//   if (value === '') {
//     callback(new Error('请输入手机号'))
//   } else {
//     if (!validatorUtil.checkMobilePhoneNum(value)) {
//       callback(new Error('请输入正确的手机号'))
//     }
//     callback()
//   }
// }

const mutations = {

  // 'getUserList' (state, { userInfo }) {
  //   state.userList = {
  //     userInfo
  //   }
  // },
  // 'recevieSessionState' (state, { userInfo, logined }) {
  //   state.sessionState = {
  //     userInfo, logined
  //   }
  // },
  // 'getMobilrCode' (state, { formData }) {
  //   state.mobileNo = Object.assign({
  //     phoneNum: ''
  //   }, formData)
  // },
  // 'recevieUserLoginForm' (state, { formData }) {
  //   state.loginForm = Object.assign({
  //     email: '',
  //     password: ''
  //   }, formData)
  // },
  // 'recevieUserRegForm' (state, { formData }) {
  //   state.regForm = Object.assign({
  //     userName: '',
  //     email: '',
  //     password: '',
  //     confirmPassword: ''
  //   }, formData)
  // },
  // 'recevieUserNotices' (state, noticelist) {
  //   state.userNotices = noticelist
  // },
  // 'recevieUserReplies' (state, replylist) {
  //   state.userReplies = replylist
  // },
  // 'recevieUserContents' (state, contentlist) {
  //   state.userContents = contentlist
  // },
  // 'showContentForm' (state, formState) {
  //   state.content.formState.edit = formState.edit
  //   state.content.formState.formData = Object.assign({
  //     title: '',
  //     stitle: '',
  //     type: '',
  //     categories: [],
  //     sortPath: '',
  //     tags: [],
  //     keywords: '',
  //     sImg: '',
  //     discription: '',
  //     author: {},
  //     state: true,
  //     isTop: 0,
  //     clickNum: 0,
  //     comments: '',
  //     markDownComments: '',
  //     commentNum: 0,
  //     likeNum: 0,
  //     likeUserIds: '',
  //     from: '3'
  //   }, formState.formData)
  // }
}

const actions = {
  // async getSmsCode ({commit}, value) {
  //   const { data } = await api.post('users/getsmscode', { mobile: value })
  //   if (data.state === 'success') {
  //     commit('GETSmsCode', {
  //       ...data
  //     })
  //   }
  // },
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
  // async 'getSessionState' ({ commit, state }, config) {
  //   const { data } = await api.get('users/session')
  //   if (data.state === 'success') {
  //     commit('recevieSessionState', {
  //       ...config,
  //       ...data
  //     })
  //   }
  // },
  // async 'getMobilrCode' ({commit}, params) {
  //   commit('getMobilrCode', {
  //     ...params
  //   })
  // },
  // async 'regForm' ({commit}, params) {
  //   commit('recevieUserRegForm', {
  //     ...params
  //   })
  // },
  // async 'userNotices' ({
  //   commit
  // }, params) {
  //   const { data } = await api.get('users/getUserNotifys')
  //   commit('recevieUserNotices', data)
  // },
  // async 'userReplies' ({
  //   commit
  // }, params) {
  //   const { data } = await api.get('users/getUserReplies')
  //   commit('recevieUserReplies', data)
  // },
  // async 'userContents' ({
  //   commit
  // }, params) {
  //   const { data } = await api.get('users/getUserContents')
  //   commit('recevieUserContents', data)
  // },
  // async 'contentForm' ({
  //   commit
  // }, params) {
  //   commit('showContentForm', {
  //     edit: params.edit,
  //     formData: params.formData
  //   })
  // }
}

const getters = {
  'loginForm' (state) {
    return state.loginForm
  },
  'loginRule' (state) {
    return state.loginRule
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
