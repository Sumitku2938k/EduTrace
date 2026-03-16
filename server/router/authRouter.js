const express = require('express');
const router = express.Router();
const { home, register, login } = require('../controllers/authController');

router.route('/').get(home);
router.route('/register').post(register);
router.route('/login').post(login);

module.exports = router;