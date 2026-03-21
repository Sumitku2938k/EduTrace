const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found for this token' });
        }

        req.user = user;
        req.userId = user._id;
        req.token = token;
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'You are not allowed to access this resource' });
    }

    next();
};

module.exports = {
    authMiddleware,
    authorizeRoles,
};
