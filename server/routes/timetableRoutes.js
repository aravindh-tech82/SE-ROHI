import { Router } from 'express';
import { getTimetable } from '../controllers/timetableController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getTimetable);

export default router;

