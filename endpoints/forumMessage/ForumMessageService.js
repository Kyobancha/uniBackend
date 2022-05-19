const { ForumMessage } = require("./ForumMessageModel");
const { ForumThread } = require("../forumThread/ForumThreadModel");

function create(req){
    let message = new ForumMessage({
        forumThreadID: req.body.forumThreadID,
        title: req.body.title,
        text: req.body.text ? req.body.text : "",
        authorID: req.user.userID
    });

    return new Promise((resolve, reject) => {
        ForumThread.findOne({_id: message.forumThreadID}).exec()
        .then(thread => {
            if(thread){
                resolve(message.save());
            }
        })
        .catch(() => {
            resolve(400)
        })
    })
    
}

async function getAll(){
    try{
        return ForumMessage.find().exec();
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

async function getThreadMessages(req){
    try{
        return ForumMessage.find({forumThreadID: req.thread.threadID}).exec()
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

function get(req){
    return new Promise((resolve, reject) => {
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
        .then(message => {
            if(message){
                if(req.body.forumThreadID){
                    console.log(req.body.forumThreadID)
                    ForumThread.find({forumThreadID: req.body.forumThreadID}).exec()
                    .then(result => {
                        console.log(result)
                        message.title = (req.body.title ? req.body.title : message.title);
                        message.text = (req.body.text ? req.body.text : message.text);
                        message.forumThreadID = (req.body.forumThreadID ? req.body.forumThreadID : message.forumThreadID);
                        message.save();
                        resolve(204);
                    })
                    .catch(() => {
                        console.log(req.body.forumThreadID)
                        resolve(404);
                    })
                } else{
                    message.title = (req.body.title ? req.body.title : message.title);
                    message.text = (req.body.text ? req.body.text : message.text);
                    message.save();
                    resolve(204);
                }
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

module.exports = {create, getAll, getThreadMessages, get, update, remove}