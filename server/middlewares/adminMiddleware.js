const adminMiddleware = (req, res, next) => {
    try {
        console.log("Admin middleware executed for user:", req.user); // Log the user object for debugging
        if (req.user && req.user.role === 'admin') { // Check if user is authenticated and has admin privileges
            next(); // User is admin, proceed to the next middleware or route handler
        } else {
            return res.status(403).json({ message: 'Access denied, admin only' }); // User is not admin, deny access
        }
    } catch (error) {
        console.log("Error in admin middleware:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = adminMiddleware;