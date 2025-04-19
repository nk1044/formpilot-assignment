# Use Node.js v20 as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the TypeScript application
RUN npm run build

# Expose the port your app runs on
EXPOSE 8002


CMD ["node", "dist/index.js"]