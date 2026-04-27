const express = require('express');
const router = express.Router();
const {
    getClassification,
    getAlerts,
    getScores,
} = require('../controllers/behaviorController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/classification', getClassification);
router.get('/alerts', getAlerts);
router.get('/scores', getScores);

module.exports = router;
