const mongoose = require('mongoose');

const forumThreadSchema = new mongoose.Schema({
    ownerID: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: String,
})

const ForumThread = new mongoose.model("ForumThread", forumThreadSchema)

module.exports = { ForumThread };