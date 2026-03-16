const Student = require('../models/Student');

// POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, rollNo, email, department } = req.body;

    const student = await Student.create({
      name,
      rollNo,
      email,
      department,
    });

    return res.status(201).json({message: "Student Created Successfully",student});
  } catch (error) {
    console.error('Error creating student:', error);
    return res.status(500).json({ message: 'Failed to create student' });
  }
};

// GET /api/students
const getStudents = async (_req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    return res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ message: 'Failed to fetch students' });
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollNo, email, department } = req.body;

    const updated = await Student.findByIdAndUpdate(
      id,
      { name, rollNo, email, department },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({ message: 'Student updated successfully', updated });
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({ message: 'Failed to update student' });
  }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Student.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({ message: 'Failed to delete student' });
  }
};

module.exports = {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
};

