const express = require('express');
const publicUserRouter = require('./endpoints/user/PublicUserRoute');
const authenticationRouter = require('./endpoints/authentication/AuthenticationRoute');
const userRouter = require('./endpoints/user/UserRoute');
const forumThreadRoute = require('./endpoints/forumThread/ForumThreadRoute');
const forumMessageRoute = require('./endpoints/forumMessage/ForumMessageRoute');
const registrationRoute = require('./endpoints/registration/RegistrationRoute');
const bodyParser = require('body-parser');
const database = require('./database/database.js')
const https = require('https');
const fs = require('fs');
const key = fs.readFileSync('./certificates/key.pem');
const cert = fs.readFileSync('./certificates/cert.pem');

let app;
let server;

function getServer(){
    return app;
}

function startServer(){
    app = express();
    server = https.createServer({key: key, cert: cert }, app);

    //needed so we can actually read the request body
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
    app.use('/publicUsers', publicUserRouter);
    app.use('/authenticate', authenticationRouter);
    app.use('/users', userRouter);
    app.use('/forumThreads', forumThreadRoute);
    app.use('/forumMessages', forumMessageRoute);
    app.use('/register', registrationRoute);
    app.use((req, res) => {
        res.status(404);
        res.send("Not found");
    });

    server.listen(443, () => {
        console.log('listening on 443')
    });
}

database.startDb();
startServer();

module.exports = { getServer, startServer }