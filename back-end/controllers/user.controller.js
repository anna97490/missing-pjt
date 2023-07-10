const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const errorMessage = {
  notFound: 'User not found!',
  unauthorized: 'You are not authorized!',
  serverError: 'Server Error!',
  uncorrectEmail: 'Incorrect email',
  emailAlreadyUsed: 'Email already registered',
  uncorrectPassword: 'Incorrect password',
};

/**
 * Sign up a new user
 * @param user The user object containing firstname, lastname, email, and password
 * @returns An observable that emits the created user
 */
exports.signUp = async (req, res, next) => {
  try {
    const isEmailUser = await User.findOne({ email: req.body.email });

    // Check if email already exists
    if (isEmailUser) {
      return res.status(409).json({ message: errorMessage.emailAlreadyUsed });
    }
   
    // Hash the password
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      ...req.body,
      password: hash,
    });

    // Save the new user
    await user.save();

    // Get the new user
    const email = user.email;
    const newUser = await User.findOne({ email });
    
    // Generate Token
    const token = jwt.sign(
      { userId: newUser._id, isAdmin: user.status },
        process.env.SECRET_TOKEN,
      { expiresIn: '24h',}
    )

    res.status(201).json({ message: 'User created!', token, _id: newUser._id });
  } catch (error) {
    res.status(500).json({ message: errorMessage.serverError });
  }
};


/**
 * Log in an existing user
 * @param email The user's email
 * @param password The user's password
 * @returns An observable that emits the authenticated user
 */
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const valid = await bcrypt.compare(req.body.password, user.password);

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: errorMessage.uncorrectEmail });
    }

    // Check password
    if (!valid) {
      return res.status(401).json({ message: errorMessage.uncorrectPassword });
    }

    // Generate token
    // const token = generateToken(user._id);
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.status },
        process.env.SECRET_TOKEN,
      { expiresIn: '24h',}
    )

    res.status(200).json({ message: 'Authentication successful', token, _id: user._id });
  } catch (error) {
    res.status(500).json({ message: errorMessage.serverError });
  }
};


/**
 * Get a user by their ID
 * @returns A JSON response with the user's datas if found, or an error message if not found
 */
exports.getUser = async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await User.findOne({ _id: req.params.id });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: errorMessage.notFound });
    } else {
      // Return the user's datas
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(404).json({ error });
  }
};


/**
 * Update the user with new datas
 * @param req The request object
 * @returns A JSON response indicating the success or failure of the update operation
 */
exports.updateUser = async (req, res, next) => {
  const userReq = JSON.parse(req.body.user);

  // Check the type of userReq
  if (typeof userReq !== 'object') {
    return res.status(400).json({ message: errorMessage.invalidDataTypes });
  }

  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: errorMessage.notFound });
    } else if (!isAuthorized(user._id, req.params.id)) {
      return res.status(403).json({ message: errorMessage.unauthorized });
    }

    // Update the document with new datas
    await User.findByIdAndUpdate(req.params.id, { $set: userReq });

    res.status(200).json({ message: 'Profile updated!' });
  } catch (error) {
    res.status(500).json({ error: errorMessage.serverError });
  }
};


/**
 * Delete the user by userId
 * @param req.params.id The ID of the user to delete
 * @returns JSON response indicating the status of the operation
 */
exports.deleteUser = async (req, res, next) => {
  try {
    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: errorMessage.notFound });
    } else if (!isAuthorized(user._id, req.params.id)) {
      return res.status(403).json({ message: errorMessage.unauthorized });
    }

    // Delete the user
    await User.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'User deleted!' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.SECRET_TOKEN,
    { expiresIn: '24h' }
  );
};

// Check if the user is authorized
const isAuthorized = (userIdDb, userIdParam) => {
  return userIdDb.toString() === userIdParam;
};