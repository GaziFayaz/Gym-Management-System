# Gym Management System - Docker Guide

This comprehensive guide explains the Docker configuration for the Gym Management System and provides step-by-step instructions for new developers to get up and running.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Docker Configuration Overview](#docker-configuration-overview)
3. [Getting Started](#getting-started)
4. [Development Workflow](#development-workflow)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Topics](#advanced-topics)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- Git
- A code editor (VS Code recommended)

**Verify your installation:**
```bash
docker --version
docker-compose --version
```

## Docker Configuration Overview

Our project uses a sophisticated Docker setup with multiple files, each serving a specific purpose:

### File Structure
```
├── Dockerfile                    # Multi-stage build configuration
├── docker-compose.yml           # Base services configuration
├── docker-compose.override.yml  # Development-specific overrides
└── .dockerignore                # Files to exclude from build context
```

### 1. Dockerfile (Multi-Stage Build)

Our `Dockerfile` uses a **multi-stage build** approach for optimal security and performance:

**Stage 1: Builder (`base`)**
- Installs all dependencies (including devDependencies)
- Copies source code
- Generates Prisma Client
- Compiles TypeScript to JavaScript

**Stage 2: Production (`production`)**
- Creates a lean runtime image
- Installs only production dependencies
- Copies compiled code from the builder stage
- Final image size is significantly smaller

### 2. docker-compose.yml (Base Configuration)

Defines the core services:
- **`app`**: Your Express.js application
- **`db`**: PostgreSQL database (optional, uses profiles)

### 3. docker-compose.override.yml (Development Magic)

This file automatically merges with the base configuration and provides:
- Live code reloading through bind mounts
- Development command override (`npm run start:dev`)
- Real-time file synchronization

### 4. .dockerignore (Security & Performance)

Prevents sensitive files from being copied into the Docker image:
- `.env` files (security)
- `node_modules` (performance)
- Build artifacts

## Getting Started

### Step 1: Clone and Setup

```bash
git clone <repository-url>
cd gym-management-system
```

### Step 2: Environment Configuration

Create a `.env` file in the project root. You have two options:

**Option A: Using Remote Database (Recommended for personal development)**
```env
# Your existing remote database credentials
DATABASE_URL="postgresql://your-remote-db-connection-string"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
BCRYPT_SALT_ROUNDS=12
API_VERSION="v1"
```

**Option B: Using Local Database**
```env
# Point to the local PostgreSQL container
DATABASE_URL="postgresql://user:password@db:5432/gymdb"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
BCRYPT_SALT_ROUNDS=12
API_VERSION="v1"
```

### Step 3: Start Development Environment

**For development with remote database (saves PC resources):**
```bash
docker-compose up --build
```

**For development with local database:**
```bash
docker-compose up --build --profile postgres
```

🎉 **Your application is now running at `http://localhost:5000`**

## Development Workflow

### Real-Time Development

Thanks to our bind mounts configuration, you get instant feedback:

1. **Edit any file** in the `src` directory
2. **Save the file** - changes are immediately reflected in the container
3. **The server automatically restarts** (via nodemon)
4. **Test your changes** at `http://localhost:5000`

### Installing New Dependencies

When you need to add a new npm package:

1. **Install inside the running container:**
   ```bash
   docker-compose exec app npm install <package-name>
   ```

2. **Rebuild the image** to persist the change:
   ```bash
   # Stop containers (Ctrl+C), then:
   docker-compose up --build
   ```

**Example: Adding Zod for validation**
```bash
docker-compose exec app npm install zod
docker-compose up --build
```

### Database Operations

**Run Prisma migrations:**
```bash
docker-compose exec app npx prisma migrate dev
```

**Generate Prisma Client:**
```bash
docker-compose exec app npx prisma generate
```

**Open Prisma Studio:**
```bash
docker-compose exec app npx prisma studio
```

### Viewing Logs

**All services:**
```bash
docker-compose logs -f
```

**Specific service:**
```bash
docker-compose logs -f app
```

## Production Deployment

### Building Production Image

For production, we want to use only the base `docker-compose.yml` (without development overrides):

```bash
docker-compose -f docker-compose.yml up --build
```

This ensures:
- No bind mounts (code is baked into the image)
- Production command (`node dist/server.js`)
- Optimized runtime environment

### Environment Variables in Production

**Never** build environment variables into the image. Instead, provide them at runtime:

```bash
docker run -p 5000:5000 \
  -e DATABASE_URL="your_production_db_url" \
  -e JWT_SECRET="your_production_secret" \
  -e NODE_ENV="production" \
  gym-management-system
```

## Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux

# Stop existing containers
docker-compose down
```

**2. Database Connection Issues**
- Verify your `DATABASE_URL` in `.env`
- For local database, ensure you're using `--profile postgres`
- Check that the database container is running: `docker-compose ps`

**3. Permission Issues (Linux/macOS)**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

**4. Build Failures**
```bash
# Clean build (removes cached layers)
docker-compose build --no-cache

# Remove all containers and volumes
docker-compose down -v
```

### Useful Commands

**View running containers:**
```bash
docker-compose ps
```

**Access container shell:**
```bash
docker-compose exec app sh
```

**Remove everything and start fresh:**
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Advanced Topics

### Understanding Profiles

We use Docker Compose profiles to conditionally start services:

- **Default**: Only starts the `app` service
- **`postgres` profile**: Also starts the local database

This allows developers to choose their preferred setup without wasting resources.

### Multi-Stage Build Benefits

1. **Security**: Final image doesn't contain source code or build tools
2. **Size**: Production image is ~60% smaller
3. **Speed**: Faster deployments and container starts
4. **Consistency**: Same build process for all environments

### File Bind Mounts Explained

In development, we mount these directories:
- `./src:/app/src` - Source code for live reloading
- `./prisma:/app/prisma` - Schema changes
- `./package.json:/app/package.json` - Dependency management
- `./package-lock.json:/app/package-lock.json` - Lock file sync

### Why Not Mount Everything?

We deliberately don't mount config files like `tsconfig.json` because:
- They change infrequently
- Mounting them adds complexity
- Better to rebuild when they change (ensures consistency)

## Best Practices

1. **Always use `.dockerignore`** to exclude sensitive files
2. **Never commit `.env` files** to version control
3. **Rebuild after adding dependencies** to ensure consistency
4. **Use profiles** to avoid running unnecessary services
5. **Provide environment variables at runtime** in production

## Team Collaboration

When a new developer joins:

1. **They clone the repo**
2. **Install Docker Desktop**
3. **Create their `.env` file**
4. **Run `docker-compose up --build`**
5. **Start coding immediately**

No need to install Node.js, PostgreSQL, or manage versions!

---

## Quick Reference

### Start Development
```bash
docker-compose up --build
```

### Add Package
```bash
docker-compose exec app npm install <package>
docker-compose up --build
```

### Database Migration
```bash
docker-compose exec app npx prisma migrate dev
```

### Production Build
```bash
docker-compose -f docker-compose.yml up --build
```

### Clean Reset
```bash
docker-compose down -v
docker system prune -a
```

---

*This guide covers the complete Docker workflow for the Gym Management System. For questions or issues, refer to the troubleshooting section or consult the team.*