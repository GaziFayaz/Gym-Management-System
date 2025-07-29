import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ResponseUtils } from '../../utils/response';
import { LoginRequest, CreateUserRequest, Role } from '../../types';
import { UserService } from '../users/user.service';

export class AuthController {
  /**
   * User login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginRequest = req.body;
      const result = await AuthService.login(credentials);

      const response = ResponseUtils.success(
        200,
        'Login successful',
        result
      );
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      if (error.message === 'Invalid email or password') {
        const response = ResponseUtils.error(401, error.message);
        res.status(response.statusCode).json(response);
        return;
      }

      const response = ResponseUtils.error(500, 'Login failed');
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Verify token endpoint
   */
  static async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response = ResponseUtils.unauthorized('Access token is required');
        res.status(response.statusCode).json(response);
        return;
      }

      const token = authHeader.substring(7);
      const user = await AuthService.verifyToken(token);

      const response = ResponseUtils.success(
        200,
        'Token is valid',
        { user, valid: true }
      );
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      const response = ResponseUtils.unauthorized(error.message);
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Register first admin user (temporary endpoint)
   * Remove this endpoint after creating the first admin user
   */
  static async registerAdmin(req: Request, res: Response): Promise<void> {
    try {
      // Check if any admin already exists
      const existingAdmin = await UserService.findByRole(Role.ADMIN);
      if (existingAdmin && existingAdmin.length > 0) {
        const response = ResponseUtils.error(403, 'Admin user already exists. Remove this endpoint.');
        res.status(response.statusCode).json(response);
        return;
      }

      const userData: CreateUserRequest = {
        ...req.body,
        role: Role.ADMIN // Force role to ADMIN
      };

      const user = await UserService.createUser(userData);
      
      const response = ResponseUtils.success(
        201,
        'Admin user created successfully',
        user
      );
      res.status(response.statusCode).json(response);
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        const response = ResponseUtils.error(409, error.message);
        res.status(response.statusCode).json(response);
        return;
      }

      const response = ResponseUtils.error(500, 'Failed to create admin user');
      res.status(response.statusCode).json(response);
    }
  }

  /**
   * Logout (client-side token removal)
   */
  static async logout(req: Request, res: Response): Promise<void> {
    const response = ResponseUtils.success(
      200,
      'Logout successful. Please remove the token from client storage.'
    );
    res.status(response.statusCode).json(response);
  }
}

export default AuthController;
