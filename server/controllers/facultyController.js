import { db } from '../services/dbService.js';

export async function getFacultyDashboard(req, res, next) {
  try {
    const students = await db.find('students');
    const assignments = await db.find('assignments');
    const announcements = await db.find('announcements');

    // Faculty's assigned classes
    const assignedClasses = [
      {
        id: 'cls_01',
        name: 'Cyber Security & Forensics',
        code: 'CS3601',
        department: 'CSE Cyber Security',
        semester: 'Semester 6',
        section: 'A',
        studentCount: 42,
        attendanceRate: 87.4,
        avgScore: 82.1,
        room: 'CS-204',
        schedule: 'Mon, Wed, Fri • 10:00 AM'
      },
      {
        id: 'cls_02',
        name: 'Network Defense & Cryptography',
        code: 'CS3602',
        department: 'CSE Cyber Security',
        semester: 'Semester 6',
        section: 'A & B',
        studentCount: 48,
        attendanceRate: 85.2,
        avgScore: 80.5,
        room: 'CS-302',
        schedule: 'Tue, Thu • 11:15 AM'
      },
      {
        id: 'cls_03',
        name: 'Ethical Hacking Practical Lab',
        code: 'CS3604L',
        department: 'CSE Cyber Security',
        semester: 'Semester 6',
        section: 'A',
        studentCount: 38,
        attendanceRate: 91.0,
        avgScore: 86.8,
        room: 'Cyber Defense Lab 2',
        schedule: 'Wed, Fri • 01:15 PM'
      }
    ];

    // Today's Teaching schedule
    const todayTeaching = {
      currentClass: {
        subject: 'Network Security & Forensics',
        code: 'CS3601',
        department: 'CSE Cyber Security',
        room: 'CS-204',
        time: '10:00 AM – 11:00 AM',
        status: 'LIVE NOW',
        enrolledCount: 42,
        presentCount: 38
      },
      nextClass: {
        subject: 'Ethical Hacking Practical Lab',
        code: 'CS3604L',
        department: 'CSE Cyber Security',
        room: 'Cyber Defense Lab 2',
        time: '01:15 PM – 03:15 PM',
        status: 'UPCOMING'
      }
    };

    // Pending tasks
    const pendingTasks = [
      { id: 'task_1', title: '12 Assignments to Evaluate', subject: 'Cryptographic Hash Attack Sim', deadline: 'Due Today', priority: 'high' },
      { id: 'task_2', title: '3 Students Need Academic Attention', subject: 'Rahul Kumar, Priya S, Arun K', deadline: 'Action Advised', priority: 'urgent' },
      { id: 'task_3', title: '1 Upcoming Assessment Exam', subject: 'Continuous Assessment 2 on Monday', deadline: 'In 3 Days', priority: 'normal' }
    ];

    // Cohort performance metrics
    const performanceOverview = {
      attendance: 87.2,
      averageMarks: 82.4,
      assignmentCompletion: 88.5,
      atRiskStudentsCount: 3
    };

    // Filter relevant students (e.g. Cyber Security cohort)
    const cohortStudents = students.filter(s => s.department === 'CSE Cyber Security');

    res.json({
      success: true,
      facultyName: req.user?.name || 'Prof. Rajesh Khanna',
      designation: req.user?.designation || 'Associate Professor',
      department: req.user?.department || 'CSE Cyber Security',
      todayTeaching,
      assignedClasses,
      performanceOverview,
      pendingTasks,
      cohortStudents: cohortStudents.slice(0, 8),
      totalCohortSize: cohortStudents.length
    });
  } catch (error) {
    next(error);
  }
}

export async function getFacultyClasses(req, res, next) {
  try {
    const classes = [
      { id: 'cls_01', name: 'Cyber Security & Forensics', code: 'CS3601', semester: '6th Semester', students: 42, room: 'CS-204' },
      { id: 'cls_02', name: 'Network Defense & Cryptography', code: 'CS3602', semester: '6th Semester', students: 48, room: 'CS-302' },
      { id: 'cls_03', name: 'Ethical Hacking Practical Lab', code: 'CS3604L', semester: '6th Semester', students: 38, room: 'Cyber Defense Lab 2' }
    ];

    res.json({
      success: true,
      data: classes
    });
  } catch (error) {
    next(error);
  }
}

