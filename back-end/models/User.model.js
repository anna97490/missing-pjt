const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname : { type: String, required: true },
    email    : { type: String, required: true, unique: true },
    birthDate: { type: Date, required: true },
    password : { type: String, required: true },
    image    : { type: String },
    posts    : [],
});
       
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);