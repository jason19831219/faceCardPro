const request = require('request')
const moment = require('moment')
const sha1 = require('./wx/sha1')
const aesDecrypt = require('./wx/aesDecrypt')
const settings = require('./settings')
const {ERRORS, LOGIN_STATE} = require('./wx/constants')

async function authorization(req, res, next) {

    if (req.session.openId) {
        return next();
    }

    const {
        'x-wx-code': code,
        'x-wx-encrypted-data': encryptedData,
        'x-wx-iv': iv
    } = req.headers

    if ([code, encryptedData, iv].every(v => !v)) {
        throw new Error(ERRORS.ERR_HEADER_MISSED)
    }
    const pkg = await getSessionKey(code);
    const { session_key, openid } = pkg;
    const skey = sha1(session_key);
    var decryptedData = ''

    if(encryptedData){
        decryptedData = aesDecrypt(session_key, iv, encryptedData)
        decryptedData = JSON.parse(decryptedData)
        req.session.userInfo = decryptedData;
    }

    req.session.session_key = session_key;
    req.session.openId = openid;
    req.session.skey = skey

    return next()

}

function validation(req, res, next) {
    const {
        'x-wx-skey': skey
    } = req.headers

    if (!skey) {
        throw new Error(ERRORS.ERR_SKEY_INVALID)
    }

    if(req.session.skey){
        console.log(req.session.skey)
    }

    return next()
    // return AuthDbService.getUserInfoBySKey(skey)
    //     .then(result => {
    //         if (result.length === 0) throw new Error(ERRORS.ERR_SKEY_INVALID)
    //         else result = result[0]
    //         // 效验登录态是否过期
    //         const { last_visit_time: lastVisitTime, user_info: userInfo } = result
    //         const expires = config.wxLoginExpires && !isNaN(parseInt(config.wxLoginExpires)) ? parseInt(config.wxLoginExpires) * 1000 : 7200 * 1000
    //
    //         if (moment(lastVisitTime, 'YYYY-MM-DD HH:mm:ss').valueOf() + expires < Date.now()) {
    //             debug('Valid: skey expired, login failed.')
    //             return {
    //                 loginState: LOGIN_STATE.FAILED,
    //                 userinfo: {}
    //             }
    //         } else {
    //             debug('Valid: login success.')
    //             return {
    //                 loginState: LOGIN_STATE.SUCCESS,
    //                 userinfo: JSON.parse(userInfo)
    //             }
    //         }
    //     })
}

// async function authorizationMiddleware(req, res, next) {
//     var result = await authorization(req)
//     req.session.session_key = result.session_key;
//     req.session.openId = result.openId;
//     req.session.skey = result.skey
//     if(result.userInfo){
//         req.session.userInfo = result.userInfo;
//     }
//
//
//     return next()
// }

// function validationMiddleware(req, res, next) {
//     var result = await validation(req)
//     console.log(result)
//
//     return next()
// }

function getSessionKey(code) {

    return new Promise((resolve, reject) => {
        request({
            method: 'get',
            uri: 'https://api.weixin.qq.com/sns/jscode2session',
            json: true,
            qs: {
                grant_type: 'authorization_code',
                appid: settings.wx_appID,
                secret: settings.wx_appSecret,
                js_code: code
            }
        }, (error, response, body) => {
            console.log(body)
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
            else {
                reject(json);
            }

        });
    })
}

module.exports = {
    authorization,
    validation,
    // authorizationMiddleware,
    // validationMiddleware
}
