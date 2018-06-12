const AdminModel = require("../models").Admin;
const _ = require('lodash')
const {service, settings} = require('../../utils');

class Admin {
    constructor() {
        // super()
    }

    async login(req, res, next) {
        var fields = req.body
        var errmsg = service.checkFormData(fields);
        if (errmsg != '') {
            res.send({
                state: 'error',
                message: errmsg
            })
            return
        }
        const queryObj = {
            userName: fields.userName
        }
        try {
            await AdminModel.findOne(queryObj, (error, admin) => {
                if (error) {
                    req.session.adminlogined = false;
                    res.send({
                        state: 'error',
                        message: '密码错误'
                    });
                    return;
                }
                if (!admin) {
                    req.session.adminlogined = false;
                    res.send({
                        state: 'error',
                        message: '密码错误'
                    });
                    return;
                }
                if (!admin.validPassword(fields.password)) {
                    req.session.adminlogined = false;
                    res.send({
                        state: 'error',
                        message: '密码错误'
                    });
                    return;
                }
                req.session.adminlogined = true;
                queryObj.adminId = admin._id;
                req.session.adminInfo = queryObj;
                res.cookie(settings.admin_auth_cookie_name, queryObj.adminId.toString(), {
                    path: '/manage',
                    expires: new Date(Date.now() + settings.admin_auth_cookie_age),
                    signed: true
                });
                res.send({
                    state: 'success',
                    message: '登录成功'
                });

            })
        } catch (e) {
            res.send({
                state: 'error',
                message: e.message
            })
        }

    }

    async getAll(req, res, next) {
        let pageNumber = req.query.pageNumber || 1;
        let pageSize = req.query.pageSize || 10;
        let searchKey = req.query.searchKey;
        let queryObj = {};
        if (searchKey) {
            let reKey = new RegExp(searchKey, 'i')
            queryObj.content = {$regex: reKey}
        }
        const admins = await AdminModel.find(queryObj).populate("password", "-salt").sort({
            updateDate: -1
        }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).exec();
        const totalItems = await AdminModel.count(queryObj);
        res.send({
            state: 'success',
            list: admins,
            pageInfo: {
                totalItems,
                pageNumber: Number(pageNumber) || 1,
                pageSize: Number(pageSize) || 10,
                searchKey: searchKey || ''
            }
        })
    }

    async addOne(req, res, next) {
        var fields = req.body
        try {
            service.checkFormData(fields);
        } catch (err) {
            res.send({
                state: 'error',
                type: 'ERROR_PARAMS',
                message: err.message
            })
            return
        }

        const adminObj = {
            userName: fields.userName,
            mobile: fields.mobile,
            password: fields.password,
        }

        try {
            let user = await AdminModel.find({userName: fields.userName})
            if (!_.isEmpty(user)) {
                res.send({
                    state: 'error',
                    message: '用户名已存在！'
                });
            } else {
                const newAdminUser = new AdminModel(adminObj);
                newAdminUser.setPassword(adminObj.password);
                await newAdminUser.save();
                delete adminObj.password;
                adminObj.adminId = newAdminUser._id
                req.session.adminlogined = true;
                req.session.adminInfo = adminObj;
                res.send({
                    state: 'success',
                    id: newAdminUser._id
                });
            }
        } catch (err) {
            console.log(err);
            res.send({
                state: 'error',
                type: 'ERROR_IN_SAVE_DATA',
                message: '保存数据失败:',
            })
        }
    }

    async updateOne(req, res, next) {
        var fields = req.body;
        try {
            service.checkFormData(fields);
        } catch (err) {
            res.send({
                state: 'error',
                type: 'ERROR_PARAMS',
                message: err.message
            })
            return
        }

        try {
            const adminObj = await AdminModel.findById(fields._id);
            delete adminObj._id
            console.log(adminObj)
            adminObj.setPassword(fields.password);
            await AdminModel.findOneAndUpdate({ _id: fields._id }, { $set: adminObj });
            res.send({
                state: 'success',
                message: '更新成功',
            });
        } catch (err) {
            res.send({
                state: 'error',
                message: '更新失败:',
            })
        }
    }
    async deleteOne(req, res, next) {
        try {
            let errMsg = '';
            if (!service.checkIds(req.query.ids)) {
                errMsg = '非法请求，请稍后重试！';
            }
            if (errMsg) {
                res.send({
                    state: 'error',
                    message: errMsg
                })
            }
            await AdminModel.remove({ _id: req.query.ids });
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

    async logOut(req, res, next) {
        req.session.destroy();
        res.clearCookie(settings.auth_cookie_name, {path: '/'});
        res.send({
            state: 'success',
        })
    }


}

module.exports = new Admin();
