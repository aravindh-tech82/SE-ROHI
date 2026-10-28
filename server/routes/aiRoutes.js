import { Router } from 'express';
import { askStudentAi } from '../controllers/aiController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/query', verifyToken, askStudentAi);

export default router;

