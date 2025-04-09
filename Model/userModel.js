const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String
    },
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }]

}, { timestamps: true });

const users = mongoose.model('users', userSchema);

module.exports = users;
