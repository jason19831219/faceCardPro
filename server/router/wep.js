const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const url = require("url");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

// 新建一个对象，建议只保存一个对象调用服务接口
const {
    User
} = require("../controller");
const {
    service,
    settings
} = require("../../utils");


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

router.get("/login", User.wxLogin);

module.exports = router;
