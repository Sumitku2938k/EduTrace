const Student = require('../models/Student');

const createStudent = async (req, res) => {
    try {
        const { name, rollNo, email, department } = req.body;

        if (!name || !rollNo || !email || !department) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (req.user && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to create student' });
        }

        const student = await Student.create({
            name,
            rollNo,
            email,
            department,
        });

        return res.status(201).json({
            message: 'Student created successfully',
            student,
        });
    } catch (error) {
        console.error('Error creating student:', error);
        return res.status(500).json({ message: 'Failed to create student' });
    }
};

const getStudents = async (_req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        return res.status(200).json({ students });
    } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({ message: 'Failed to fetch students' });
    }
};

const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json({ student });
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        return res.status(500).json({ message: 'Failed to fetch student' });
    }
};

const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, rollNo, email, department } = req.body;

        if (req.user && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to update student' });
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (rollNo !== undefined) updateData.rollNo = rollNo;
        if (email !== undefined) updateData.email = email;
        if (department !== undefined) updateData.department = department;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        const updated = await Student.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: 'after', runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json({
            message: 'Student updated successfully',
            student: updated,
        });
    } catch (error) {
        console.error('Error updating student:', error);
        return res.status(500).json({ message: 'Failed to update student' });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete student' });
        }

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
    getStudentById,
    updateStudent,
    deleteStudent,
};
