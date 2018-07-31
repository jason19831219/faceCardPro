const ViewModel = require("../models").View;
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



        var viewObj = {
            faceCard: fields.faceCardId
        }

        if(fields.user){
            viewObj.user = fields.user
        }else{
            viewObj.user = req.session.userId
        }

        try {
            let view = await ViewModel.findOne(viewObj).populate({path: 'user', select: 'id'}).exec(function (err, result) {
                console.log(result)
            })
            if (!_.isEmpty(view)) {
                res.send({
                    state: 'error',
                    message: '已阅读过！'
                });
            } else {
                const view = new ViewModel(viewObj);
                await view.save();
                res.send({
                    state: 'success',
                    id: '阅读成功'
                });
            }
        } catch (err) {
            res.send({
                state: 'error',
                message: '收藏失败:',
            })
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
        await ViewModel.find(queryObj).populate('faceCard').sort({
            createDate: -1
        }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).exec(async function (err, comments) {
            const totalItems = await ViewModel.count(queryObj);
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
            await ViewModel.remove({ _id: req.query.ids });
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
