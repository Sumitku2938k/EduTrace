const Attendance = require('../models/AttendanceModel');
const Student = require('../models/Student');

const REGULAR_ATTENDANCE_THRESHOLD = 85;
const AT_RISK_ATTENDANCE_THRESHOLD = 60;
const FREQUENT_LATE_DAYS = 10;
const FREQUENT_LATE_THRESHOLD = 5;
const DROP_WINDOW_SIZE = 7;
const SUDDEN_DROP_THRESHOLD = 20;

const createEmptyStats = () => ({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
});

const getStudentId = (student) => String(student._id);

const getRecordStudentId = (record) => String(record.studentId?._id || record.studentId);

const calculatePercentage = (stats) => {
    if (!stats.total) {
        return 0;
    }

    return Math.round(((stats.present + stats.late) / stats.total) * 100);
};

const getCategory = (percentage) => {
    if (percentage >= REGULAR_ATTENDANCE_THRESHOLD) {
        return 'Regular';
    }

    if (percentage >= AT_RISK_ATTENDANCE_THRESHOLD) {
        return 'Irregular';
    }

    return 'At-Risk';
};

const addRecordToStats = (stats, record) => {
    if (record.status === 'Present') {
        stats.present += 1;
    }

    if (record.status === 'Absent') {
        stats.absent += 1;
    }

    if (record.status === 'Late') {
        stats.late += 1;
    }

    stats.total += 1;
};

const buildStudentMap = (students) => {
    return new Map(
        students.map((student) => [
            getStudentId(student),
            {
                studentId: student._id,
                name: student.name,
                rollNo: student.rollNo,
                email: student.email,
                department: student.department,
            },
        ])
    );
};

const aggregatePerStudent = (students, attendanceDocs) => {
    const statsByStudent = new Map(
        students.map((student) => [getStudentId(student), createEmptyStats()])
    );

    attendanceDocs.forEach((attendanceDoc) => {
        attendanceDoc.records.forEach((record) => {
            const studentId = getRecordStudentId(record);
            const stats = statsByStudent.get(studentId);

            if (!stats) {
                return;
            }

            addRecordToStats(stats, record);
        });
    });

    return statsByStudent;
};

const buildStatsForDocs = (students, attendanceDocs) => {
    return aggregatePerStudent(students, attendanceDocs);
};

const getBehaviorDataset = async () => {
    const [students, attendanceDocs] = await Promise.all([
        Student.find().select('name rollNo email department').lean(),
        Attendance.find().select('date records').sort({ date: 1 }).lean(),
    ]);

    const studentMap = buildStudentMap(students);
    const statsByStudent = aggregatePerStudent(students, attendanceDocs);

    return {
        students,
        studentMap,
        attendanceDocs,
        statsByStudent,
    };
};

const getClassification = async () => {
    const { students, attendanceDocs, statsByStudent } = await getBehaviorDataset();

    const classifications = students.map((student) => {
        const stats = statsByStudent.get(getStudentId(student)) || createEmptyStats();
        const percentage = calculatePercentage(stats);

        return {
            studentId: student._id,
            name: student.name,
            rollNo: student.rollNo,
            department: student.department,
            percentage,
            category: getCategory(percentage),
            ...stats,
        };
    });

    const summary = classifications.reduce(
        (result, student) => {
            result[student.category] += 1;
            return result;
        },
        {
            Regular: 0,
            Irregular: 0,
            'At-Risk': 0,
        }
    );

    return {
        totalAttendanceDays: attendanceDocs.length,
        thresholds: {
            regular: REGULAR_ATTENDANCE_THRESHOLD,
            atRisk: AT_RISK_ATTENDANCE_THRESHOLD,
        },
        summary,
        students: classifications.sort((first, second) => first.percentage - second.percentage),
    };
};

const getFrequentLateFlags = (students, attendanceDocs, studentMap) => {
    const recentDocs = [...attendanceDocs].sort((first, second) => second.date - first.date).slice(0, FREQUENT_LATE_DAYS);
    const lateCounts = new Map(students.map((student) => [getStudentId(student), 0]));

    recentDocs.forEach((attendanceDoc) => {
        attendanceDoc.records.forEach((record) => {
            if (record.status !== 'Late') {
                return;
            }

            const studentId = getRecordStudentId(record);
            if (!lateCounts.has(studentId)) {
                return;
            }

            lateCounts.set(studentId, lateCounts.get(studentId) + 1);
        });
    });

    return [...lateCounts.entries()]
        .filter(([, lateCount]) => lateCount >= FREQUENT_LATE_THRESHOLD)
        .map(([studentId, lateCount]) => ({
            studentId,
            name: studentMap.get(studentId)?.name || 'Unknown Student',
            lateCount,
            flag: 'Frequent Late',
        }));
};

const getSuddenDropFlags = (students, attendanceDocs, studentMap) => {
    const recentFirstDocs = [...attendanceDocs].sort((first, second) => second.date - first.date);
    const recentDocs = recentFirstDocs.slice(0, DROP_WINDOW_SIZE);
    const previousDocs = recentFirstDocs.slice(DROP_WINDOW_SIZE, DROP_WINDOW_SIZE * 2);

    const recentStats = buildStatsForDocs(students, recentDocs);
    const previousStats = buildStatsForDocs(students, previousDocs);

    return students
        .map((student) => {
            const studentId = getStudentId(student);
            const recent = calculatePercentage(recentStats.get(studentId) || createEmptyStats());
            const previous = calculatePercentage(previousStats.get(studentId) || createEmptyStats());
            const drop = previous - recent;

            return {
                studentId,
                name: studentMap.get(studentId)?.name || student.name,
                previous,
                recent,
                drop,
                alert: drop > SUDDEN_DROP_THRESHOLD,
            };
        })
        .filter((student) => student.alert);
};

const getScores = async () => {
    const { students, statsByStudent } = await getBehaviorDataset();

    const scores = students
        .map((student) => {
            const stats = statsByStudent.get(getStudentId(student)) || createEmptyStats();
            const score = stats.present * 1 + stats.late * 0.5 - stats.absent * 1;

            return {
                studentId: student._id,
                name: student.name,
                rollNo: student.rollNo,
                department: student.department,
                score,
                present: stats.present,
                late: stats.late,
                absent: stats.absent,
            };
        })
        .sort((first, second) => second.score - first.score);

    return {
        formula: 'score = (present * 1) + (late * 0.5) - (absent * 1)',
        scores,
    };
};

const getAlerts = async () => {
    const classification = await getClassification();
    const { students, attendanceDocs, studentMap } = await getBehaviorDataset();
    const frequentLateFlags = getFrequentLateFlags(students, attendanceDocs, studentMap);
    const suddenDropFlags = getSuddenDropFlags(students, attendanceDocs, studentMap);

    const alerts = [];

    classification.students
        .filter((student) => student.category === 'At-Risk')
        .forEach((student) => {
            alerts.push({
                studentId: student.studentId,
                name: student.name,
                type: 'At-Risk',
                message: `Attendance below ${AT_RISK_ATTENDANCE_THRESHOLD}%`,
                percentage: student.percentage,
            });
        });

    suddenDropFlags.forEach((student) => {
        alerts.push({
            studentId: student.studentId,
            name: student.name,
            type: 'Drop',
            message: `Attendance dropped by ${student.drop}%`,
            previous: student.previous,
            recent: student.recent,
            drop: student.drop,
        });
    });

    frequentLateFlags.forEach((student) => {
        alerts.push({
            studentId: student.studentId,
            name: student.name,
            type: 'Frequent Late',
            message: `${student.lateCount} late marks in last ${FREQUENT_LATE_DAYS} attendance days`,
            lateCount: student.lateCount,
        });
    });

    return {
        thresholds: {
            atRisk: AT_RISK_ATTENDANCE_THRESHOLD,
            suddenDrop: SUDDEN_DROP_THRESHOLD,
            frequentLate: FREQUENT_LATE_THRESHOLD,
            recentLateDays: FREQUENT_LATE_DAYS,
            dropWindowDays: DROP_WINDOW_SIZE,
        },
        alerts,
        frequentLateFlags,
        suddenDropFlags,
    };
};

module.exports = {
    getClassification,
    getAlerts,
    getScores,
};
