const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userID: String,
    // {
    //     type: String,
    //     required: true,
    // },
    userName: String,
    password: String,
    isAdministrator: Boolean
})
const User = new mongoose.model("User", userSchema)

module.exports = { User };