const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const User = require('../models/User.model');

const errorMessage = {
  notFound: 'Not found!',
  unauthorized: 'Not authorized!',
  postNotFound: 'Post not found!',
  serverError: 'Server Error!',
};

/**
 * Update a post by ID
 * @param req.params.id - The ID of the post to update
 * @returns JSON response indicating the status of the operation
 */
exports.createComment = async (req, res, next) => {
    const commentReq = JSON.parse(req.body.comment);
  
    try {
        const post = await Post.findById(commentReq.postId);
        const user = await User.findById(commentReq.userId);
    
        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: errorMessage.postNotFound });
        }

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: errorMessage.notFound });
        }

        // Check if the id of the post === the postId of the commentReq
        if (post._id.toString() !== commentReq.postId) {
            return res.status(403).json({ message: errorMessage.unauthorized });
        }

        // Check if the id of the user === the userId of the commentReq
        if (user._id.toString() !== commentReq.userId) {
            return res.status(403).json({ message: errorMessage.unauthorized });
        }
    
        // Create a new comment object
        const commentObject = new Comment({
            ...commentReq,
        });
        
        // Save the comment to the database
        await commentObject.save();

        // Add the comment to the comments array of the corresponding post
        await post.updateOne({ $push: { comments: commentObject } });
    
        res.status(201).json({ message: 'Comment created' });
    } catch (error) {
      res.status(400).json({ error });
    }
};


/**
 * Get all comments
 * @returns JSON response containing all comments
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
 * Delete a comment by ID
 * @param req.params.userId - The ID of the user in the params
 * @param req.params.id - The ID of the comment to delete
 * @returns JSON response indicating the status of the operation
 */
exports.deleteComment = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.id);
      const post = await Post.findById(comment.postId);
      const user = await User.findById(comment.userId);
  
      // Check if the comment or post is not found
      if (!comment || !post) {
        return res.status(404).json({ message: errorMessage.notFound });
      }
  
      if (user.status === 'admin' || req.params.userId === comment.userId.toString()) {
        // Check if the commentId in req.params === the commentId of the comment
        if (req.params.id !== comment._id.toString()) {
          return res.status(403).json({ message: errorMessage.unauthorized });
        }

        await comment.deleteOne({ _id: req.params.id });
  
        // Filter out the deleted comment from the post's comments array
        post.comments = post.comments.filter((c) => c._id.toString() !== req.params.id);
        await post.save();
    
        res.status(200).json({ message: 'Comment deleted!' });
      } else {
        // not authorized
        return res.status(403).json({ message: errorMessage.unauthorized });
      }
    
    } catch (error) {
      res.status(500).json({ error: errorMessage.serverError });
    }
};