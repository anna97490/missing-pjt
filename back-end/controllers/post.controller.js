const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const fs = require('fs');

const errorMessage = {
    notFound: 'Post not found!',
    unauthorized: 'Not authorized!',
    serverError: 'Server Error!',
};
  
// Create post
exports.createPost = async (req, res, next) => {
    try {
      const post = new Post({
        ...req.body,
        image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      });
      const user = await User.findOne({ _id: req.body.userId });
  
      if (req.body.userId != user._id) {
        res.status(401).json({ message: errorMessage.unauthorized });
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
};
  
// Update post
exports.updatePost = async (req, res, next) => {
    const postReq = JSON.parse(req.body.post);
  
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({ message: errorMessage.notFound });
      }
  
      await Post.findByIdAndUpdate(req.params.id, postReq, {
        new: true,
        overwrite: false,
      });
  
      res.status(200).json({ message: 'Post updated!' });
    } catch (error) {
      res.status(500).json({ error: errorMessage.serverError });
    }
};
  
// Update post picture
exports.updatePostPicture = async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({ message: errorMessage.notFound });
      }
  
      if (req.file) {
        if (post.image) {
          const filename = post.image.split('/images/')[1];
          await fs.promises.unlink(`images/${filename}`);
        }
        const image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        post.image = image;
      }
  
      await post.save();
  
      res.status(200).json({ message: 'Post picture updated!' });
    } catch (error) {
      res.status(500).json({ error: errorMessage.serverError });
    }
};
  
// Delete post
exports.deletePost = async (req, res, next) => {
    const postId = req.params.id;
  
    try {
      const post = await Post.findById(postId);
  
      if (!post) {
        res.status(401).json({ message: errorMessage.unauthorized });
      } else {
        if (post.comments && post.comments.length > 0) {
          const commentIds = post.comments.map((comment) => comment._id);
          await Comment.deleteMany({ _id: { $in: commentIds } });
        }
  
        const filename = post.image.split('/images/')[1];
        await fs.promises.unlink(`images/${filename}`);
  
        await post.remove();
        res.status(200).json({ message: 'Post deleted!' });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
};

