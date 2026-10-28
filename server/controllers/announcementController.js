import { v4 as uuidv4 } from 'uuid';
import { db } from '../services/dbService.js';

export async function getAllAnnouncements(req, res, next) {
  try {
    const { priority = 'All' } = req.query;

    let announcements = await db.find('announcements');

    if (priority !== 'All') {
      announcements = announcements.filter(a => a.priority === priority);
    }

    // Sort latest first
    announcements.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: announcements
    });
  } catch (error) {
    next(error);
  }
}

export async function createAnnouncement(req, res, next) {
  try {
    const { title, description, priority = 'Normal', tag = 'Notice' } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const newAnnouncement = {
      id: 'anc_' + uuidv4().slice(0, 8),
      title: title.trim(),
      date: new Date().toISOString().slice(0, 10),
      publisher: req.user?.name || 'Academic Administrator',
      role: req.user?.role || 'ADMIN',
      priority,
      tag,
      description: description.trim(),
      createdAt: new Date().toISOString()
    };

    await db.insert('announcements', newAnnouncement);

    // Also trigger notification
    await db.insert('notifications', {
      id: 'notif_' + uuidv4().slice(0, 8),
      title: `Notice: ${title}`,
      message: description.slice(0, 100) + '...',
      type: priority === 'Urgent' ? 'warning' : 'announcement',
      unread: true,
      createdAt: new Date().toISOString(),
      link: '/announcements'
    });

    res.status(201).json({
      success: true,
      message: 'Announcement published successfully.',
      data: newAnnouncement
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAnnouncement(req, res, next) {
  try {
    const { id } = req.params;
    const removed = await db.remove('announcements', id);

    if (!removed) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    res.json({
      success: true,
      message: 'Announcement deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

