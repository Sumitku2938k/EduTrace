const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./utils/db');
const authRouter = require('./router/authRouter');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
    })
);
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/students', studentRoutes);

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
    });
});

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to start server:', err);
    });
