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

    async addOne(req, res, next) {
        var fields = req.body
        try {
            service.checkFormData(fields);
        } catch (err) {
            console.log(err.message, err);
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

    // async updateAdminUser(req, res, next) {
    //   const form = new formidable.IncomingForm();
    //   form.parse(req, async (err, fields, files) => {
    //     try {
    //       checkFormData(req, res, fields);
    //     } catch (err) {
    //       console.log(err.message, err);
    //       res.send({
    //         state: 'error',
    //         type: 'ERROR_PARAMS',
    //         message: err.message
    //       })
    //       return
    //     }
    //
    //     const userObj = {
    //       userName: fields.userName,
    //       name: fields.name,
    //       email: fields.email,
    //       phoneNum: fields.phoneNum,
    //       password: fields.password,
    //       confirm: fields.confirm,
    //       group: fields.group,
    //       enable: fields.enable,
    //       comments: fields.comments
    //     }
    //     const item_id = fields._id;
    //     try {
    //       await AdminUserModel.findOneAndUpdate({
    //         _id: item_id
    //       }, {
    //         $set: userObj
    //       });
    //       res.send({
    //         state: 'success'
    //       });
    //     } catch (err) {
    //       logUtil.error(err, req);
    //       res.send({
    //         state: 'error',
    //         type: 'ERROR_IN_SAVE_DATA',
    //         message: '更新数据失败:',
    //       })
    //     }
    //   })
    //
    // }
    //
    async logOut(req, res, next) {
        req.session.destroy();
        res.clearCookie(settings.auth_cookie_name, {path: '/'});
        res.send({
            state: 'success',
        })
    }


}

module.exports = new Admin();
