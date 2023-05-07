const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text     : { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userId   : { type: String, required: true },
    postId   : { type: String, required: true },
});

module.exports = mongoose.model('Comment', commentSchema);