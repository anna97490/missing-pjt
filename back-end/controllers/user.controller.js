const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

// SignUp 
exports.signUp = async (req, res, next) => {
    // Check if email user already exists
    const isEmailUser = await User.findOne({ email: req.body.email });
    if (isEmailUser) {
        return res.status(409).json({ message: 'Email already registered' });
    } else {
        try {
            // Encrypted password
            const hash = await bcrypt.hash(req.body.password, 10);
            const user = new User({
                ...req.body,
                password: hash
            });
            await user.save();

            // The token for authorizations
            const token = jwt.sign(
                { userId: user._id },
                process.env.SECRET_TOKEN,
                { expiresIn: '24h' }
            );

            res.status(201).json({ message: 'User created!', token, _id: user._id});
        } catch (error) {
            console.log(error)
            res.status(400).json({ error });   
        }
    }
};

// Login 
exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        // Check user of the request is the same as user in DB
        if (!user) {
            return res.status(401).json({ message: 'Uncorrect email' });
        }

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Uncorrect password' });
        }
       
        // The token for authorizations
        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_TOKEN,
            { expiresIn: '24h' }
        );
      
        res.status(200).json({ message: 'Authentication successful', token, _id: user._id });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Get user by id 
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        res.status(200).json(user);
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
            return res.status(404).json({ message: 'User not found!' });
        }

        const userObject = {...userReq};

        await User.findByIdAndUpdate(req.params.id, userObject, {
            new: true,
            overwrite: false
        });

        res.status(200).json({ message: 'Profile updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error!' });
    }
};

exports.updateProfilePicture = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // If there is a file in the request
        if (req.file) {
            const image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            user.image = image;
        }

        await user.save();

        res.status(200).json({ message: 'Profile picture updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error!' });
    }
};

// Delete 
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });  
        } else {
            // const filename = post.image.split('/images/')[1];
            // await fs.promises.unlink(`images/${filename}`);
            await User.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'User deleted !' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};






