const { User } = require("./UserModel");


function create(req, res){
    const user = new User({
        userID: req.body.userID,
        userName: req.body.userName,
        password: req.body.password,
        isAdministrator: req.body.isAdministrator
    });
    user.save().then(() => console.log('User saved'))
    // res.setHeader('Content-Type', 'application/json')
    res.send(user);
}

function getAll(res){
    User.find(function (err, docs) {
        if(err){
            res.setHeader("HTTP", "Bad Request"); //overwork
        }
        res.send(docs)
    });
}

function get(req, res){
    User.find({userID: req.params.userID}, function (err, docs) {
        if(err){
            res.setHeader("HTTP", "Bad Request"); //overwork
        }
        res.send(docs)
    });
}

function update(req, res){
    let user = User.updateOne({userID: req.params.userID}, req.body, function (err, docs) {
        if(err){
            res.setHeader("HTTP", "Bad Request"); //overwork
        }
        user = req.body;
        console.log('User updated');
        res.send(docs) //EVTL etwas anderes schicken
    });
}

function remove(req, res){
    User.deleteOne({userID: req.params.userID}, (err, docs) => {
        console.log("User deleted");
        res.send(docs)
    })
}

module.exports = {create, getAll, get, update, remove}