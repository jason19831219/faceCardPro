/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var moment = require("moment");
moment.locale("zh-cn");

var shortid = require("shortid");
var MojiSet = require("./MojiSet");
var Admin = require("./Admin");
var MojiSchema = new Schema({
	_id: {
		type: String,
		"default": shortid.generate
	},
	name: {
		type: String,
		default: this.src+this._id
	},
	src: {
		type: String,
		default: "/upload/images/defaultImg.jpg"
	},
	description: {
		type: String,
		default: ""
	},
	author: {
		type: String,
		default: ""
	},
	submitAuthor: {
		type: String,
		ref: "Admin"
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	}
}, {
	versionKey: false,
	timestamps: {createdAt: "createDate", updatedAt: "updateDate"}
});

MojiSchema.set("toJSON", { getters: true, virtuals: true });
MojiSchema.set("toObject", { getters: true, virtuals: true });
MojiSchema.path("createDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD");
});
MojiSchema.path("updateDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD");
});
module.exports = mongoose.model("Moji", MojiSchema);

