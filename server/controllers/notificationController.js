import { db } from '../services/dbService.js';

export async function getNotifications(req, res, next) {
  try {
    const notifications = await db.getCollection('notifications');
    // Sort latest first
    const sorted = [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const unreadCount = sorted.filter(n => n.unread).length;

    res.json({
      success: true,
      unreadCount,
      notifications: sorted
    });
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await db.update('notifications', id, { unread: false });

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const notifications = await db.getCollection('notifications');
    const updated = notifications.map(n => ({ ...n, unread: false }));
    await db.replaceCollection('notifications', updated);

    res.json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    next(error);
  }
}

