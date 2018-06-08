import api from '../../api'

const state = () => ({
  lists: {
    data: [],
    hasNext: 0,
    page: 1,
    path: ''
  },
  item: {
    data: {},
    path: '',
    isLoad: false
  },
  hotContentList: [],
  recContentList: [],
  recentContentList: []
})

const actions = {
  async 'getArticleList' ({
    commit,
    state
  }, config) {
    if (state.lists.data.length > 0 && config.path === state.lists.path) {
      return
    }
    const {
      data
    } = await api.get('content/getList', {
      ...config,
      cache: true
    })
    if (data.docs && data.state === 'success') {
      commit('receiveArticleList', {
        ...config,
        ...data
      })
    }
  }
}

const mutations = {
  'receiveArticleList' (state, {
    docs,
    pageInfo,
    hasNext,
    hasPrev,
    page,
    path
  }) {
    state.lists = {
      data: docs,
      pageInfo,
      hasNext,
      hasPrev,
      page,
      path
    }
  }
}

const getters = {
  getArticleList: (state, getters) => (path) => {
    if (path === state.lists.path) {
      return state.lists
    } else {
      return {
        data: {},
        loading: true
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
