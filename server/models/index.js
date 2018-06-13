const mongoose = require("mongoose");

const {settings} = require("../../utils");

mongoose.connect("mongodb://" + settings.mongo_username + ":" + settings.mongo_password + "@" + settings.mongo_host + ":" + settings.mongo_port + "/" + settings.mongo_db + "");

mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.once("open", () => {
  console.log("连接数据成功");
});

db.on("error", function (error) {
  console.error("Error in MongoDb connection: " + error);
  mongoose.disconnect();
});

db.on("close", function () {
  console.log("数据库断开，重新连接数据库");
});

exports.Admin = require("./Admin");
exports.User = require("./User");
exports.Star = require("./Star");
exports.Article = require("./Article");
exports.Moji = require("./Moji");
exports.MojiSet = require("./MojiSet");
