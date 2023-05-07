const Comment = require('../models/Comment.model');
const User = require('../models/User.model');
const Post = require('../models/Post.model');

/**
* Create method
* @param {object} post   - comment datas
* @return {string|error} - Sucessful insertion or Error
*/
exports.createComment = async (req, res, next) => {
    try {
        console.log(req.body)
        const comment = new Comment({
            ...req.body,
        });
        const user = await User.findOne({ _id: req.body.userId });

        if (req.body.userId != user._id) {
            res.status(401).json({ message: 'Not authorized!' });
        } else {
            await comment.save();
            res.status(200).json({ message: 'Comment created!' });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};

/**
* Get all comments method
* @return {string|error} - Sucessful insertion or Error
*/
exports.getAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ error });
    }
};

/**
* Get post by id method
* @param {string} commentId - associated userId		
* @return {string|error} - Sucessful insertion or Error
*/
exports.getComment = async (req, res, next) => {
    try {
        const comment = await Post.findOne({ _id: req.params.id });
        res.status(200).json(comment);
    } catch (error) {
        res.status(404).json({ error });
    }
}

/**
* Update method
* @param {object} comment   - datas to update 
* @param {string} commentId - associated postId		
* @return {string|error} - Sucessful insertion or Error
*/
exports.updateComment = async (req, res, next) => {
    console.log('yo')
    const commentReq = JSON.parse(req.body.comment);
    
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found!' });
        }

        const commentObject = {...commentReq}

        await Comment.findByIdAndUpdate(req.params.id, commentObject, {
            new: true,
            overwrite: false
        });

        res.status(200).json({ message: 'PComment updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error!' });
    }
};

/**
* Delete method
* @param {string} commentId - commentId	
* @return {string|error} - Sucessful insertion or Error
*/
exports.deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!poscomment) {
            res.status(401).json({ message: 'Not authorized' });
        } else {
            await Post.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'Comment deleted !' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};
