const mongoose = require('mongoose');

const forumMessageSchema = new mongoose.Schema({
    forumThreadID: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    text: String,
    authorID: {
        type: String,
        required: true,
    }
})

const ForumMessage = new mongoose.model("ForumMessage", forumMessageSchema)

module.exports = { ForumMessage };