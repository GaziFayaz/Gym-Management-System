# Gym Management System - Database Relational Diagram

## Entity Relationship Diagram

```
┌─────────────────────────────────────┐
│                USER                 │
├─────────────────────────────────────┤
│ id          : String (PK, CUID)     │
│ email       : String (Unique)       │
│ password    : String                │
│ firstName   : String                │
│ lastName    : String                │
│ role        : Role (ADMIN/TRAINER/  │
│               TRAINEE)              │
│ adminId     : String? (FK)          │
│ createdAt   : DateTime              │
│ updatedAt   : DateTime              │
└─────────────────────────────────────┘
         │                    │
         │ 1:N                │ 1:N
         │ (AdminTrainer)     │ (TrainerSchedule)
         ▼                    ▼
┌─────────────────────────────────────┐
│           CLASS_SCHEDULE            │
├─────────────────────────────────────┤
│ id          : String (PK, CUID)     │
│ title       : String                │
│ description : String?               │
│ date        : DateTime              │
│ startTime   : DateTime              │
│ endTime     : DateTime              │
│ maxTrainees : Int (Default: 10)     │
│ trainerId   : String (FK)           │
│ createdBy   : String                │
│ createdAt   : DateTime              │
│ updatedAt   : DateTime              │
└─────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
         ┌─────────────────────────────────────┐
         │              BOOKING                │
         ├─────────────────────────────────────┤
         │ id         : String (PK, CUID)      │
         │ traineeId  : String (FK)            │
         │ scheduleId : String (FK)            │
         │ status     : BookingStatus          │
         │            (CONFIRMED/CANCELLED)    │
         │ bookedAt   : DateTime               │
         │ updatedAt  : DateTime               │
         └─────────────────────────────────────┘
                    ▲
                    │ N:1
                    │
         ┌─────────────────────────────────────┐
         │         USER (TRAINEE)              │
         │     (Role = TRAINEE)                │
         └─────────────────────────────────────┘
```

## Key Relationships

### 1. Admin ← → Trainer (1:N)
- **Description**: An Admin can create and manage multiple Trainers
- **Implementation**: `adminId` field in User table (self-referencing)
- **Business Rule**: Only ADMIN role users can create TRAINER role users

### 2. Trainer ← → ClassSchedule (1:N)
- **Description**: A Trainer can be assigned to multiple Class Schedules
- **Implementation**: `trainerId` field in ClassSchedule table
- **Business Rule**: Only ADMIN can assign trainers to schedules

### 3. ClassSchedule ← → Booking (1:N)
- **Description**: A Class Schedule can have multiple Bookings (max 10)
- **Implementation**: `scheduleId` field in Booking table
- **Business Rule**: Maximum 10 trainees per schedule

### 4. Trainee ← → Booking (1:N)
- **Description**: A Trainee can make multiple Bookings
- **Implementation**: `traineeId` field in Booking table
- **Business Rule**: Trainee cannot book overlapping time slots

## Business Rules Implementation

### Role-Based Access Control
```
ADMIN:
- Create/manage trainers
- Create/update/delete class schedules
- Assign trainers to schedules
- View all bookings

TRAINER:
- View assigned class schedules
- View attendees for their classes
- Cannot create schedules or manage users

TRAINEE:
- Create/manage own profile
- Book available class schedules
- Cancel own bookings
- View own booking history
```

### Scheduling Constraints
```
- Maximum 5 schedules per day
- Each schedule is 2 hours long
- Maximum 10 trainees per schedule
- No overlapping bookings for same trainee
```

### Data Integrity
```
- Unique email addresses
- Unique booking per trainee per schedule
- Cascade relationships maintained
- Audit trails with timestamps
```

## Indexes for Performance
```sql
-- User table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_admin_id ON users(admin_id);

-- Class Schedule table
CREATE INDEX idx_schedules_trainer_id ON class_schedules(trainer_id);
CREATE INDEX idx_schedules_date ON class_schedules(date);
CREATE INDEX idx_schedules_start_time ON class_schedules(start_time);

-- Booking table
CREATE INDEX idx_bookings_trainee_id ON bookings(trainee_id);
CREATE INDEX idx_bookings_schedule_id ON bookings(schedule_id);
CREATE INDEX idx_bookings_status ON bookings(status);
```
