const { User } = require("./UserModel");

function create(req, res){
    const user = new User({
        userID: req.body.userID,
        userName: req.body.userName ? req.body.userName : req.body.userID,
        password: req.body.password ? req.body.password : "",
        isAdministrator: req.body.isAdministrator ? req.body.isAdministrator : false
    });

    User.findOne({userID: req.body.userID}, function (err, doc) {
        if(err){
            res.status(500);
            res.send("This is our fault, sorry!");
        }else if(doc){
            res.status(405);
            res.send("This user ID is already taken. Please choose another one.");
        } else {
            user.save()
            .then(() => {
                res.status(201);
                res.send(user);
                console.log('User saved')
            })
            .catch(error => {
                res.status(400);
                res.send("A user ID is required");
                console.log(error);
            })
        }
    })
}

function getAll(res){
    User.find()
    .then(docs => {
        res.send(docs)
    })
    .catch(err => {
        res.status(500);
        res.send("This is our fault, sorry!");
        console.log(err)
    })
}

function get(req, res){
    User.findOne({userID: req.params.userID})
    .then(doc => {
        if(doc){
            res.send(doc);
        } else{
            res.status(404);
            res.send("This user doesn't exit.");
        }
    })
    .catch(err => {
        res.status(500);
        res.send("This is our fault, sorry!");
        console.log(err);
    })
}

//TODO was ist, wenn im body ein fehlerhafter key steht?
function update(req, res){
    User.findOne({userID: req.params.userID})
    .then(doc => {
        if(doc){
            return User.updateOne({userID: req.params.userID}, req.body)
        } else{
            throw new Error({status: 403});
        }
    })
    .then(user => {
        res.status(204);
        res.send("");
        console.log('User updated');
    })
    .catch(err => {
        if(err.status = 403){
            res.status(403);
            res.send("No user with the provided id exits so far.");
        } else{
            res.status(500);
            res.send("This is our fault, sorry!");
            console.log(err);
        }
    })
}

function remove(req, res){
    User.deleteOne({userID: req.params.userID})
    .then(doc => {
        res.send(doc)
        console.log("User deleted");
    })
    .catch(err => {
        res.status(500);
        res.send("This is our fault, sorry!");
        console.log(err);
    })
}

module.exports = {create, getAll, get, update, remove}