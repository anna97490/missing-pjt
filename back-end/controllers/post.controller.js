const Post = require('../models/Post.model');
const User = require('../models/User.model');
const fs = require('fs');

/**
* Create method
* @param {object} post   - post datas
* @param {file} image    - post image	
* @param {string} userId - associated userId		
* @return {string|error} - Sucessful insertion or Error
*/
exports.createPost = async (req, res, next) => {
    console.log('ok', req.body)
    console.log('req.file', req.file)
    try {
    const post = new Post({
            ...req.body,
            image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            userId: req.auth.userId
        });
        if (post.userId != req.auth.userId) {
            res.status(401).json({ message: 'Not authorized!' });
        } else {
            await post.save();
            res.status(200).json({ message: 'Post created!' });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};

/**
* Get all posts method
* @return {string|error} - Sucessful insertion or Error
*/
exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error });
    }
};

/**
* Get post by id method
* @param {string} postId - associated userId		
* @return {string|error} - Sucessful insertion or Error
*/
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ _id: req.params.id });
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ error });
    }
}

/**
* Update method
* @param {object} post   - datas to update 
* @param {file} image    - image to update	
* @param {string} userId - associated userId		
* @return {string|error} - Sucessful insertion or Error
*/
exports.updatePost = async (req, res, next) => {
    console.log('req.body', req.body)
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (post.userId !== req.auth.userId) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      const postObject = req.file ? {
        ...JSON.parse(req.body.post),
        image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
      await Post.findByIdAndUpdate(req.params.id, { $set: postObject });
      res.status(200).json({ message: 'Post updated!' });
    } catch (error) {
      res.status(400).json({ error });
    }
  };

/**
* Delete method
* @param {string} postId - associated userId		
* @return {string|error} - Sucessful insertion or Error
*/
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.userId != req.auth.userId) {
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