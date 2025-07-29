import { Router } from 'express';
import { AuthController } from './auth.controller';
import { ValidationMiddleware } from '../../middleware/validation';
import { AuthMiddleware } from '../../middleware/auth';

const router = Router();

// Public routes
router.post(
  '/login',
  ValidationMiddleware.validateUserLogin,
  AuthController.login
);

router.post('/verify-token', AuthController.verifyToken);

// First admin registration (remove this after creating first admin)
router.post(
  '/register-admin',
  ValidationMiddleware.validateUserRegistration,
  AuthController.registerAdmin
);

// Protected routes
router.post('/logout', AuthMiddleware.authenticate, AuthController.logout);

export default router;
