const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const commentController = require('../controllers/comment.controller');

// Get all comments
router.get('/', commentController.getAllComments);

module.exports = router;