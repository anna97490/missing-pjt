const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

const errorMessage = {
  notFound: 'User not found!',
  unauthorized: 'You are not authorized!',
  serverError: 'Server Error!',
  uncorrectEmail: 'Incorrect email',
  uncorrectPassword: 'Incorrect password',
};

// SignUp
exports.signUp = async (req, res, next) => {
  try {
    const isEmailUser = await User.findOne({ email: req.body.email });
    if (isEmailUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      ...req.body,
      password: hash,
    });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({ message: 'User created!', token, _id: user._id });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: errorMessage.uncorrectEmail });
    }

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json({ message: errorMessage.uncorrectPassword });
    }

    const token = generateToken(user._id);

    res.status(200).json({ message: 'Authentication successful', token, _id: user._id });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get user by id
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(401).json({ message: errorMessage.notFound });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(404).json({ error });
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  const userReq = JSON.parse(req.body.user);

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: errorMessage.notFound });
    } else if (!isAuthorized(user._id, req.params.id)) {
      return res.status(403).json({ message: errorMessage.unauthorized });
    }

    // update the document with new data
    await User.findByIdAndUpdate(req.params.id, { $set: userReq });

    res.status(200).json({ message: 'Profile updated!' });
  } catch (error) {
    res.status(500).json({ error: errorMessage.serverError });
  }
};

// Update profile picture
exports.updateProfilePicture = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: errorMessage.notFound });
    } else if (!isAuthorized(user._id, req.params.id)) {
      return res.status(403).json({ message: errorMessage.unauthorized });
    }

    if (req.file) {
      if (user.image) {
        const filename = user.image.split('/images/')[1];
        await fs.promises.unlink(`images/${filename}`);
      }
      const image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
      user.image = image;
    }

    await user.save();

    res.status(200).json({ message: 'Profile picture updated!' });
  } catch (error) {
    res.status(500).json({ error: errorMessage.serverError });
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: errorMessage.notFound });
    } else if (!isAuthorized(user._id, req.params.id)) {
      return res.status(403).json({ message: errorMessage.unauthorized });
    }

    if (user.image) {
      const filename = user.image.split('/images/')[1];
      await fs.promises.unlink(`images/${filename}`);
    }

    await User.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'User deleted!' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.SECRET_TOKEN,
    { expiresIn: '24h' }
  );
};

// Function to check if the user is authorized
const isAuthorized = (userIdDb, userIdParam) => {
  return userIdDb.toString() === userIdParam;
};