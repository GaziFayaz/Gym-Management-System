# Gym Management System

A comprehensive gym class scheduling and membership management system built with TypeScript, Express.js, Prisma, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Business Rules](#business-rules)
- [Contributing](#contributing)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Trainer, Trainee)
- Secure password hashing with bcrypt
- Protected routes and middleware

### 👥 User Management
- User registration and profile management
- Admin can create trainer accounts
- Self-registration for trainees
- Role-based permissions

### 📅 Class Schedule Management
- Create and manage gym class schedules
- 2-hour class duration enforcement
- Maximum 5 classes per day limit
- Trainer assignment and conflict prevention
- Real-time availability tracking

### 📝 Booking System
- Book available gym classes
- Maximum 10 trainees per class
- Booking cancellation (minimum 2 hours before class)
- Booking history and upcoming classes
- Conflict prevention and availability checking

### 📊 Reporting & Analytics
- Trainer schedule overview
- Booking statistics
- Class attendance tracking
- User activity monitoring

## 🛠 Technology Stack

- **Backend Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors
- **Logging**: morgan
- **Date Utilities**: date-fns

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gym-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

## ⚙️ Configuration

Edit the `.env` file with your configuration:

```env
# Environment Configuration
NODE_ENV=development

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/gym_management"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Bcrypt Configuration
BCRYPT_ROUNDS=12
```

## 🗄️ Database Setup

1. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

2. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

3. **Seed the database (optional)**
   ```bash
   npm run prisma:seed
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Other Commands
```bash
# Lint code
npm run lint

# Format code
npm run format

# Run type checking
npm run type-check

# Reset database
npm run prisma:reset
```

## 📚 API Documentation

### Base URL
```
https://gym-management-system-2hn3cvcbj-gazifayazs-projects.vercel.app/api
```

### Authentication Endpoints

#### Register User (Trainee)
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "trainee@gym.com",
  "password": "Abc123",
  "firstName": "John",
  "lastName": "Trainee",
  "role": "TRAINEE"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gym.com",
  "password": "Abc123"
}
```

#### Verify Token
```http
POST /api/auth/verify-token
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <jwt-token>
```

### User Management Endpoints

#### Register Admin (Admin only)
```http
POST /api/users/register-admin
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "email": "admin1@gym.com",
  "password": "Abc123",
  "firstName": "System",
  "lastName": "Admin",
  "role": "ADMIN"
}
```

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <jwt-token>
```

#### Update Profile
```http
PUT /api/users/update-profile
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "firstName": "Updated",
  "lastName": "Name",
  "email": "updated@gym.com"
}
```

#### Get All Trainers (Admin only)
```http
GET /api/users/trainers
Authorization: Bearer <jwt-token>
```

#### Get My Trainers (Admin only)
```http
GET /api/users/my-trainers
Authorization: Bearer <jwt-token>
```

#### Create Trainer (Admin only)
```http
POST /api/users/trainers
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "email": "trainer4@gym.com",
  "password": "Abc123",
  "firstName": "New",
  "lastName": "Trainer",
  "role": "TRAINER"
}
```

#### Delete User (Admin only)
```http
DELETE /api/users/:userId
Authorization: Bearer <jwt-token>
```

### Schedule Management Endpoints

#### Create Schedule (Admin only)
```http
POST /api/schedules
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Morning Yoga",
  "description": "Relaxing yoga session",
  "date": "2025-07-31",
  "startTime": "08:00",
  "endTime": "10:00",
  "trainerId": "cuid-trainer-id"
}
```

#### Get All Schedules
```http
GET /api/schedules
Authorization: Bearer <jwt-token>
```

#### Get Available Schedules
```http
GET /api/schedules/available
Authorization: Bearer <jwt-token>
```

#### Get My Schedules (Trainers only)
```http
GET /api/schedules/my
Authorization: Bearer <jwt-token>
```

#### Get Schedules by Trainer (Admin or Trainer themselves)
```http
GET /api/schedules/trainer/:trainerId
Authorization: Bearer <jwt-token>
```

#### Get Schedule by ID
```http
GET /api/schedules/:id
Authorization: Bearer <jwt-token>
```

#### Update Schedule (Admin only)
```http
PUT /api/schedules/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Morning Yoga",
  "description": "Updated description",
  "date": "2025-07-31",
  "startTime": "09:00",
  "endTime": "11:00"
}
```

#### Delete Schedule (Admin only)
```http
DELETE /api/schedules/:id
Authorization: Bearer <jwt-token>
```

### Booking Management Endpoints

#### Create Booking (Trainees only)
```http
POST /api/bookings
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "scheduleId": "cuid-schedule-id"
}
```

#### Get All Bookings (Admin only)
```http
GET /api/bookings
Authorization: Bearer <jwt-token>
```

#### Get My Bookings (Trainees only)
```http
GET /api/bookings/my
Authorization: Bearer <jwt-token>
```

#### Get My Upcoming Bookings (Trainees only)
```http
GET /api/bookings/my/upcoming
Authorization: Bearer <jwt-token>
```

#### Get My Booking History (Trainees only)
```http
GET /api/bookings/my/history
Authorization: Bearer <jwt-token>
```

#### Get Trainer's Schedule Bookings (Trainers only)
```http
GET /api/bookings/trainer/schedules
Authorization: Bearer <jwt-token>
```

#### Get Specific Trainer's Schedule Bookings (Admin only)
```http
GET /api/bookings/trainer/:trainerId/schedules
Authorization: Bearer <jwt-token>
```

#### Get Bookings by Schedule (Trainer/Admin only)
```http
GET /api/bookings/schedule/:scheduleId
Authorization: Bearer <jwt-token>
```

#### Get Bookings by Trainee (Admin only)
```http
GET /api/bookings/trainee/:traineeId
Authorization: Bearer <jwt-token>
```

#### Get Booking by ID (Booking owner or Admin)
```http
GET /api/bookings/:id
Authorization: Bearer <jwt-token>
```

#### Cancel Booking (Booking owner or Admin)
```http
PUT /api/bookings/:id/cancel
Authorization: Bearer <jwt-token>
```

### System Endpoints

#### Health Check
```http
GET /health
```

## 📁 Project Structure

```
gym-management-system/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database connection
│   │   └── environment.ts       # Environment configuration
│   ├── middleware/
│   │   ├── auth.ts             # Authentication middleware
│   │   ├── error.ts            # Error handling middleware
│   │   └── validation.ts       # Request validation middleware
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.routes.ts
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.routes.ts
│   │   ├── schedules/
│   │   │   ├── schedule.controller.ts
│   │   │   ├── schedule.service.ts
│   │   │   └── schedule.routes.ts
│   │   └── bookings/
│   │       ├── booking.controller.ts
│   │       ├── booking.service.ts
│   │       └── booking.routes.ts
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   ├── auth.ts             # Authentication utilities
│   │   ├── date.ts             # Date utilities
│   │   └── response.ts         # Response utilities
│   └── server.ts               # Application entry point
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 📐 Business Rules

### Class Scheduling Rules
- **Maximum 5 classes per day**: No more than 5 gym classes can be scheduled on any single day
- **2-hour duration**: Each class must be exactly 2 hours long
- **No trainer conflicts**: A trainer cannot be assigned to overlapping time slots
- **Future scheduling only**: Classes can only be scheduled for future dates/times

### Booking Rules
- **Maximum capacity**: Each class can accommodate a maximum of 10 trainees
- **No double booking**: A trainee cannot book the same class twice
- **Future classes only**: Only future classes can be booked
- **Cancellation window**: Bookings can only be cancelled at least 2 hours before the class starts
- **Real-time availability**: Available slots are calculated in real-time

### User Roles & Permissions

#### Admin
- Create and manage trainer accounts
- Create and manage class schedules
- View all bookings and user information
- Full system access

#### Trainer
- View their assigned schedules
- View attendees for their classes
- Manage their profile

#### Trainee
- Register for an account
- Book available classes
- View their bookings and history
- Cancel their bookings (within time limits)
- Manage their profile

## 📊 Database Schema

### User Table
- Stores user information with role-based access
- Passwords are securely hashed using bcrypt
- Supports Admin, Trainer, and Trainee roles

### ClassSchedule Table
- Manages gym class schedules
- Enforces business rules for timing and capacity
- Links to trainers and tracks creation metadata

### Booking Table
- Tracks trainee bookings for classes
- Manages booking status (CONFIRMED, CANCELLED)
- Enforces capacity limits and prevents conflicts

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Prisma ORM with prepared statements
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers and protection
- **Role-based Access**: Granular permission system

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run test coverage
npm run test:coverage
```

## 🚀 Deployment

### Environment Setup
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build the application

### Production Commands
```bash
npm run build
npm run prisma:migrate:prod
npm start
```

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses include additional error details:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error occurred",
  "errorDetails": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using TypeScript, Express.js, Prisma, and PostgreSQL**
