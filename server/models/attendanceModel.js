const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late'],
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

const attendanceSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
            unique: true,
            set: (value) => {
                const parsedDate = new Date(value);
                parsedDate.setHours(0, 0, 0, 0);
                return parsedDate;
            },
        },
        records: {
            type: [attendanceRecordSchema],
            default: [],
            validate: {
                validator: (records) => { 
                    const studentIds = records.map((record) => String(record.studentId));
                    return new Set(studentIds).size === studentIds.length;
                },
                message: 'A student can only have one attendance record for a given date',
            },
        },
    },
    {
        timestamps: true,
    }
);

attendanceSchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
