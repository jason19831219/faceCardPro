/**
 * Created by Administrator on 2015/4/15.
 * 文章标签对象
 */
const mongoose = require("mongoose");
const shortid = require("shortid");
const moment = require("moment");
var Moji = require("./Moji");
var Schema = mongoose.Schema;

var MojiSetSchema = new Schema({
	_id: {
		type: String,
		"default": shortid.generate
	},
	name: String,
	desc: String,
	author: {
		type: String,
		default: ""
	},
	avatar: {
		type: String,
		default: "/"
	},
	enable: {
		type: Boolean,
		default: true
	},
	price: {
		type: Number,
		default: 0
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	},
	mojis: {
	    type: [],
		default: [],
		ref: "Moji"
	},
	comments: String
}, {
	versionKey: false,
	timestamps: {createdAt: "createDate", updatedAt: "updateDate"}
});

MojiSetSchema.set("toJSON", { getters: true, virtuals: true });
MojiSetSchema.set("toObject", { getters: true, virtuals: true });

MojiSetSchema.path("createDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
MojiSetSchema.path("updateDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
MojiSetSchema.path("price").get(function(v) {
	return (v / 100).toFixed(2);
});

MojiSetSchema.path("price").set(function(v) {
	return v * 100;
});




var MojiSet = mongoose.model("MojiSet", MojiSetSchema);

module.exports = MojiSet;

