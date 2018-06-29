var express = require("express");
var https = require("https");
var http = require("http");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const fs = require("fs");

const resolve = file => path.resolve(__dirname, file);
const session = require("express-session");
const RedisStore =require("connect-redis")(session);
const settings = require("./utils/settings");

const api = require("./server/router/api");
const manage = require("./server/router/manage");
const wep = require("./server/router/wep");
var app = express();
app.set("view engine", "ejs");

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true }));
app.use(cookieParser(settings.encrypt_key));

let sessionConfig = {
    name: 'skey',
    secret: settings.encrypt_key,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    resave: false,
    saveUninitialized: false,

    store: new RedisStore({
        port: settings.redis_port,
        host: settings.redis_host,
        pass: settings.redis_psd,
        ttl: 1800 // 过期时间
    })
};
app.use(session(sessionConfig));

app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.use("/public", express.static("./public"));
app.use("/www-admin", express.static("./www-admin/dist"));
// app.use("/face-test", express.static("./face-test/dist"));
// app.use(express.static("./web-www/dist"));
app.use("/api", api);
app.use("/manage", manage);
app.use("/wep", wep);
// app.get("*", function(req, res) {
//     const html = fs.readFileSync(path.resolve(__dirname, settings.frontend_path+"/index.html"), "utf-8");
//     res.send(html);
// });



var privateKey  = fs.readFileSync("./utils/1529871730876.key");
var certificate = fs.readFileSync("./utils/1529871730876.pem");
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(settings.serverPort, function() {
    console.log("HTTP Server is running on: http://localhost:%s", settings.serverPort);
});
httpsServer.listen(settings.serverSSLPort, function() {
    console.log("HTTPS Server is running on: https://localhost:%s", settings.serverSSLPort);
});



module.exports = app;
