/**
 * Created by Administrator on 2015/4/15.
 * 文章标签对象
 */
var mongoose = require("mongoose");
var shortid = require("shortid");
var Schema = mongoose.Schema;
var moment = require("moment");

var NoticeSchema = new Schema({
	_id: {
		type: String,
		"default": shortid.generate
	},
	type: {
		type: String,
		enum: ["1", "2"]
	},  // 消息的类型，1:贴 stick，2: 撕 tear
	user: {
		type: String,
		ref: "User"
	},
	target: {
		type: String,
		ref: "Content"
	},    // 目标的ID
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


NoticeSchema.set("toJSON", { getters: true, virtuals: true });
NoticeSchema.set("toObject", { getters: true, virtuals: true });
NoticeSchema.path("createDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD");
});
module.exports = mongoose.model("Sticker", NoticeSchema);
