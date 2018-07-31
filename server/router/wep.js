const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const url = require("url");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// 新建一个对象，建议只保存一个对象调用服务接口
const {
    User,
    Star,
    FaceCard,
    Collection,
    View
} = require("../controller");
const {
    service,
    settings,
    wxAuth
} = require("../../utils");

var AipFaceClient = require("baidu-aip-sdk").face;
var APP_ID = settings.aip_appID;
var API_KEY = settings.aip_api_key;
var SECRET_KEY = settings.aip_secret_key;


router.post("/startAipFace", function (req, res, next) {
    var fields = req.body;
    var client = new AipFaceClient(APP_ID, API_KEY, SECRET_KEY);
    var bitmap = fs.readFileSync(path.join(__dirname, "../../", fields.path));
    var image = Buffer.from(bitmap).toString("base64");

    var imageType = "BASE64";
    var options = {};
    options["face_field"] = "age,beauty,expression,faceshape,gender,glasses,landmark,race,qualities";
    options["max_face_num"] = "1";

    client.detect(image, imageType, options).then(function (result) {
        if (!result.error_code) {
            res.send(
                {
                    state: "success",
                    message: "分析成功",
                    info: result.result.face_list
                });
        }

    }).catch(function (err) {
        console.log(err);
    });
});


router.post("/uploads", (req, res, next) => {
    let form = new formidable.IncomingForm();
    let uploadPath = settings.wep_image_upload_path;
    form.uploadDir = uploadPath;
    form.maxFileSize = settings.size_moji_upload;

    try {
        form.parse(req)
            .on("file", function (name, file) {
                let realFileType = service.getFileMimeType(file.path);
                let ms = moment(new Date()).format("YYYYMMDDHHmmss").toString();
                let newFileName = 'img' + ms + "." + realFileType.fileType;

                if (realFileType.fileType == "jpg" || realFileType.fileType == "jpeg" || realFileType.fileType == "png" || realFileType.fileType == "gif") {
                    fs.rename(file.path, uploadPath + newFileName, function () {
                        res.send(
                            {
                                state: "success",
                                message: "上传成功!",
                                info:
                                    {
                                        imgUrl: "/" + uploadPath + newFileName
                                    }
                            });
                    });
                }
            })
    } catch (e) {
        res.send({
            state: "error",
            massage: e.toString()
        });
    }
});

router.get("/login", wxAuth.authorization, User.wxLogin);
router.get("/star/getAll", wxAuth.authorization, Star.getAll);


router.get("/faceCard/getAll", wxAuth.authorization, FaceCard.getAll);
router.get("/faceCard/getOne", FaceCard.getOne);
router.post("/faceCard/addOne", wxAuth.authorization, FaceCard.addOne);
router.post("/faceCard/updateOne", wxAuth.authorization, FaceCard.updateOne);
router.get("/faceCard/deleteOne", wxAuth.authorization, FaceCard.deleteOne);
router.get("/faceCard/updateLikeNum", wxAuth.authorization, FaceCard.updateLikeNum);
router.get("/faceCard/findRandomOne", wxAuth.authorization, FaceCard.findRandomOne);

router.post("/collection/addOne", wxAuth.authorization, Collection.addOne);
router.get("/collection/deleteOne", wxAuth.authorization, Collection.deleteOne);
router.get("/collection/getAll", wxAuth.authorization, Collection.getAll);

router.post("/view/addOne", wxAuth.authorization, View.addOne);

module.exports = router;
