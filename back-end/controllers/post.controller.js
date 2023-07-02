const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const User = require('../models/User.model');
const fs = require('fs');

const errorMessage = {
  notFound: 'Not found!',
  unauthorized: 'Not authorized!',
  serverError: 'Server Error!',
};
  

/**
 * Create a new post
 * @param req.body - Request body containing post datas
 * @param req.file - File attached to the request
 * @param req.protocol - Request protocol
 * @returns JSON response indicating the status of the operation
 */
exports.createPost = async (req, res, next) => {
  try {
    // Create a new post with the request body and the image
    const post = new Post({
      ...req.body,
      image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    // Find the user by ID
    const user = await User.findOne({ _id: req.body.userId });

    // Check if the user ID === the ID in the request
    if (req.body.userId !== user._id.toString()) {
      return res.status(401).json({ message: errorMessage.unauthorized });
    }

    // Save the post
    await post.save();

    res.status(200).json({ message: 'Post created!' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

  
/**
 * Get all posts
 * @returns JSON response containing all posts
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
 * Get a post by ID
 * @param req.params.id - The ID of the post to retrieve
 * @returns JSON response containing the post
 */
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error });
  }
};

  
/**
 * Update a post by ID
 * @param req.params.id - The ID of the post to update
 * @returns JSON response indicating the status of the operation
 */
exports.updatePost = async (req, res, next) => {
  const postReq = JSON.parse(req.body.post);

  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(postReq.userId);

    // Check if post exists
    if (!post) {
      return res.status(404).json({ message: errorMessage.notFound });
    }

    if (user.status === 'admin' || postReq.userId === post.userId.toString()) {
      await Post.findByIdAndUpdate(req.params.id, postReq, {
        new: true,
        overwrite: false,
      });
  
      res.status(200).json({ message: 'Post updated!' });
    } else {
      // not authorized
      return res.status(401).json({ message: errorMessage.unauthorized });
    }
  } catch (error) {
    res.status(500).json({ error: errorMessage.serverError });
  }
};

  
/**
 * Update the picture of a post
 * @param req.params.id - The ID of the post to update 
 * @returns JSON response indicating the status of the operation
 */
exports.updatePostPicture = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.body.userId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: errorMessage.notFound });
    }

    if (user.status === 'admin' || req.body.userId === post.userId.toString()) {

      // Check if a file is uploaded
      if (req.file) {
        if (post.image) {
          // If the post already has an image, delete the old image file
          const filename = post.image.split('/images/')[1];
          await fs.promises.unlink(`images/${filename}`);
        }

        // Set the image URL for the post to the new uploaded image
        const image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        post.image = image;
      } else {
        return res.status(400).json({ message: errorMessage.invalidData });
      }

      // Save the post
      await post.save();

      res.status(200).json({ message: 'Post picture updated!' });
    } else {
      return res.status(403).json({ message: errorMessage.unauthorized });
    }
  } catch (error) {
    res.status(500).json({ error: errorMessage.serverError });
  }
};

  
/**
 * Delete a post
 * @param req.params.id - ID of the post to delete
 * @param req.params.userId - ID of the user of the request
 * @returns JSON response indicating the status of the operation
 */
exports.deletePost = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.params.userId;

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post) {
      // The post does not exist
      return res.status(404).json({ message: errorMessage.notFound });
    }

    if (!user) {
      // The user does not exist
      return res.status(404).json({ message: errorMessage.notFound });
    }
    
    // Check if the user ID matches the one in the post
    if (user.status !== 'admin') {
      // The user is not authorized to delete this post
      return res.status(403).json({ message: errorMessage.unauthorized });
    }

    if (post.comments && post.comments.length > 0) {
      // Delete associated comments
      const commentIds = post.comments.map((comment) => comment._id);
      await Comment.deleteMany({ _id: { $in: commentIds } });
    }

    // Delete the post image file
    const filename = post.image.split('/images/')[1];
    await fs.promises.unlink(`images/${filename}`);

    // Remove the post from the database
    await post.remove();

    res.status(200).json({ message: 'Post deleted!' });
  } catch (error) {
    res.status(500).json({ error });
  }
};


