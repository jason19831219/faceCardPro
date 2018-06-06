/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var moment = require("moment");
moment.locale("zh-cn");
var shortid = require("shortid");
var StickerSchema = new Schema({
	_id: {
		type: String,
		"default": shortid.generate
	},
	mojiId: {
		type: String,
		ref: "Moji"
	},
	userId: {
		type: String,
		ref: "User"
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


StickerSchema.set("toJSON", { getters: true, virtuals: true });
StickerSchema.set("toObject", { getters: true, virtuals: true });
StickerSchema.path("createDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD");
});
StickerSchema.path("updateDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD");
});
module.exports = mongoose.model("Sticker", StickerSchema);

