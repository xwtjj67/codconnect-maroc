FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY server/package.json server/package-lock.json ./server/

# Install frontend dependencies
RUN npm ci --production=false

# Install backend dependencies
RUN cd server && npm ci --production

# Copy all source
COPY . .

# Build frontend
RUN npm run build

# Create uploads directory
RUN mkdir -p /app/server/uploads/products

# Expose backend port
EXPOSE 3001

# Start backend
WORKDIR /app/server
CMD ["node", "server.js"]
