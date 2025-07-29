import { Request, Response } from 'express';
import { UserService } from './user.service';
import { ResponseUtils } from '../../utils/response';
import { AuthenticatedRequest, Role, CreateUserRequest } from '../../types';

export class UserController {
  /**
   * Create a new user (Admin creates trainers, anyone can create trainee)
   */
  static async createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;
      const currentUser = req.user;

      // If creating a trainer, ensure the current user is an admin
      if (userData.role === Role.TRAINER) {
        console.log(currentUser);
        if (!currentUser || currentUser.role !== Role.ADMIN) {
          const response = ResponseUtils.forbidden('Only admins can create trainers');
          res.status(response.statusCode).json(response);
          return;
        }
      }

      // For trainee registration, set role explicitly
      if (!userData.role) {
        userData.role = Role.TRAINEE;
      }

      const user = await UserService.createUser(
        userData,
        currentUser?.userId
      );

      const response = ResponseUtils.success(
        201,
        'User created successfully',
        user
      );
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        const response = ResponseUtils.conflict(error.message);
        res.status(response.statusCode).json(response);
        return;
      }

      const response = ResponseUtils.error(500, 'Failed to create user');
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response = ResponseUtils.unauthorized();
        res.status(response.statusCode).json(response);
        return;
      }

      const user = await UserService.findById(req.user.userId);
      
      if (!user) {
        const response = ResponseUtils.notFound('User');
        res.status(response.statusCode).json(response);
        return;
      }

      const response = ResponseUtils.success(200, 'Profile retrieved successfully', user);
      res.status(response.statusCode).json(response);
    } catch (error) {
      const response = ResponseUtils.error(500, 'Failed to retrieve profile');
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Update current user profile
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        const response = ResponseUtils.unauthorized();
        res.status(response.statusCode).json(response);
        return;
      }

      const { firstName, lastName, email } = req.body;
      const updateData = { firstName, lastName, email };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if ((updateData as any)[key] === undefined) {
          delete (updateData as any)[key];
        }
      });

      const user = await UserService.updateProfile(req.user.userId, updateData);

      const response = ResponseUtils.success(200, 'Profile updated successfully', user);
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      if (error.code === 'P2002') {
        const response = ResponseUtils.conflict('Email already exists');
        res.status(response.statusCode).json(response);
        return;
      }

      const response = ResponseUtils.error(500, 'Failed to update profile');
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get all trainers (Admin only)
   */
  static async getTrainers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== Role.ADMIN) {
        const response = ResponseUtils.forbidden('Only admins can view trainers');
        res.status(response.statusCode).json(response);
        return;
      }

      const trainers = await UserService.getAllTrainers();

      const response = ResponseUtils.success(200, 'Trainers retrieved successfully', trainers);
      res.status(response.statusCode).json(response);
    } catch (error) {
      const response = ResponseUtils.error(500, 'Failed to retrieve trainers');
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Get trainers created by current admin
   */
  static async getMyTrainers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== Role.ADMIN) {
        const response = ResponseUtils.forbidden('Only admins can view their trainers');
        res.status(response.statusCode).json(response);
        return;
      }

      const trainers = await UserService.getTrainersByAdmin(req.user.userId);

      const response = ResponseUtils.success(200, 'My trainers retrieved successfully', trainers);
      res.status(response.statusCode).json(response);
    } catch (error) {
      const response = ResponseUtils.error(500, 'Failed to retrieve trainers');
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Delete a user (Admin only)
   */
  static async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user || req.user.role !== Role.ADMIN) {
        const response = ResponseUtils.forbidden('Only admins can delete users');
        res.status(response.statusCode).json(response);
        return;
      }

      const { userId } = req.params;
      
      // Prevent admin from deleting themselves
      if (userId === req.user.userId) {
        const response = ResponseUtils.error(400, 'Cannot delete your own account');
        res.status(response.statusCode).json(response);
        return;
      }

      await UserService.deleteUser(userId);

      const response = ResponseUtils.success(200, 'User deleted successfully');
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      if (error.code === 'P2025') {
        const response = ResponseUtils.notFound('User');
        res.status(response.statusCode).json(response);
        return;
      }

      const response = ResponseUtils.error(500, 'Failed to delete user');
      res.status(response.statusCode).json(response);
    }
  }
}

export default UserController;
