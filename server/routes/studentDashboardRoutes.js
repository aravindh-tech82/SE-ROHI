import { Router } from 'express';
import {
  getStudentDashboard,
  getStudentPerformance,
  getStudentRiskScore
} from '../controllers/studentDashboardController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/dashboard', verifyToken, getStudentDashboard);
router.get('/performance', verifyToken, getStudentPerformance);
router.get('/risk-score', verifyToken, getStudentRiskScore);

export default router;

