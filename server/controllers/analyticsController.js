import { db } from '../services/dbService.js';

export async function getDashboardOverview(req, res, next) {
  try {
    const students = await db.find('students');
    const assignments = await db.find('assignments');
    const announcements = await db.find('announcements');

    const totalStudents = students.length;
    const avgAttendance = totalStudents
      ? Math.round((students.reduce((acc, s) => acc + s.attendancePercentage, 0) / totalStudents) * 10) / 10
      : 87.4;

    const totalAssignments = assignments.length;
    const studentsAtRisk = students.filter(s => s.riskStatus === 'At Risk').length;

    // Attendance weekly trend for chart
    const attendanceChart = [
      { day: 'Mon', percentage: 88, target: 85 },
      { day: 'Tue', percentage: 86, target: 85 },
      { day: 'Wed', percentage: 91, target: 85 },
      { day: 'Thu', percentage: 87, target: 85 },
      { day: 'Fri', percentage: 89, target: 85 }
    ];

    // Early warning preview (Rahul Kumar, Priya S, Arun K)
    const earlyWarningPreview = [
      {
        id: 'ew_1',
        studentId: 'std_02',
        name: 'Rahul Kumar',
        reason: 'Attendance dropped below 75%',
        metric: '68%',
        severity: 'high'
      },
      {
        id: 'ew_2',
        studentId: 'std_03',
        name: 'Priya S',
        reason: 'Internal marks declining',
        metric: '-9.5% Trend',
        severity: 'high'
      },
      {
        id: 'ew_3',
        studentId: 'std_04',
        name: 'Arun K',
        reason: 'Multiple assignments pending',
        metric: '4 Pending',
        severity: 'medium'
      }
    ];

    // Recent activity stream
    const recentActivity = [
      { id: 'act_1', time: '10 mins ago', text: 'Attendance logged for CSE Cyber Security (Section A)', type: 'attendance' },
      { id: 'act_2', time: '45 mins ago', text: 'Early warning triggered: Rahul Kumar attendance fell to 68%', type: 'warning' },
      { id: 'act_3', time: '2 hours ago', text: 'New assignment posted: Cryptographic Hash Function Attack Simulation', type: 'assignment' },
      { id: 'act_4', time: '4 hours ago', text: 'Semester End Examination Schedule published by Admin', type: 'announcement' }
    ];

    res.json({
      success: true,
      kpis: {
        totalStudents: { value: '1,248', raw: totalStudents, trend: '+4.2% this month' },
        attendance: { value: `${avgAttendance}%`, raw: avgAttendance, trend: '+1.8% vs last week' },
        assignments: { value: '42', raw: totalAssignments, trend: '8 due this week' },
        studentsAtRisk: { value: `${studentsAtRisk}`, raw: studentsAtRisk, trend: '-2 since last cycle' }
      },
      attendanceChart,
      earlyWarningPreview,
      recentActivity
    });
  } catch (error) {
    next(error);
  }
}

export async function getDetailedAnalytics(req, res, next) {
  try {
    const students = await db.find('students');
    const assignments = await db.find('assignments');

    // Department Performance
    const deptStats = [
      { department: 'CSE Cyber Sec', avgScore: 81, avgAttendance: 86, total: 420 },
      { department: 'CSE AI & ML', avgScore: 84, avgAttendance: 89, total: 380 },
      { department: 'Information Tech', avgScore: 79, avgAttendance: 84, total: 290 },
      { department: 'ECE', avgScore: 77, avgAttendance: 82, total: 260 }
    ];

    // Grade Distribution
    const gradeDistribution = [
      { grade: 'O (90-100)', count: 28, percentage: 22 },
      { grade: 'A+ (80-89)', count: 45, percentage: 35 },
      { grade: 'A (70-79)', count: 32, percentage: 25 },
      { grade: 'B+ (60-69)', count: 14, percentage: 11 },
      { grade: 'B & Below', count: 9, percentage: 7 }
    ];

    // Risk Score Breakdown
    const riskBreakdown = [
      { name: 'Stable (0-30)', value: students.filter(s => s.riskStatus === 'Stable').length || 11, color: '#10B981' },
      { name: 'Needs Attention (31-60)', value: students.filter(s => s.riskStatus === 'Needs Attention').length || 4, color: '#F59E0B' },
      { name: 'At Risk (61-100)', value: students.filter(s => s.riskStatus === 'At Risk').length || 3, color: '#EF4444' }
    ];

    // Assignment Completion
    const assignmentStats = [
      { title: 'Hash Attack Sim', submitted: 14, pending: 4, rate: 77 },
      { title: 'Memory Dump Analysis', submitted: 16, pending: 2, rate: 88 },
      { title: 'Zero Trust Blueprint', submitted: 11, pending: 7, rate: 61 },
      { title: 'Web App Pen Test', submitted: 18, pending: 0, rate: 100 },
      { title: 'Autoencoders Anomaly', submitted: 12, pending: 6, rate: 66 }
    ];

    res.json({
      success: true,
      deptStats,
      gradeDistribution,
      riskBreakdown,
      assignmentStats
    });
  } catch (error) {
    next(error);
  }
}

