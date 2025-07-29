import { Request, Response } from 'express';
import { BookingService } from './booking.service';
import { ResponseUtils } from '../../utils/response';
import { AuthenticatedRequest, Role } from '../../types';
import { prisma } from '../../config/database';

export class BookingController {
  /**
   * Create a new booking
   */
  static async createBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const bookingData = req.body;
      const traineeId = req.user!.userId;

      const booking = await BookingService.createBooking(bookingData, traineeId);

      const response = ResponseUtils.success(201, 'Booking created successfully', booking);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get all bookings (Admin only)
   */
  static async getAllBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const bookings = await BookingService.getAllBookings();

      const response = ResponseUtils.success(200, 'Bookings retrieved successfully', bookings);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get my bookings (for trainees)
   */
  static async getMyBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const traineeId = req.user!.userId;

      const bookings = await BookingService.getBookingsByTrainee(traineeId);

      const response = ResponseUtils.success(200, 'My bookings retrieved successfully', bookings);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get my upcoming bookings (for trainees)
   */
  static async getMyUpcomingBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const traineeId = req.user!.userId;

      const bookings = await BookingService.getUpcomingBookings(traineeId);

      const response = ResponseUtils.success(200, 'Upcoming bookings retrieved successfully', bookings);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get my booking history (for trainees)
   */
  static async getMyBookingHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const traineeId = req.user!.userId;

      const bookings = await BookingService.getBookingHistory(traineeId);

      const response = ResponseUtils.success(200, 'Booking history retrieved successfully', bookings);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get bookings by schedule (for trainers and admins)
   */
  static async getBookingsBySchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { scheduleId } = req.params;

      // For trainers, verify they own the schedule
      if (req.user!.role === Role.TRAINER) {
        const schedule = await prisma.classSchedule.findUnique({
          where: { id: scheduleId },
        });

        if (!schedule || schedule.trainerId !== req.user!.userId) {
          const response = ResponseUtils.forbidden('Access denied');
          res.status(response.statusCode).json(response);
          return;
        }
      }

      const bookings = await BookingService.getBookingsBySchedule(scheduleId);

      const response = ResponseUtils.success(200, 'Schedule bookings retrieved successfully', bookings);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const booking = await BookingService.getBookingById(id);

      if (!booking) {
        const response = ResponseUtils.notFound('Booking');
        res.status(response.statusCode).json(response);
        return;
      }

      // Check access rights
      if (req.user!.role !== Role.ADMIN && booking.traineeId !== req.user!.userId) {
        const response = ResponseUtils.forbidden('Access denied');
        res.status(response.statusCode).json(response);
        return;
      }

      const response = ResponseUtils.success(200, 'Booking retrieved successfully', booking);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const userRole = req.user!.role;

      await BookingService.cancelBooking(id, userId, userRole);

      const response = ResponseUtils.success(200, 'Booking cancelled successfully');
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get trainer's schedule bookings (for trainers to see their class attendees)
   */
  static async getTrainerScheduleBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      let trainerId = req.user!.userId;

      // If admin wants to see another trainer's bookings
      if (req.user!.role === Role.ADMIN && req.params.trainerId) {
        trainerId = req.params.trainerId;
      } else if (req.user!.role !== Role.TRAINER) {
        const response = ResponseUtils.forbidden('Access denied');
        res.status(response.statusCode).json(response);
        return;
      }

      const scheduleBookings = await BookingService.getTrainerScheduleBookings(trainerId);

      const response = ResponseUtils.success(200, 'Trainer schedule bookings retrieved successfully', scheduleBookings);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get bookings by trainee (Admin only)
   */
  static async getBookingsByTrainee(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { traineeId } = req.params;

      const bookings = await BookingService.getBookingsByTrainee(traineeId);

      const response = ResponseUtils.success(200, 'Trainee bookings retrieved successfully', bookings);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }
}

export default BookingController;
