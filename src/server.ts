import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import scheduleRoutes from './modules/schedules/schedule.routes';
import bookingRoutes from './modules/bookings/booking.routes';
import { ErrorMiddleware } from './middleware/error';
import { ResponseUtils } from './utils/response';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.originalUrl} from ${req.ip}`);
  next();
});

// API Routes
console.log('Setting up routes...');
app.use('/api/auth', (req, res, next) => {
  console.log(`Auth route: ${req.method} ${req.path}`);
  next();
}, authRoutes);
console.log('Auth routes set up');
app.use('/api/users', (req, res, next) => {
  console.log(`User route: ${req.method} ${req.path}`);
  next();
}, userRoutes);
console.log('User routes set up');
app.use('/api/schedules', (req, res, next) => {
  console.log(`Schedule route: ${req.method} ${req.path}`);
  next();
}, scheduleRoutes);
console.log('Schedule routes set up');
app.use('/api/bookings', (req, res, next) => {
  console.log(`Booking route: ${req.method} ${req.path}`);
  next();
}, bookingRoutes);
console.log('Booking routes set up');

// Health check endpoint
app.get('/health', (req, res) => {
  const response = ResponseUtils.success(200, 'Server is running successfully', {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: process.env.npm_package_version || '1.0.0',
  });
  res.status(response.statusCode).json(response);
});

// Root endpoint
app.get('/', (req, res) => {
  const response = ResponseUtils.success(200, 'Welcome to Gym Management System API', {
    name: 'Gym Management System',
    version: process.env.npm_package_version || '1.0.0',
    description: 'A comprehensive gym class scheduling and membership management system',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      schedules: '/api/schedules',
      bookings: '/api/bookings',
      health: '/health',
    },
  });
  res.status(response.statusCode).json(response);
});

// 404 handler
app.use((req, res) => {
  const response = ResponseUtils.notFound('Endpoint');
  res.status(response.statusCode).json(response);
});

// Global error handler
app.use(ErrorMiddleware.handle);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
