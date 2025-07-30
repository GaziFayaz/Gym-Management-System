import { Request } from 'express';

export enum Role {
  ADMIN = 'ADMIN',
  TRAINER = 'TRAINER',
  TRAINEE = 'TRAINEE',
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  adminId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: true;
  statusCode: number;
  message: string;
  data: {
    user: Omit<User, 'password'>;
    token: string;
  };
}

export interface ClassSchedule {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  maxTrainees: number;
  trainerId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateScheduleRequest {
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  trainerId: string;
  maxTrainees?: number;
}

export interface Booking {
  id: string;
  traineeId: string;
  scheduleId: string;
  status: BookingStatus;
  bookedAt: Date;
  updatedAt: Date;
}

export interface CreateBookingRequest {
  scheduleId: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errorDetails?: any;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}
