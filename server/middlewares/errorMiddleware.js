const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500; // Default to 500 Internal Server Error
    const message = err.message || "An unexpected error occurred";
    const extraDetails = err.extraDetails || "Back-end error";
    return res.status(status).json({ message, extraDetails });
};

module.exports = errorMiddleware;