const express = require('express');
const { register, login, getUser } = require('../controllers/authController');
const { signUpSchema, loginSchema } = require('../validator/authValidator');
const validate = require('../middlewares/validateMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', validate(signUpSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/user', authMiddleware, getUser);

module.exports = router;
