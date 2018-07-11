const StarModel = require("../models").Star;
const {settings, service} = require('../../utils');
const _ = require('lodash');

class Star {


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

        var src = req.body.src;
        if (!src) {
            res.send({
                state: 'error',
                message: '图片没有上传成功'
            })
        }

        const starObj = {
            name: fields.name,
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

        try {
            let star = await StarModel.find({name: fields.name})
            if (!_.isEmpty(star)) {
                res.send({
                    state: 'error',
                    message: '名字已存在！'
                });
            } else {
                const newStarSet = new StarModel(starObj);
                await newStarSet.save();
                res.send({
                    state: 'success',
                    id: 'Star已保存'
                });
            }
        } catch (err) {
            res.send({
                state: 'error',
                message: '保存数据失败:',
            })
        }
    }


    async getAll(req, res, next) {
        let pageNumber = req.query.pageNumber || 1;
        let pageSize = req.query.pageSize || 10;
        let nameReg = req.query.nameReg;
        let starId = req.query.starId;
        let author = req.query.author;
        let gender = req.query.gender;
        let faceShape = req.query.faceShape;
        let yaw = req.query.yaw;
        let yawMinus = req.query.yawMinus;
        let queryObj = {};
        if (starId) {
            queryObj._id = starId;
        }
        if (nameReg) {
            let reKey = new RegExp(nameReg, 'i')
            queryObj.name = {$regex: reKey}
        }
        if (author) {
            queryObj.author = author;
        }
        if (gender) {
            queryObj.gender = gender;
        }
        if (faceShape) {
            queryObj.face_shape = faceShape;
        }
        if (faceShape) {
            queryObj.yaw = { $gt : yawMinus, $lt : yaw }
        }

        const list = await StarModel.find(queryObj).sort({
            updateTime: -1
        }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).exec();
        const totalItems = await StarModel.count(queryObj);
        res.send({
            state: 'success',
            list: list,
            pageInfo: {
                totalItems,
                pageNumber: Number(pageNumber) || 1,
                pageSize: Number(pageSize) || 10,
                nameReg: nameReg || ''
            }
        })
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

            const starObj = {
                name: fields.name,
                src: fields.src,
                age: fields.age,
                angle: fields.angle,
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
            await StarModel.findOneAndUpdate({ _id: fields._id }, { $set: starObj });
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
            await StarModel.remove({ _id: req.query.ids });
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

module.exports = new Star();
