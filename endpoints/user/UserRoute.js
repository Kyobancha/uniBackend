const express = require("express");
const router = express.Router();
const UserService = require('./UserService');
const { isAuthenticated } = require('../authentication/AuthenticationService');

router.get('/', isAuthenticated, (req, res) => {
    if(req.user.isAdministrator){
        UserService.getAll(req)
        .then(users => {
            res.send(users)
        })
        .catch(error => {
            res.status(500)
            res.send(error.message);
        })
    } else{
        res.status(403).send("You don't have the needed permission");
    }
})
.get('/:userID', isAuthenticated, (req, res) => {
    if(req.user.isAdministrator){
        UserService.get(req, res)
        .then(user => {
            if(user){
                res.send(user);
            } else{
                res.status(404)
                res.send("This user doesn't exist");
            }
        })
        .catch(error => {
            res.status(500)
            res.send(error.message);
        })
    } else{
        res.status(403).send("You don't have the needed permission");
    }
})
.post('/', isAuthenticated, (req, res) => {
    if(req.user.isAdministrator){
        UserService.create(req)
        .then(result => {
            if(result === 400){
                res.status(400);
                res.send("A user ID is required");
            } else if(result === 405){
                res.status(405);
                res.send("This user ID is already taken. Please choose another one.");
            } else{
                res.status(201);
                res.send(result);
                console.log('User saved')
            }
        })
        .catch(error => {      
            res.status(500)
            res.send(error.message)
        })
    } else{
        res.status(403).send("You don't have the needed permission");
    }
})
.put('/:userID', isAuthenticated, (req, res) => {
    if(req.user.isAdministrator){
        UserService.update(req, res)
        .then(result => {
            if(result === 403){
                res.status(403);
                res.send("No user with the provided id exits so far.");
            } else if(result === 204){
                res.status(204);
                res.send("User updated");
            }
        })
        .catch(error => {
            res.status(500);
            res.send(error.message);
        })
    } else{
        res.status(403).send("You don't have the needed permission");
    }
})
.delete('/:userID', isAuthenticated, (req, res) => {
    if(req.user.isAdministrator){
        UserService.remove(req, res)
        .then(deleteObject => {
            if(deleteObject.deletedCount === 0){
                res.status(404);
                res.send("This user doesn't exist");
            } else{
                res.status(204);
                res.send();
            }
        })
        .catch(error => {
            res.status(500);
            res.send(error.message)
        })
    } else{
        res.status(403).send("You don't have the needed permission");
    }
})
module.exports = router;