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
        faceEmbedding: {
            type: [Number],
            default: undefined,
        },
        faceEmbeddingModel: {
            type: String,
            default: 'face_recognition_v1',
            trim: true,
        },
        faceEnrolledAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
// Virtual field to populate attendance records for a student
studentSchema.virtual('attendanceRecords', { //Student → uske attendance records fetch kar sakte ho
    ref: 'Attendance',
    localField: '_id',
    foreignField: 'records.studentId',
});

module.exports = mongoose.model('Student', studentSchema);
