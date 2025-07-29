import { prisma } from '../../config/database';
import { ClassSchedule, CreateScheduleRequest, Role } from '../../types';
import { DateUtils } from '../../utils/date';

export class ScheduleService {
  /**
   * Create a new class schedule
   */
  static async createSchedule(
    scheduleData: CreateScheduleRequest,
    createdById: string
  ): Promise<ClassSchedule> {
    const { title, description, date, startTime, endTime, trainerId, maxTrainees = 10 } = scheduleData;

    // Validate trainer exists and is a trainer
    const trainer = await prisma.user.findUnique({
      where: { id: trainerId, role: Role.TRAINER },
    });

    if (!trainer) {
      throw new Error('Invalid trainer ID');
    }

    // Create datetime objects
    const scheduleDate = DateUtils.parseDate(date);
    const startDateTime = DateUtils.createDateTime(date, startTime);
    const endDateTime = DateUtils.createDateTime(date, endTime);

    // Validate schedule duration (must be 2 hours)
    const duration = DateUtils.getDurationInHours(startDateTime, endDateTime);
    if (duration !== 2) {
      throw new Error('Class schedule must be exactly 2 hours long');
    }

    // Check daily schedule limit (max 5 per day)
    const dayStart = DateUtils.getStartOfDay(scheduleDate);
    const dayEnd = DateUtils.getEndOfDay(scheduleDate);

    const dailyScheduleCount = await prisma.classSchedule.count({
      where: {
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    if (dailyScheduleCount >= 5) {
      throw new Error('Maximum 5 schedules allowed per day');
    }

    // Check for trainer conflicts
    const trainerConflicts = await prisma.classSchedule.findMany({
      where: {
        trainerId,
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    for (const conflict of trainerConflicts) {
      if (DateUtils.isTimeOverlapping(
        startDateTime,
        endDateTime,
        conflict.startTime,
        conflict.endTime
      )) {
        throw new Error('Trainer is already assigned to another class at this time');
      }
    }

    // Create schedule
    const schedule = await prisma.classSchedule.create({
      data: {
        title,
        description,
        date: scheduleDate,
        startTime: startDateTime,
        endTime: endDateTime,
        maxTrainees,
        trainerId,
        createdBy: createdById,
      },
    });

    return schedule as ClassSchedule;
  }

  /**
   * Get all schedules
   */
  static async getAllSchedules(): Promise<ClassSchedule[]> {
    const schedules = await prisma.classSchedule.findMany({
      include: {
        trainer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: 'CONFIRMED',
              },
            },
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return schedules.map((schedule: any) => ({
      ...schedule,
      availableSlots: schedule.maxTrainees - schedule._count.bookings,
    })) as ClassSchedule[];
  }

  /**
   * Get schedules by trainer
   */
  static async getSchedulesByTrainer(trainerId: string): Promise<ClassSchedule[]> {
    const schedules = await prisma.classSchedule.findMany({
      where: { trainerId },
      include: {
        trainer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: 'CONFIRMED',
              },
            },
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return schedules.map((schedule: any) => ({
      ...schedule,
      availableSlots: schedule.maxTrainees - schedule._count.bookings,
    })) as ClassSchedule[];
  }

  /**
   * Get available schedules for booking
   */
  static async getAvailableSchedules(): Promise<ClassSchedule[]> {
    const now = new Date();
    
    const schedules = await prisma.classSchedule.findMany({
      where: {
        startTime: {
          gt: now, // Only future schedules
        },
      },
      include: {
        trainer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: 'CONFIRMED',
              },
            },
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });

    // Filter schedules with available slots
    return schedules
      .filter((schedule: any) => schedule._count.bookings < schedule.maxTrainees)
      .map((schedule: any) => ({
        ...schedule,
        availableSlots: schedule.maxTrainees - schedule._count.bookings,
      })) as ClassSchedule[];
  }

  /**
   * Get schedule by ID
   */
  static async getScheduleById(id: string): Promise<ClassSchedule | null> {
    const schedule = await prisma.classSchedule.findUnique({
      where: { id },
      include: {
        trainer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            bookings: {
              where: {
                status: 'CONFIRMED',
              },
            },
          },
        },
      },
    });

    if (!schedule) {
      return null;
    }

    return {
      ...schedule,
      availableSlots: schedule.maxTrainees - (schedule as any)._count.bookings,
    } as ClassSchedule;
  }

  /**
   * Update schedule
   */
  static async updateSchedule(
    id: string,
    updateData: Partial<CreateScheduleRequest>
  ): Promise<ClassSchedule> {
    const existingSchedule = await prisma.classSchedule.findUnique({
      where: { id },
    });

    if (!existingSchedule) {
      throw new Error('Schedule not found');
    }

    // Check if there are any bookings before allowing updates
    const bookingCount = await prisma.booking.count({
      where: {
        scheduleId: id,
        status: 'CONFIRMED',
      },
    });

    if (bookingCount > 0) {
      throw new Error('Cannot update schedule with existing bookings');
    }

    const updatedSchedule = await prisma.classSchedule.update({
      where: { id },
      data: updateData,
    });

    return updatedSchedule as ClassSchedule;
  }

  /**
   * Delete schedule
   */
  static async deleteSchedule(id: string): Promise<void> {
    const existingSchedule = await prisma.classSchedule.findUnique({
      where: { id },
    });

    if (!existingSchedule) {
      throw new Error('Schedule not found');
    }

    // Check if there are any bookings
    const bookingCount = await prisma.booking.count({
      where: {
        scheduleId: id,
        status: 'CONFIRMED',
      },
    });

    if (bookingCount > 0) {
      throw new Error('Cannot delete schedule with existing bookings');
    }

    await prisma.classSchedule.delete({
      where: { id },
    });
  }
}

export default ScheduleService;
