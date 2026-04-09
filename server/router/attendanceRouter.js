const express = require('express');
const router = express.Router();
const {
	saveAttendanceByDate,
	getAttendanceByDate,
	getAttendanceByStudent,
	getDashboardSummary,
	getStudentAttendancePercentages,
	recognizeFaceAndMarkAttendance,
} = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadSingleFaceImage } = require('../middlewares/uploadMiddleware');
router.use(authMiddleware);

router.get('/summary', getDashboardSummary);
router.get('/student-percentages', getStudentAttendancePercentages);
router.get('/', getAttendanceByDate);
router.get('/student/:studentId', getAttendanceByStudent);
router.post('/', saveAttendanceByDate);
router.post('/recognize-face', uploadSingleFaceImage, recognizeFaceAndMarkAttendance);

module.exports = router;
