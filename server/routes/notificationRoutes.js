import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead
} from '../controllers/notificationController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getNotifications);
router.patch('/:id/read', verifyToken, markAsRead);
router.patch('/read-all', verifyToken, markAllAsRead);

export default router;

