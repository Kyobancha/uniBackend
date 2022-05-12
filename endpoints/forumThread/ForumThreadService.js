const { ForumThread } = require("./ForumThreadModel");
const UserService = require('../user/UserService');

function create(req){
    if(req.user.isAdministrator){
        let thread = new ForumThread({
            ownerID: req.user.userID,
            name: req.body.name ? req.body.name : "My forum thread",
            description: req.body.description ? req.body.description : ""
        });

        return new Promise((resolve, reject) => {
            thread.save()
            .then(() => {
                resolve(thread);
            })
            .catch(() => {
                reject(new Error("This is our fault, sorry!"))
            })
        })
    } else{
        return 
    }
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
        console.log(typeof req.params.id)
        ForumThread.findOne({_id: req.params.id}).exec()
        .then(result => {
            resolve(result)
        })
        .catch(() => {
            resolve(undefined)
        })
    })
}

//TODO was ist, wenn im body ein fehlerhafter key steht?
function update(req){
    return new Promise((resolve, reject) => {
        User.findOne({userID: req.params.userID}).exec()
        .then(doc => {
            doc;
            if(doc){
                doc.userID = (req.body.userID ? req.body.userID : doc.userID);
                doc.userName = (req.body.userName ? req.body.userName : doc.userName);
                doc.isAdministrator = (req.body.isAdministrator ? req.body.isAdministrator : doc.isAdministrator);
                doc.comparePassword(req.body.password, (error, isMatch) => {
                    if(error){
                        throw new Error("This is our fault, sorry!");
                    }
                    if(!isMatch){
                        doc.password = req.body.password;
                    }
                    doc.save();
                    resolve(204);
                });
            } else{
                resolve(403);
            }
        })
        .catch(() => {
            reject(new Error("This is our fault, sorry!"));
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