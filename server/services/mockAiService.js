import { db } from './dbService.js';
import { config } from '../config/config.js';

export async function processAiQuery(queryText, userContext = {}) {
  const query = (queryText || '').toLowerCase().trim();
  const students = await db.find('students');
  const assignments = await db.find('assignments');
  const marks = await db.find('marks');
  const timetable = await db.find('timetable');
  const announcements = await db.find('announcements');

  // Check if query is about low attendance
  if (query.includes('attendance') && (query.includes('below') || query.includes('75') || query.includes('low') || query.includes('poor') || query.includes('shortage'))) {
    const lowAttStudents = students.filter(s => s.attendancePercentage < 75);
    return {
      source: 'Structured Analytical Engine',
      type: 'attendance_alert',
      title: 'Students with Attendance Below 75%',
      summary: `Identified ${lowAttStudents.length} student(s) currently falling short of the statutory 75% university attendance threshold.`,
      data: lowAttStudents.map(s => ({
        id: s.id,
        name: s.name,
        registerNumber: s.registerNumber,
        department: s.department,
        attendance: `${s.attendancePercentage}%`,
        shortage: `${75 - s.attendancePercentage}% below threshold`,
        riskStatus: s.riskStatus
      })),
      recommendation: 'Recommend issuing institutional warnings and triggering parent notification SMS via the Early Warning System.',
      suggestedQueries: [
        'Which students are at risk?',
        'Show students whose marks declined.',
        'Which assignments are due this week?'
      ]
    };
  }

  // Check if query is about at-risk students
  if (query.includes('risk') || query.includes('critical') || query.includes('warning') || query.includes('attention')) {
    const atRiskStudents = students.filter(s => s.riskStatus === 'At Risk' || s.riskScore >= 60);
    const attentionStudents = students.filter(s => s.riskStatus === 'Needs Attention');

    return {
      source: 'Structured Analytical Engine',
      type: 'risk_analysis',
      title: 'Early Warning Risk Assessment',
      summary: `Detected ${atRiskStudents.length} high-risk student(s) and ${attentionStudents.length} student(s) requiring academic attention based on our multi-factor scoring model.`,
      data: atRiskStudents.map(s => ({
        id: s.id,
        name: s.name,
        registerNumber: s.registerNumber,
        department: s.department,
        riskScore: `${s.riskScore}/100`,
        status: s.riskStatus,
        attendance: `${s.attendancePercentage}%`,
        academicScore: `${s.academicScore}%`,
        pendingAssignments: s.pendingAssignments
      })),
      recommendation: 'Priority academic mentoring and counselor intervention advised for Rahul Kumar, Arun K, and Priya Sundaram.',
      suggestedQueries: [
        'Which students have attendance below 75%?',
        'Show students whose marks declined.',
        'Summarize department academic performance.'
      ]
    };
  }

  // Check if query is about declining marks or academic performance
  if (query.includes('declined') || query.includes('marks') || query.includes('grades') || query.includes('score') || query.includes('academic') || query.includes('fail')) {
    const decliningStudents = students.filter(s => s.performanceTrend < 0);
    const topStudents = [...students].sort((a, b) => b.academicScore - a.academicScore).slice(0, 3);

    return {
      source: 'Structured Analytical Engine',
      type: 'academic_trend',
      title: 'Academic Performance & Trend Analysis',
      summary: `${decliningStudents.length} student(s) exhibit a downward performance trend compared to their previous assessment cycles.`,
      data: decliningStudents.map(s => ({
        id: s.id,
        name: s.name,
        department: s.department,
        currentScore: `${s.academicScore}%`,
        trend: `${s.performanceTrend}%`,
        pendingWork: `${s.pendingAssignments} assignments`
      })),
      topPerformers: topStudents.map(s => `${s.name} (${s.academicScore}%)`),
      recommendation: 'Arrange remedial coursework for Priya Sundaram (-9.5% trend) and Naveen Balaji (-7.0% trend).',
      suggestedQueries: [
        'Which students are at risk?',
        'Which assignments are due this week?',
        'Show timetable for today'
      ]
    };
  }

  // Check if query is about assignments
  if (query.includes('assignment') || query.includes('homework') || query.includes('submission') || query.includes('due') || query.includes('deadline')) {
    const pendingAssignments = assignments.filter(a => a.status === 'Pending' || a.status === 'Late');
    return {
      source: 'Structured Analytical Engine',
      type: 'assignments_status',
      title: 'Upcoming & Pending Assignments',
      summary: `There are currently ${assignments.length} tracked assignments across disciplines, with ${pendingAssignments.length} requiring immediate student submission.`,
      data: assignments.map(a => ({
        id: a.id,
        title: a.title,
        subject: a.subject,
        deadline: new Date(a.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: a.status,
        submissions: `${a.submissionsCount}/${a.totalStudents}`
      })),
      recommendation: 'Highlight "Cryptographic Hash Function Attack Simulation" due Nov 02 on student dashboards.',
      suggestedQueries: [
        'Which students have attendance below 75%?',
        'Show timetable for today',
        'Which students are at risk?'
      ]
    };
  }

  // Check if query is about timetable / schedule
  if (query.includes('timetable') || query.includes('schedule') || query.includes('class') || query.includes('today')) {
    return {
      source: 'Structured Analytical Engine',
      type: 'timetable_overview',
      title: 'Weekly Academic Schedule (CSE Cyber Security)',
      summary: 'Timetable configured across 5 instructional days with integrated laboratory and research blocks.',
      data: timetable.map(t => ({
        day: t.day,
        totalClasses: t.slots.length,
        subjects: t.slots.map(s => s.subject).join(', ')
      })),
      recommendation: 'Laboratory slots scheduled on Monday, Wednesday, and Friday afternoons at Cyber Security Lab.',
      suggestedQueries: [
        'Which assignments are due this week?',
        'Which students are at risk?',
        'Show department analytics'
      ]
    };
  }

  // Default intelligent overview
  const totalStudents = students.length;
  const avgAttendance = Math.round(students.reduce((acc, s) => acc + s.attendancePercentage, 0) / (totalStudents || 1));
  const atRiskCount = students.filter(s => s.riskStatus === 'At Risk').length;

  return {
    source: 'Structured Analytical Engine',
    type: 'general_assistant',
    title: `STUDENTX Intelligence Overview`,
    summary: `Currently monitoring ${totalStudents} enrolled students. Institutional attendance is averaging ${avgAttendance}%, with ${atRiskCount} student(s) currently flagged for academic risk.`,
    metrics: {
      totalStudents,
      avgAttendance: `${avgAttendance}%`,
      atRiskCount,
      activeAssignments: assignments.length,
      publishedAnnouncements: announcements.length
    },
    recommendation: 'Feel free to inquire about low attendance, at-risk individuals, assignment submission statistics, or subject performances.',
    suggestedQueries: [
      'Which students have attendance below 75%?',
      'Which students are at risk?',
      'Show students whose marks declined.',
      'Which assignments are due this week?'
    ]
  };
}

