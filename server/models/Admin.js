/**
 * Created by Administrator on 2015/4/15.
 * 管理员对象
 */
var mongoose = require("mongoose");
var shortid = require("shortid");
var Schema = mongoose.Schema;
const crypto = require("crypto");
const moment = require("moment");

// var AdminGroup = require("./AdminGroup");

var AdminSchema = new Schema({
	id: String,
	_id: {
		type: String,
		"default": shortid.generate
	},
	userName: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	password: {
	    type: String,
		required: true
	},
	mobile: {
		type: Number,
		unique: true,
		required: true
	},
	createDate: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	},
	group: {
		type: String,
		ref: "AdminGroup"
	}
}, {
	versionKey: false,
	timestamps: {createdAt: "createDate", updatedAt: "updateDate"}
});


// AdminSchema.statics = {
//   getOneItem: function (res, targetId, callBack) {
//     Admin.findOne({"_id": targetId}).populate("group").exec(function (err, user) {
//       if (err) {
//         res.end(err);
//       }
//       callBack(user);
//     });
//   }
// };

AdminSchema.path("createDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD HH:mm:ss");
});
AdminSchema.path("updateDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD HH:mm:ss");
});

AdminSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString("hex");
	this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
};
AdminSchema.methods.validPassword = function (password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
	return this.password === hash;
};


var Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;

