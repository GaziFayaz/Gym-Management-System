import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, Role } from '../types';
import { AuthUtils } from '../utils/auth';
import { ResponseUtils } from '../utils/response';

export class AuthMiddleware {
  /**
   * Verify JWT token and attach user to request
   */
  static authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response = ResponseUtils.unauthorized('Access token is required');
        res.status(response.statusCode).json(response);
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      try {
        const decoded = AuthUtils.verifyToken(token);
        req.user = decoded;
        next();
      } catch (tokenError) {
        const response = ResponseUtils.unauthorized('Invalid or expired token');
        res.status(response.statusCode).json(response);
        return;
      }
    } catch (error) {
      const response = ResponseUtils.error(500, 'Authentication error');
      res.status(response.statusCode).json(response);
      return;
    }
  }

  /**
   * Check if user has required role(s)
   */
  static authorize(...allowedRoles: Role[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          const response = ResponseUtils.unauthorized('Authentication required');
          res.status(response.statusCode).json(response);
          return;
        }

        if (!allowedRoles.includes(req.user.role)) {
          const response = ResponseUtils.forbidden(
            `You must be ${allowedRoles.join(' or ')} to perform this action.`
          );
          res.status(response.statusCode).json(response);
          return;
        }

        next();
      } catch (error) {
        const response = ResponseUtils.error(500, 'Authorization error');
        res.status(response.statusCode).json(response);
        return;
      }
    };
  }

  /**
   * Check if user is admin
   */
  static adminOnly = AuthMiddleware.authorize(Role.ADMIN);

  /**
   * Check if user is trainer or admin
   */
  static trainerOrAdmin = AuthMiddleware.authorize(Role.TRAINER, Role.ADMIN);

  /**
   * Check if user is trainee (for self-management endpoints)
   */
  static traineeOnly = AuthMiddleware.authorize(Role.TRAINEE);
}

export default AuthMiddleware;
