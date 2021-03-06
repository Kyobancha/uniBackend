const express = require("express");
const publicUserRouter = require("./endpoints/user/PublicUserRoute");
const authenticationRouter = require("./endpoints/authentication/AuthenticationRoute");
const userRouter = require("./endpoints/user/UserRoute");
const forumThreadRoute = require("./endpoints/forumThread/ForumThreadRoute");
const forumMessageRoute = require("./endpoints/forumMessage/ForumMessageRoute");
const bodyParser = require("body-parser");
const database = require("./database/database.js");
const https = require("https");
const fs = require("fs");
const key = fs.readFileSync("./certificates/key.pem");
const cert = fs.readFileSync("./certificates/cert.pem");
const winston = require("./config/winston");
const morgan = require("morgan");
const logger = require("./config/winston");
const config = require("config");
const cors = require("cors");

let app;
let server;

function startServer(){
    server = https.createServer({ key: key, cert: cert }, getApp());
    server.listen(443, () => {
        console.log("listening on 443")
        logger.info("listening on 443");
    });
}

function closeServer() {
    server.close();
}

function startApp() {
    app = express();

    //needed so we can actually read the request body
    app.use(cors({
        exposedHeaders: "Authorization"
    }))
    app.use(bodyParser.json());
    app.use(morgan(config.get('morgan.format'), { stream: winston.stream }));
    app.get("/", (req, res) => {
        res.send("Hello World!");
    });
    app.use("/publicUsers", publicUserRouter);
    app.use("/authenticate", authenticationRouter);
    app.use("/users", userRouter);
    app.use("/forumThreads", forumThreadRoute);
    app.use("/forumMessages", forumMessageRoute);
    app.use((req, res) => {
        res.status(404);
        res.send("Not found");
    });
}

function getApp() {
    return app;
}

database.startDb();
startApp();

if (process.env.NODE_ENV !== "development") {
    startServer();
}

module.exports = { closeServer, getApp: getApp, startServer: startApp };
