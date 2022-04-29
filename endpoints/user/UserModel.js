const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    userName: String,
    password: String,
    isAdministrator: Boolean
})
const User = new mongoose.model("User", userSchema)

module.exports = { User };