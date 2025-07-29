import type { User as PrismaUser, ClassSchedule as PrismaClassSchedule, Booking as PrismaBooking } from '@prisma/client';
import { User, ClassSchedule, Booking, Role, BookingStatus } from '../types';

/**
 * Utility functions to convert Prisma types to our application types
 */
export class TypeConverter {
  /**
   * Convert Prisma User to application User type
   */
  static prismaUserToUser(prismaUser: PrismaUser): User {
    const { password: _, ...userWithoutPassword } = prismaUser;
    return {
      ...userWithoutPassword,
      role: prismaUser.role as Role,
    } as User;
  }

  /**
   * Convert Prisma User to application User type with password
   */
  static prismaUserToUserWithPassword(prismaUser: PrismaUser): User & { password: string } {
    return {
      ...prismaUser,
      role: prismaUser.role as Role,
    } as User & { password: string };
  }

  /**
   * Convert Prisma ClassSchedule to application ClassSchedule type
   */
  static prismaScheduleToSchedule(prismaSchedule: PrismaClassSchedule): ClassSchedule {
    return {
      ...prismaSchedule,
    } as ClassSchedule;
  }

  /**
   * Convert Prisma Booking to application Booking type
   */
  static prismaBookingToBooking(prismaBooking: PrismaBooking): Booking {
    return {
      ...prismaBooking,
      status: prismaBooking.status as BookingStatus,
    } as Booking;
  }

  /**
   * Convert array of Prisma Users to application Users
   */
  static prismaUsersToUsers(prismaUsers: PrismaUser[]): User[] {
    return prismaUsers.map(user => this.prismaUserToUser(user));
  }

  /**
   * Convert array of Prisma Schedules to application Schedules
   */
  static prismaSchedulesToSchedules(prismaSchedules: PrismaClassSchedule[]): ClassSchedule[] {
    return prismaSchedules.map(schedule => this.prismaScheduleToSchedule(schedule));
  }

  /**
   * Convert array of Prisma Bookings to application Bookings
   */
  static prismaBookingsToBookings(prismaBookings: PrismaBooking[]): Booking[] {
    return prismaBookings.map(booking => this.prismaBookingToBooking(booking));
  }
}

export default TypeConverter;
