import { Router } from 'express';
import {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getAllAnnouncements);
router.post('/', verifyToken, requireRole('ADMIN', 'FACULTY'), createAnnouncement);
router.delete('/:id', verifyToken, requireRole('ADMIN'), deleteAnnouncement);

export default router;

