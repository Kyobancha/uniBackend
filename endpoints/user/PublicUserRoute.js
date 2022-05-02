const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { User } = require('./UserModel');
const UserService = require('./UserService');

router.get('/', (req, res) => {
    UserService.getAll(res);
})
.get('/:userID', (req, res) => {
    UserService.get(req, res);
})
.post('/', (req, res) => {
    UserService.create(req, res);
})
.put('/:userID', (req, res) => {
    UserService.update(req, res);
})
.delete('/:userID', (req, res) => {
    UserService.remove(req, res);
})
module.exports = router;

