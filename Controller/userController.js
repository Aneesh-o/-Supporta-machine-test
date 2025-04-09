const users = require('../Model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Generate Tokens
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
};

// Register
exports.registerController = async (req, res) => {
    const { username, email, password, profilePhoto } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) return res.status(409).json({ message: 'User already exists. Please login.' });
        const uploadProfilePic = req.file ? req.file.filename : profilePhoto

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new users({
            username,
            email,
            password: hashedPassword,
            profilePhoto: uploadProfilePic || ''
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login
exports.loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await users.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect username/password' });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePhoto: user.profilePhoto
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Refresh Access Token
exports.refreshTokenController = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });
        const newAccessToken = generateAccessToken(decoded.userId);
        res.status(200).json({ accessToken: newAccessToken });
    });
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await users.findById(req.userId).select('-password');
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    console.log("Inside updateProfile");
    console.log(req.body);
    const { username, email, profilePhoto } = req.body;
    console.log(req.body);
    try {
        const user = await users.findById(req.userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.username = username || user.username;
        user.email = email || user.email;
        user.profilePhoto = profilePhoto || user.profilePhoto;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};





// Block a user
exports.blockUser = async (req, res) => {
    const userId = req.userId;
    const { id: targetUserId } = req.params;
    if (userId === targetUserId) {
        return res.status(400).json({ message: "You can't block yourself." });
    }
    try {
        const user = await users.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.blockedUsers.includes(targetUserId)) {
            user.blockedUsers.push(targetUserId);
            await user.save();
        }
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Unblock a user
exports.unblockUser = async (req, res) => {
    const userId = req.userId;
    const { id: targetUserId } = req.params;

    try {
        const user = await users.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.blockedUsers = user.blockedUsers.filter(
            (blockedId) => blockedId.toString() !== targetUserId
        );
        await user.save();

        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get list of blocked users
exports.getBlockedUsers = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await users.findById(userId).populate('blockedUsers', 'username email');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ blockedUsers: user.blockedUsers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
