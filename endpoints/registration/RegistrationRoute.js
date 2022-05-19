const express = require("express");
const router = express.Router();
const { isAuthenticated } = require('../authentication/AuthenticationService');
const nodemailer = require('./RegistrationService');

router.get('/', (req, res) => {
    nodemailer.send()
    // if(req.query.forumThreadID){
    //     console.log(req.query.forumThreadID)
    //     req.thread = {}
    //     req.thread.threadID = req.query.forumThreadID;
    //     ForumMessageService.getThreadMessages(req)
    //     .then(messages => {
    //         if(messages){
    //             res.send(messages)
    //         } else{
    //             res.status(404)
    //             res.send("This forum thread doesn't exist");
    //         }
    //     })
    //     .catch(error => {
    //         res.status(500)
    //         res.send(error.message);
    //     })
    // } else{
    //     ForumMessageService.getAll()
    //     .then(messages => {
    //         res.send(messages)
    //     })
    //     .catch(error => {
    //         res.status(500)
    //         res.send(error.message);
    //     })
    // }
})
.get('/:id', (req, res) => {
    ForumMessageService.get(req)
    .then(thread => {
        if(thread){
            res.send(thread);
        } else{
            res.status(404)
            res.send("This forum message doesn't exist");
        }
    })
    .catch(error => {
        res.status(500)
        res.send(error.message);
    })
})
module.exports = router;