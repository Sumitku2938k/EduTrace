const express = require('express');
const { createStudent, getStudents, updateStudent, deleteStudent } = require('../controllers/studentController');
const router = express.Router();

// POST   /api/students
router.post('/', createStudent);

// GET    /api/students
router.get('/', getStudents);

// PUT    /api/students/:id
router.put('/:id', updateStudent);

// DELETE /api/students/:id
router.delete('/:id', deleteStudent);

module.exports = router;

