const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const multer = require('../middleware/multer-config');
const postController = require('../controllers/post.controller');
  
// Create post
router.post('/create', auth, multer, postController.createPost);

// Get One post by id
router.get('/:id', postController.getPost);

// Get all posts
router.get('/', postController.getAllPosts);

// Update post
router.put('/:id', auth, multer, postController.updatePost);
  
// Delete post
router.delete('/:id', auth, postController.deletePost);

// --------- Comments --------
// Create comment
router.post('/:id/create-comment', auth, postController.createComment);

// Update comment
router.put('/:id/update-comment', postController.updateComment);

// Delete comment
router.delete('/:commentId/delete-comment', auth, postController.deleteComment);
 
module.exports = router;