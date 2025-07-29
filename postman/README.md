# Postman API Testing Guide

This guide explains how to use the Postman collection to test all endpoints in the Gym Management System.

## 📁 Files Included

- `Gym-Management-System.postman_collection.json` - Complete API collection with all endpoints
- `Gym-Management-System.postman_environment.json` - Environment variables for easy testing

## 🚀 Quick Start

### 1. Import Collection and Environment

1. Open Postman
2. Click **Import** button
3. Select both JSON files from the `postman/` directory
4. Choose the **Gym Management System Environment** from the environment dropdown

### 2. Start Your Server

```bash
# Make sure your server is running
npm run dev
```

### 3. Create First Admin (Choose One Method)

**Option A: Using the Collection**
- Run the **"Register Admin (Temporary)"** request in the Authentication folder

**Option B: Using CLI**
```bash
npm run create-admin
```

### 4. Login and Test

- Run the **"Login"** request (it will automatically save the auth token)
- All subsequent requests will use this token automatically

## 📚 Collection Structure

### 🏠 System (2 endpoints)
- **Health Check** - Test if server is running
- **API Root** - Get API information

### 🔐 Authentication (4 endpoints)
- **Register Admin (Temporary)** - Create first admin user
- **Login** - Authenticate and get JWT token
- **Verify Token** - Check if token is valid
- **Logout** - Clear session (client-side)

### 👥 Users (7 endpoints)
- **Register User (Public)** - Create new user account
- **Get Profile** - Get current user profile
- **Update Profile** - Update user information
- **Get All Trainers (Admin)** - List all trainer accounts
- **Get My Trainers (Admin)** - List trainers created by admin
- **Create Trainer (Admin)** - Create new trainer account
- **Delete User (Admin)** - Remove user account

### 📅 Schedules (8 endpoints)
- **Create Schedule (Admin)** - Create new class schedule
- **Get All Schedules** - List all schedules
- **Get Available Schedules** - List schedules with available spots
- **Get My Schedules (Trainer)** - List trainer's schedules
- **Get Schedules by Trainer** - List schedules for specific trainer
- **Get Schedule by ID** - Get specific schedule details
- **Update Schedule (Admin)** - Modify schedule
- **Delete Schedule (Admin)** - Remove schedule

### 📝 Bookings (11 endpoints)
- **Create Booking (Trainee)** - Book a class
- **Get All Bookings (Admin)** - List all bookings
- **Get My Bookings (Trainee)** - List user's bookings
- **Get My Upcoming Bookings (Trainee)** - List future bookings
- **Get My Booking History (Trainee)** - List past bookings
- **Get Trainer Schedule Bookings (Trainer)** - List trainer's class bookings
- **Get Trainer Schedule Bookings by ID (Admin)** - Admin view of trainer bookings
- **Get Bookings by Schedule** - List bookings for specific class
- **Get Bookings by Trainee (Admin)** - Admin view of user's bookings
- **Get Booking by ID** - Get specific booking details
- **Cancel Booking** - Cancel a booking

## 🔧 Environment Variables

The collection uses these variables (automatically managed):

- `baseUrl` - API base URL (default: http://localhost:5000)
- `authToken` - JWT token (auto-saved after login)
- `userId` - Current user ID (auto-saved)
- `scheduleId` - Schedule ID for testing (auto-saved)
- `bookingId` - Booking ID for testing (auto-saved)

## 🎯 Testing Workflows

### Workflow 1: Admin Setup and Management

1. **Register Admin (Temporary)** - Create admin account
2. **Login** - Get admin token
3. **Create Trainer (Admin)** - Add trainer accounts
4. **Get All Trainers (Admin)** - Verify trainers created
5. **Create Schedule (Admin)** - Add class schedules

### Workflow 2: Trainer Operations

1. **Login** (as trainer) - Get trainer token
2. **Get Profile** - View trainer profile
3. **Get My Schedules (Trainer)** - View assigned schedules
4. **Get Trainer Schedule Bookings (Trainer)** - View class bookings

### Workflow 3: Trainee Booking Flow

1. **Register User (Public)** - Create trainee account
2. **Login** (as trainee) - Get trainee token
3. **Get Available Schedules** - Browse available classes
4. **Create Booking (Trainee)** - Book a class
5. **Get My Upcoming Bookings (Trainee)** - View bookings
6. **Cancel Booking** - Cancel if needed

### Workflow 4: Complete Testing Flow

1. **Health Check** - Verify server
2. **Register Admin (Temporary)** - Setup admin
3. **Login** (admin) - Get admin access
4. **Create Trainer (Admin)** - Add trainer
5. **Create Schedule (Admin)** - Add class
6. **Register User (Public)** - Add trainee
7. **Login** (trainee) - Switch to trainee
8. **Create Booking (Trainee)** - Book the class
9. **Get Bookings by Schedule** - Verify booking

## 🛡️ Security Testing

### Authentication Tests
- Try accessing protected endpoints without token
- Test with invalid/expired tokens
- Verify role-based access control

### Authorization Tests
- Test admin-only endpoints as trainer/trainee
- Test trainer-only endpoints as trainee
- Verify users can only access their own data

## 📊 Response Formats

All responses follow this structure:
```json
{
  \"success\": true,
  \"statusCode\": 200,
  \"message\": \"Operation successful\",
  \"data\": { /* response data */ }
}
```

Error responses:
```json
{
  \"success\": false,
  \"statusCode\": 400,
  \"message\": \"Error description\",
  \"errors\": [ /* validation errors */ ]
}
```

## 🔍 Common Test Scenarios

### Data Validation Tests
- Send requests with missing required fields
- Test with invalid email formats
- Test with passwords that are too short
- Test with invalid date/time formats

### Business Rule Tests
- Try booking more than 10 trainees per class
- Try creating more than 5 classes per day
- Test class duration limits (2 hours max)
- Test booking past classes

### Edge Cases
- Test with very long strings
- Test with special characters
- Test concurrent bookings
- Test duplicate registrations

## 🚨 Troubleshooting

### Common Issues

**401 Unauthorized**
- Make sure you're logged in and token is saved
- Check if token has expired (re-login)

**403 Forbidden**
- Verify you have the right role for the endpoint
- Admin-only endpoints require admin login

**404 Not Found**
- Check if the resource ID exists
- Verify the endpoint URL is correct

**422 Validation Error**
- Check required fields in request body
- Verify data formats (dates, emails, etc.)

### Token Management
- Tokens are automatically saved after successful login
- If having auth issues, try logging in again
- Check the Authorization header in request details

## 💡 Tips for Effective Testing

1. **Use Collection Runner** - Run entire workflows automatically
2. **Write Tests** - Add assertions to verify responses
3. **Monitor Network** - Check request/response details
4. **Use Console** - Debug with console.log in test scripts
5. **Save Examples** - Save successful responses as examples

## 🔗 Next Steps

After testing with Postman:
1. Remove the temporary admin registration endpoint
2. Implement rate limiting
3. Add API documentation
4. Set up automated testing
5. Deploy to production environment

Happy testing! 🎉
