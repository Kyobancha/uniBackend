const { ForumThread } = require("./ForumThreadModel");
const UserService = require('../user/UserService');

function create(req){
    let thread = new ForumThread({
        ownerID: req.user.userID,
        name: req.body.name,
        description: req.body.description ? req.body.description : ""
    });

    return new Promise((resolve, reject) => {
        thread.save()
        .then(() => {
            resolve(thread);
        })
        .catch(() => {
            resolve(403)
        })
    })
}

async function getAll(){
    try{
        return ForumThread.find().exec();
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

async function getUserThreads(req){
    try{
        return ForumThread.find({ownerID: req.user.userID}).exec()
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

function get(req){
    return new Promise((resolve, reject) => {
        ForumThread.findOne({_id: req.params.id}).exec()
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
        ForumThread.findOne({_id: req.params.id}).exec()
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
        return ForumThread.deleteOne({_id: req.params.id}).exec();
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

module.exports = {create, getAll, getUserThreads, get, update, remove}