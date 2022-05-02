const express = require('express');
const router = require('./endpoints/user/PublicUserRoute');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/WebII', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log("Conntected"); });

const app = express();
const port = 8080;

//needed so we can actually read the request body
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/publicUsers', router);
app.use((req, res) => {
    res.status(404);
    res.send("Not found");
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})