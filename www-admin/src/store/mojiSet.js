import api from '@/api'
import validatorUtil from '@/utils/validation'
const state = () => ({
  mojiSetList: [],
  mojiSetListPageInfo: {
    pageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    nameReg: ''
  },
  addForm: {
    name: '',
    desc: '',
    author: '',
    price: 0.00
  },
  mojiSetAddRule: {
    name: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('名字'))
          }
          callback()
        },
        trigger: 'blur'
      }
    ],
    author: [
      {
        trigger: 'blur'
      }
    ],
    desc: [
      {
        trigger: 'blur'
      }
    ],
    price: [
      {
        validator: (rule, value, callback) => {
          if (!validatorUtil.checkCurrency(value)) {
            callback(new Error('只能输如数字，且2位小数'))
          }
          callback()
        },
        trigger: 'blur'
      }
    ]
  }
})

const mutations = {
  'receiveMojiSetList' (state, {
    list,
    pageInfo
  }) {
    state.mojiSetList = list
    state.mojiSetList.forEach(function (value, key) {
      value.mojis.push('')
      var mojisList = value.mojis
      value.mojis.forEach(function (value, key) {
        mojisList[key] = {old: value, new: value}
      })
    })
    state.mojiSetListPageInfo = pageInfo
  }
}

const actions = {
  async 'getMojiSetList' ({
    commit,
    state
  }) {
    const {
      data
    } = await api.get('mojiSet/getList', {
      ...state.mojiSetListPageInfo
    }, true)
    if (data.list && data.state === 'success') {
      commit('receiveMojiSetList', {
        ...data
      })
    }
  },
  async 'setPageSize' ({
    commit,
    dispatch,
    state
  }, val) {
    state.mojiSetListPageInfo.pageSize = val
    dispatch('getMojiSetList')
  },
  async 'setPageNumber' ({
    commit,
    dispatch,
    state
  }, val) {
    state.mojiSetListPageInfo.pageNumber = val
    dispatch('getMojiSetList')
  },
  async 'addMojiSetOne' ({
    commit,
    state
  }) {
    const {
      data
    } = await api.get('mojiSet/addOne', {
      ...state.mojiSetListPageInfo
    }, true)
    if (data.list && data.state === 'success') {
    }
  }
}

const getters = {
  'mojiSetList' (state) {
    return state.mojiSetList
  },
  'mojiSetListPageInfo' (state) {
    return state.mojiSetListPageInfo
  },
  'addForm' (state) {
    return state.addForm
  },
  'mojiSetAddRule' (state) {
    return state.mojiSetAddRule
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
