const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./utils/db');
const PORT = process.env.PORT || 3000;
const router = require('./router/authRouter');

app.use(express.json());
app.use('/api/auth', router);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to start server:', err);  
});