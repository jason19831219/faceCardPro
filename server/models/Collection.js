/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var moment = require("moment");
moment.locale("zh-cn");
var shortid = require("shortid");
var User = require("./User");
var FaceCard = require("./FaceCard");
var CollectionSchema = new Schema({
	_id: {
		type: String,
		"default": shortid.generate
	},
	faceCard: {
		type: String,
		ref: "FaceCard",
        require: true
	},
	user: {
		type: String,
		ref: "User",
		require: true
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


CollectionSchema.set("toJSON", { getters: true, virtuals: true });
CollectionSchema.set("toObject", { getters: true, virtuals: true });
CollectionSchema.path("createDate").get(function (v) {
    return moment(v).startOf("minute").fromNow();
});
CollectionSchema.path("updateDate").get(function (v) {
    return moment(v).startOf("minute").fromNow();
});
module.exports = mongoose.model("Collection", CollectionSchema);

