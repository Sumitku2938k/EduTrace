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
        markedAt: {
            type: Date,
            default: Date.now,
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
            set: (value) => {
                const parsedDate = new Date(value);
                parsedDate.setHours(0, 0, 0, 0); //same date ke multiple docs ban jaate hain, isliye time ko zero kar diya
                return parsedDate;
            },
        },
        records: {
            type: [attendanceRecordSchema],
            default: [],
            validate: {
                validator: (records) => { 
                    const studentIds = records.map((record) => String(record.studentId)); 
                    return new Set(studentIds).size === studentIds.length; //same student ek hi date me 2 baar nahi aa sakta
                },
                message: 'A student can only have one attendance record for a given date',
            },
        },
    },
    {
        timestamps: true,
    }
);

attendanceSchema.index({ date: 1 }, { unique: true }); //Fast search by date + duplicate prevention

module.exports = mongoose.model('Attendance', attendanceSchema);
