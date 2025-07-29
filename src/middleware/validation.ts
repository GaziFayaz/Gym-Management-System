import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '../utils/response';
import { Role } from '../types';

export class ValidationMiddleware {
  /**
   * Check for validation errors
   */
  static checkErrors(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      const response = ResponseUtils.validationError(
        firstError.type === 'field' ? (firstError as any).path : 'unknown',
        firstError.msg
      );
      res.status(response.statusCode).json(response);
      return;
    }
    next();
  }

  /**
   * User registration validation
   */
  static validateUserRegistration = [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('firstName')
      .trim()
      .isLength({ min: 2 })
      .withMessage('First name must be at least 2 characters long')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('First name must contain only letters and spaces'),
    body('lastName')
      .trim()
      .isLength({ min: 2 })
      .withMessage('Last name must be at least 2 characters long')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Last name must contain only letters and spaces'),
    body('role')
      .optional()
      .isIn(Object.values(Role))
      .withMessage('Invalid role'),
    ValidationMiddleware.checkErrors,
  ];

  /**
   * User login validation
   */
  static validateUserLogin = [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    ValidationMiddleware.checkErrors,
  ];

  /**
   * Class schedule creation validation
   */
  static validateScheduleCreation = [
    body('title')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Title must be at least 3 characters long'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters'),
    body('date')
      .isISO8601()
      .withMessage('Invalid date format. Use YYYY-MM-DD')
      .custom((value) => {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
          throw new Error('Date cannot be in the past');
        }
        return true;
      }),
    body('startTime')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Invalid start time format. Use HH:MM'),
    body('endTime')
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Invalid end time format. Use HH:MM')
      .custom((value, { req }) => {
        if (req.body.startTime && value <= req.body.startTime) {
          throw new Error('End time must be after start time');
        }
        return true;
      }),
    body('trainerId')
      .notEmpty()
      .withMessage('Trainer ID is required')
      .isString()
      .withMessage('Trainer ID must be a string'),
    body('maxTrainees')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('Maximum trainees must be between 1 and 10'),
    ValidationMiddleware.checkErrors,
  ];

  /**
   * Booking creation validation
   */
  static validateBookingCreation = [
    body('scheduleId')
      .notEmpty()
      .withMessage('Schedule ID is required')
      .isString()
      .withMessage('Schedule ID must be a string'),
    ValidationMiddleware.checkErrors,
  ];
}

export default ValidationMiddleware;
