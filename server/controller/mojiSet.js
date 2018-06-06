const MojiSetModel = require("../models").MojiSet;
const {settings, service} = require('../../utils');
const _ = require('lodash');

class MojiSet {


    constructor() {
        // super()
    }

    async addOne(req, res, next) {
        var fields = req.body
        var errmsg = service.checkFormData(fields);
        if (errmsg != '') {
            res.send({
                state: 'error',
                message: errmsg
            })
            return
        }

        const mojiSetObj = {
            name: fields.name,
            desc: fields.desc,
            author: fields.author,
            price: fields.price
        }

        try {
            let mojiSet = await MojiSetModel.find({name: fields.name})
            if (!_.isEmpty(mojiSet)) {
                res.send({
                    state: 'error',
                    message: '套装名字已存在！'
                });
            } else {
                const newMojiSet = new MojiSetModel(mojiSetObj);
                await newMojiSet.save();
                res.send({
                    state: 'success',
                    id: '套装已保存'
                });
            }
        } catch (err) {
            res.send({
                state: 'error',
                message: '保存数据失败:',
            })
        }
    }

    async updateMojiItem(req, res, next) {
        var fields = req.body
        var errmsg = service.checkFormData(fields);
        if (errmsg != '') {
            res.send({
                state: 'error',
                message: errmsg
            })
            return
        }
        var update = {};

        try {

            if (fields.newMojiItemId) {
                update = {};
                Object.assign(update, {
                    $push: {
                        mojis: fields.newMojiItemId
                    }
                })
                await MojiSetModel.findOneAndUpdate({_id: fields.mojiSeIid}, update);
            }


            if (fields.oldMojiItemId) {
                update = {};
                Object.assign(update, {
                    $pull: {
                        mojis: fields.oldMojiItemId
                    }
                })
                await MojiSetModel.findOneAndUpdate({_id: fields.mojiSeIid}, update);
            }
            res.send({
                state: 'success'
            });

        } catch (err) {
            res.send({
                state: 'error',
                message: '更新数据失败:',
            })
        }

    }

    async getList(req, res, next) {
        console.log('sdfds')
        let pageNumber = req.query.pageNumber || 1;
        let pageSize = req.query.pageSize || 10;
        let nameReg = req.query.nameReg;
        let id = req.query.id;
        let author = req.query.user;
        let queryObj = {};
        if (id) {
            queryObj._id = id;
        }
        if (nameReg) {
            let reKey = new RegExp(nameReg, 'i')
            queryObj.name = {$regex: reKey}
        }
        if (author) {
            queryObj.author = author;
        }
        try {
            const list = await MojiSetModel.find(queryObj).sort({
                updateTime: -1
            }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).exec();
            console.log(list)
            const totalItems = await MojiSetModel.count(queryObj);
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
        } catch (err) {
            res.send({
                state: 'error',
                message: '保存数据失败:',
            })
        }
    }
}

module.exports = new MojiSet();
