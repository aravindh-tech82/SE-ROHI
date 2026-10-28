import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getEarlyWarningAlerts
} from '../controllers/studentController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Early warning alerts (placed before :id to prevent collision)
router.get('/alerts/early-warning', verifyToken, getEarlyWarningAlerts);

router.get('/', verifyToken, getAllStudents);
router.get('/:id', verifyToken, getStudentById);

// Admin & Faculty privileges
router.post('/', verifyToken, requireRole('ADMIN'), createStudent);
router.put('/:id', verifyToken, requireRole('ADMIN', 'FACULTY'), updateStudent);
router.delete('/:id', verifyToken, requireRole('ADMIN'), deleteStudent);

export default router;

