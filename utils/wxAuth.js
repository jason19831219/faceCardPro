const http = require('axios')
const moment = require('moment')
const sha1 = require('./wx/sha1')
const aesDecrypt = require('./wx/aesDecrypt')
const settings  = require('./settings')
const { ERRORS, LOGIN_STATE } = require('./wx/constants')

function authorization (req) {
    const {
        'x-wx-code': code,
        'x-wx-encrypted-data': encryptedData,
        'x-wx-iv': iv
    } = req.headers

    // 检查 headers
    if ([code, encryptedData, iv].every(v => !v)) {
        throw new Error(ERRORS.ERR_HEADER_MISSED)
    }

    debug('Auth: code: %s', code)

    // 如果只有 code 视为仅使用 code 登录
    if (code && !encryptedData && !iv) {
        return getSessionKey(code).then(pkg => {
            const { openid, session_key } = pkg
            // 生成 3rd_session
            const skey = sha1(session_key)

            return AuthDbService.getUserInfoByOpenId(openid).then(userinfo => {
                const wxUserInfo = JSON.parse(userinfo.user_info)

                return AuthDbService.saveUserInfo(wxUserInfo, skey, session_key)
                    .then(userinfo => ({
                        loginState: LOGIN_STATE.SUCCESS,
                        userinfo: {
                            userinfo: wxUserInfo,
                            skey: userinfo.skey
                        }
                    }))
            })
        })
    }

    debug('Auth: encryptedData: %s, iv: %s', encryptedData, iv)

    // 获取 session key
    return getSessionKey(code)
        .then(pkg => {
            const { session_key } = pkg
            // 生成 3rd_session
            const skey = sha1(session_key)

            // 解密数据
            let decryptedData
            try {
                decryptedData = aesDecrypt(session_key, iv, encryptedData)
                decryptedData = JSON.parse(decryptedData)
            } catch (e) {
                throw new Error(`${ERRORS.ERR_IN_DECRYPT_DATA}\n${e}`)
            }

            // 存储到数据库中
            return {
                decryptedData,
                skey: skey,
                session_key: session_key
            }
        })
}

function validation (req) {
    const { 'x-wx-skey': skey } = req.headers
    if (!skey) throw new Error(ERRORS.ERR_SKEY_INVALID)

    return true
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

function authorizationMiddleware (req, res, next) {
    return authorization(req).then(result => {
        console.log(result)
        return next()
    })
}

function validationMiddleware (req, res, next) {
    return validation(req).then(result => {
        console.log(result)
        return next()
    })
}

function getSessionKey (code) {

        const appid = settings.wx_appID
        const appsecret = settings.wx_appSecret

        return http({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            method: 'GET',
            params: {
                appid: appid,
                secret: appsecret,
                js_code: code,
                grant_type: 'authorization_code'
            }
        }).then(res => {
            res = res.data
            if (res.errcode || !res.openid || !res.session_key) {
                throw new Error(`${ERRORS.ERR_GET_SESSION_KEY}\n${JSON.stringify(res)}`)
            } else {
                return res
            }
        })

}

module.exports = {
    authorization,
    validation,
    authorizationMiddleware,
    validationMiddleware
}
