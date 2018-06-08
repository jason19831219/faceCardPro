import api from '@/api'
const state = () => ({
  list: [],
  listPageInfo: {
    pageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    nameReg: ''
  },
  addForm: {
    src: '',
    name: '',
    desc: '',
    author: ''
  },
  addRule: {
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
    src: [
      {
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
    ]
  }
})

const mutations = {
  'receiveList' (state, {
    list,
    pageInfo
  }) {
    state.list = list
    state.listPageInfo = pageInfo
  }
}

const actions = {
  async 'getAll' ({commit, state}) {
    const {
      data
    } = await api.get('moji/getAll', {
      ...state.listPageInfo
    }, true)
    if (data.list && data.state === 'success') {
      commit('receiveList', {
        ...data
      })
    }
  },
  async 'setPageSize' ({commit, dispatch, state}, val) {
    state.listPageInfo.pageSize = val
    dispatch('getAll')
  },
  async 'setPageNumber' ({commit, dispatch, state}, val) {
    state.listPageInfo.PageNumber = val
    dispatch('getAll')
  },
  async 'addMojiSetOne' ({commit, state}) {
    const {
      data
    } = await api.get('moji/addOne', {
      ...state.listPageInfo
    }, true)
    if (data.list && data.state === 'success') {
    }
  }
}

const getters = {
  'list' (state) {
    return state.list
  },
  'listPageInfo' (state) {
    return state.listPageInfo
  },
  'addForm' (state) {
    return state.addForm
  },
  'addRule' (state) {
    return state.addRule
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
