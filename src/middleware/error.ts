import { Request, Response, NextFunction } from 'express';
import { ResponseUtils } from '../utils/response';

export class ErrorMiddleware {
  /**
   * Global error handler
   */
  static handle(error: any, req: Request, res: Response, next: NextFunction): void {
    console.error('Error occurred:', error);

    // Prisma errors
    if (error.code === 'P2002') {
      const response = ResponseUtils.conflict('A record with this data already exists');
      res.status(response.statusCode).json(response);
      return;
    }

    if (error.code === 'P2025') {
      const response = ResponseUtils.notFound('Record not found');
      res.status(response.statusCode).json(response);
      return;
    }

    // Validation errors
    if (error.name === 'ValidationError') {
      const response = ResponseUtils.validationError(error.field || 'unknown', error.message);
      res.status(response.statusCode).json(response);
      return;
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      const response = ResponseUtils.unauthorized('Invalid token');
      res.status(response.statusCode).json(response);
      return;
    }

    if (error.name === 'TokenExpiredError') {
      const response = ResponseUtils.unauthorized('Token expired');
      res.status(response.statusCode).json(response);
      return;
    }

    // Default error
    const response = ResponseUtils.error(
      error.statusCode || 500,
      error.message || 'Internal server error'
    );
    res.status(response.statusCode).json(response);
  }

  /**
   * 404 Not Found handler
   */
  static notFound(req: Request, res: Response): void {
    const response = ResponseUtils.notFound(`Route ${req.method} ${req.originalUrl} not found`);
    res.status(response.statusCode).json(response);
  }
}

export default ErrorMiddleware;
