const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname : { type: String, required: true },
    email    : { type: String, required: true, unique: true },
    password : { type: String, required: true},
    createdAt: { type: Date, default: Date.now }
});
       
userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
