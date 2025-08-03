# 1. Builder Stage: Build the application
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# 2. Production Stage: Create the final, lightweight image
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the built application, prisma schema, and generated client from the builder stage
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/node_modules/.prisma ./node_modules/.prisma

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/server.js"]

