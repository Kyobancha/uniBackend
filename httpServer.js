const express = require('express');
const router = require('./endpoints/user/PublicUserRoute');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/WebII', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log("Conntected"); });



const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.all('/publicUsers', router);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})