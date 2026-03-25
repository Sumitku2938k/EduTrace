const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        rollNo: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        department: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
// Virtual field to populate attendance records for a student
studentSchema.virtual('attendanceRecords', {
    ref: 'Attendance',
    localField: '_id',
    foreignField: 'records.studentId',
});

module.exports = mongoose.model('Student', studentSchema);
