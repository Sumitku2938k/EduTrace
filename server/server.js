const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./utils/db');
const authRouter = require('./router/authRouter');
const studentRouter = require('./router/studentRouter');
const attendanceRouter = require('./router/attendanceRouter');
const behaviorRouter = require('./router/behaviorRouter');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

//Handling cors policy issues
const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/students', studentRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/behavior', behaviorRouter);

// Global error handling middleware
app.use(errorMiddleware);

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to start server:', err);
    });
