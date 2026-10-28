import { db } from '../services/dbService.js';
import { calculateStudentRisk } from '../utils/riskCalculator.js';

export async function getStudentDashboard(req, res, next) {
  try {
    const students = await db.find('students');
    const assignments = await db.find('assignments');
    const timetable = await db.find('timetable');
    const announcements = await db.find('announcements');

    // Identify current student (if logged in user is student, find by email or studentId; otherwise fallback to std_01 Aravindh S)
    let currentStudent = null;
    if (req.user?.studentId) {
      currentStudent = await db.findById('students', req.user.studentId);
    }
    if (!currentStudent && req.user?.email) {
      currentStudent = students.find(s => s.email.toLowerCase() === req.user.email.toLowerCase());
    }
    if (!currentStudent) {
      currentStudent = students[0]; // fallback to Aravindh S
    }

    const marks = await db.find('marks', m => m.studentId === currentStudent.id);
    const subjects = await db.getCollection('subjects');

    const enrichedMarks = marks.map(m => {
      const sub = subjects.find(s => s.id === m.subjectId);
      return {
        ...m,
        subjectName: sub ? sub.name : 'Computer Science Subject',
        subjectCode: sub ? sub.code : 'CS'
      };
    });

    // Compute CGPA on scale of 10
    const cgpa = (currentStudent.academicScore / 10).toFixed(2);

    // Personal 4 metrics
    const personalMetrics = {
      attendance: currentStudent.attendancePercentage,
      assignments: currentStudent.assignmentCompletion || 91,
      averageMarks: currentStudent.academicScore,
      riskScore: currentStudent.riskScore,
      riskStatus: currentStudent.riskStatus
    };

    // Performance Trajectory across tests for this student
    const performanceTrend = [
      { assessment: 'Unit Test 1', score: Math.max(50, currentStudent.academicScore - 6), classAverage: 76 },
      { assessment: 'Internal 1', score: Math.max(50, currentStudent.academicScore - 2), classAverage: 78 },
      { assessment: 'Unit Test 2', score: Math.max(50, currentStudent.academicScore + 1), classAverage: 79 },
      { assessment: 'Internal 2', score: currentStudent.academicScore, classAverage: 81 },
      { assessment: 'Model Exam', score: Math.min(100, currentStudent.academicScore + 3), classAverage: 82 }
    ];

    // Subject Performance for student
    const subjectPerformance = enrichedMarks.length > 0 ? enrichedMarks.map(m => ({
      subject: m.subjectCode,
      fullName: m.subjectName,
      internal: m.internal1 + m.internal2,
      exam: m.semesterExam,
      total: m.totalScore,
      grade: m.grade
    })) : [
      { subject: 'CS3601', fullName: 'Cyber Security & Forensics', internal: 88, exam: 84, total: 86, grade: 'A+' },
      { subject: 'CS3602', fullName: 'Network Defense & Cryptography', internal: 84, exam: 80, total: 82, grade: 'A' },
      { subject: 'CS3603', fullName: 'Cloud Security Architecture', internal: 88, exam: 85, total: 87, grade: 'A+' },
      { subject: 'CS3604', fullName: 'Ethical Hacking & Pen Testing', internal: 79, exam: 76, total: 78, grade: 'B+' }
    ];

    // Today section
    const todaySchedule = {
      nextClass: {
        subject: 'Network Security & Cryptography',
        code: 'CS3602',
        time: '10:00 AM',
        room: 'CS-204',
        faculty: 'Prof. Rajesh Khanna'
      },
      upcomingAssignments: assignments.slice(0, 3).map(a => ({
        id: a.id,
        title: a.title,
        subject: a.subject,
        deadline: new Date(a.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: a.status
      })),
      upcomingExam: {
        title: 'Continuous Assessment 2 (Cyber Forensics)',
        date: 'Monday • 09:30 AM',
        room: 'Exam Hall 3'
      }
    };

    res.json({
      success: true,
      student: {
        id: currentStudent.id,
        name: currentStudent.name,
        registerNumber: currentStudent.registerNumber,
        department: currentStudent.department,
        year: currentStudent.year,
        semester: currentStudent.semester,
        section: currentStudent.section || 'A',
        cgpa,
        performanceStatus: currentStudent.riskStatus === 'Stable' ? 'STABLE' : currentStudent.riskStatus.toUpperCase(),
        avatar: currentStudent.avatar
      },
      personalMetrics,
      performanceTrend,
      subjectPerformance,
      todaySchedule,
      recentAnnouncements: announcements.slice(0, 3)
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentPerformance(req, res, next) {
  try {
    const studentId = req.query.studentId || req.user?.studentId || 'std_01';
    const marks = await db.find('marks', m => m.studentId === studentId);
    res.json({
      success: true,
      data: marks
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentRiskScore(req, res, next) {
  try {
    const studentId = req.query.studentId || req.user?.studentId || 'std_01';
    const student = await db.findById('students', studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const risk = calculateStudentRisk({
      attendancePercentage: student.attendancePercentage,
      academicScore: student.academicScore,
      pendingAssignmentsCount: student.pendingAssignments || 0,
      totalAssignmentsCount: student.totalAssignments || 8,
      performanceTrend: student.performanceTrend || 0
    });

    res.json({
      success: true,
      risk
    });
  } catch (error) {
    next(error);
  }
}

