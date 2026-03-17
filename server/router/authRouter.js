const express = require('express');
const router = express.Router();
const { home, register, login, getUser } = require('../controllers/authController');
const { signUpSchema, loginSchema } = require('../validator/authValidator');
const validate = require('../middlewares/validateMiddleware');

router.route('/').get(home);
router.route('/register').post(validate(signUpSchema), register);
router.route('/login').post(validate(loginSchema), login);

// Route to fetch currently authenticated user
const authMiddleware = require('../middlewares/authMiddleware');
router.route('/user').get(authMiddleware, getUser); // protected route returning user info

module.exports = router;