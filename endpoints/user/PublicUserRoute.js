const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { User } = require('./UserModel');
const UserService = require('./UserService');



router.get('/publicUsers', (req, res, next) => {
    UserService.getAll(res);
})
.get('/publicUsers/:userID', (req, res) => {
    console.log("gotcha");
    UserService.get(req, res);
})
.post('/publicUsers', (req, res) => {
    UserService.create(req, res);
})
.put('/publicUsers', (req, res) => {
    res.send('This command is not available...yet?')
})
.put('/publicUsers/:userID', (req, res) => {
    UserService.update(req, res);
})
.delete('/publicUsers', (req, res) => {
    res.send('Hallo')
})
.delete('/publicUsers/:userID', (req, res) => {
    UserService.remove(req, res);
})
module.exports = router;

