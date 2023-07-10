const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// Create user 
router.post('/signup', userController.signUp);

// Login
router.post('/login', userController.login)

// Get user by id
router.get('/:id', userController.getUser);

// Update user
router.put('/:id', auth, userController.updateUser);
  
// Delete user
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;