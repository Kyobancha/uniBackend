const express = require("express");
const router = express.Router();
const { isAuthenticated } = require('../authentication/AuthenticationService');
const ForumMessageService = require('./ForumMessageService');

router.get('/', (req, res) => {
    ForumMessageService.getAll()
    .then(messages => {
        res.send(messages)
    })
    .catch(error => {
        res.status(500)
        res.send(error.message);
    })
})
.get('/:id', (req, res) => {
    ForumMessageService.get(req)
    .then(thread => {
        if(thread){
            res.send(thread);
        } else{
            res.status(404)
            res.send("This forum thread doesn't exist");
        }
    })
    .catch(error => {
        res.status(500)
        res.send(error.message);
    })
})
.post('/', isAuthenticated, (req, res) => {
    if(req.user){
        ForumMessageService.create(req)
        .then(result => {
            if(result === 400){
                res.status(400);
                res.send("A user ID is required");
            } else if(result === 403){
                res.status(403);
                res.send("A title is required");
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
.put('/:id', isAuthenticated, (req, res) => {
    ForumMessageService.update(req)
    .then(result => {
        if(result === 404){
            res.status(404);
            res.send("No forum thread with the provided id exits so far.");
        } else if(result === 204){
            res.status(204);
            res.send("Thread updated");
        } else {
            throw new Error("This is our fault, sorry!");
        }
    })
    .catch(error => {
        res.status(500);
        res.send(error.message);
    })
})
.delete('/:id', isAuthenticated, (req, res) => {
    ForumMessageService.remove(req)
    .then(deleteObject => {
        if(deleteObject.deletedCount === 0){
            res.status(404);
            res.send("This forum thread doesn't exist");
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