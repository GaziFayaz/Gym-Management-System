import { Router } from 'express';
import { UserController } from './user.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { ValidationMiddleware } from '../../middleware/validation';

const router = Router();

// Public routes
router.post(
  '/register',
  ValidationMiddleware.validateUserRegistration,
  UserController.createUser
);

// Protected routes (authentication required)
router.use(AuthMiddleware.authenticate);

// Profile management
router.get('/profile', UserController.getProfile);
router.put(
  '/update-profile',
  ValidationMiddleware.validateUserRegistration.slice(1, 4), // Exclude password validation for updates
  UserController.updateProfile
);

// Admin only routes
router.get('/trainers', AuthMiddleware.adminOnly, UserController.getTrainers);
router.get('/my-trainers', AuthMiddleware.adminOnly, UserController.getMyTrainers);
router.post(
  '/trainers',
  AuthMiddleware.adminOnly,
  ValidationMiddleware.validateUserRegistration,
  UserController.createUser
);
router.delete('/:userId', AuthMiddleware.adminOnly, UserController.deleteUser);

export default router;
