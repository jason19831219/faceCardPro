const FaceCardModel = require("../models").FaceCard;
const {settings, service} = require('../../utils');
const _ = require('lodash');
const chinaTime = require('china-time');


class Article {

    // async updateOne(req, res, next) {
    //     var fields = req.body;
    //     var errmsg = checkFormData(fields);
    //     if (errmsg != '') {
    //         res.send({
    //             state: 'error',
    //             message: errmsg
    //         })
    //         return
    //     }
    //
    //     const articleObj = {
    //         title: fields.title,
    //         author: fields.author,
    //         authorAvatarSrc: fields.authorAvatarSrc,
    //         imgSrc: fields.imgSrc,
    //         fromSite: fields.fromSite,
    //         sticky: fields.sticky
    //     }
    //
    //     try {
    //         await ArticleModel.findOneAndUpdate({ _id: fields.id }, { $set: articleObj });
    //         res.send({
    //             state: 'success',
    //             message: '更新成功',
    //         });
    //     } catch (err) {
    //         res.send({
    //             state: 'error',
    //             message: '更新失败:',
    //         })
    //     }
    // }

    async getAll(req, res, next) {
        let pageNumber = req.query.pageNumber || 1;
        let pageSize = req.query.pageSize || 10;
        let searchkey = req.query.searchkey;
        let contentId = req.query.contentId;
        let author = req.query.user;
        let queryObj = {};
        if (contentId) {
            queryObj.contentId = contentId;
        }
        if (searchkey) {
            let reKey = new RegExp(searchkey, 'i')
            queryObj.content = {$regex: reKey}
        }
        if (author) {
            queryObj.author = author;
        }
        queryObj.imgSrc = {$ne: []}
        const articles = await ArticleModel.find(queryObj).sort({
            updateDate: -1
        }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).exec();
        const totalItems = await ArticleModel.count(queryObj);
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
            src: fields.src,
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
        console.log(faceCardObj)
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

    // async deleteOne(req, res, next) {
    //     try {
    //         let errMsg = '';
    //         if (!service.checkIds(req.query.ids)) {
    //             errMsg = '非法请求，请稍后重试！';
    //         }
    //         if (errMsg) {
    //             res.send({
    //                 state: 'error',
    //                 message: errMsg
    //             })
    //         }
    //         await ArticleModel.remove({ _id: req.query.ids });
    //         res.send({
    //             state: 'success'
    //         });
    //     } catch (err) {
    //         res.send({
    //             state: 'error',
    //             type: 'ERROR_IN_SAVE_DATA',
    //             message: '删除数据失败:' + err,
    //         })
    //     }
    // }


}

module.exports = new Article();
