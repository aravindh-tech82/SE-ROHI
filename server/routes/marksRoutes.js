import { Router } from 'express';
import { getMarksOverview, recordMarks } from '../controllers/marksController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getMarksOverview);
router.post('/', verifyToken, requireRole('ADMIN', 'FACULTY'), recordMarks);

export default router;

