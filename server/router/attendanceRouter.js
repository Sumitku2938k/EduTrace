const express = require('express');
const router = express.Router();
const {
	saveAttendanceByDate,
	getAttendanceByDate,
	getAttendanceByStudent,
	getDashboardSummary,
	getStudentAttendancePercentages,
} = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');
router.use(authMiddleware);

router.get('/summary', getDashboardSummary);
router.get('/student-percentages', getStudentAttendancePercentages);
router.get('/', getAttendanceByDate);
router.get('/student/:studentId', getAttendanceByStudent);
router.post('/', saveAttendanceByDate);

module.exports = router;
