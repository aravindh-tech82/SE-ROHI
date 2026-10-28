import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/dbService.js';

export async function getAllAssignments(req, res, next) {
  try {
    const { status = 'All', subject = 'All' } = req.query;

    let assignments = await db.find('assignments');

    if (status !== 'All') {
      assignments = assignments.filter(a => a.status === status);
    }

    if (subject !== 'All') {
      assignments = assignments.filter(a => a.subject === subject);
    }

    // Sort by deadline ascending
    assignments.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    res.json({
      success: true,
      data: assignments
    });
  } catch (error) {
    next(error);
  }
}

export async function createAssignment(req, res, next) {
  try {
    const { title, subject, deadline, maxScore = 20, description, department = 'CSE Cyber Security' } = req.body;

    if (!title || !subject || !deadline) {
      return res.status(400).json({ success: false, message: 'Title, Subject, and Deadline are required.' });
    }

    const newAssignment = {
      id: 'asg_' + uuidv4().slice(0, 8),
      title: title.trim(),
      subject: subject.trim(),
      department,
      faculty: req.user?.name || 'Faculty Mentor',
      deadline,
      maxScore: Number(maxScore),
      description: description || '',
      status: 'Pending',
      submissionsCount: 0,
      totalStudents: 18,
      createdAt: new Date().toISOString()
    };

    await db.insert('assignments', newAssignment);

    // Also dispatch notification
    await db.insert('notifications', {
      id: 'notif_' + uuidv4().slice(0, 8),
      title: 'New Assignment Published',
      message: `${title} (${subject}) has been published. Due: ${new Date(deadline).toLocaleDateString()}.`,
      type: 'info',
      unread: true,
      createdAt: new Date().toISOString(),
      link: '/assignments'
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created and students notified.',
      data: newAssignment
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAssignmentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, studentNotes } = req.body;

    const assignment = await db.findById('assignments', id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found.' });
    }

    const updated = await db.update('assignments', id, {
      status,
      submissionsCount: status === 'Submitted' ? assignment.submissionsCount + 1 : assignment.submissionsCount,
      studentNotes
    });

    res.json({
      success: true,
      message: `Assignment marked as ${status}.`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

