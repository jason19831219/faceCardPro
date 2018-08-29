const CollectionModel = require("../models").Collection;
const UserModel = require("../models").User;
const {settings, service} = require('../../utils');
const _ = require('lodash');
const moment = require('moment')

class Moji {


    constructor() {
        // super()
    }

    async addOne(req, res) {
        var fields = req.body
        var errmsg = service.checkFormData(fields);
        if (errmsg != '') {
            res.send({
                state: 'error',
                message: errmsg
            })
            return
        }



        var collectionObj = {
            faceCard: fields.faceCardId
        }
        let queryObj = {};
        if(fields.user){
            collectionObj.user = fields.user
            queryObj.user = fields.user
        }else{
            collectionObj.user = req.session.userId
            queryObj.user = req.session.userId
        }

        const totalItems = await CollectionModel.count(queryObj);
        console.log(totalItems)
        if(totalItems>=50){
            res.send({
                state: 'error',
                totalItem:totalItems,
                message: '超过收藏上限',
            })
            return;
        }

        console.log(collectionObj)

        try {
            let collection = await CollectionModel.findOne(collectionObj)
            if (!_.isEmpty(collection)) {
                res.send({
                    state: 'error',
                    message: '已收藏过！'
                });
            } else {
                const collection = new CollectionModel(collectionObj);
                await collection.save();
                res.send({
                    state: 'success',
                    id: collection.id,
                    message: '收藏成功！'
                });
            }
        } catch (err) {
            res.send({
                state: 'error',
                message: '收藏失败:',
            })
        }
    }

    async getOne(req, res, next) {
        let queryObj = {};
        queryObj.faceCard = req.query.faceCardId;
        queryObj.user = req.session.userId
        var collection = await CollectionModel.findOne(queryObj)
        if (!_.isEmpty(collection)) {
            res.send({
                state: 'success',
                id: collection.id,
                message: '已收藏过！'
            });
        } else {
            res.send({
                state: 'success',
                id: '未收藏过'
            });
        }
    }


    async getAll(req, res, next) {
        let pageNumber = req.query.pageNumber || 1;
        let pageSize = req.query.pageSize || 10;
        let searchkey = req.query.searchkey;
        let queryObj = {};
        if(req.session.openId) {
            let user = await UserModel.findOne({ openId: req.session.openId });
            queryObj.user = user._id
        }
        console.log(req.session.openId)
        var timeToChange = moment().add(-1, 'days').format('X')
        await CollectionModel.find(queryObj).populate('faceCard').sort({
            createDate: -1
        }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).lean().exec(async function (err, comments) {
            const totalItems = await CollectionModel.count(queryObj);
            comments.forEach(function (value) {
                if(value.faceCard){
                    if (moment(value.faceCard.createDate, 'YYYY-MM-DD HH:mm:ss').format('X') > timeToChange) {
                        value.faceCard.createDate = moment(value.createDate, 'YYYY-MM-DD HH:mm:ss').startOf("minute").fromNow()
                    } else {
                        value.faceCard.createDate = moment(value.createDate, 'YYYY-MM-DD HH:mm:ss').format('M月D日')
                    }
                }else{
                    console.log(value.faceCard)
                }
            })
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
        });
    }


    async deleteOne(req, res, next) {
        try {
            let errMsg = '';
            if (!service.checkCurrentId(req.query.ids)) {
                errMsg = '非法请求，请稍后重试！';
            }
            if (errMsg) {
                throw new service.UserException(errMsg);
            }
            await CollectionModel.remove({ _id: req.query.ids });
            res.send({
                state: 'success'
            });
        } catch (err) {
            res.send({
                state: 'error',
                type: 'ERROR_IN_SAVE_DATA',
                message: '删除数据失败:' + err,
            })
        }
    }
}

module.exports = new Moji();
