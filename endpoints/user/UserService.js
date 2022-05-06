const { User } = require("./UserModel");
const bcrypt = require('bcryptjs');

function create(req){
    let user = new User({
        userID: req.body.userID,
        userName: req.body.userName ? req.body.userName : req.body.userID,
        password: req.body.password ? req.body.password : "",
        isAdministrator: req.body.isAdministrator ? req.body.isAdministrator : false
    });

    return new Promise(resolve => {
        User.findOne({userID: req.body.userID}).exec()
        .then(userFound => {
            if(userFound){
                resolve(405);
            } else{
                console.log(user);
                user.save()
                .then(() => {
                    resolve(user);
                })
                .catch(() => {
                    resolve(400)
                });
            }
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
// function update(req, res){
//     User.findOne({userID: req.params.userID})
//     .then(doc => {
//         if(doc){
//             return User.updateOne({userID: req.params.userID}, req.body)
//         } else{
//             throw new Error({status: 403});
//         }
//     })
//     .then(user => {
//         res.status(204);
//         res.send("");
//         console.log('User updated');
//     })
//     .catch(err => {
//         if(err.status = 403){
//             res.status(403);
//             res.send("No user with the provided id exits so far.");
//         } else{
//             res.status(500);
//             res.send("This is our fault, sorry!");
//             console.log(err);
//         }
//     })
// }

//Dirty Ansatz ohne "updateOne()". Nach dem Ausführen Hände waschen nicht vergessen.
function update(req, res){
    User.findOne({userID: req.params.userID}, function (err, doc) {
        if(err){
            res.status(500);
            res.send("This is our fault, sorry!");
            console.log(err);
        } else if(doc){
            doc.userID = (req.body.userID ? req.body.userID : doc.userID);
            doc.userName = (req.body.userName ? req.body.userName : doc.userName);
            // console.log(doc.compare(req.body.password));
            bcrypt.compare(req.body.password, doc.password ,function(err,isMatch){
                if(err){
                    res.status(500);
                    res.send("This is our fault, sorry!");
                    console.log(err);
                }
                if(!isMatch){
                    doc.password = req.body.password;
                } else{
                    console.log("beides ist gleich");
                }
                // doc.password = (req.body.password ? req.body.password : doc.password);
                doc.isAdministrator = (req.body.isAdministrator ? req.body.isAdministrator : doc.isAdministrator);
                // console.log(doc.isModified('password'));
                doc.save(function (err, docs) {
                    if(err){
                        res.status(500);
                        res.send("This is our fault, sorry!");
                        console.log(err);
                    } else{
                        res.status(204);
                        res.send("");
                        console.log('User updated');
                    }
                });
            })
        } else{
            res.status(403);
            res.send("No user with the provided id exits so far.");
        }
    });
}

async function remove(req){
    try{
        const user = User.deleteOne({userID: req.params.userID}).exec();
        //"acknowledged": true,
        //"deletedCount": 0
        return user;
    } catch{
        throw new Error("This is our fault, sorry!");
    }
}

module.exports = {create, getAll, get, update, remove}