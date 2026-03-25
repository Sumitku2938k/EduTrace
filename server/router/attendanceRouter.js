const express = require('express');
const router = express.Router();
const {
    saveAttendanceByDate,
    getAttendanceByDate,
    getAttendanceByStudent,
} = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(authMiddleware);

router.get('/date/:date', getAttendanceByDate);
router.get('/student/:studentId', getAttendanceByStudent);
router.post('/save', adminMiddleware, saveAttendanceByDate);

module.exports = router;
