const express = require('express');
const router = express.Router();
const { home, register, login, getUser } = require('../controllers/authController');

router.route('/').get(home);
router.route('/register').post(register);
router.route('/login').post(login);

// Route to fetch currently authenticated user
const authMiddleware = require('../middlewares/authMiddleware');
router.route('/user').get(authMiddleware, getUser); // protected route returning user info

module.exports = router;