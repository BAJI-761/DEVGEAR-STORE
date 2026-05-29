import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, logout, me, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequiredBody } from '../middleware/validate.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', authLimiter, validateRequiredBody(['name', 'email', 'password']), register);
router.post('/login', authLimiter, validateRequiredBody(['email', 'password']), login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

export default router;