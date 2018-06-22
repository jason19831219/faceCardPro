var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var shortid = require("shortid");
var moment = require("moment");
const settings = require("../../utils/settings");
const crypto = require("crypto");

var UserSchema = new Schema({
	_id: {
		type: String,
		"default": shortid.generate
	},
	userName: {
		type: String,
		unique: true,
		required: true
	},
	mobile: {
		type: Number,
		unique: true
	},
	nickName: {
		type: String
	},
	salt: {
		type: String
	},
	password: {
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
	gender: {
		type: String
	},
    openId: {
        type: String,
        unique: true
    },
    unionId: {
        type: String,
        unique: true
    },
    city: {
        type: String
    },
    province: {
        type: String
    },
    country: {
        type: String
    },
    avatarUrl: {
        type: String
    },

});

UserSchema.set("toJSON", {getters: true, virtuals: true});
UserSchema.set("toObject", {getters: true, virtuals: true});

UserSchema.path("createDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
UserSchema.path("updateDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

UserSchema.methods.setUserName = function (mobile) {
	this.userName = "uid_"+mobile;
};

UserSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
};
UserSchema.methods.validPassword = function (password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
	return this.password === hash;
};


var User = mongoose.model("User", UserSchema);
module.exports = User;
