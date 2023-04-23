const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

/**
* SignUp method
* @param {object} user   - user datas
* @param {string} userId - associated userId		
* @return {string|error} - Sucessful insertion or Error
*/
exports.signUp = async (req, res, next) => {
    console.log(req.body)
    const isEmailUser = await User.findOne({ email: req.body.email });
    if (isEmailUser) {
        return res.status(409).json({ message: 'Email already registered' });
    } else {
        try {
            const hash = await bcrypt.hash(req.body.password, 10);
            const user = new User({
                ...req.body,
                password: hash
            });
            await user.save();
            res.status(201).json({ message: 'User created!', _id: user._id });
        } catch (error) {
            console.log(error)
            res.status(400).json({ error });   
        }
    }
};

/**
* Login method
* @param {string} email    - user email
* @param {string} password - user password	
* @return {string|error}   - Sucessful insertion or Error
*/
exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'Uncorrect email' });
        }
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Uncorrect password' });
        }
        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                process.env.SECRET_TOKEN,
                { expiresIn: '24h'}
            ),
            message: 'Logged'
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

/**
* Get all users method
* @param {string} email    - user email
* @param {string} password - user password	
* @return {string|error}   - Sucessful insertion or Error
*/
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error });
    }
};

/**
* Get user by id method
* @return {string|error}   - Sucessful insertion or Error
*/
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error });
    }
};

/**
* Update method
* @param {object} user     - datas to update 
* @return {string|error}   - Sucessful insertion or Error
*/
exports.updateUser = async (req, res, next) => {
    const userReq = JSON.parse(req.body.user);
    const idUser  = { _id: req.params.id };
    try {
        const user = await User.findById(req.params.id);
        console.log('req.params.id', req.params.id);
        console.log('req.body.user', req.body.user);
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        } else if (user.image !== undefined) {
            const filename = user.image.split('/images/')[1];
            fs.unlinkSync(`./images/${filename}`);
        }

        const userObject = req.file ? {
            ...userReq,
            image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...userReq };

        await User.findByIdAndUpdate(req.params.id, userObject, {
            new: true,
            overwrite: false
        });

        res.status(200).json({ message: 'Profile updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Server Error!' });
    }
};

/**
* Delete method
* @param {string} userId - user email
* @return {string|error} - Sucessful insertion or Error
*/
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






