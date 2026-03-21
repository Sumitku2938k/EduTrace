const express = require('express');
const router = express.Router();
const { createStudent, getStudents, getStudentById, updateStudent, deleteStudent } = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validate = require('../middlewares/validateMiddleware');

router.use(authMiddleware);

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', adminMiddleware, validate(createStudentSchema), createStudent);
router.put('/:id', adminMiddleware, validate(updateStudentSchema), updateStudent);
router.delete('/:id', adminMiddleware, validate(deleteStudentSchema), deleteStudent);

module.exports = router;
