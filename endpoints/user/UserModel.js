const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    userName: String,
    password: String,
    isAdministrator: Boolean
})

userSchema.pre('save', function (next) {
    let user = this;
    console.log("weird");

    if (!user.isModified('password')) {
        return next();
    } else{
        bcrypt.hash(user.password,10).then((hashedPassword) => {
            user.password = hashedPassword;
            next();
        })
    }}, function (err) { next(err) }
)

// userSchema.pre('updateOne', function (next) {
//     let user = this;
    
//     if (!user.isModified('password')) {
//         console.log("we are hereaaaaa")
//         return next();
//     } else{
//         console.log("we are here")
//         bcrypt.hash(user.password,10).then((hashedPassword) => {
//             user.password = hashedPassword;
//             next();
//         })
//     }
// })

userSchema.methods.comparePassword = function(candidatePassword,next){
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
    if(err){
        return next(err);
    }
    next(null,isMatch)
    })
}

const User = new mongoose.model("User", userSchema)

module.exports = { User };