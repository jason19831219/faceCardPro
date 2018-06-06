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
var AdminUser = require("./Admin");
var User = require("./User");
var MojiCategorySchema = new Schema({
  _id: {
    type: String,
    "default": shortid.generate
  },
  name: String,
  img: { type: String, default: "/upload/images/defaultImg.jpg" },
  description: String,
  author: { type: String, ref: "AdminUser" }, // 文档作者
  uAuthor: { type: String, ref: "User" }, // 文档作者(普通用户)
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now } // 更新时间
});


ContentSchema.set("toJSON", { getters: true, virtuals: true });
ContentSchema.set("toObject", { getters: true, virtuals: true });
ContentSchema.path("createDate").get(function (v) {
  return moment(v).format("YYYY-MM-DD");
});
ContentSchema.path("updateDate").get(function (v) {
  return moment(v).format("YYYY-MM-DD");
});

var MojiCategory = mongoose.model("MojiCategory", MojiCategorySchema);

module.exports = MojiCategory;

