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
var Star = require("./Star");

var FaceCardSchema = new Schema({
	_id: {
		type: String,
		"default": shortid.generate
	},
    author: {
        type: String,
        ref: "User",
    },
	facePhoto: {
        type: String,
        require: true
	},
    sidePhoto: {
        type: String,
        default: ''
    },
    backPhoto: {
        type: String,
        default: ''
    },
    star: {
        type: String,
        ref: "Star",
    },
    recommendPic: {
        type: [String],
        default: []
    },
    hairParam: {
        type: String,
        enum : ['NEW','OLD'],
        default: 'NEW'
    },
    hairLength: {
        type: String,
        enum : ['SHORT','NORMAL','LONG'],
        default: 'NORMAL'
    },
    hairQuality: {
        type: String,
        enum : ['SOFT','NORMAL','HARD'],
        default: 'SOFT'
    },
    hairQuantity: {
        type: String,
        enum : ['LITTLE','NORMAL','LOT'],
        default: 'LOT'
    },
    hairGranularity: {
        type: String,
        enum : ['THIN','NORMAL','THICK'],
        default: 'NORMAL'
    },
    hairCrispation: {
        type: String,
        enum : ['NONE','NORMAL','LOT'],
        default: 'NONE'
    },
    age: {
        type: Number,
        default: ''
    },
    yaw: {
        type: Number,
        default: ''
    },
    pitch: {
        type: Number,
        default: ''
    },
    roll: {
        type: Number,
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
    likeNum: {
	    type: Number,
        default: 0
    }, // 喜欢数
    likeUserIds: [{
	    type: String,
        default: []
	}],
    clickNum: {
	    type: Number,
        default: 1
    },
    isTop: {
	    type: Number,
        default: 1
    },
    isRemove: {
        type: Number,
        default: 0
    },
    street: {
        type: String,
        default: ''
    },
    district: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    editDate: {
        type: Date,
        default: Date.now
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
    // var timeToChange = moment().add(-1, 'days').format('X')
    // console.log(moment(v).format('X') > timeToChange)
	// return moment(v).startOf("minute").fromNow();
    return moment(v).format('X');
});
FaceCardSchema.path("updateDate").get(function (v) {
	return moment(v).startOf("minute").fromNow();
});

FaceCardSchema.path("editDate").get(function (v) {
    return moment(v).startOf("minute").fromNow();
});

module.exports = mongoose.model("FaceCard", FaceCardSchema);

