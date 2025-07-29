import express from 'express';
import { ScheduleController } from './schedule.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { ValidationMiddleware } from '../../middleware/validation';
import { body, param } from 'express-validator';
import { Role } from '../../types';

const router = express.Router();

// Validation rules for schedule creation/update
const createScheduleValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be in valid ISO format (YYYY-MM-DD)'),
  
  body('startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  
  body('endTime')
    .notEmpty()
    .withMessage('End time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  
  body('trainerId')
    .notEmpty()
    .withMessage('Trainer ID is required')
    .isUUID()
    .withMessage('Trainer ID must be a valid UUID'),
  
//   body('maxTrainees')
//     .optional()
//     .isInt({ min: 1, max: 20 })
//     .withMessage('Max trainees must be between 1 and 20'),
];

const updateScheduleValidation = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in valid ISO format (YYYY-MM-DD)'),
  
  body('startTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  
  body('endTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  
  body('trainerId')
    .optional()
    .isUUID()
    .withMessage('Trainer ID must be a valid UUID'),
  
  // body('maxTrainees')
  //   .optional()
  //   .isInt({ min: 1, max: 20 })
  //   .withMessage('Max trainees must be between 1 and 20'),
];

const idValidation = [
  param('id')
    .isUUID()
    .withMessage('Schedule ID must be a valid UUID'),
];

const trainerIdValidation = [
  param('trainerId')
    .isUUID()
    .withMessage('Trainer ID must be a valid UUID'),
];

// Routes

/**
 * @route   POST /api/schedules
 * @desc    Create a new schedule (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/',
  AuthMiddleware.authenticate,
  AuthMiddleware.adminOnly,
  createScheduleValidation,
  ValidationMiddleware.checkErrors,
  ScheduleController.createSchedule
);

/**
 * @route   GET /api/schedules
 * @desc    Get all schedules
 * @access  Private (All authenticated users)
 */
router.get(
  '/',
  AuthMiddleware.authenticate,
  ScheduleController.getAllSchedules
);

/**
 * @route   GET /api/schedules/available
 * @desc    Get available schedules for booking
 * @access  Private (All authenticated users)
 */
router.get(
  '/available',
  AuthMiddleware.authenticate,
  ScheduleController.getAvailableSchedules
);

/**
 * @route   GET /api/schedules/my
 * @desc    Get my schedules (for trainers)
 * @access  Private (Trainers only)
 */
router.get(
  '/my',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(Role.TRAINER),
  ScheduleController.getMySchedules
);

/**
 * @route   GET /api/schedules/trainer/:trainerId
 * @desc    Get schedules by trainer
 * @access  Private (Admin or the trainer themselves)
 */
router.get(
  '/trainer/:trainerId',
  AuthMiddleware.authenticate,
  trainerIdValidation,
  ValidationMiddleware.checkErrors,
  ScheduleController.getSchedulesByTrainer
);

/**
 * @route   GET /api/schedules/:id
 * @desc    Get schedule by ID
 * @access  Private (All authenticated users)
 */
router.get(
  '/:id',
  AuthMiddleware.authenticate,
  idValidation,
  ValidationMiddleware.checkErrors,
  ScheduleController.getScheduleById
);

/**
 * @route   PUT /api/schedules/:id
 * @desc    Update schedule
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.adminOnly,
  idValidation,
  updateScheduleValidation,
  ValidationMiddleware.checkErrors,
  ScheduleController.updateSchedule
);

/**
 * @route   DELETE /api/schedules/:id
 * @desc    Delete schedule
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  AuthMiddleware.authenticate,
  AuthMiddleware.adminOnly,
  idValidation,
  ValidationMiddleware.checkErrors,
  ScheduleController.deleteSchedule
);

export default router;
