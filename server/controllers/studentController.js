import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/dbService.js';
import { calculateStudentRisk } from '../utils/riskCalculator.js';

export async function getAllStudents(req, res, next) {
  try {
    const {
      search = '',
      department = 'All',
      year = 'All',
      riskStatus = 'All',
      sortBy = 'name',
      order = 'asc',
      page = 1,
      limit = 100
    } = req.query;

    let students = await db.find('students');

    // 1. Search Filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      students = students.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.registerNumber.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    }

    // 2. Department Filter
    if (department !== 'All') {
      students = students.filter(s => s.department === department);
    }

    // 3. Year Filter
    if (year !== 'All') {
      students = students.filter(s => s.year === year);
    }

    // 4. Risk Status Filter
    if (riskStatus !== 'All') {
      students = students.filter(s => s.riskStatus === riskStatus);
    }

    // 5. Sorting
    students.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    // 6. Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const total = students.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = students.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      data: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentById(req, res, next) {
  try {
    const { id } = req.params;
    const student = await db.findById('students', id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    // Fetch related marks, assignments, and subjects
    const marks = await db.find('marks', m => m.studentId === id);
    const subjects = await db.getCollection('subjects');
    const enrichedMarks = marks.map(m => {
      const subject = subjects.find(s => s.id === m.subjectId);
      return {
        ...m,
        subjectName: subject ? subject.name : 'Unknown Subject',
        subjectCode: subject ? subject.code : 'N/A',
        credits: subject ? subject.credits : 3
      };
    });

    const assignments = await db.find('assignments');
    const attendanceHistory = await db.find('attendance');

    // Calculate dynamic risk factors
    const riskDetails = calculateStudentRisk({
      attendancePercentage: student.attendancePercentage,
      academicScore: student.academicScore,
      pendingAssignmentsCount: student.pendingAssignments || 0,
      totalAssignmentsCount: student.totalAssignments || 8,
      performanceTrend: student.performanceTrend || 0
    });

    res.json({
      success: true,
      student: {
        ...student,
        riskDetails,
        marks: enrichedMarks,
        recentAssignments: assignments.slice(0, 4),
        attendanceTrend: [
          { day: 'Mon', attendance: student.attendancePercentage > 85 ? 95 : 70 },
          { day: 'Tue', attendance: student.attendancePercentage > 80 ? 90 : 65 },
          { day: 'Wed', attendance: student.attendancePercentage > 85 ? 100 : 72 },
          { day: 'Thu', attendance: student.attendancePercentage > 80 ? 88 : 68 },
          { day: 'Fri', attendance: student.attendancePercentage }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createStudent(req, res, next) {
  try {
    const {
      name,
      registerNumber,
      email,
      phone,
      department,
      year = '1st Year',
      semester = '1st Semester',
      section = 'A',
      attendancePercentage = 100,
      academicScore = 75,
      dob,
      bloodGroup = 'B+'
    } = req.body;

    if (!name || !registerNumber || !department) {
      return res.status(400).json({ success: false, message: 'Name, Register Number, and Department are required.' });
    }

    const existingReg = await db.findOne('students', s => s.registerNumber === registerNumber);
    if (existingReg) {
      return res.status(400).json({ success: false, message: 'A student with this Register Number already exists.' });
    }

    const risk = calculateStudentRisk({
      attendancePercentage: Number(attendancePercentage),
      academicScore: Number(academicScore),
      pendingAssignmentsCount: 0,
      totalAssignmentsCount: 5,
      performanceTrend: 0
    });

    const newStudent = {
      id: 'std_' + uuidv4().slice(0, 8),
      name: name.trim(),
      registerNumber: registerNumber.trim().toUpperCase(),
      email: email || `${registerNumber.toLowerCase()}@studentx.edu`,
      phone: phone || '+91 98000 00000',
      department,
      year,
      semester,
      section,
      dob: dob || '2005-01-01',
      bloodGroup,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      attendancePercentage: Number(attendancePercentage),
      academicScore: Number(academicScore),
      assignmentCompletion: 100,
      performanceTrend: 0,
      pendingAssignments: 0,
      totalAssignments: 5,
      riskScore: risk.score,
      riskStatus: risk.status,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    await db.insert('students', newStudent);

    res.status(201).json({
      success: true,
      message: 'Student added successfully.',
      student: newStudent
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStudent(req, res, next) {
  try {
    const { id } = req.params;
    const student = await db.findById('students', id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    const updates = { ...req.body };
    delete updates.id; // immutable

    // Recalculate risk if metrics changed
    const att = updates.attendancePercentage !== undefined ? Number(updates.attendancePercentage) : student.attendancePercentage;
    const acad = updates.academicScore !== undefined ? Number(updates.academicScore) : student.academicScore;
    const pending = updates.pendingAssignments !== undefined ? Number(updates.pendingAssignments) : student.pendingAssignments;
    const trend = updates.performanceTrend !== undefined ? Number(updates.performanceTrend) : student.performanceTrend;

    const risk = calculateStudentRisk({
      attendancePercentage: att,
      academicScore: acad,
      pendingAssignmentsCount: pending,
      totalAssignmentsCount: student.totalAssignments || 8,
      performanceTrend: trend
    });

    updates.riskScore = risk.score;
    updates.riskStatus = risk.status;

    const updated = await db.update('students', id, updates);

    res.json({
      success: true,
      message: 'Student record updated successfully.',
      student: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteStudent(req, res, next) {
  try {
    const { id } = req.params;
    const removed = await db.remove('students', id);

    if (!removed) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    res.json({
      success: true,
      message: 'Student record removed successfully.'
    });
  } catch (error) {
    next(error);
  }
}

export async function getEarlyWarningAlerts(req, res, next) {
  try {
    const students = await db.find('students');

    const alerts = [];

    // 1. Rahul Kumar / Low Attendance alerts
    const lowAtt = students.filter(s => s.attendancePercentage < 75);
    lowAtt.forEach(s => {
      alerts.push({
        id: `att_${s.id}`,
        studentId: s.id,
        studentName: s.name,
        department: s.department,
        avatar: s.avatar,
        title: 'Attendance dropped below 75%',
        metric: `${s.attendancePercentage}% Attendance`,
        severity: 'high',
        category: 'Attendance Deficit',
        actionLabel: 'Send Attendance Warning'
      });
    });

    // 2. Priya Sundaram / Declining marks alerts
    const declining = students.filter(s => s.performanceTrend <= -5);
    declining.forEach(s => {
      alerts.push({
        id: `trend_${s.id}`,
        studentId: s.id,
        studentName: s.name,
        department: s.department,
        avatar: s.avatar,
        title: 'Internal marks declining',
        metric: `${s.performanceTrend}% Trajectory`,
        severity: 'high',
        category: 'Academic Regression',
        actionLabel: 'Schedule Remedial Mentoring'
      });
    });

    // 3. Arun K / Pending assignments alerts
    const pendingAsg = students.filter(s => s.pendingAssignments >= 3);
    pendingAsg.forEach(s => {
      alerts.push({
        id: `asg_${s.id}`,
        studentId: s.id,
        studentName: s.name,
        department: s.department,
        avatar: s.avatar,
        title: 'Multiple assignments pending',
        metric: `${s.pendingAssignments} Overdue Items`,
        severity: 'medium',
        category: 'Assignment Delinquency',
        actionLabel: 'Notify Faculty Mentor'
      });
    });

    res.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    next(error);
  }
}

