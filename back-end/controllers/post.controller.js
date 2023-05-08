const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const fs = require('fs');

// Create post
exports.createPost = async (req, res, next) => {
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

        res.status(200).json({ message: 'Profile updated!' });
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
    console.log(1,req.body)
    console.log(2,req.params)
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
        return res.status(404).json({ message: 'Post not found' });
        }

        const comment = new Comment({
            comment: req.body.comment,
        });

        // post.comments.push(comment);
        await post.updateOne({ $push: { comments: comment } });

        res.status(201).json({ message: 'Comment created' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.updateComment = async (req, res, next) => {
    console.log('yo')
    
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found!' });
        }

        await Post.findByIdAndUpdate(req.params.id, {comment:req.body.comment}, {
            new: true,
            overwrite: false
        });

        res.status(200).json({ message: 'Profile updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error!' });
    }
};