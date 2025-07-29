import { prisma } from '../../config/database';
import { Booking, CreateBookingRequest, BookingStatus, Role } from '../../types';

export class BookingService {
  /**
   * Create a new booking
   */
  static async createBooking(
    bookingData: CreateBookingRequest,
    traineeId: string
  ): Promise<Booking> {
    const { scheduleId } = bookingData;

    // Check if schedule exists and is in the future
    const schedule = await prisma.classSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    // Check if schedule is in the future
    if (schedule.startTime <= new Date()) {
      throw new Error('Cannot book past or ongoing schedules');
    }

    // Check if trainee already has a booking for this schedule
    const existingBooking = await prisma.booking.findFirst({
      where: {
        scheduleId,
        traineeId,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (existingBooking) {
      throw new Error('You already have a booking for this schedule');
    }

    // Check if schedule has available slots
    const confirmedBookingsCount = await prisma.booking.count({
      where: {
        scheduleId,
        status: BookingStatus.CONFIRMED,
      },
    });

    if (confirmedBookingsCount >= schedule.maxTrainees) {
      throw new Error('No available slots for this schedule');
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        scheduleId,
        traineeId,
        status: BookingStatus.CONFIRMED,
      },
    });

    return booking as Booking;
  }

  /**
   * Get all bookings (Admin only)
   */
  static async getAllBookings(): Promise<Booking[]> {
    const bookings = await prisma.booking.findMany({
      include: {
        trainee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        schedule: {
          include: {
            trainer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: [
        { bookedAt: 'desc' },
      ],
    });

    return bookings as Booking[];
  }

  /**
   * Get bookings by trainee
   */
  static async getBookingsByTrainee(traineeId: string): Promise<Booking[]> {
    const bookings = await prisma.booking.findMany({
      where: { traineeId },
      include: {
        schedule: {
          include: {
            trainer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: [
        { bookedAt: 'desc' },
      ],
    });

    return bookings as Booking[];
  }

  /**
   * Get bookings by schedule (for trainers and admins)
   */
  static async getBookingsBySchedule(scheduleId: string): Promise<Booking[]> {
    const bookings = await prisma.booking.findMany({
      where: { 
        scheduleId,
        status: BookingStatus.CONFIRMED,
      },
      include: {
        trainee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: [
        { bookedAt: 'asc' },
      ],
    });

    return bookings as Booking[];
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(id: string): Promise<Booking | null> {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        trainee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        schedule: {
          include: {
            trainer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return booking as Booking | null;
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(id: string, userId: string, userRole: Role): Promise<void> {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        schedule: true,
      },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Check if user can cancel this booking
    if (userRole !== Role.ADMIN && booking.traineeId !== userId) {
      throw new Error('You can only cancel your own bookings');
    }

    // Check if booking can still be cancelled (must be at least 2 hours before schedule)
    const twoHoursFromNow = new Date();
    twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);

    if (booking.schedule!.startTime <= twoHoursFromNow) {
      throw new Error('Cannot cancel booking less than 2 hours before the schedule');
    }

    // Update booking status
    await prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CANCELLED,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get upcoming bookings for a trainee
   */
  static async getUpcomingBookings(traineeId: string): Promise<Booking[]> {
    const now = new Date();

    const bookings = await prisma.booking.findMany({
      where: {
        traineeId,
        status: BookingStatus.CONFIRMED,
        schedule: {
          startTime: {
            gt: now,
          },
        },
      },
      include: {
        schedule: {
          include: {
            trainer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: [
        { schedule: { startTime: 'asc' } },
      ],
    });

    return bookings as Booking[];
  }

  /**
   * Get booking history for a trainee
   */
  static async getBookingHistory(traineeId: string): Promise<Booking[]> {
    const now = new Date();

    const bookings = await prisma.booking.findMany({
      where: {
        traineeId,
        OR: [
          { status: BookingStatus.CANCELLED },
          {
            status: BookingStatus.CONFIRMED,
            schedule: {
              endTime: {
                lt: now,
              },
            },
          },
        ],
      },
      include: {
        schedule: {
          include: {
            trainer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: [
        { bookedAt: 'desc' },
      ],
    });

    return bookings as Booking[];
  }

  /**
   * Get trainer's schedule bookings (for trainers to see who's attending their classes)
   */
  static async getTrainerScheduleBookings(trainerId: string): Promise<any[]> {
    const schedules = await prisma.classSchedule.findMany({
      where: { trainerId },
      include: {
        bookings: {
          where: {
            status: BookingStatus.CONFIRMED,
          },
          include: {
            trainee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
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
      attendees: schedule.bookings,
      availableSlots: schedule.maxTrainees - schedule.bookings.length,
    }));
  }
}

export default BookingService;
