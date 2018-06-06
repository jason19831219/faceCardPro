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
	enable: {
		type: Boolean,
		default: true
	},
	userName: {
		type: String,
		unique: true,
		required: true
	},
	mobile: {
		type: Number,
		unique: true,
		required: true
	},
	nickName: {
		type: String
	},
	salt: {
		type: String
	},
	password: {
		type: String,
		required: true
	},
	comments: {
		type: String,
		default: "这个人很懒，什么都没有留下..."
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	},
	actionPoint: {
	    type: Number,
		default: 20
	},
	avatar: {
	    type: String,
		default: "/upload/images/defaultlogo.png"
	},
	group: {
	    type: Number,
		default: 0
	},
	adminFlag: {
	    type: Boolean,
		default: false
	},
	gender: {
		type: String,
		default: "secret",
		required: true
	},
	openid: String,
	qq: Number

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
