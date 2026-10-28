import { Router } from 'express';
import {
  getAttendanceByDateAndClass,
  submitAttendance,
  getAttendanceAnalytics
} from '../controllers/attendanceController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getAttendanceByDateAndClass);
router.get('/analytics', verifyToken, getAttendanceAnalytics);
router.post('/', verifyToken, requireRole('ADMIN', 'FACULTY'), submitAttendance);

export default router;

