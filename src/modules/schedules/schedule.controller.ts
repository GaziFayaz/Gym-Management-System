import { Request, Response } from 'express';
import { ScheduleService } from './schedule.service';
import { ResponseUtils } from '../../utils/response';
import { AuthenticatedRequest, Role } from '../../types';

export class ScheduleController {
  /**
   * Create a new schedule
   */
  static async createSchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const scheduleData = req.body;
      const userId = req.user!.userId;

      const schedule = await ScheduleService.createSchedule(scheduleData, userId);

      const response = ResponseUtils.success(201, 'Schedule created successfully', schedule);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get all schedules
   */
  static async getAllSchedules(req: Request, res: Response): Promise<void> {
    try {
      const schedules = await ScheduleService.getAllSchedules();

      const response = ResponseUtils.success(200, 'Schedules retrieved successfully', schedules);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get schedules by trainer
   */
  static async getSchedulesByTrainer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { trainerId } = req.params;
      
      // Check if user is requesting their own schedules or is an admin
      if (req.user!.role !== Role.ADMIN && req.user!.userId !== trainerId) {
        const response = ResponseUtils.forbidden('Access denied');
        res.status(response.statusCode).json(response);
        return;
      }

      const schedules = await ScheduleService.getSchedulesByTrainer(trainerId);

      const response = ResponseUtils.success(200, 'Trainer schedules retrieved successfully', schedules);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get available schedules for booking
   */
  static async getAvailableSchedules(req: Request, res: Response): Promise<void> {
    try {
      const schedules = await ScheduleService.getAvailableSchedules();

      const response = ResponseUtils.success(200, 'Available schedules retrieved successfully', schedules);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get schedule by ID
   */
  static async getScheduleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const schedule = await ScheduleService.getScheduleById(id);

      if (!schedule) {
        const response = ResponseUtils.notFound('Schedule');
        res.status(response.statusCode).json(response);
        return;
      }

      const response = ResponseUtils.success(200, 'Schedule retrieved successfully', schedule);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Update schedule
   */
  static async updateSchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const schedule = await ScheduleService.updateSchedule(id, updateData);

      const response = ResponseUtils.success(200, 'Schedule updated successfully', schedule);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Delete schedule
   */
  static async deleteSchedule(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await ScheduleService.deleteSchedule(id);

      const response = ResponseUtils.success(200, 'Schedule deleted successfully');
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get my schedules (for trainers)
   */
  static async getMySchedules(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      if (req.user!.role !== Role.TRAINER) {
        const response = ResponseUtils.forbidden('Only trainers can access this endpoint');
        res.status(response.statusCode).json(response);
        return;
      }

      const schedules = await ScheduleService.getSchedulesByTrainer(userId);

      const response = ResponseUtils.success(200, 'My schedules retrieved successfully', schedules);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.error(400, error.message);
      res.status(response.statusCode).json(response);
    }
  }
}

export default ScheduleController;
