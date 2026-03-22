const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const jwtToken = authHeader.replace('Bearer ', '').trim();
    const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).json({ message: 'JWT secret is not configured' });
    }

    try {
        const isVerified = jwt.verify(jwtToken, jwtSecret);

        const userData = await User.findById(isVerified.userId).select({ password: 0 });
        if (!userData) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }

        req.user = userData;
        req.token = jwtToken;
        req.userId = userData._id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, authorization denied' });
        }

        return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
};

module.exports = authMiddleware;