const { User } = require("./UserModel");

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
        const user = User.deleteOne({userID: req.params.userID}).exec();
        return user;
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

module.exports = {create, getAll, get, update, remove}