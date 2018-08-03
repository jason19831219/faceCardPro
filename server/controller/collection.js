const CollectionModel = require("../models").Collection;
const UserModel = require("../models").User;
const {settings, service} = require('../../utils');
const _ = require('lodash');

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

        if(fields.user){
            collectionObj.user = fields.user
        }else{
            collectionObj.user = req.session.userId
        }

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
        await CollectionModel.find(queryObj).populate('faceCard').sort({
            createDate: -1
        }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).exec(async function (err, comments) {
            const totalItems = await CollectionModel.count(queryObj);
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
