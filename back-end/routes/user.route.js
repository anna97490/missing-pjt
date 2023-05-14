const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const multer = require('../middleware/multer-config');
const userController = require('../controllers/user.controller');

  
// Create user 
router.post('/signup', multer, userController.signUp);

// Login
router.post('/login', userController.login)

// Get user by id
router.get('/:id', auth, userController.getUser);

// Update user
router.put('/:id', auth, userController.updateUser);

// Update profile picture
router.post('/:id/profile-picture', auth, multer, userController.updateProfilePicture);
  
// Delete user
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;