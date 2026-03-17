# Stage 1: Build the React application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for Vite environment variables
ARG VITE_API_KEY
ARG VITE_MAZAD_IP
ARG VITE_DEFAUTLT_AVATAR
ARG VITE_DEFAUTLT_AVATAR_THUMB

# Set environment variables for build
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_MAZAD_IP=$VITE_MAZAD_IP
ENV VITE_DEFAUTLT_AVATAR=$VITE_DEFAUTLT_AVATAR
ENV VITE_DEFAUTLT_AVATAR_THUMB=$VITE_DEFAUTLT_AVATAR_THUMB

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html


# Start nginx
CMD ["nginx", "-g", "daemon off;"]
