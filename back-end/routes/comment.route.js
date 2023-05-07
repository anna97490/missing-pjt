const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const multer = require('../middleware/multer-config');
const commentController = require('../controllers/comment.controller');
  
// Create comment
router.post('/create', auth, commentController.createComment);

// Update comment
router.put('/:id', auth, multer, commentController.updateComment);
  
// Delete comment
router.delete('/:id', auth, commentController.deleteComment);

// Get One comment by id
router.get('/:id', commentController.getComment);

// Get all comments
router.get('/', commentController.getAllComments)
   
module.exports = router;