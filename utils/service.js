/* eslint-disable no-unused-vars,no-console */
/**
 * Created by Administrator on 2015/4/18.
 */

let crypto = require("crypto");
//数据操作日志
// let DataOptionLog = require("../models/DataOptionLog");
//时间格式化
let moment = require("moment");
//站点配置
let settings = require("./settings");
const fs = require('fs');
const mime = require("./mime").types;
const jwt = require("jsonwebtoken");
const validatorUtil = require("./validatorUtil");
const shortid = require("shortid");
let systemService = {

    getFileMimeType: function (filePath) {
        let buffer = new Buffer(8);
        let fd = fs.openSync(filePath, "r");
        fs.readSync(fd, buffer, 0, 8, 0);
        let newBuf = buffer.slice(0, 4);
        let head_1 = newBuf[0].toString(16);
        let head_2 = newBuf[1].toString(16);
        let head_3 = newBuf[2].toString(16);
        let head_4 = newBuf[3].toString(16);
        let typeCode = head_1 + head_2 + head_3 + head_4;
        let filetype = "";
        let mimetype;
        switch (typeCode) {
            case "ffd8ffe1":
                filetype = "jpg";
                mimetype = ["image/jpeg", "image/pjpeg"];
                break;
            case "ffd8ffe0":
                filetype = "jpg";
                mimetype = ["image/jpeg", "image/pjpeg"];
                break;
            case "ffd8ffdb":
                filetype = "jpg";
                mimetype = ["image/jpeg", "image/pjpeg"];
                break;
            case "47494638":
                filetype = "gif";
                mimetype = "image/gif";
                break;
            case "89504e47":
                filetype = "png";
                mimetype = ["image/png", "image/x-png"];
                break;
            case "504b34":
                filetype = "zip";
                mimetype = ["application/x-zip", "application/zip", "application/x-zip-compressed"];
                break;
            case "2f2aae5":
                filetype = "js";
                mimetype = "application/x-javascript";
                break;
            case "2f2ae585":
                filetype = "css";
                mimetype = "text/css";
                break;
            case "5b7bda":
                filetype = "json";
                mimetype = ["application/json", "text/json"];
                break;
            case "3c212d2d":
                filetype = "ejs";
                mimetype = "text/html";
                break;
            default:
                filetype = "unknown";
                break;
        }

        fs.closeSync(fd);

        return {
            fileType: filetype,
            mimeType: mimetype
        };

    },
    encrypt: function (data, key) { // 密码加密
        let cipher = crypto.createCipher("bf", key);
        let newPsd = "";
        newPsd += cipher.update(data, "utf8", "hex");
        newPsd += cipher.final("hex");
        return newPsd;
    },

    decrypt: function (data, key) { //密码解密
        let decipher = crypto.createDecipher("bf", key);
        let oldPsd = "";
        oldPsd += decipher.update(data, "hex", "utf8");
        oldPsd += decipher.final("utf8");
        return oldPsd;
    },

    randomCode: function () {
        var num = "";
        for (var i = 0; i < 6; i++) {
            num += Math.floor(Math.random() * 10);
        }
        return num
    },

    getx: function (arr) {
        for (var i = 0; i > -1; i++) {
            var flag = true;
            var num = Math.floor(Math.random() * 12);
            for (var i in arr) {
                if (arr[i] == num) {
                    flag = false;
                    break;
                }
            }
            if (flag == true) {
                arr.push(num);
                return;
            }
        }
    },

    getBehanceSpiderArray: async function () {
        return new Promise((resolve) => {
            var arr = [];
            for (var i = 0; i < 12; i++) {
                this.getx(arr);
            }
            return resolve(arr);
        })
    },

    checkIds(ids) {
        if (!ids) return false;
        let idState = true;
        let idsArr = ids.split(",");
        if (typeof idsArr === "object" && idsArr.length > 0) {
            for (let i = 0; i < idsArr.length; i++) {
                if (!shortid.isValid(idsArr[i])) {
                    idState = false;
                    break;
                }
            }
        } else {
            idState = false;
        }
        return idState;
    },

    checkFormData: function (fields) {
        let errMsg = '';
        console.log(fields.imgSrc+'sf');
        if (fields.userName && !validatorUtil.checkUserName(fields.userName)) {
            errMsg = '5-12个英文字符!';
        }
        if (fields.password && !validatorUtil.checkPwd(fields.password)) {
            errMsg = '6-12位，只能包含字母、数字和下划线!';
        }
        if (fields.price && !validatorUtil.checkCurrency(fields.price)) {
            errMsg = '只能数组，且2位小数';
        }
        if (fields.passwordConfirmed && fields.password && fields.password !== fields.passwordConfirmed) {
            errMsg = '两次输入密码不一致!';
        }
        if (fields.mobile && !validatorUtil.checkMobile(fields.mobile)) {
            errMsg = '请填写正确的手机号码!';
        }
        return errMsg
    },
    generateJwt: function (userObj) {
        var expires = moment().add('days', 30).valueOf();

            return jwt.sign({
            userId: userObj.userId,
            exp: expires,
        }, settings.jwt_secret)
    }

}
module.exports = systemService;
