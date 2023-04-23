const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    firstname   : { type: String, required: true },
    lastname    : { type: String, required: true },
    birthDate   : { type: Date, required: true },
    address     : { type: String, required: true },
    missingDate : { type: Date, required: true },
    missingPlace: { type: String, required: true },
    description : { type: String, required: true},
    image       : { type: String, required: true},
    createdAt   : { type: Date, default: Date.now },
    userId      : { type: String, required: true },
});

module.exports = mongoose.model('Post', postSchema);