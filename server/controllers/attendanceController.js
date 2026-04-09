const mongoose = require('mongoose');
const Attendance = require('../models/AttendanceModel');
const Student = require('../models/Student');
const { recognizeFaceFromBuffer } = require('../services/faceRecognitionService');

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

        const invalidRecord = records.find((record) => { //studentId ya status missing hai, ya status valid nahi hai
            return !record.studentId || !['Present', 'Absent', 'Late'].includes(record.status);
        });

        if (invalidRecord) {
            return res.status(400).json({ message: 'Each record must include a valid studentId and status' });
        }

        const hasInvalidStudentId = records.some((record) => !mongoose.Types.ObjectId.isValid(record.studentId));
        if (hasInvalidStudentId) {
            return res.status(400).json({ message: 'Each record must include a valid student id' });
        }

        const uniqueStudentIds = new Set(records.map((record) => String(record.studentId)));
        if (uniqueStudentIds.size !== records.length) {
            return res.status(400).json({ message: 'Duplicate student attendance is not allowed for the same date' });
        }

        // Check if all studentIds exist in the database
        const existingStudentsCount = await Student.countDocuments({
            _id: { $in: [...uniqueStudentIds] },
        });

        if (existingStudentsCount !== uniqueStudentIds.size) {
            return res.status(400).json({ message: 'One or more students were not found' });
        }

        const attendance = await Attendance.findOneAndUpdate(
            { date: normalizedDate },
            { date: normalizedDate, records },
            {
                returnDocument: 'after',
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
        const normalizedDate = normalizeDate(req.query.date);

        if (!normalizedDate) {
            return res.status(400).json({ message: 'Please provide a valid date in query params' });
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

const getDashboardSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalStudents, todayAttendance] = await Promise.all([
            Student.countDocuments(),
            Attendance.findOne({ date: today }).select('records').lean(),
        ]);

        const records = Array.isArray(todayAttendance?.records) ? todayAttendance.records : [];

        const present = records.filter((record) => record.status === 'Present').length;
        const absent = records.filter((record) => record.status === 'Absent').length;
        const late = records.filter((record) => record.status === 'Late').length;

        return res.status(200).json({
            totalStudents,
            present,
            absent,
            late,
        });
    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        return res.status(500).json({ message: 'Failed to fetch dashboard summary' });
    }
};

const getStudentAttendancePercentages = async (_req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const last7DaysStart = new Date(today);
        last7DaysStart.setDate(last7DaysStart.getDate() - 6);

        const [attendanceDocs, students, last7DaysAttendanceDocs] = await Promise.all([
            Attendance.find().select('records').lean(),
            Student.find().select('name rollNo email department').lean(),
            Attendance.find({
                date: {
                    $gte: last7DaysStart,
                    $lte: today,
                },
            }).select('date records').lean(),
        ]);

        const totalClasses = attendanceDocs.length;

        const studentStats = new Map(
            students.map((student) => [
                String(student._id),
                {
                    present: 0,
                    absent: 0,
                    late: 0,
                },
            ])
        );

        const last7DaysAbsentStats = new Map(
            students.map((student) => [String(student._id), 0])
        );

        attendanceDocs.forEach((attendanceDoc) => {
            attendanceDoc.records.forEach((record) => {
                const key = String(record.studentId);
                const stat = studentStats.get(key);

                if (!stat) {
                    return;
                }

                if (record.status === 'Present') stat.present += 1;
                if (record.status === 'Absent') stat.absent += 1;
                if (record.status === 'Late') stat.late += 1;
            });
        });

        last7DaysAttendanceDocs.forEach((attendanceDoc) => {
            attendanceDoc.records.forEach((record) => {
                if (record.status !== 'Absent') {
                    return;
                }

                const key = String(record.studentId);
                if (!last7DaysAbsentStats.has(key)) {
                    return;
                }

                last7DaysAbsentStats.set(key, last7DaysAbsentStats.get(key) + 1);
            });
        });

        const studentPercentages = students.map((student) => {
            const stats = studentStats.get(String(student._id)) || { present: 0, absent: 0, late: 0 };
            const absentCountLast7Days = last7DaysAbsentStats.get(String(student._id)) || 0;
            const attendancePercentage =
                totalClasses > 0 ? Math.round(((stats.present + stats.late) / totalClasses) * 100) : 0;

            return {
                studentId: student._id,
                name: student.name,
                rollNo: student.rollNo,
                email: student.email,
                department: student.department,
                attendancePercentage,
                present: stats.present,
                absent: stats.absent,
                late: stats.late,
                absentCountLast7Days,
            };
        });

        const atRiskStudents = studentPercentages
            .filter((student) => student.attendancePercentage < 75)
            .sort((firstStudent, secondStudent) => firstStudent.attendancePercentage - secondStudent.attendancePercentage)
            .map((student) => ({
                studentId: student.studentId,
                name: student.name,
                rollNo: student.rollNo,
                percentage: student.attendancePercentage,
                department: student.department,
            }));

        const irregularStudents = studentPercentages
            .filter((student) => student.absentCountLast7Days >= 3)
            .sort((firstStudent, secondStudent) => secondStudent.absentCountLast7Days - firstStudent.absentCountLast7Days)
            .map((student) => ({
                studentId: student.studentId,
                name: student.name,
                rollNo: student.rollNo,
                absentCountLast7Days: student.absentCountLast7Days,
                percentage: student.attendancePercentage,
                department: student.department,
            }));

        return res.status(200).json({
            totalClasses,
            students: studentPercentages,
            atRiskStudents,
            irregularStudents,
        });
    } catch (error) {
        console.error('Error fetching student attendance percentages:', error);
        return res.status(500).json({ message: 'Failed to fetch student attendance percentages' });
    }
};

const recognizeFaceAndMarkAttendance = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'Please upload a valid image file' });
        }

        const normalizedDate = normalizeDate(req.body.date || new Date());
        if (!normalizedDate) {
            return res.status(400).json({ message: 'Please provide a valid attendance date' });
        }

        const markStatus = ['Present', 'Absent', 'Late'].includes(req.body.status) ? req.body.status : 'Present';

        const studentsWithEmbeddings = await Student.find({
            faceEmbedding: { $exists: true, $ne: [] },
        }).select('_id name rollNo faceEmbedding faceEmbeddingModel').lean();

        if (!studentsWithEmbeddings.length) {
            return res.status(400).json({ message: 'No enrolled student faces found. Enroll student faces first.' });
        }

        const candidates = studentsWithEmbeddings.map((student) => ({
            studentId: String(student._id),
            embedding: student.faceEmbedding,
        }));

        const aiResult = await recognizeFaceFromBuffer({
            imageBuffer: req.file.buffer,
            mimeType: req.file.mimetype,
            candidates,
        });

        if (!aiResult.isMatch || !aiResult.studentId) {
            return res.status(200).json({
                recognized: false,
                message: 'Unknown face. Attendance not marked.',
                confidence: aiResult.confidence,
            });
        }

        const matchedStudent = studentsWithEmbeddings.find(
            (student) => String(student._id) === String(aiResult.studentId)
        );

        if (!matchedStudent) {
            return res.status(404).json({ message: 'Recognized student not found in records' });
        }

        const attendance = await Attendance.findOne({ date: normalizedDate });

        if (!attendance) {
            const created = await Attendance.create({
                date: normalizedDate,
                records: [{ studentId: matchedStudent._id, status: markStatus }],
            });

            await created.populate('records.studentId', 'name rollNo email department');
            return res.status(200).json({
                recognized: true,
                message: `Attendance marked for ${matchedStudent.name}`,
                student: {
                    _id: matchedStudent._id,
                    name: matchedStudent.name,
                    rollNo: matchedStudent.rollNo,
                },
                confidence: aiResult.confidence,
                attendance: created,
            });
        }

        const recordIndex = attendance.records.findIndex(
            (record) => String(record.studentId) === String(matchedStudent._id)
        );

        if (recordIndex >= 0) {
            attendance.records[recordIndex].status = markStatus;
        } else {
            attendance.records.push({
                studentId: matchedStudent._id,
                status: markStatus,
            });
        }

        await attendance.save();
        await attendance.populate('records.studentId', 'name rollNo email department');

        return res.status(200).json({
            recognized: true,
            message: `Attendance marked for ${matchedStudent.name}`,
            student: {
                _id: matchedStudent._id,
                name: matchedStudent.name,
                rollNo: matchedStudent.rollNo,
            },
            confidence: aiResult.confidence,
            attendance,
        });
    } catch (error) {
        console.error('Error recognizing face and marking attendance:', error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message || 'Failed to recognize face' });
    }
};

module.exports = {
    saveAttendanceByDate,
    getAttendanceByDate,
    getAttendanceByStudent,
    getDashboardSummary,
    getStudentAttendancePercentages,
    recognizeFaceAndMarkAttendance,
};
