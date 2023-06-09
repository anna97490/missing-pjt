const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const commentController = require('../controllers/comment.controller');

// Create comment
router.post('/create-comment', auth, commentController.createComment);

// Get all comments
router.get('/', commentController.getAllComments);

// Delete comment
router.delete('/:userId/:id/delete-comment', auth, commentController.deleteComment);

module.exports = router;