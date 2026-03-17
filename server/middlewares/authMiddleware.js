const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization'); // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Remove "Bearer " prefix if present
    const jwtToken = token.replace("Bearer ", "");

    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY); // Verify JWT token using secret key from environment variables
        
        const userData = await User.findOne({ email: isVerified.email }).select({ password: 0 }); // Find user in database using user ID from verified token
        if (!userData) {
            return res.status(401).json({ message: 'User not found, authorization denied' });
        }
        req.user = userData; // Attach user object to request object
        req.token = token; // Attach token to request object
        req.userId = userData._id; // Attach user ID to request object for easy access in future middlewares or route handlers
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.log("Error in verifying token:", error);
        return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
};

module.exports = authMiddleware;