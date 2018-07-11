const FaceCardModel = require("../models").FaceCard;
const {settings, service} = require('../../utils');
const _ = require('lodash');
const chinaTime = require('china-time');


class Article {

    async getAll(req, res, next) {
        let pageNumber = req.query.pageNumber || 1;
        let pageSize = req.query.pageSize || 10;
        let searchkey = req.query.searchkey;
        let faceCardId = req.query.faceCardId;
        let author = req.query.user;
        let queryObj = {};
        if (faceCardId) {
            queryObj._id = faceCardId;
        }
        if (searchkey) {
            let reKey = new RegExp(searchkey, 'i')
            queryObj.content = {$regex: reKey}
        }
        if (author) {
            queryObj.author = author;
        }
        queryObj.imgSrc = {$ne: []}
        const articles = await FaceCardModel.find(queryObj).sort({
            updateDate: -1
        }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).exec();
        const totalItems = await FaceCardModel.count(queryObj);
        res.send({
            state: 'success',
            list: articles,
            pageInfo: {
                totalItems,
                pageNumber: Number(pageNumber) || 1,
                pageSize: Number(pageSize) || 10,
                searchkey: searchkey || ''
            }
        })
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

        var src = req.body.src;
        if (!src) {
            res.send({
                state: 'error',
                message: '图片没有上传成功'
            })
        }


        const faceCardObj = {
            facePhoto: fields.src,
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
            race: fields.race
        }

        if(fields.author){
            faceCardObj.author = fields.author
        }else{
            faceCardObj.author = req.session.userId
        }

        try {
            let faceCard = await FaceCardModel.find({src: faceCardObj.src})
            if (!_.isEmpty(faceCard)) {
                res.send({
                    state: 'error',
                    message: '图片已存在！'
                });
            } else {
                const newFaceCard = new FaceCardModel(faceCardObj);
                await newFaceCard.save();
                res.send({
                    state: 'success',
                    id: '已保存'
                });
            }
        } catch (err) {
            res.send({
                state: 'error',
                message: '保存数据失败:',
            })
        }
    }

    async updateOne(req, res, next) {
        try {
            var fields = req.body;
            var errmsg = service.checkFormData(fields);
            if (errmsg != '') {
                res.send({
                    state: 'error',
                    message: errmsg
                })
                return
            }

            const faceCardObj = {
                facePhoto: fields.src,
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
                race: fields.race
            }

            if(fields.author){
                faceCardObj.author = fields.author
            }else{
                faceCardObj.author = req.session.userId
            }

            await FaceCardModel.findOneAndUpdate({ _id: fields._id }, { $set: faceCardObj });
            res.send({
                state: 'success',
                message: '更新成功',
            });
        } catch (err) {
            res.send({
                state: 'error',
                message: '更新失败:'+ err,
            })
        }
    }
    async deleteOne(req, res, next) {
        try {
            var fields = req.query;
            let errMsg = '';
            if (!service.checkIds(fields.ids)) {
                errMsg = '非法请求，请稍后重试！';
            }
            if (errMsg) {
                res.send({
                    state: 'error',
                    message: errMsg
                })
            }
            await FaceCardModel.remove({ _id: req.query.ids });
            res.send({
                state: 'success',
                message: '删除成功'
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

module.exports = new Article();
