const { User } = require("./UserModel");


function create(req, res){
    const user = new User({
        userID: req.body.userID,
        userName: req.body.userName,
        password: req.body.password,
        isAdministrator: req.body.isAdministrator
    });
    user.save().then(() => console.log('User saved'))
    res.send(user);
}

function getAll(res){
    User.find({ userName: 'Timo'}, function (err, docs) {
        if(err){
            res.setHeader("HTTP", "Bad Request"); //overwork
        }
        res.send(docs)
    });
}

function get(){

}

function update(){

}

function remove(){

}

module.exports = {create, getAll, get, update, remove}