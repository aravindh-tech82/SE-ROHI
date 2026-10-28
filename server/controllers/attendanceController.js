import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/dbService.js';
import { calculateStudentRisk } from '../utils/riskCalculator.js';

export async function getAttendanceByDateAndClass(req, res, next) {
  try {
    const { date = new Date().toISOString().slice(0, 10), department = 'CSE Cyber Security', semester = '6th Semester' } = req.query;

    const students = await db.find('students', s => s.department === department);
    const existingSheet = await db.findOne('attendance', a => a.date === date && a.department === department);

    // Map each student with their present/absent status
    const list = students.map(s => {
      let status = 'Present';
      if (existingSheet && existingSheet.records) {
        const found = existingSheet.records.find(r => r.studentId === s.id);
        if (found) status = found.status;
      } else {
        // Default to student's baseline behavior
        status = s.attendancePercentage < 75 && Math.random() > 0.4 ? 'Absent' : 'Present';
      }

      return {
        studentId: s.id,
        registerNumber: s.registerNumber,
        name: s.name,
        department: s.department,
        overallAttendance: s.attendancePercentage,
        status,
        avatar: s.avatar
      };
    });

    const presentCount = list.filter(item => item.status === 'Present').length;
    const absentCount = list.length - presentCount;
    const dayPercentage = list.length ? Math.round((presentCount / list.length) * 100) : 100;

    res.json({
      success: true,
      date,
      department,
      semester,
      summary: {
        total: list.length,
        present: presentCount,
        absent: absentCount,
        percentage: dayPercentage
      },
      records: list
    });
  } catch (error) {
    next(error);
  }
}

export async function submitAttendance(req, res, next) {
  try {
    const { date, department, semester, records } = req.body;

    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'Invalid attendance payload.' });
    }

    const existingIndex = await db.find('attendance', a => a.date === date && a.department === department);
    
    if (existingIndex.length > 0) {
      await db.update('attendance', existingIndex[0].id, {
        records,
        semester,
        updatedBy: req.user?.name || 'Faculty'
      });
    } else {
      const newSheet = {
        id: 'att_' + uuidv4().slice(0, 8),
        date,
        department,
        semester,
        records,
        submittedBy: req.user?.name || 'Faculty',
        createdAt: new Date().toISOString()
      };
      await db.insert('attendance', newSheet);
    }

    // Optionally update student attendance percentages slightly based on new record
    for (const rec of records) {
      const student = await db.findById('students', rec.studentId);
      if (student) {
        const delta = rec.status === 'Present' ? 0.2 : -0.8;
        const newAtt = Math.max(40, Math.min(100, Math.round((student.attendancePercentage + delta) * 10) / 10));
        
        const risk = calculateStudentRisk({
          attendancePercentage: newAtt,
          academicScore: student.academicScore,
          pendingAssignmentsCount: student.pendingAssignments || 0,
          totalAssignmentsCount: student.totalAssignments || 8,
          performanceTrend: student.performanceTrend || 0
        });

        await db.update('students', student.id, {
          attendancePercentage: newAtt,
          riskScore: risk.score,
          riskStatus: risk.status
        });
      }
    }

    res.json({
      success: true,
      message: 'Attendance submitted and student analytics synchronized successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export async function getAttendanceAnalytics(req, res, next) {
  try {
    const students = await db.find('students');
    const totalStudents = students.length || 1;
    const avgAttendance = Math.round(students.reduce((sum, s) => sum + s.attendancePercentage, 0) / totalStudents);

    // Weekly trend
    const weeklyTrend = [
      { day: 'Mon', attendance: 88, target: 85 },
      { day: 'Tue', attendance: 86, target: 85 },
      { day: 'Wed', attendance: 91, target: 85 },
      { day: 'Thu', attendance: 87, target: 85 },
      { day: 'Fri', attendance: 89, target: 85 }
    ];

    // Department breakdown
    const deptMap = {};
    students.forEach(s => {
      if (!deptMap[s.department]) {
        deptMap[s.department] = { total: 0, sum: 0 };
      }
      deptMap[s.department].total += 1;
      deptMap[s.department].sum += s.attendancePercentage;
    });

    const departmentStats = Object.keys(deptMap).map(dept => ({
      department: dept,
      avgAttendance: Math.round(deptMap[dept].sum / deptMap[dept].total),
      studentCount: deptMap[dept].total
    }));

    const lowAttendanceList = students
      .filter(s => s.attendancePercentage < 75)
      .map(s => ({
        id: s.id,
        name: s.name,
        registerNumber: s.registerNumber,
        department: s.department,
        attendancePercentage: s.attendancePercentage,
        deficit: 75 - s.attendancePercentage
      }));

    res.json({
      success: true,
      avgAttendance,
      weeklyTrend,
      departmentStats,
      lowAttendanceCount: lowAttendanceList.length,
      lowAttendanceList
    });
  } catch (error) {
    next(error);
  }
}

