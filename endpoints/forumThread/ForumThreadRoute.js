const express = require("express");
const router = express.Router();
const { isAuthenticated } = require('../authentication/AuthenticationService');
const ForumThreadService = require('./ForumThreadService');
const UserService = require('../user/UserService');

router.get('/', (req, res) => {
    ForumThreadService.getAll()
    .then(threads => {
        res.send(threads)
    })
    .catch(error => {
        res.status(500)
        res.send(error.message);
    })
})
.get('/myForumThreads', (req, res) => {
    ForumThreadService.getUserThreads(req)
    .then(resUser => {
        if(resUser){
            UserService.getUserFromToken(req)
            .then(reqUser => {
                if(reqUser.isAdministrator || reqUser.userID === resUser.userID){
                    res.send(resUser);
                } else{
                    res.status(403).send("You don't have the needed permission");
                }
            })
        } else{
            res.status(404)
            res.send("This user doesn't exist");
        }
    })
    .catch(error => {
        res.status(500)
        res.send(error.message);
    })
})
.get('/:ownerID', (req, res) => {
    UserService.get(req, res)
    .then(resUser => {
        if(resUser){
            UserService.getUserFromToken(req)
            .then(reqUser => {
                if(reqUser.isAdministrator || reqUser.userID === resUser.userID){
                    res.send(resUser);
                } else{
                    res.status(403).send("You don't have the needed permission");
                }
            })
        } else{
            res.status(404)
            res.send("This user doesn't exist");
        }
    })
    .catch(error => {
        res.status(505)
        res.send(error.message);
    })
})
.post('/', isAuthenticated, (req, res) => {
    console.log("hi")
    ForumThreadService.create(req)
    .then(result => {
        console.log(result)
        if(result === 400){
            res.status(400);
            res.send("A user ID is required");
            // console.log(error);
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
})
.put('/:userID', isAuthenticated, (req, res) => {
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
})
.delete('/:userID', isAuthenticated, (req, res) => {
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
})
module.exports = router;