const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const fs = require('fs');

// Create post
exports.createPost = async (req, res, next) => {
    console.log('req.body', req.body)
    try {
        const post = new Post({
            ...req.body,
            image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        });
        const user = await User.findOne({ _id: req.body.userId });

        if (req.body.userId != user._id) {
            res.status(401).json({ message: 'Not authorized!' });
        } else {
            await post.save();
            res.status(200).json({ message: 'Post created!' });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Get all posts 
exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Get post by id 
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ _id: req.params.id });
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ error });
    }
}

// Update post
exports.updatePost = async (req, res, next) => {
    const postReq = JSON.parse(req.body.post);
    
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found!' });
        }

        const postObject = {...postReq};

        await Post.findByIdAndUpdate(req.params.id, postObject, {
            new: true,
            overwrite: false
        });

        res.status(200).json({ message: 'Comment updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error!' });
    }
};

// Update post picture
exports.updatePostPicture = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found!' });
        }

        // If there is a file in the request
        if (req.file) {
            const image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            post.image = image;
        }

        await post.save();

        res.status(200).json({ message: 'Post picture updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error!' });
    }
};

// Delete post
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(401).json({ message: 'Not authorized' });
        } else {
            // const filename = post.imageUrl.split('/images/')[1];
            // await fs.promises.unlink(`images/${filename}`);
            await Post.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'Post deleted !' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};


// ----------- COMMENTS ---------
// Create comment 
exports.createComment = async (req, res, next) => {
    const commentReq = JSON.parse(req.body.comment);

    try {
        const post = await Post.findById(req.params.id);

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
    console.log("commentReq", commentReq)
    
    try {
        const post = await Post.findById(req.params.id);
        const comment = await Comment.findById(commentReq._id);
        console.log("post", post)
        console.log("comment", comment)

        if (!post || !comment) {
            return res.status(404).json({ message: 'Not found!' });
        }

        const commentObject = {...commentReq};
        console.log("commentObject", commentObject)

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
        const comment = await Comment.findById(req.params.commentId);
        const post = await Post.findById(comment.postId);

        if (!post || !comment) {
            res.status(401).json({ message: 'Not authorized' });
        } else {
            await comment.deleteOne({ _id: req.params.id });

            post.comments = post.comments.filter((c) => c._id.toString() !== req.params.commentId);
            await post.save();
            
            res.status(200).json({ message: 'Comment deleted !' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};