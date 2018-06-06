/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var moment = require("moment");
moment.locale("zh-cn");
var shortid = require("shortid");
var ArticleSchema = new Schema({
	_id: {
		type: String,
		"default": shortid.generate
	},
	detailLink: {
		type: String,
		default: "/"
	},
	imgSrc: {
		type: [[]],
        require: true
	},
	title: {
		type: String,
		require: true
	},
	author: {
		type: String,
		default: ""
	},
	authorAvatarSrc: {
		type: String,
        default: ""
	},
	description: {
		type: String,
		default: ""
	},
	fromSite: {
		type: String,
		default: ""
	},
	sticky: {
		type: Boolean,
		default: false
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


ArticleSchema.set("toJSON", {getters: true, virtuals: true});
ArticleSchema.set("toObject", {getters: true, virtuals: true});

ArticleSchema.path("createDate").get(function (v) {
	return moment(v).startOf("hour").fromNow();
});
ArticleSchema.path("updateDate").get(function (v) {
	return moment(v).startOf("minute").fromNow();
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

