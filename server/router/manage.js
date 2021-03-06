const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const url = require("url");
const moment = require("moment");
const fs = require("fs");
const https = require("https");
const qs = require("querystring");
const path = require("path");
const base64Img = require("base64-img");

// 新建一个对象，建议只保存一个对象调用服务接口
const {
	Admin,
	Star,
	User,
	FaceCard,
	View
} = require("../controller");
const {
	service,
	authAdmin,
	settings
} = require("../../utils");

var AipFaceClient = require("baidu-aip-sdk").face;
var APP_ID = settings.aip_appID;
var API_KEY = settings.aip_api_key;
var SECRET_KEY = settings.aip_secret_key;


// router.use(function(req, res, next) {
// 	if(req.signedCookies[settings.admin_auth_cookie_name]) {
//         next();
// 	}
//
// });
router.get("/admin/getAll",authAdmin, Admin.getAll);
router.post("/admin/addOne",authAdmin, Admin.addOne);
router.post("/admin/updateOne",authAdmin, Admin.updateOne);
router.get("/admin/deleteOne",authAdmin, Admin.deleteOne);
router.post("/admin/login", Admin.login);
router.post("/admin/logOut",authAdmin, Admin.logOut);


router.get("/star/getAll", authAdmin, Star.getAll);
router.post("/star/addOne",authAdmin, Star.addOne);
router.post("/star/updateOne",authAdmin, Star.updateOne);
router.get("/star/deleteOne",authAdmin, Star.deleteOne);

router.get("/user/getAll", authAdmin, User.getAll);
// router.post("/user/addOne",authAdmin, User.addOne);
// router.post("/user/updateOne",authAdmin, User.updateOne);
router.get("/user/deleteOne",authAdmin, User.deleteOne);

router.get("/faceCard/getAll", authAdmin, FaceCard.getAll);
router.post("/faceCard/addOne",authAdmin, FaceCard.addOne);
router.post("/faceCard/updateOne",authAdmin, FaceCard.updateOne);
router.get("/faceCard/deleteOne",authAdmin, FaceCard.deleteOne);

router.get("/view/getAll",authAdmin, View.getAll);

function base64_encode(file) {
	var bitmap = fs.readFileSync(path.join(__dirname,"../../",file));
	return  Buffer.from(bitmap).toString("base64");
}

router.post("/startAipFace", function (req, res, next) {
	var fields = req.body;
	var client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);
	var image = base64_encode(fields.path);

	var imageType = "BASE64";
	var options = {};
	options["face_field"] = "age,beauty,expression,faceshape,gender,glasses,landmark,race,qualities";
	options["max_face_num"] = "1";

	client.detect(image, imageType, options).then(function(result) {
		if(!result.error_code){
			res.send(
				{
					state: "success",
					message: "分析成功",
					info:result.result.face_list
				});
		}

	}).catch(function(err) {
		console.log(err);
	});
});


router.post("/uploadsImageBase64", (req, res, next) => {

	// var imgData = req.body.imgData;
	// console.log(imgData);
	// //过滤data:URL
	// var base64Data  =   imgData.replace(/^data:image\/png;base64,/, "");
	// base64Data  +=  base64Data.replace("+", " ");
	// var dataBuffer  =   new Buffer(base64Data, "base64").toString("binary");
	// var userUploadedFeedMessagesLocation = settings.upload_path;
	//
	// let ms = moment(new Date()).format("YYYYMMDDHHmmss").toString();
	// var imageTypeRegularExpression      = /\/(.*?)$/;
	// console.log(dataBuffer)
	// var imageTypeDetected                = dataBuffer.type.match(imageTypeRegularExpression);
	//
	// var userUploadedImagePath            = userUploadedFeedMessagesLocation + "img" + ms + "." + imageTypeDetected[1];
	var imgData = req.body.imgData;
	var filePath = path.join(__dirname, "../../"+ settings.upload_path);
	var ms = moment(new Date()).format("YYYYMMDDHHmmss").toString();
	var fileName = "img" + ms;
	base64Img.img(imgData, filePath, fileName, function(err, file) {
		res.send(
        			{
        				state: "success",
        				message: "上传成功!",
        				info:
                           {
                           	path: "/"+settings.upload_path+fileName+"."+file.split(".")[1]
                           }
        			});
	});
	// var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");




});

router.post("/uploads", (req, res, next) => {

	let params = url.parse(req.url, true);
	let fileType = params.query.type;

	let form = new formidable.IncomingForm();
	let uploadPath = settings.upload_path;
	let newFileName = "";
	form.uploadDir = uploadPath;
	form.maxFileSize = settings.size_moji_upload;

	try{
		form.parse(req)
			.on("file", function (name, file) {
				let realFileType = service.getFileMimeType(file.path);
				let typeKey = "others";
				let thisType = file.name.split(".")[file.name.split(".").length-1];
                console.log(thisType)
				let ms = moment(new Date()).format("YYYYMMDDHHmmss").toString();
				if (fileType == "images") {
					typeKey = "img";
				}
				newFileName = typeKey + ms + "." + thisType;



				if (fileType == "images") {
					if (realFileType.fileType == "jpg" || realFileType.fileType == "jpeg" || realFileType.fileType == "png" || realFileType.fileType == "gif") {
						fs.rename(file.path, uploadPath + newFileName, function () {
							var imageBuf = fs.readFileSync(path.join(__dirname, "../../"+uploadPath + newFileName));
							res.send(
								{
									state: "success",
									message: "上传成功!",
									info:
										{
											path: "/"+uploadPath + newFileName
										}
								});
						});

					}
				}
			})
			.on("error", function (err) {
				res.send({
					state: "error",
					massage: err.toString()
				});
			})
			.on("end", function () {

			});
	}catch (e) {
		res.send({
			state: "error",
			massage: e.toString()
		});
	}
});


module.exports = router;
