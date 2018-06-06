const MojiModel = require("../models").Moji;
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

        var src = req.body.src;
        if (!src) {
            res.send({
                state: 'error',
                message: '图片没有上传成功'
            })
        }

        const mojiObj = {
            name: fields.name,
            author: fields.author,
            src: fields.src
        }

        try {
            let moji = await MojiModel.find({name: fields.name})
            if (!_.isEmpty(moji)) {
                res.send({
                    state: 'error',
                    message: '名字已存在！'
                });
            } else {
                const newMojiSet = new MojiModel(mojiObj);
                await newMojiSet.save();
                res.send({
                    state: 'success',
                    id: 'Moji已保存'
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
        let mojiId = req.query.mojiId;
        let author = req.query.author;
        let queryObj = {};
        if (mojiId) {
            queryObj.mojiId = mojiId;
        }
        if (nameReg) {
            let reKey = new RegExp(nameReg, 'i')
            queryObj.name = {$regex: reKey}
        }
        if (author) {
            queryObj.author = author;
        }
        const list = await MojiModel.find(queryObj).sort({
            updateTime: -1
        }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).exec();
        const totalItems = await MojiModel.count(queryObj);
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
}

module.exports = new Moji();
