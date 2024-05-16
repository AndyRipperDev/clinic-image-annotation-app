# Use official Node.js image as base
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Set the PORT environment variable
ENV PORT=3001

# Expose port
EXPOSE 3001

# Command to run the server
CMD ["node", "start.js"]
