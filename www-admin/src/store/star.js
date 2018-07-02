import api from '@/api'
import { Message } from 'element-ui'
// import validatorUtil from '@/utils/validation'

const state = () => ({
  list: [],
  listInfo: {
    pageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    nameReg: ''
  },
  itemForm: {
    name: '',
    src: '',
    age: '',
    angle: '',
    beauty: '',
    expression: '',
    face_probability: '',
    face_shape: '',
    face_token: '',
    gender: '',
    glasses: '',
    landmark: '',
    landmark72: '',
    location: '',
    race: ''
  },
  itemRule: {
    name: [
      {
        required: true,
        trigger: 'blur'
      }
    ],
    src: [
      {
        required: true,
        trigger: 'blur'
      }
    ]
  },
  itemDialog: {
    visable: false,
    title: ''
  }
})

const mutations = {
  'receiveList' (state, {list, pageInfo}) {
    state.list = list
    state.listInfo = pageInfo
    state.itemDialog.visable = false
  },
  'receiveImage' (state, {info}) {
    state.itemForm.src = info.path
  },
  'receiveAipInfo' (state, {info}) {
    state.itemForm.age = info[0].age
    state.itemForm.yaw = info[0].angle.yaw
    state.itemForm.pitch = info[0].angle.pitch
    state.itemForm.roll = info[0].angle.roll
    state.itemForm.beauty = info[0].beauty
    state.itemForm.expression = info[0].expression.type
    state.itemForm.face_probability = info[0].face_probability
    state.itemForm.face_shape = info[0].face_shape.type
    state.itemForm.face_token = info[0].face_token
    state.itemForm.gender = info[0].gender.type
    state.itemForm.glasses = info[0].glasses.type
    state.itemForm.landmark = JSON.stringify(info[0].landmark)
    state.itemForm.landmark72 = JSON.stringify(info[0].landmark72)
    state.itemForm.location = JSON.stringify(info[0].location)
    state.itemForm.race = info[0].race.type
    console.log(info)
  }
}

const actions = {
  async 'getAll' ({commit, state}) {
    const {data} = await api.get('star/getAll', {...state.listInfo})
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
  },
  async 'addOne' ({commit, dispatch, state}) {
    const {data} = await api.post('star/addOne', {...state.itemForm})
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
    const {data} = await api.post('star/updateOne', {...state.itemForm})
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
    const {data} = await api.get('star/deleteOne', {ids: state.itemForm._id}, true)
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
        name: '',
        src: '',
        age: '',
        angle: '',
        beauty: '',
        expression: '',
        face_probability: '',
        face_shape: '',
        face_token: '',
        gender: '',
        glasses: '',
        landmark: '',
        landmark72: '',
        location: '',
        race: ''
      }
    } else {
      state.itemForm = state.list[index]
    }
  },
  async 'uploadImageBase64' ({commit, state}, info) {
    const {data} = await api.post('uploadsImageBase64', {...info})
    if (data.state === 'success') {
      Message.success(data.message)
      commit('receiveImage', {...data})
    }
  },
  async 'uploadImage' ({commit, dispatch, state}, event) {
    var file = event.target.files[0]
    const isImage = (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')
    const isLt2M = file.size / 1024 / 1024 / 2 < 2
    if (!isLt2M) {
      Message.error('上传头像图片大小不能超过 2M!')
      return
    }
    if (!isImage) {
      Message.error('只能上传图片！')
      return
    }

    if (!file || !window.FileReader) return

    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function () {
      var result = this.result
      var img = new Image()
      var canvas = document.createElement('canvas')
      var drawer = canvas.getContext('2d')
      img.src = result
      img.onload = function () {
        canvas.height = img.height
        canvas.width = img.width
        drawer.drawImage(img, 0, 0, canvas.width, canvas.height)
        var base64 = canvas.toDataURL('image/jpeg', 1.0)
        var data = {
          imgData: base64
        }
        dispatch('uploadImageBase64', data)
      }
    }
  },
  async 'getAipInfo' ({commit, state}) {
    const {data} = await api.post('startAipFace', {path: state.itemForm.src})
    if (data.state === 'success') {
      Message.success(data.message)
      commit('receiveAipInfo', {...data})
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
  'listInfo' (state) {
    return state.listInfo
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
