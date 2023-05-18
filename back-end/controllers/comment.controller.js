const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const User = require('../models/User.model');

// Get all comments 
exports.getAllComments = async (req, res, next) => {
    console.log('test')
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ error });
    }
};