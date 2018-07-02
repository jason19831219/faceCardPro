/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var moment = require("moment");
moment.locale("zh-cn");

var shortid = require("shortid");
var StarSchema = new Schema({
	_id: {
		type: String,
		"default": shortid.generate
	},
	name: {
		type: String,
		default: ''
	},
	src: {
		type: String,
		default: ''
	},
    age: {
        type: String,
        default: ''
	},
    yaw: {
        type: String,
        default: ''
    },
    pitch: {
        type: String,
        default: ''
    },
    roll: {
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

StarSchema.set("toJSON", { getters: true, virtuals: true });
StarSchema.set("toObject", { getters: true, virtuals: true });
StarSchema.path("createDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD");
});
StarSchema.path("updateDate").get(function (v) {
	return moment(v).format("YYYY-MM-DD");
});
module.exports = mongoose.model("Star", StarSchema);

