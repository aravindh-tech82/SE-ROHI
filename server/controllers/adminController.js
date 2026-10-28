import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/dbService.js';

export async function getAdminOverview(req, res, next) {
  try {
    const departments = await db.getCollection('departments');
    const students = await db.find('students');
    const faculty = await db.getCollection('faculty');
    const auditLogs = await db.getCollection('auditLogs');

    const totalStudents = departments.reduce((acc, d) => acc + (d.studentCount || 0), 0) || students.length;
    const totalFaculty = departments.reduce((acc, d) => acc + (d.facultyCount || 0), 0) || faculty.length;
    const activeDepartments = departments.length;

    const avgAttendance = Math.round(
      (departments.reduce((acc, d) => acc + (d.avgAttendance || 0), 0) / (departments.length || 1)) * 10
    ) / 10;

    const avgPerformance = Math.round(
      (departments.reduce((acc, d) => acc + (d.avgPerformance || 0), 0) / (departments.length || 1)) * 10
    ) / 10;

    const totalAtRisk = departments.reduce((acc, d) => acc + (d.atRiskCount || 0), 0);

    // Performance comparison for charts
    const departmentComparison = departments.map(d => ({
      name: d.code,
      fullName: d.name,
      avgScore: d.avgPerformance,
      avgAttendance: d.avgAttendance,
      students: d.studentCount,
      atRisk: d.atRiskCount
    }));

    // Institutional Academic Trajectory
    const performanceTrend = [
      { cycle: 'Unit Test 1', average: 78.4, benchmark: 80 },
      { cycle: 'Continuous Assessment 1', average: 80.2, benchmark: 80 },
      { cycle: 'Unit Test 2', average: 81.1, benchmark: 80 },
      { cycle: 'Continuous Assessment 2', average: 83.5, benchmark: 80 },
      { cycle: 'Model Exam', average: 82.6, benchmark: 80 }
    ];

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalFaculty,
        activeDepartments,
        avgAttendance: `${avgAttendance}%`,
        avgPerformance: `${avgPerformance}%`,
        totalAtRisk
      },
      departments,
      departmentComparison,
      performanceTrend,
      recentAuditLogs: auditLogs.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
}

export async function getDepartments(req, res, next) {
  try {
    const departments = await db.getCollection('departments');
    res.json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    next(error);
  }
}

export async function getDepartmentById(req, res, next) {
  try {
    const { id } = req.params;
    const departments = await db.getCollection('departments');
    const dept = departments.find(d => d.id === id || d.code.toLowerCase() === id.toLowerCase());

    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    const students = await db.find('students', s => s.department.toLowerCase().includes(dept.code.toLowerCase()) || dept.name.toLowerCase().includes(s.department.toLowerCase()));
    const faculty = await db.find('faculty', f => f.department.toLowerCase().includes(dept.code.toLowerCase()) || dept.name.toLowerCase().includes(f.department.toLowerCase()));

    res.json({
      success: true,
      department: dept,
      studentCount: students.length,
      students: students.slice(0, 10),
      faculty
    });
  } catch (error) {
    next(error);
  }
}

export async function createDepartment(req, res, next) {
  try {
    const { name, code, headOfDept, buildingZone, color, studentCount = 150, facultyCount = 10 } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Department name and code are required.' });
    }

    const newDept = {
      id: 'dept_' + code.toLowerCase().replace(/[^a-z0-9]/g, ''),
      code: code.toUpperCase(),
      name,
      headOfDept: headOfDept || 'Appointed HOD',
      buildingZone: buildingZone || 'Academic Block',
      color: color || '#9303C5',
      studentCount: Number(studentCount),
      facultyCount: Number(facultyCount),
      avgAttendance: 85,
      avgPerformance: 80,
      atRiskCount: 2,
      assignmentRate: 90,
      performanceTrend: 2.0,
      labCount: 4,
      establishedYear: new Date().getFullYear(),
      position: [((Math.random() - 0.5) * 5), ((Math.random() - 0.5) * 3), ((Math.random() - 0.5) * 2)]
    };

    await db.insert('departments', newDept);

    // Record audit log
    await db.insert('auditLogs', {
      id: 'log_' + uuidv4().slice(0, 8),
      timestamp: new Date().toISOString(),
      action: 'Department Created',
      details: `${name} (${code}) added to institutional charter`,
      category: 'System',
      user: req.user?.name || 'Administrator',
      severity: 'important'
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully.',
      department: newDept
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDepartment(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await db.update('departments', id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    res.json({
      success: true,
      message: 'Department updated successfully.',
      department: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function getFacultyList(req, res, next) {
  try {
    const faculty = await db.getCollection('faculty');
    res.json({
      success: true,
      data: faculty
    });
  } catch (error) {
    next(error);
  }
}

export async function createFaculty(req, res, next) {
  try {
    const { name, email, department, designation, cabin, phone, specialization } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({ success: false, message: 'Name, email, and department are required.' });
    }

    const newFaculty = {
      id: 'fac_' + uuidv4().slice(0, 8),
      name,
      email,
      department,
      designation: designation || 'Assistant Professor',
      cabin: cabin || 'Academic Block',
      phone: phone || '+91 98000 00000',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=9303c5`,
      activeClasses: 2,
      totalStudentsMentored: 30,
      specialization: specialization || 'Computer Science'
    };

    await db.insert('faculty', newFaculty);

    res.status(201).json({
      success: true,
      message: 'Faculty member added successfully.',
      data: newFaculty
    });
  } catch (error) {
    next(error);
  }
}

export async function getAuditLogs(req, res, next) {
  try {
    const logs = await db.getCollection('auditLogs');
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
}

