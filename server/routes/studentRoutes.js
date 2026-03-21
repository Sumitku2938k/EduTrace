const express = require('express');
const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
} = require('../controllers/studentController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getStudents);
router.post('/', authorizeRoles('admin'), createStudent);
router.put('/:id', authorizeRoles('admin'), updateStudent);
router.delete('/:id', authorizeRoles('admin'), deleteStudent);

module.exports = router;
