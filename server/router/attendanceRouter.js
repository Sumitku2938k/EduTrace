const express = require('express');
const router = express.Router();
const { saveAttendanceByDate, getAttendanceByDate, getAttendanceByStudent } = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(authMiddleware);

router.get('/', getAttendanceByDate);
router.get('/student/:studentId', getAttendanceByStudent);
router.post('/', adminMiddleware, saveAttendanceByDate);

module.exports = router;
