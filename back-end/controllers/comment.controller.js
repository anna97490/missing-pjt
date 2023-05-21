const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const User = require('../models/User.model');

// Get all comments 
exports.getAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Create comment 
exports.createComment = async (req, res, next) => {
    const commentReq = JSON.parse(req.body.comment);

    try {
        const post = await Post.findById(commentReq.postId);
        console.log('post', post)

        if (!post) {
        return res.status(404).json({ message: 'Post not found' });
        }

        const commentObject = new Comment({
            ...commentReq,
        });

        await commentObject.save();
        await post.updateOne({ $push: { comments: commentObject } });

        res.status(201).json({ message: 'Comment created' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Update Comment
exports.updateComment = async (req, res, next) => {
    const commentReq = JSON.parse(req.body.comment);
    
    try {
        const comment = await Comment.findById(req.params.id);
        const post = await Post.findById(comment.postId);

        if (!post || !comment) {
            return res.status(404).json({ message: 'Not found!' });
        }

        const commentObject = {...commentReq};

        // Update the comment
        await Comment.findByIdAndUpdate(commentReq._id, commentObject, {
            new: true,
            overwrite: false
        });

        post.comments.forEach(async (comment, index) => {
            const commentIdString = comment._id.toString();

            if (commentIdString === commentReq._id) {
                const updatedComments = [...post.comments];

                updatedComments[index] = commentObject;
               
                await Post.findByIdAndUpdate(post._id, {comments: updatedComments}, {
                    new: true,
                    overwrite: false
                });   
            }
        });
 
        res.status(200).json({ message: 'Comment updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error!' });
    }
};

// Delete Comment
exports.deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        const post = await Post.findById(comment.postId);
    
        await comment.deleteOne({ _id: req.params.id });

        post.comments = post.comments.filter((c) => c._id.toString() !== req.params.id);
        await post.save();
        
        res.status(200).json({ message: 'Comment deleted !' });
        
    } catch (error) {
        res.status(500).json({ error });
    }
};