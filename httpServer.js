const express = require('express');
const publicUserRouter = require('./endpoints/user/PublicUserRoute');
const authenticationRouter = require('./endpoints/authentication/AuthenticationRoute');
const userRouter = require('./endpoints/user/UserRoute');
const userService = require('./endpoints/user/UserService');
const forumThreadRoute = require('./endpoints/forumThread/ForumThreadRoute');
const forumMessageRoute = require('./endpoints/forumMessage/ForumMessageRoute');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('config');

const https = require('https');
const fs = require('fs');
const key = fs.readFileSync('./certificates/key.pem');
const cert = fs.readFileSync('./certificates/cert.pem');

//seems to be a bad one
// const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// https.globalAgent.options.ca = [
//     fs.readFileSync('./certificates/key.pem'),
//     fs.readFileSync('./certificates/cert.pem')
// ]

const dbConnectionString = config.get('db.connectionString')
const dbUseNewUrlParser = config.get('db.connectionOptions.useNewUrlParser');
const dbUseUnifiedTopology = config.get('db.connectionOptions.useUnifiedTopology');

mongoose.connect(dbConnectionString, {useNewUrlParser: dbUseNewUrlParser, useUnifiedTopology: dbUseUnifiedTopology});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Conntected");
    userService.createDefaultAdmin()
});

const app = express();
const server = https.createServer({key: key, cert: cert }, app);
// const server = https.createServer(app);

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
app.use((req, res) => {
    res.status(404);
    res.send("Not found");
});

server.listen(443, () => {
    console.log('listening on 443')
});