import { UserService } from '../users/user.service';
import { AuthUtils } from '../../utils/auth';
import { LoginRequest } from '../../types';

export class AuthService {
  /**
   * Authenticate user login
   */
  static async login(credentials: LoginRequest) {
    const { email, password } = credentials;

    // Find user by email
    const user = await UserService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await AuthUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = AuthUtils.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Verify token and return user info
   */
  static async verifyToken(token: string) {
    try {
      const decoded = AuthUtils.verifyToken(token);
      const user = await UserService.findById(decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

export default AuthService;
