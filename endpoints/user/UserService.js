const logger = require("../../config/winston");
const { User } = require("./UserModel");

function authenticate(userId, password){
    return new Promise((resolve, reject) => {
        User.findOne({userID: userId}).exec()
        .then(user => {
            user.comparePassword(password, (error, isMatch) => {
                if(isMatch){
                    resolve(user);
                } else{
                    reject();
                }
            });
        })
        .catch(() => {
            resolve(401)
        })
    })
}

function createDefaultAdmin(){
    User.findOne({userID: "admin"}).exec()
    .then(admin => {
        if(!admin){
            console.log("Default admin is being created.")
            let user = new User({
                userID: 'admin',
                userName: 'admin',
                password: '123',
                isAdministrator: true
            });
            user.save()
        }
    })
    .catch(() => {
        console.log("there is a severe problem UserService")
    })
}

function create(req){
    let user = new User({
        userID: req.body.userID,
        userName: req.body.userName ? req.body.userName : req.body.userID,
        password: req.body.password ? req.body.password : "",
        isAdministrator: req.body.isAdministrator ? req.body.isAdministrator : false
    });

    return new Promise((resolve, reject) => {
        User.findOne({userID: req.body.userID}).exec()
        .then(userFound => {
            if(userFound){
                resolve(405);
            } else{
                user.save()
                .then(() => {
                    resolve(user);
                })
                .catch(() => {
                    resolve(400)
                });
            }
        })
        .catch(() => {
            reject(new Error("This is our fault, sorry!"));
        })
    })
}

async function getAll(){
    try{
        return User.find().exec();
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

async function get(req){
    try{
        return User.findOne({userID: req.params.userID}).exec();
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

function update(req){
    return new Promise((resolve, reject) => {
        User.findOne({userID: req.params.userID}).exec()
        .then(user => {
            if(user){
                user.userID = (req.body.userID ? req.body.userID : user.userID);
                user.userName = (req.body.userName ? req.body.userName : user.userName);
                user.isAdministrator = (req.body.isAdministrator ? req.body.isAdministrator : user.isAdministrator);
                if(req.body.password){
                    user.comparePassword(req.body.password, (error, isMatch) => {
                        logger.debug("this is the password: " + req.body.password)
                        if(error){
                            logger.debug("this is an error")
                            throw new Error("This is our fault, sorry!");
                        }
                        if(!isMatch){
                            logger.debug("this is a new password")
                            user.password = req.body.password;
                            user.save(); //needed since we are runnign async logic
                        } else{
                            logger.debug("the passwords are the same")
                        }
                    });
                } else{ //needed since we are runnign async logic
                    logger.debug("no password given, no worries")
                    user.save();
                }
                resolve(204);
            } else{
                resolve(404);
            }
        })
        .catch(() => {
            resolve(405);
        })
    });
}

async function remove(req){
    try{
        return User.deleteOne({userID: req.params.userID}).exec();
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

module.exports = {authenticate, createDefaultAdmin, create, getAll, get, update, remove}