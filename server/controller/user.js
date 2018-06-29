const UserModel = require("../models").User;
// const formidable = require('formidable');
const {service, settings, WXBizDataCrypt} = require('../../utils');
const _ = require('lodash');
const SMSClient = require('@alicloud/sms-sdk');
const request = require('request');
const sha1 = require("sha1");
const redis = require('redis');
const redisClient = redis.createClient(settings.redis_port, settings.redis_host, {auth_pass: settings.redis_psd});
redisClient.select("15", function (err) {
    if (err) {
        return false;
    } else {
        console.log('Redis Ready');
    }
});

class User {
    constructor() {
        // super()
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
        const users = await UserModel.find(queryObj).populate("password", "-salt").sort({
            updateDate: -1
        }).skip(Number(pageSize) * (Number(pageNumber) - 1)).limit(Number(pageSize)).exec();
        const totalItems = await UserModel.count(queryObj);
        res.send({
            state: 'success',
            list: users,
            pageInfo: {
                totalItems,
                pageNumber: Number(pageNumber) || 1,
                pageSize: Number(pageSize) || 10,
                searchKey: searchKey || ''
            }
        })
    }

    // async loginAction(req, res, next) {
    //   const form = new formidable.IncomingForm();
    //   form.parse(req, async (err, fields, files) => {
    //     try {
    //       let newPsd = service.encrypt(fields.password, settings.encrypt_key);
    //       let errMsg = '';
    //       if (!validatorUtil.checkEmail(fields.email)) {
    //         errMsg = '请输入正确的邮箱'
    //       } else if (!validatorUtil.checkPwd(fields.password)) {
    //         errMsg = '请输入正确的密码'
    //       }
    //       if (errMsg) {
    //         throw new siteFunc.UserException(errMsg);
    //       }
    //     } catch (err) {
    //       console.log(err.message, err);
    //       res.send({
    //         state: 'error',
    //         type: 'ERROR_PARAMS',
    //         message: err.message
    //       })
    //       return;
    //     }
    //     const userObj = {
    //       email: fields.email,
    //       password: service.encrypt(fields.password, settings.encrypt_key),
    //     }
    //     try {
    //       let user = await UserModel.findOne(userObj);
    //       if (user) {
    //         if (!user.enable) {
    //           res.send({
    //             state: 'error',
    //             message: "您已被限制登录，请稍后重试"
    //           });
    //         }
    //         // 将cookie存入缓存
    //         let auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
    //         res.cookie(settings.auth_cookie_name, auth_token,
    //           { path: '/', maxAge: 1000 * 60 * 60 * 24 * 30, signed: true, httpOnly: true }); //cookie 有效期30天
    //
    //         res.send({
    //           state: 'success'
    //         });
    //       } else {
    //         logUtil.error(err, req);
    //         res.send({
    //           state: 'error',
    //           message: "用户名或密码错误"
    //         });
    //       }
    //     } catch (err) {
    //       res.send({
    //         state: 'error',
    //         type: 'ERROR_IN_SAVE_DATA',
    //         message: err.stack
    //       })
    //     }
    //
    //   })
    // }

    async getUsers(req, res) {
        try {
            let current = req.query.current || 1;
            let pageSize = req.query.pageSize || 10;
            let searchkey = req.query.searchkey, queryObj = {};

            if (searchkey) {
                let reKey = new RegExp(searchkey, 'jason')
                queryObj.userName = {$regex: reKey}
            }

            const Users = await UserModel.find(queryObj, {password: 0}).sort({date: -1}).skip(Number(pageSize) * (Number(current) - 1)).limit(Number(pageSize));
            const totalItems = await UserModel.count(queryObj);
            // console.lgo("totalItems"+totalItems);

            // req.session.user = _.assign(req.session.user, {
            //   username:"sdfsd"
            // });

            // console.log(req.body);
            // req.session.user = {name:'sdfdsf'};

            if (req.session.sign) {//检查用户是否已经登录
                // console.log(req.session);//打印session的值
            } else {

                // console.log(req.session);
                req.session.sign = true;
                req.session.name = 'https://github.com/CleverFan';
            }
            res.cookie('userId', '123412342134', {
                path: '/',
                maxAge: 5000000,
            });

            res.send({
                state: 'success',
                msg: req.headers.cookie,
                docs: Users,
                pageInfo: {
                    totalItems,
                    current: Number(current) || 1,
                    pageSize: Number(pageSize) || 10,
                    searchkey: searchkey || ''
                }
            })
        } catch (err) {
            console.log(err)
            res.send({
                state: 'error',
                type: 'ERROR_DATA',
                message: '获取User失败'
            })
        }
    }


    async getSmsCode(req, res) {
        try {
            var mobile = req.query.mobile;
            var mobileExt = mobile + "_smslogin";
            var isExist = false;
            redisClient.exists(mobileExt, async (err, isExist) => {
                if (isExist) {
                    res.send({
                        state: 'error',
                        message: '已发送，请1分钟后再尝试！'
                    });
                } else {
                    var smsCode = service.randomCode();
                    const accessKeyId = settings.sms_access_id;
                    const secretAccessKey = settings.sms_access_secret;
                    let smsClient = new SMSClient({accessKeyId, secretAccessKey});

                    var templateParm = {"code": smsCode};
                    var response = await smsClient.sendSMS({
                        PhoneNumbers: mobile,
                        SignName: '陌及MoJi',
                        TemplateCode: settings.sms_template_id,
                        TemplateParam: JSON.stringify(templateParm)
                    });
                    if (response.Code === 'OK') {
                        res.send({
                            state: 'success',
                            message: '获取smsCode成功'
                        });
                        redisClient.set(mobileExt, smsCode);
                        redisClient.expire(mobileExt, settings.sms_code_expire_secs);
                    } else {
                        res.send({
                            state: 'error',
                            message: response.data.Message
                        });
                    }
                }
            })
        } catch (error) {
            res.send({
                state: 'success',
                message: JSON.stringify(error)
            });
        }
    }

    async getAuth(req, res) {
        try {
            var mobile = req.body.mobile;
            var mobileExt = req.body.mobile + '_smslogin';
            var smsCode = req.body.smsCode;

            redisClient.exists(mobileExt, async (err, isExist) => {
                if (isExist) {
                    redisClient.get(mobileExt, async (err, reply) => {
                        if (reply === smsCode) {
                            const userObj = {
                                mobile: mobile,
                            }
                            try {
                                UserModel.findOne({'mobile': mobile}, async (err, user) => {
                                    if (!_.isEmpty(user)) {
                                        console.log(user)
                                        userObj.userId = user.userId
                                        var valid = user.validPassword("aaamoji");
                                        console.log(valid)
                                        var token = service.generateJwt(userObj);
                                        res.status(200);
                                        res.json({
                                            state: 'success',
                                            message: "登录成功！",
                                            "token": token
                                        });
                                    } else {
                                        let newUser = new UserModel(userObj);
                                        newUser.setUserName(userObj.mobile);
                                        newUser.setPassword(settings.default_password);
                                        newUser = await newUser.save();
                                        console.log(newUser);
                                        var token = service.generateJwt();
                                        res.status(200);
                                        res.send({
                                            state: 'success',
                                            message: "注册成功！",
                                            token: token
                                        });
                                    }
                                })

                            } catch (e) {
                                console.log(e)
                            }


                        } else {
                            res.send({
                                state: 'error',
                                message: '验证码不正确'
                            })
                        }
                    })
                }
            });
        } catch (error) {
            res.send({
                state: 'error',
                message: JSON.stringify(error)
            })
        }
    }

    async mobileCheck(req, res) {
        var mobile = req.body.mobile;
        var fields = {
            mobile: mobile
        };
        let errmsg = service.checkFormData(fields)
        if (errmsg) {
            res.send({
                state: 'error',
                message: errmsg
            })
        }
        try {
            var user = await UserModel.findOne({'mobile': mobile})
            if (!_.isEmpty(user)) {
                res.status(200).send({
                    state: 'success',
                    message: "用户已存在"
                });
            } else {
                res.status(200).send({
                    state: 'success',
                    message: "用户不存在"
                });
            }
        } catch (e) {
            res.send({
                state: 'error',
                message: e
            });
        }

    }


// async regAction(req, res, next) {
//   const form = new formidable.IncomingForm();
//   form.parse(req, async (err, fields, files) => {
//     try {
//       let newPsd = service.encrypt(fields.password, settings.encrypt_key);
//       let errMsg = '';
//
//       if (!validatorUtil.checkUserName(fields.userName)) {
//         errMsg = '5-12个英文字符!';
//       }
//       if (!validatorUtil.checkEmail(fields.email)) {
//         errMsg = '请输入正确的邮箱'
//       }
//       if (!validatorUtil.checkPwd(fields.password)) {
//         errMsg = '请输入正确的密码'
//       }
//       if (fields.password != fields.confirmPassword) {
//         errMsg = '两次输入密码不一致，请重新输入'
//       }
//       if (errMsg) {
//         throw new siteFunc.UserException(errMsg);
//       }
//     } catch (err) {
//       console.log(err.message, err);
//       res.send({
//         state: 'error',
//         type: 'ERROR_PARAMS',
//         message: err.message
//       })
//       return;
//     }
//     const userObj = {
//       userName: fields.userName,
//       email: fields.email,
//       password: service.encrypt(fields.password, settings.encrypt_key),
//     }
//     try {
//       let user = await UserModel.find().or([{ 'email': fields.email }, { userName: fields.userName }])
//       if (!_.isEmpty(user)) {
//         res.send({
//           state: 'error',
//           message: '邮箱或用户名已存在！'
//         });
//       } else {
//         let newUser = new UserModel(userObj);
//         await newUser.save();
//
//         res.send({
//           state: 'success',
//           message: "注册成功！"
//         });
//       }
//     } catch (err) {
//       res.send({
//         state: 'error',
//         type: 'ERROR_IN_SAVE_DATA',
//         message: err.stack
//       })
//     }
//
//   })
// }


    async logOut(req, res, next) {
        req.session.destroy();
        res.clearCookie(settings.auth_cookie_name, {path: '/'});
        res.send({
            state: 'success',
        })
    }

    async wxLogin(req, res, next) {
        let userObj = {
            openId: req.session.openId,
            wxUserInfo: req.session.userInfo
        };
        if (req.session.userInfo && req.session.userInfo.unionId) {
            userObj.unionId = req.session.userInfo.unionId
        }
        var user = {};

        try {
            user = await UserModel.findOne({openId: userObj.openId})
            if (!_.isEmpty(user)) {
                delete user.wxUserInfo.openId;
                res.send({
                    code: 0,
                    data: {
                        skey: req.session.skey,
                        userinfo: user.wxUserInfo
                    }
                })
            } else {
                const newUser = new UserModel(userObj);
                await newUser.save();
                delete newUser.wxUserInfo.openId;
                res.send({
                    code: 0,
                    data: {
                        skey: req.session.skey,
                        userinfo: newUser.wxUserInfo
                    }
                })
            }
        } catch (err) {
            res.send({
                state: 'error',
                message: '保存数据失败:',
            })
        }

    }


}

module.exports = new User();
