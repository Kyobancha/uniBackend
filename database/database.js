const config = require('config');
const mongoose = require('mongoose');
const userService = require('../endpoints/user/UserService')

function startDb(){
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
}

module.exports = { startDb }