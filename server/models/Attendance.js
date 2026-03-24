const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        date: {
            type: Date,
            required: true,
            set: (value) => {
                const parsedDate = new Date(value);
                parsedDate.setHours(0, 0, 0, 0);
                return parsedDate;
            },
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late'],
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// One student can have many attendance records, but only one per day.
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
