# Use Node.js 18 as base image
FROM node:18-slim

# Install Python and required system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install Node.js dependencies
COPY package.json ./
RUN yarn install

# Copy frontend directory and build
COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build

# Copy backend directory and install Python dependencies
COPY backend/ ./backend/
RUN cd backend && pip3 install --break-system-packages -r requirements.txt

# Expose port
EXPOSE $PORT

# Start the backend server
CMD ["sh", "-c", "cd backend && python3 -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]