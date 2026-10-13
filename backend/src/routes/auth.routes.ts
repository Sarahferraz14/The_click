import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me, refresh, register, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

const resetLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5});

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.post('/refresh', refresh);
router.post('/forgot-password', resetLimiter, forgotPassword);
router.post('/reset-password', resetLimiter, resetPassword);

export default router;