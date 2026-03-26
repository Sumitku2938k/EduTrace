const express = require('express');
const router = express.Router();
const { saveAttendanceByDate, getAttendanceByDate, getAttendanceByStudent } = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');
router.use(authMiddleware);

router.get('/', getAttendanceByDate);
router.get('/student/:studentId', getAttendanceByStudent);
router.post('/', saveAttendanceByDate);

module.exports = router;
