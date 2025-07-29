import { prisma } from '../../config/database';
import { Role, User, CreateUserRequest } from '../../types';
import { AuthUtils } from '../../utils/auth';
import { TypeConverter } from '../../utils/typeConverter';

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(userData: CreateUserRequest, createdById?: string): Promise<User> {
    const { email, password, firstName, lastName, role = Role.TRAINEE } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(password);

    // Create user data
    const createData: any = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    };

    // If creating a trainer, set the admin relationship
    if (role === Role.TRAINER && createdById) {
      createData.adminId = createdById;
    }

    const user = await prisma.user.create({
      data: createData,
    });

    // Convert and remove password from response
    return TypeConverter.prismaUserToUser(user);
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<(User & { password: string }) | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    // Convert Prisma user to our User type with password
    return TypeConverter.prismaUserToUserWithPassword(user);
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return TypeConverter.prismaUserToUser(user);
  }

  /**
   * Find users by role
   */
  static async findByRole(role: Role): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: { role },
    });

    return TypeConverter.prismaUsersToUsers(users);
  }

  /**
   * Get all trainers created by an admin
   */
  static async getTrainersByAdmin(adminId: string): Promise<User[]> {
    const trainers = await prisma.user.findMany({
      where: {
        adminId,
        role: Role.TRAINER,
      },
    });

    return TypeConverter.prismaUsersToUsers(trainers);
  }

  /**
   * Get all trainers (admin only)
   */
  static async getAllTrainers(): Promise<User[]> {
    const trainers = await prisma.user.findMany({
      where: {
        role: Role.TRAINER,
      },
    });

    return TypeConverter.prismaUsersToUsers(trainers);
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    updateData: Partial<Pick<User, 'firstName' | 'lastName' | 'email'>>
  ): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return TypeConverter.prismaUserToUser(user);
  }

  /**
   * Verify trainer belongs to admin
   */
  static async verifyTrainerBelongsToAdmin(trainerId: string, adminId: string): Promise<boolean> {
    const trainer = await prisma.user.findUnique({
      where: {
        id: trainerId,
        adminId,
        role: Role.TRAINER,
      },
    });

    return !!trainer;
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}

export default UserService;
