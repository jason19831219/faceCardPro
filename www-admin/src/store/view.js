import api from '@/api'
// import { Message } from 'element-ui'
// import validatorUtil from '@/utils/validation'
const state = () => ({
  list: [],
  listInfo: {
    pageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    nameReg: ''
  }
})

const mutations = {
  'receiveList' (state, {list, pageInfo}) {
    state.list = list
    state.listInfo = pageInfo
  }
}

const actions = {
  async 'getAll' ({commit, state}) {
    const {data} = await api.get('view/getAll', {...state.listInfo})
    if (data.list && data.state === 'success') {
      commit('receiveList', {...data})
    }
  },
  async 'setPageSize' ({commit, dispatch, state}, val) {
    state.listInfo.pageSize = val
    dispatch('getAll')
  },
  async 'setPageNumber' ({commit, dispatch, state}, val) {
    state.listInfo.pageNumber = val
    dispatch('getAll')
  }
}

const getters = {
  'list' (state) {
    return state.list
  },
  'listInfo' (state) {
    return state.listInfo
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
