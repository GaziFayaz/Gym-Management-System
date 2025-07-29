import { APIResponse } from '../types';

export class ResponseUtils {
  /**
   * Create a success response
   */
  static success<T>(
    statusCode: number = 200,
    message: string = 'Operation successful',
    data?: T
  ): APIResponse<T> {
    const response: APIResponse<T> = {
      success: true,
      statusCode,
      message,
    };

    if (data !== undefined) {
      response.data = data;
    }

    return response;
  }

  /**
   * Create an error response
   */
  static error(
    statusCode: number = 500,
    message: string = 'Internal server error',
    errorDetails?: any
  ): APIResponse {
    const response: APIResponse = {
      success: false,
      statusCode,
      message,
    };

    if (errorDetails !== undefined) {
      response.errorDetails = errorDetails;
    }

    return response;
  }

  /**
   * Create a validation error response
   */
  static validationError(
    field: string,
    message: string
  ): APIResponse {
    return this.error(400, 'Validation error occurred.', {
      field,
      message,
    });
  }

  /**
   * Create an unauthorized error response
   */
  static unauthorized(message: string = 'Unauthorized access.'): APIResponse {
    return this.error(401, message);
  }

  /**
   * Create a forbidden error response
   */
  static forbidden(errorDetails?: string): APIResponse {
    return this.error(403, 'Unauthorized access.', errorDetails);
  }

  /**
   * Create a not found error response
   */
  static notFound(resource: string = 'Resource'): APIResponse {
    return this.error(404, `${resource} not found.`);
  }

  /**
   * Create a conflict error response
   */
  static conflict(message: string): APIResponse {
    return this.error(409, message);
  }
}

export default ResponseUtils;
