# Use official Node.js image as base
FROM node:latest as builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Build the React app
RUN npm run build

# Use Nginx as production server
FROM nginx:alpine

# Copy build files to Nginx public folder
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
