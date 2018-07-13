var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var shortid = require("shortid");
var moment = require("moment");
moment.locale("zh-cn");
const crypto = require("crypto");

var UserSchema = new Schema({
    _id: {
        type: String,
        "default": shortid.generate
    },
    userName: {
        type: String
    },
    mobile: {
        type: String
    },
    salt: {
        type: String
    },
    password: {
        type: String
    },
    skey: {
        type: String
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: "/upload/images/defaultlogo.png"
    },
    openId: {
        type: String,
        unique: true
    },
    unionId: {
        type: String
    },
    wxUserInfo: {
        type: Object
    }
});

UserSchema.set("toJSON", {getters: true, virtuals: true});
UserSchema.set("toObject", {getters: true, virtuals: true});

UserSchema.path("createDate").get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
UserSchema.path("updateDate").get(function (v) {
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
};
UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
    return this.password === hash;
};


module.exports = mongoose.model("User", UserSchema);
