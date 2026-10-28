import { Router } from 'express';
import { getFacultyDashboard, getFacultyClasses } from '../controllers/facultyController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/dashboard', verifyToken, requireRole('ADMIN', 'FACULTY'), getFacultyDashboard);
router.get('/classes', verifyToken, requireRole('ADMIN', 'FACULTY'), getFacultyClasses);

export default router;

