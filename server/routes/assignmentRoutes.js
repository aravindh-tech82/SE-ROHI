import { Router } from 'express';
import {
  getAllAssignments,
  createAssignment,
  updateAssignmentStatus
} from '../controllers/assignmentController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getAllAssignments);
router.post('/', verifyToken, requireRole('ADMIN', 'FACULTY'), createAssignment);
router.patch('/:id/status', verifyToken, updateAssignmentStatus);

export default router;

