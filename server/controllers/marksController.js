import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/dbService.js';
import { calculateStudentRisk } from '../utils/riskCalculator.js';

export async function getMarksOverview(req, res, next) {
  try {
    const { studentId, department = 'CSE Cyber Security' } = req.query;

    const subjects = await db.find('subjects', s => department === 'All' ? true : s.department === department);
    let marks = await db.find('marks');
    const students = await db.find('students');

    if (studentId) {
      marks = marks.filter(m => m.studentId === studentId);
    }

    const enriched = marks.map(m => {
      const sub = subjects.find(s => s.id === m.subjectId);
      const stu = students.find(s => s.id === m.studentId);
      return {
        ...m,
        subjectName: sub ? sub.name : 'Unknown Subject',
        subjectCode: sub ? sub.code : 'N/A',
        studentName: stu ? stu.name : 'Unknown Student',
        registerNumber: stu ? stu.registerNumber : 'N/A'
      };
    });

    // Subject averages for chart
    const subjectAverages = subjects.map(sub => {
      const subMarks = marks.filter(m => m.subjectId === sub.id);
      const avg = subMarks.length
        ? Math.round(subMarks.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) / subMarks.length)
        : 78;
      return {
        subject: sub.name.length > 20 ? sub.code : sub.name,
        code: sub.code,
        average: avg,
        passRate: 92
      };
    });

    res.json({
      success: true,
      marks: enriched,
      subjects,
      subjectAverages,
      performanceTrend: [
        { assessment: 'Unit Test 1', average: 74, classTop: 96 },
        { assessment: 'Internal 1', average: 78, classTop: 98 },
        { assessment: 'Unit Test 2', average: 76, classTop: 94 },
        { assessment: 'Internal 2', average: 82, classTop: 99 },
        { assessment: 'Model Exam', average: 80, classTop: 97 }
      ]
    });
  } catch (error) {
    next(error);
  }
}

export async function recordMarks(req, res, next) {
  try {
    const { studentId, subjectId, internal1, internal2, assignmentMarks, semesterExam } = req.body;

    if (!studentId || !subjectId) {
      return res.status(400).json({ success: false, message: 'Student and Subject are required.' });
    }

    const int1 = Number(internal1) || 0;
    const int2 = Number(internal2) || 0;
    const asg = Number(assignmentMarks) || 0;
    const sem = Number(semesterExam) || 0;

    // Total out of 100
    // formula: 20% internal1 + 20% internal2 + 20% assignment + 40% semester exam
    const totalScore = Math.round((int1 * 0.2) + (int2 * 0.2) + (asg * 1.0) + (sem * 0.4));

    let grade = 'F';
    if (totalScore >= 90) grade = 'O';
    else if (totalScore >= 80) grade = 'A+';
    else if (totalScore >= 70) grade = 'A';
    else if (totalScore >= 60) grade = 'B+';
    else if (totalScore >= 50) grade = 'B';
    else if (totalScore >= 45) grade = 'C';

    const existing = await db.findOne('marks', m => m.studentId === studentId && m.subjectId === subjectId);

    if (existing) {
      const updated = await db.update('marks', existing.id, {
        internal1: int1,
        internal2: int2,
        assignmentMarks: asg,
        semesterExam: sem,
        totalScore,
        grade
      });

      // Update student overall academic score
      await updateStudentOverallScore(studentId);

      return res.json({
        success: true,
        message: 'Marks updated successfully.',
        data: updated
      });
    }

    const newMark = {
      id: 'mrk_' + uuidv4().slice(0, 8),
      studentId,
      subjectId,
      internal1: int1,
      internal2: int2,
      assignmentMarks: asg,
      semesterExam: sem,
      totalScore,
      grade,
      maxTotal: 100,
      recordedBy: req.user?.name || 'Faculty',
      createdAt: new Date().toISOString()
    };

    await db.insert('marks', newMark);
    await updateStudentOverallScore(studentId);

    res.status(201).json({
      success: true,
      message: 'Marks recorded successfully.',
      data: newMark
    });
  } catch (error) {
    next(error);
  }
}

async function updateStudentOverallScore(studentId) {
  const student = await db.findById('students', studentId);
  if (!student) return;

  const marks = await db.find('marks', m => m.studentId === studentId);
  if (marks.length === 0) return;

  const avg = Math.round(marks.reduce((acc, m) => acc + m.totalScore, 0) / marks.length);
  const trend = avg - student.academicScore;

  const risk = calculateStudentRisk({
    attendancePercentage: student.attendancePercentage,
    academicScore: avg,
    pendingAssignmentsCount: student.pendingAssignments || 0,
    totalAssignmentsCount: student.totalAssignments || 8,
    performanceTrend: trend
  });

  await db.update('students', studentId, {
    academicScore: avg,
    performanceTrend: trend,
    riskScore: risk.score,
    riskStatus: risk.status
  });
}

