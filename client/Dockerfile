# Build stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start Vite dev server with host flag
CMD ["npm", "run", "dev", "--", "--host"]