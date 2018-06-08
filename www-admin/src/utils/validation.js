const validator = require('validator')
// const shortid = require('shortid');

export default {

  validateWords (str) {
    let pattern = new RegExp('[<>#$%^*+*]')
    let newParams = ''
    for (let i = 0; i < str.length; i++) {
      newParams += str.substr(i, 1).replace(pattern, '')
    }
    return newParams
  },
  // 校验用户名
  checkUserName (str) {
    return /^[a-zA-Z][a-zA-Z0-9_]{4,11}$/.test(str)
  },
  // 校验中文GBK
  checkName (str, min = 2, max = 6) {
    return str && validator.isLength(str, min, max) && /[\u4e00-\u9fa5]/.test(str)
  },
  // 校验密码
  checkPwd (str, min = 6, max = 32) {
    return str && validator.isLength(str, 5, max) && /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,}/.test(str)
  },
  // 校验邮箱
  checkEmail (str) {
    return str && validator.isEmail(str)
  },
  // 校验手机号
  checkMobilePhoneNum (str) {
    return str && validator.isLength(str, 11, 11) && validator.isMobilePhone(str.toString(), 'zh-CN')
  },
  checkSmsCode (str) {
    return str && validator.isNumeric(str.toString(), 'zh-CN') && validator.isLength(str, 6, 6)
  },
  checkCurrency (str) {
    return str && validator.isCurrency(str.toString())
  },
  // 校验QQ号
  checkQqNum (str) {
    return RegExp(/^[1-9][0-9]{4,9}$/).test(str)
  },

  checkUrl (str) {
    return str && validator.isURL(str)
  }

}
