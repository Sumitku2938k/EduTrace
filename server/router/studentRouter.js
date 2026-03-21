const express = require('express');
const router = express.Router();
const { createStudent, getStudents, getStudentById, updateStudent, deleteStudent } = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { createStudentSchema, updateStudentSchema } = require('../validator/studentValidator');

router.use(authMiddleware);

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.route('/create').post(adminMiddleware, validate(createStudentSchema), createStudent);
router.route('/update/:id').patch(adminMiddleware, validate(updateStudentSchema), updateStudent);
router.route('/delete/:id').delete(adminMiddleware, deleteStudent);

module.exports = router;
