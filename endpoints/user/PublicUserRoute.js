const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { User } = require('../../schemas/schemas');



router.get('/publicUsers', (req, res) => {
    User.find({ userName: 'Timo'}, function (err, docs) {
        if(err){
            res.setHeader("HTTP", "Bad Request"); //overwork
        }
        res.send(docs)
    });

    
})
.post('/publicUsers', (req, res) => {
    console.log(req.body)
    user = new User({
        userID: "123",
        userName: "Timo",
        password: "12345",
        isAdministrator: true
    });
    // user.save().then(() => console.log('User saved'))
    res.send(user);
})
.put('/publicUsers', (req, res) => {
    res.send('Hallo')
})
.delete('/publicUsers', (req, res) => {
    res.send('Hallo')
})

module.exports = router;

