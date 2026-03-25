const mongoose = require('mongoose');
const Attendance = require('../models/AttendanceModel');

const normalizeDate = (value) => {
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    parsedDate.setHours(0, 0, 0, 0);
    return parsedDate;
};

const saveAttendanceByDate = async (req, res) => {
    try {
        const { date, records } = req.body;
        const normalizedDate = normalizeDate(date);

        if (!normalizedDate) {
            return res.status(400).json({ message: 'Please provide a valid attendance date' });
        }

        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ message: 'Please provide at least one attendance record' });
        }

        const invalidRecord = records.find((record) => {
            return !record.studentId || !['Present', 'Absent', 'Late'].includes(record.status);
        });

        if (invalidRecord) {
            return res.status(400).json({ message: 'Each record must include a valid studentId and status' });
        }

        const uniqueStudentIds = new Set(records.map((record) => String(record.studentId)));
        if (uniqueStudentIds.size !== records.length) {
            return res.status(400).json({ message: 'Duplicate student attendance is not allowed for the same date' });
        }

        const attendance = await Attendance.findOneAndUpdate(
            { date: normalizedDate },
            { date: normalizedDate, records },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        ).populate('records.studentId', 'name rollNo email department');

        return res.status(200).json({
            message: 'Attendance saved successfully',
            attendance,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Attendance for this date already exists' });
        }

        console.error('Error saving attendance:', error);
        return res.status(500).json({ message: 'Failed to save attendance' });
    }
};

const getAttendanceByDate = async (req, res) => {
    try {
        const normalizedDate = normalizeDate(req.params.date);

        if (!normalizedDate) {
            return res.status(400).json({ message: 'Please provide a valid date' });
        }

        const attendance = await Attendance.findOne({ date: normalizedDate })
            .populate('records.studentId', 'name rollNo email department')
            .lean();

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance not found for this date' });
        }

        return res.status(200).json({ attendance });
    } catch (error) {
        console.error('Error fetching attendance by date:', error);
        return res.status(500).json({ message: 'Failed to fetch attendance' });
    }
};

const getAttendanceByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Please provide a valid student id' });
        }

        const attendance = await Attendance.find({ 'records.studentId': studentId })
            .select('date records')
            .sort({ date: -1 })
            .lean();

        const studentAttendance = attendance.map((entry) => {
            const record = entry.records.find((item) => String(item.studentId) === studentId);

            return {
                date: entry.date,
                studentId,
                status: record?.status || null,
            };
        });

        return res.status(200).json({ attendance: studentAttendance });
    } catch (error) {
        console.error('Error fetching attendance by student:', error);
        return res.status(500).json({ message: 'Failed to fetch student attendance' });
    }
};

module.exports = {
    saveAttendanceByDate,
    getAttendanceByDate,
    getAttendanceByStudent,
};
