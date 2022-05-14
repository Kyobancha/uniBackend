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
const port = 8080;

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

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})