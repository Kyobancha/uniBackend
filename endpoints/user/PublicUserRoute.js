const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { User } = require('./UserModel');
const UserService = require('./UserService');



router.get('/publicUsers', (req, res) => {
    UserService.getAll(res);
})
.get('/publicUsers/:userID', (req, res) => {
   UserService.get("LETZTER TEIL DER URL", res)
})
.post('/publicUsers', (req, res) => {
    UserService.create(req, res);
})
.put('/publicUsers', (req, res) => {
    res.send('Hallo')
})
.delete('/publicUsers', (req, res) => {
    res.send('Hallo')
})

module.exports = router;

