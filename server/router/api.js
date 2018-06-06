const express = require("express");
// const request = require("request");
const router = express.Router();
// const sha1 = require("sha1");
// const waterfall = require("async/waterfall");
// const NodeCache = require("node-cache");
// const cache = new NodeCache({stdTTL: 3600, checkperiod: 3600});
const _ = require("lodash");

const { User, Article } = require("../controller");
const { settings } = require("../../utils");
// Article.getArticlesBG();

function checkUserSession(req, res, next) {
	if (!_.isEmpty(req.session.userInfo)) {
		next();
	} else {
		res.redirect("/");
	}
}

router.get("/users/session", (req, res) => {
	res.send({
		state: "success",
		userInfo: req.session.userInfo,
		signed: req.session.signed
	});
});

//
// router.get("/wxjssdk", (req, res, next) => {
//
// 	let wx = req.query;
// 	console.log(JSON.stringify(wx));
//
// 	let token = settings.wx_token;
// 	let timestamp = wx.timestamp;
// 	let nonce = wx.nonce;
//
// 	// 1）将token、timestamp、nonce三个参数进行字典序排序
// 	let list = [token, timestamp, nonce].sort();
//
// 	// 2）将三个参数字符串拼接成一个字符串进行sha1加密
// 	let str = list.join("");
// 	let result = sha1(str);
//
// 	// 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
// 	if (result === wx.signature) {
// 		res.send(wx.echostr); // 返回微信传来的echostr，表示校验成功，此处不能返回其它
// 	} else {
// 		res.send(false);
// 	}
// });
//
//
// router.post("/wxjssdk/getjssdk", (req, res) => {
//
//
//
// 	let grant_type = "client_credential";
// 	let appid = settings.wx_appID;
// 	let secret = settings.wx_appSecret;
//
// 	let steps = [];
//
// 	// 第一步，获取access_token
// 	steps.push((cb) => {
//
// 		let steps1 = [];
//
// 		// 第1.1步，从缓存中读取access_token
// 		steps1.push((cb1) => {
// 			let access_token = cache.get("access_token", (err, access_token) => {
// 				cb1(err, access_token);
// 			});
// 		});
//
// 		// 第1.2步，缓存中有access_token则直接返回，如果没有，则从服务器中读取access_token
// 		steps1.push((access_token, cb1) => {
// 			if (access_token) {
// 				cb1(null, access_token, "from_cache");
// 			} else {
// 				request("https://api.weixin.qq.com/cgi-bin/token?grant_type=" + grant_type + "&appid=" + appid + "&secret=" + secret, (err, response, body) => {
// 					cb1(err, JSON.parse(body).access_token, "from_server");
// 				});
// 			}
// 		});
//
// 		// 第1.3步，如果是新从服务器取的access_token，则缓存起来，否则直接返回
// 		steps1.push((access_token, from_where, cb1) => {
// 			if (from_where === "from_cache") {
// 				console.log(" === 成功从缓存中读取access_token: " + access_token + " ===");
// 				cb1(null, access_token);
// 			} else if (from_where === "from_server") {
// 				cache.set("access_token", access_token, (err, success) => {
// 					if (!err && success) {
// 						console.log(" === 缓存已过期，从服务器中读取access_token: " + access_token + " ===");
// 						cb1(null, access_token);
// 					} else {
// 						cb1(err || "cache设置access_token时，出现未知错误");
// 					}
// 				});
// 			} else {
// 				cb1("1.3获取from_where时，from_where值为空");
// 			}
// 		});
//
//
//
// 		waterfall(steps1, (err, access_token) => {
// 			cb(err, access_token);
// 		});
// 	});
//
//
// 	// 第二步，获取ticket
// 	steps.push((access_token, cb) => {
// 		let steps1 = [];
//
// 		// 第2.1步，从缓存中读取ticket
// 		steps1.push((cb1) => {
// 			let ticket = cache.get("ticket", (err, ticket) => {
// 				cb1(err, ticket);
// 			});
// 		});
//
// 		// 第2.2步，缓存中有ticket则直接返回，如果没有，则从服务器中读取ticket
// 		steps1.push((ticket, cb1) => {
// 			if (ticket) {
// 				cb1(null, ticket, "from_cache");
// 			} else {
// 				request("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi", (err, response, body) => {
// 					cb1(err, JSON.parse(body).ticket, "from_server");
// 				});
// 			}
// 		});
//
// 		// 第2.3步，如果新从服务器取的ticket，则缓存起来，否则直接返回
// 		steps1.push((ticket, from_where, cb1) => {
// 			if (from_where === "from_cache") {
// 				console.log(" === 成功从缓存中读取ticket: " + ticket + " ===");
// 				cb1(null, ticket);
// 			} else if (from_where === "from_server") {
// 				cache.set("ticket", ticket, (err, success) => {
// 					if (!err && success) {
// 						console.log(" === 缓存已过期，从服务器中读取ticket: " + ticket + " ===");
// 						cb1(null, ticket);
// 					} else {
// 						cb1(err || "cache设置ticket时，出现未知错误");
// 					}
// 				});
// 			} else {
// 				cb1("2.3获取from_where时，from_where值为空");
// 			}
// 		});
//
// 		waterfall(steps1, (err, ticket) => {
// 			cb(err, ticket);
// 		});
// 	});
//
//
// 	// 第三步，生成签名
// 	steps.push((ticket, cb) => {
// 		let jsapi_ticket = ticket;
// 		let nonce_str = "599303";
// 		let timestamp = new Date().getTime();
// 		let url = req.body.url;
//
//
// 		let str = "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + nonce_str + "&timestamp=" + timestamp + "&url=" + url;
//
//
// 		console.log("str"+str);
//
// 		let signature = sha1(str);
//
// 		cb(null, {
// 			appId: appid,
// 			timestamp: timestamp,
// 			nonceStr: nonce_str,
// 			signature: signature,
// 			ticket: ticket
// 		});
// 	});
//
// 	waterfall(steps, (err, data) => {
// 		if (err) {
// 			res.send({status: "error", data: err});
// 		} else {
// 			res.send({status: "success", data: data});
// 		}
// 	});
// });
//


// 用户登录
// router.post("/users/doLogin", User.loginAction);

// 用户注册




// router.post("/users/doReg", User.regAction);
router.get("/users",User.getUsers);

router.get("/users/getSmsCode",User.getSmsCode);
router.post("/users/mobileCheck",User.mobileCheck);
router.post("/users/getAuth",User.getAuth);


router.get("/article/getAll", Article.getAll);

module.exports = router;
