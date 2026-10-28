import { Router } from 'express';
import { getDashboardOverview, getDetailedAnalytics } from '../controllers/analyticsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/dashboard', verifyToken, getDashboardOverview);
router.get('/detailed', verifyToken, getDetailedAnalytics);

export default router;

