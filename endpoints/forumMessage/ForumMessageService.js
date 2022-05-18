const { ForumMessage } = require("./ForumMessageModel");
const { ForumThread } = require("../forumThread/ForumThreadModel");

function create(req){
    let message = new ForumMessage({
        forumThreadID: req.body.forumThreadID,
        title: req.body.title,
        text: req.body.text ? req.body.text : "",
        authorID: req
        .user.userID
    });

    return new Promise((resolve, reject) => {
        ForumThread.findOne({_id: message.forumThreadID}).exec()
        .then(thread => {
            if(thread){
                resolve message.save();
            } else {
                reject()
            }
        })
        .catch(() => {
            resolve(403)
        })
        .then(thread => {
            console.log("test")
        })
    })
    
        message.save()
        .then(() => {
            resolve(message);
        })
        .catch(() => {
            resolve(403)
        })
    
}

async function getAll(){
    try{
        return ForumMessage.find().exec();
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

async function getUserThreads(req){
    try{
        return ForumMessage.find({ownerID: req.user.userID}).exec()
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

function get(req){
    return new Promise((resolve, reject) => {
        console.log(typeof req.params.id)
        ForumMessage.findOne({_id: req.params.id}).exec()
        .then(result => {
            resolve(result)
        })
        .catch(() => {
            resolve(undefined)
        })
    })
}

function update(req){
    return new Promise((resolve, reject) => {
        ForumMessage.findOne({_id: req.params.id}).exec()
        .then(thread => {
            if(thread){
                thread.name = (req.body.name ? req.body.name : thread.name);
                thread.description = (req.body.description ? req.body.description : thread.description);
                thread.save();
                resolve(204);
            } else {
                reject(new Error("This is our fault, sorry!"))
            }
        })
        .catch(() => {
            resolve(404)
        })
    });
}

async function remove(req){
    try{
        return ForumMessage.deleteOne({_id: req.params.id}).exec();
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

module.exports = {create, getAll, getUserThreads, get, update, remove}