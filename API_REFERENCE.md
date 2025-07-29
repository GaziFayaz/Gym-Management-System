# API Endpoints Quick Reference

## 🏠 System Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Health check | None |
| GET | `/` | API information | None |

## 🔐 Authentication Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register-admin` | Create first admin (temporary) | None |
| POST | `/api/auth/login` | User login | None |
| POST | `/api/auth/verify-token` | Verify JWT token | Bearer |
| POST | `/api/auth/logout` | User logout | Bearer |

## 👥 User Endpoints
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/users/register` | Register new user | None | Public |
| GET | `/api/users/profile` | Get user profile | Bearer | Any |
| PUT | `/api/users/profile` | Update user profile | Bearer | Any |
| GET | `/api/users/trainers` | Get all trainers | Bearer | Admin |
| GET | `/api/users/my-trainers` | Get admin's trainers | Bearer | Admin |
| POST | `/api/users/trainers` | Create trainer | Bearer | Admin |
| DELETE | `/api/users/:userId` | Delete user | Bearer | Admin |

## 📅 Schedule Endpoints
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/schedules` | Create schedule | Bearer | Admin |
| GET | `/api/schedules` | Get all schedules | Bearer | Any |
| GET | `/api/schedules/available` | Get available schedules | Bearer | Any |
| GET | `/api/schedules/my` | Get my schedules | Bearer | Trainer |
| GET | `/api/schedules/trainer/:trainerId` | Get schedules by trainer | Bearer | Admin/Trainer |
| GET | `/api/schedules/:id` | Get schedule by ID | Bearer | Any |
| PUT | `/api/schedules/:id` | Update schedule | Bearer | Admin |
| DELETE | `/api/schedules/:id` | Delete schedule | Bearer | Admin |

## 📝 Booking Endpoints
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/api/bookings` | Create booking | Bearer | Trainee |
| GET | `/api/bookings` | Get all bookings | Bearer | Admin |
| GET | `/api/bookings/my` | Get my bookings | Bearer | Trainee |
| GET | `/api/bookings/my/upcoming` | Get my upcoming bookings | Bearer | Trainee |
| GET | `/api/bookings/my/history` | Get my booking history | Bearer | Trainee |
| GET | `/api/bookings/trainer/schedules` | Get trainer schedule bookings | Bearer | Trainer |
| GET | `/api/bookings/trainer/:trainerId/schedules` | Get trainer bookings (admin) | Bearer | Admin |
| GET | `/api/bookings/schedule/:scheduleId` | Get bookings by schedule | Bearer | Trainer/Admin |
| GET | `/api/bookings/trainee/:traineeId` | Get bookings by trainee | Bearer | Admin |
| GET | `/api/bookings/:id` | Get booking by ID | Bearer | Owner/Admin |
| PUT | `/api/bookings/:id/cancel` | Cancel booking | Bearer | Owner/Admin |

## 🔑 Authentication Types
- **None**: No authentication required
- **Bearer**: JWT token required in Authorization header
- **Bearer + Role**: JWT token + specific role required

## 📱 HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (no/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate data)
- **422**: Unprocessable Entity (validation failed)
- **500**: Internal Server Error

## 🎯 Role Permissions
- **Admin**: Full access to all endpoints
- **Trainer**: Can view own schedules and bookings
- **Trainee**: Can book classes and view own bookings
- **Public**: Can register and login only

## 📊 Total Endpoints: 32
- System: 2
- Authentication: 4  
- Users: 7
- Schedules: 8
- Bookings: 11
