const FaceCardModel = require('../models').FaceCard
const UserModel = require('../models').User
const ViewModel = require('../models').View
const {settings, service} = require('../../utils')
const _ = require('lodash')
const chinaTime = require('china-time')
const moment = require('moment')

class FaceCard {
  async getAll (req, res, next) {
    let pageNumber = req.query.pageNumber || 1
    let pageSize = req.query.pageSize || 10
    let searchkey = req.query.searchkey
    let frontFlag = req.query.frontFlag || false
    let faceCardId = req.query.faceCardId
    let author = req.query.user
    let gender = req.query.gender
    let faceShape = req.query.faceShape
    let yaw = req.query.yaw
    let yawMinus = req.query.yawMinus
    let queryObj = {}
    if (faceCardId) {
      queryObj._id = faceCardId
    }
    if (searchkey) {
      let reKey = new RegExp(searchkey, 'i')
      queryObj.content = {$regex: reKey}
    }
    if (author) {
      queryObj.author = author
    }
    if (gender) {
      queryObj.gender = gender
    }
    if (faceShape) {
      queryObj.face_shape = faceShape
    }
    if (faceShape) {
      queryObj.yaw = {$gt: yawMinus, $lt: yaw}
    }

    queryObj.imgSrc = {$ne: []}
    queryObj.isRemove = 0
    var timeToChange = moment().add(-1, 'days').format('X')

    console.log(queryObj)

    if (!frontFlag) {
      if (req.session.skey) {
        let user = await UserModel.findOne({skey: req.session.skey})
        queryObj.author = user._id
      }

      await FaceCardModel.find(queryObj).populate('star').sort({
        createDate: -1
      }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).lean().exec(async function (err, comments) {
        comments.forEach(function (value) {
          if (moment(value.createDate, 'YYYY-MM-DD HH:mm:ss').format('X') > timeToChange) {
            value.createDate = moment(value.createDate, 'YYYY-MM-DD HH:mm:ss').startOf('minute').fromNow()
          } else {
            value.createDate = moment(value.createDate, 'YYYY-MM-DD HH:mm:ss').format('M月D日')
          }
        })
        const totalItems = await FaceCardModel.count(queryObj)
        res.send({
          state: 'success',
          list: comments,
          pageInfo: {
            totalItems,
            pageNumber: Number(pageNumber) || 1,
            pageSize: Number(pageSize) || 10,
            searchkey: searchkey || ''
          }
        })
      })
    } else {
      queryObj.isTop = 1
      var authorId = req.session.userId
      queryObj.author = {$ne: authorId}

      var list = await FaceCardModel.find(queryObj).populate('author').lean().exec()
      list.forEach(function (value) {
        if (moment(value.createDate, 'YYYY-MM-DD HH:mm:ss').format('X') > timeToChange) {
          value.createDate = moment(value.createDate, 'YYYY-MM-DD HH:mm:ss').startOf('minute').fromNow()
        } else {
          value.createDate = moment(value.createDate, 'YYYY-MM-DD HH:mm:ss').format('M月D日')
        }
      })

      if (list.length < 21) {
        list = _.shuffle(list)
        delete queryObj.yaw
        var secondList = await FaceCardModel.find(queryObj).populate('author').exec()
        secondList = _.shuffle(secondList)
        secondList.forEach(function (value) {
          // if(value.createDate>timeToChange){
          //     value.createDate = moment(value.createDate).startOf("minute").fromNow()
          // }else{
          //     value.createDate = moment(value.createDate).format('YYYY-MM-DD')
          // }
          // console.log(value.createDate);

          if (list.length < 21) {
            list.push(value)
          }
        })
      } else {
        var templist = _.shuffle(list)

        for (var i = 0; i < 20; i++) {
          list.push(templist[i])
        }
      }
      console.log('sdfsdf')

      res.send({
        state: 'success',
        list: list,
        pageInfo: {}
      })
    }
  }

  async getOne (req, res, next) {
    let faceCardId = req.query.faceCardId
    await FaceCardModel.findOneAndUpdate({_id: faceCardId}, {'$inc': {'clickNum': 1}}).populate('star').exec(function (err, comments) {
      res.send({
        state: 'success',
        faceCard: comments
      })
    })
  }

  async findRandomOne (req, res, next) {
    let gender = req.query.gender
    let faceShape = req.query.faceShape
    let yaw = req.query.yaw
    let yawMinus = req.query.yawMinus
    let queryObj = {}
    if (gender) {
      queryObj.gender = gender
    }
    if (faceShape) {
      queryObj.face_shape = faceShape
    }
    if (faceShape) {
      queryObj.yaw = {$gt: yawMinus, $lt: yaw}
    }

    queryObj.isTop = 1

    var number = await FaceCardModel.count(queryObj)
    var random = Math.floor(Math.random() * number)

    await FaceCardModel.find(queryObj).limit(1).skip(random).exec(function (err, comments) {
      res.send({
        state: 'success',
        faceCard: comments[0].id
      })
    })
  }

  async addOne (req, res) {
    var fields = req.body
    var errmsg = service.checkFormData(fields)
    if (errmsg != '') {
      res.send({
        state: 'error',
        message: errmsg
      })
      return
    }

    var facePhoto = fields.facePhoto
    if (!facePhoto) {
      res.send({
        state: 'error',
        message: '图片没有上传成功'
      })
    }

    const faceCardObj = {
      recommendPic: fields.recommendPic,
      facePhoto: fields.facePhoto,
      sidePhoto: fields.sidePhoto,
      backPhoto: fields.backPhoto,
      star: fields.star,
      hairLength: fields.hairLength,
      hairQuality: fields.hairQuality,
      hairQuantity: fields.hairQuantity,
      hairGranularity: fields.hairGranularity,
      hairCrispation: fields.hairCrispation,
      age: fields.age,
      yaw: fields.yaw,
      pitch: fields.pitch,
      roll: fields.roll,
      beauty: fields.beauty,
      expression: fields.expression,
      face_probability: fields.face_probability,
      face_shape: fields.face_shape,
      face_token: fields.face_token,
      gender: fields.gender,
      glasses: fields.glasses,
      landmark: fields.landmark,
      landmark72: fields.landmark72,
      location: fields.location,
      race: fields.race,
      isTop: fields.isTop,
      street: fields.street,
      district: fields.district,
      city: fields.city
    }

    if (fields.author) {
      faceCardObj.author = fields.author
    } else {
      faceCardObj.author = req.session.userId
    }

    try {
      let faceCard = await FaceCardModel.find({facePhoto: faceCardObj.facePhoto})
      if (!_.isEmpty(faceCard)) {
        res.send({
          state: 'error',
          message: '图片已存在！'
        })
      } else {
        const newFaceCard = new FaceCardModel(faceCardObj)
        await newFaceCard.save()
        res.send({
          state: 'success',
          data: {
            id: newFaceCard.id
          },
          message: '已保存'
        })
      }
    } catch (err) {
      res.send({
        state: 'error',
        message: '保存数据失败:'
      })
    }
  }

  async updateOne (req, res, next) {
    try {
      var fields = req.body
      var errmsg = service.checkFormData(fields)
      if (errmsg != '') {
        res.send({
          state: 'error',
          message: errmsg
        })
        return
      }

      var time = new Date()

      const faceCardObj = {
        recommendPic: fields.recommendPic,
        facePhoto: fields.facePhoto,
        sidePhoto: fields.sidePhoto,
        backPhoto: fields.backPhoto,
        star: fields.star,
        hairLength: fields.hairLength || 'NORMAL',
        hairQuality: fields.hairQuality || 'SOFT',
        hairQuantity: fields.hairQuantity || 'LOT',
        hairGranularity: fields.hairGranularity || 'NORMAL',
        hairCrispation: fields.hairCrispation || 'NONE',
        age: fields.age,
        yaw: fields.yaw,
        pitch: fields.pitch,
        roll: fields.roll,
        beauty: fields.beauty,
        expression: fields.expression,
        face_probability: fields.face_probability,
        face_shape: fields.face_shape,
        face_token: fields.face_token,
        gender: fields.gender,
        glasses: fields.glasses,
        landmark: fields.landmark,
        landmark72: fields.landmark72,
        location: fields.location,
        race: fields.race,
        isTop: fields.isTop === 0 ? 0 : 1,
        street: fields.street,
        district: fields.district,
        city: fields.city,
        editDate: time
      }

      if (fields.author) {
        faceCardObj.author = fields.author
      } else {
        faceCardObj.author = req.session.userId
      }

      if (req.session.adminlogined) {
        await FaceCardModel.findOneAndUpdate({_id: fields._id}, {$set: faceCardObj})
      } else {
        var faceCard = await FaceCardModel.findById(fields._id).exec()
        if (faceCard.author == req.session.userId) {
          await FaceCardModel.findOneAndUpdate({_id: fields._id}, {$set: faceCardObj})
        }
      }

      res.send({
        state: 'success',
        message: '更新成功'
      })
    } catch (err) {
      res.send({
        state: 'error',
        message: '更新失败:' + err
      })
    }
  }

  async deleteOne (req, res, next) {
    try {
      let errMsg = ''
      if (!service.checkCurrentId(req.query.ids)) {
        errMsg = '非法请求，请稍后重试！'
      }
      if (errMsg) {
        throw new service.UserException(errMsg)
      }
      await FaceCardModel.remove({_id: req.query.ids})
      res.send({
        state: 'success'
      })
    } catch (err) {
      res.send({
        state: 'error',
        type: 'ERROR_IN_SAVE_DATA',
        message: '删除数据失败:' + err
      })
    }
  }

  async updateLikeNum (req, res, next) {
    let targetId = req.query.faceCardId
    let userId = req.session.userId
    try {
      let oldContent = await FaceCardModel.findOne({_id: targetId})
      if (!_.isEmpty(oldContent) && (oldContent.likeUserIds).indexOf(userId) > -1) {
        res.send({
          state: 'error',
          type: 'ERROR_IN_UPDATE_DATA',
          message: '不可重复提交'
        })
      } else {
        let newContent = await FaceCardModel.findOneAndUpdate({_id: targetId}, {
          '$inc': {'likeNum': 1},
          '$push': {'likeUserIds': userId}
        })
        res.send({
          state: 'success',
          likeNum: newContent.likeNum + 1
        })
      }
    } catch (error) {
      res.send({
        state: 'error',
        type: 'ERROR_IN_SAVE_DATA',
        message: '更新数据失败:' + error
      })
    }
  }

  async updateRemoveTag (req, res, next) {
    let targetId = req.query.faceCardId
    try {
      let newContent = await FaceCardModel.findOneAndUpdate({_id: targetId}, {
        '$set': {'isRemove': 1}
      })
      res.send({
        state: 'success',
        newContent
      })
    } catch (error) {
      res.send({
        state: 'error',
        type: 'ERROR_IN_SAVE_DATA',
        message: '更新数据失败:' + error
      })
    }
  }
}

module.exports = new FaceCard()
