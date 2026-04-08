import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

// Public route for login
router.post('/login', login);

// Protected route for registration (only admins can create users)
router.post('/register', authenticateJWT, requireRole('admin'), register);

export default router;
