import express from 'express';
import { BookingController } from './booking.controller';
import { AuthMiddleware } from '../../middleware/auth';
import { ValidationMiddleware } from '../../middleware/validation';
import { body, param } from 'express-validator';
import { Role } from '../../types';

const router = express.Router();

// Validation rules for booking creation
const createBookingValidation = [
  body('scheduleId')
    .notEmpty()
    .withMessage('Schedule ID is required')
    .isUUID()
    .withMessage('Schedule ID must be a valid UUID'),
];

const idValidation = [
  param('id')
    .isUUID()
    .withMessage('Booking ID must be a valid UUID'),
];

const scheduleIdValidation = [
  param('scheduleId')
    .isUUID()
    .withMessage('Schedule ID must be a valid UUID'),
];

const traineeIdValidation = [
  param('traineeId')
    .isUUID()
    .withMessage('Trainee ID must be a valid UUID'),
];

const trainerIdValidation = [
  param('trainerId')
    .optional()
    .isUUID()
    .withMessage('Trainer ID must be a valid UUID'),
];

// Routes

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking (Trainees only)
 * @access  Private (Trainee)
 */
router.post(
  '/',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(Role.TRAINEE),
  createBookingValidation,
  ValidationMiddleware.checkErrors,
  BookingController.createBooking
);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings (Admin only)
 * @access  Private (Admin)
 */
router.get(
  '/',
  AuthMiddleware.authenticate,
  AuthMiddleware.adminOnly,
  BookingController.getAllBookings
);

/**
 * @route   GET /api/bookings/my
 * @desc    Get my bookings (Trainees only)
 * @access  Private (Trainee)
 */
router.get(
  '/my',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(Role.TRAINEE),
  BookingController.getMyBookings
);

/**
 * @route   GET /api/bookings/my/upcoming
 * @desc    Get my upcoming bookings (Trainees only)
 * @access  Private (Trainee)
 */
router.get(
  '/my/upcoming',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(Role.TRAINEE),
  BookingController.getMyUpcomingBookings
);

/**
 * @route   GET /api/bookings/my/history
 * @desc    Get my booking history (Trainees only)
 * @access  Private (Trainee)
 */
router.get(
  '/my/history',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(Role.TRAINEE),
  BookingController.getMyBookingHistory
);

/**
 * @route   GET /api/bookings/trainer/schedules
 * @desc    Get trainer's schedule bookings (Trainers only)
 * @access  Private (Trainer)
 */
router.get(
  '/trainer/schedules',
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(Role.TRAINER),
  BookingController.getTrainerScheduleBookings
);

/**
 * @route   GET /api/bookings/trainer/:trainerId/schedules
 * @desc    Get specific trainer's schedule bookings (Admin only)
 * @access  Private (Admin)
 */
router.get(
  '/trainer/:trainerId/schedules',
  AuthMiddleware.authenticate,
  AuthMiddleware.adminOnly,
  trainerIdValidation,
  ValidationMiddleware.checkErrors,
  BookingController.getTrainerScheduleBookings
);

/**
 * @route   GET /api/bookings/schedule/:scheduleId
 * @desc    Get bookings by schedule (Trainer/Admin only)
 * @access  Private (Trainer/Admin)
 */
router.get(
  '/schedule/:scheduleId',
  AuthMiddleware.authenticate,
  AuthMiddleware.trainerOrAdmin,
  scheduleIdValidation,
  ValidationMiddleware.checkErrors,
  BookingController.getBookingsBySchedule
);

/**
 * @route   GET /api/bookings/trainee/:traineeId
 * @desc    Get bookings by trainee (Admin only)
 * @access  Private (Admin)
 */
router.get(
  '/trainee/:traineeId',
  AuthMiddleware.authenticate,
  AuthMiddleware.adminOnly,
  traineeIdValidation,
  ValidationMiddleware.checkErrors,
  BookingController.getBookingsByTrainee
);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking by ID
 * @access  Private (Booking owner or Admin)
 */
router.get(
  '/:id',
  AuthMiddleware.authenticate,
  idValidation,
  ValidationMiddleware.checkErrors,
  BookingController.getBookingById
);

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private (Booking owner or Admin)
 */
router.put(
  '/:id/cancel',
  AuthMiddleware.authenticate,
  idValidation,
  ValidationMiddleware.checkErrors,
  BookingController.cancelBooking
);

export default router;
