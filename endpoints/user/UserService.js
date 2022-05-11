const { User } = require("./UserModel");
const axios = require('axios').default;
const config = require('config');
const jwt = require('jsonwebtoken');

function authenticate(userId, password){
    return new Promise((resolve, reject) => {
        User.findOne({userID: userId}).exec()
        .then(user => {
            user.comparePassword(password, (error, isMatch) => {
                if(error){
                    throw new Error("This is our fault, sorry!");
                }
                if(isMatch){
                    resolve(user);
                } else{
                    resolve(401)
                }
            });
        })
        .catch(() => {
            reject(false);
        })
    })
}

function createDefaultAdmin(){
    User.findOne({userID: "admin"}).exec()
    .then(admin => {
        if(!admin){
            console.log("Default admin is being created.")
            axios.defaults.baseURL = "http://localhost:8080";
            axios.post('/publicUsers', {
                userID: 'admin',
                password: '123',
                isAdministrator: true
            })
        }
    })
    .catch(() => {
        console.log("there is a severe problem UserService")
    })
}

function getUserFromToken(req) {
    return new Promise((resolve, reject) => {
        if (typeof req.headers.authorization !== "undefined") {
            let token = req.headers.authorization.split(" ")[1];
            let privateKey = config.get('session.tokenKey');
            let algorithm = config.get('session.algorithm');
            resolve(jwt.verify(token, privateKey, { algorithm: algorithm }, (err, user) => {
                if (err) {
                    return 403;
                } else{
                    return user;
                }
            }));
        } else {
            reject(new Error("This is our fault, sorry!"));
        }
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

//right of isAdministrator needed
async function getAll(){
    try{
        return User.find().exec();
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

//user can only get themself
async function get(req){
    try{
        return User.findOne({userID: req.params.userID}).exec();
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
        return User.deleteOne({userID: req.params.userID}).exec();
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

module.exports = {authenticate, createDefaultAdmin, getUserFromToken, create, getAll, get, update, remove}