import axios from 'axios'

axios.defaults.withCredentials = true
axios.interceptors.request.use(config => {
  if (localStorage.MOJI_ANYWAY_TOKEN) {
    config.headers.Authorization = `Bearer ${localStorage.MOJI_ANYWAY_TOKEN}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => response, error => Promise.resolve(error.response))

function checkStatus (response) {
  if (response.status === 401) {
    localStorage.removeItem('FACE_CARD_PRO_TOKEN')
    window.location.href = '/'
  }
  if (response.status === 501) {
    window.location.href = '/www-admin'
  }
  if (response.status === 200 || response.status === 304) {
    return response
  }
  return {
    data: {
      code: -404,
      message: response.statusText,
      data: ''
    }
  }
}

function checkCode (res) {
  if (res.status === -500) {
    window.location.href = '/www-admin'
  } else if (res.status === -400) {
    window.location.href = '/'
  } else if (res.status !== 200) {
    // createStore().dispatch('global/showMsg', res.data.message)
  }
  return res
}
export default {
  post (url, data) {
    var urltemp = '/manage/' + url
    return axios({
      method: 'post',
      url: urltemp,
      data: data,
      timeout: '30000',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(checkStatus).then(checkCode)
  },
  get (url, params = {}) {
    var urltemp = '/manage/' + url
    return axios({
      method: 'get',
      url: urltemp,
      params,
      timeout: '30000',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(checkStatus).then(checkCode)
  }
}
