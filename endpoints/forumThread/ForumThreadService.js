const { ForumThread } = require("./ForumThreadModel");
const UserService = require('../user/UserService');

function create(req){
    return UserService.getUserFromToken(req)
    .then(user => {
        let thread = new ForumThread({
            ownerID: user.userID,
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
    let user = await UserService.getUserFromToken(req)
    ForumThread.findOne({ownerID: user.userID}).exec();
}

async function get(req){
    console.log(req.originalUrl)
    
    try{
        return ForumThread.findOne({userID: req.params.userID}).exec();
    } catch{
        throw new Error("This is our fault, sorry!");
    }
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
        UserService.getUserFromToken(req)
        .then(user => {
            return ForumThread.deleteOne({ownerID: user.userID}).exec();
        })
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

module.exports = {create, getAll, getUserThreads, get, update, remove}