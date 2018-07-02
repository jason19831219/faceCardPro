/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var moment = require("moment");
moment.locale("zh-cn");
var shortid = require("shortid");

var FaceCardSchema = new Schema({
	_id: {
		type: String,
		"default": shortid.generate
	},
	facePhoto: {
        type: String,
        require: true
	},
    sidePhoto: {
        type: String,
        default: "/public/images/sidePhoto.png"
    },
    backPhoto: {
        type: String,
        default: "/upload/images/backPhoto.jpg"
    },
	author: {
		type: String,
        ref: "User",
        require: true
	},
	refPic: {
        type: String,
        ref: "Star",
        require: true
	},
    hairParam: {
        type: String,
        enum : ['NEW','OLD'],
        default: 'NEW'
    },
    age: {
        type: String,
        default: ''
    },
    angle: {
        type: String,
        default: ''
    },
    beauty: {
        type: String,
        default: ''
    },
    expression: {
        type: String,
        default: ''
    },
    face_probability: {
        type: String,
        default: ''
    },
    face_shape: {
        type: String,
        default: ''
    },
    face_token: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
    glasses: {
        type: String,
        default: ''
    },
    landmark: {
        type: String,
        default: ''
    },
    landmark72: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    race: {
        type: String,
        default: ''
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


FaceCardSchema.set("toJSON", {getters: true, virtuals: true});
FaceCardSchema.set("toObject", {getters: true, virtuals: true});

FaceCardSchema.path("createDate").get(function (v) {
	return moment(v).startOf("hour").fromNow();
});
FaceCardSchema.path("updateDate").get(function (v) {
	return moment(v).startOf("minute").fromNow();
});

module.exports = mongoose.model("FaceCard", FaceCardSchema);

