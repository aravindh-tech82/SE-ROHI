import { Router } from 'express';
import {
  getAdminOverview,
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  getFacultyList,
  createFaculty,
  getAuditLogs
} from '../controllers/adminController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Admin protected endpoints
router.get('/overview', verifyToken, requireRole('ADMIN'), getAdminOverview);
router.get('/departments', verifyToken, getDepartments);
router.get('/departments/:id', verifyToken, getDepartmentById);
router.post('/departments', verifyToken, requireRole('ADMIN'), createDepartment);
router.put('/departments/:id', verifyToken, requireRole('ADMIN'), updateDepartment);
router.get('/faculty', verifyToken, getFacultyList);
router.post('/faculty', verifyToken, requireRole('ADMIN'), createFaculty);
router.get('/audit-logs', verifyToken, requireRole('ADMIN'), getAuditLogs);

export default router;

