FROM mcr.microsoft.com/playwright:v1.57.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy server code
COPY playwright-runtime.js ./

# Expose port
EXPOSE 8080

# Set environment
ENV NODE_ENV=production

# Start server
CMD ["node", "playwright-runtime.js"]
