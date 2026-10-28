import { Router } from 'express';
import {
  register,
  login,
  getMe,
  googleRedirect,
  googleCallback,
  googleTokenVerify,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);

// Google OAuth
router.get('/google', googleRedirect);
router.get('/google/callback', googleCallback);
router.post('/google-token', googleTokenVerify);

// Password recovery
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;

