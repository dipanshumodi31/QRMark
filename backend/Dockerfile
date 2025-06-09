# Use official Python image as base
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all app source code
COPY . .

# Expose port uvicorn will listen on
EXPOSE 10000

# Command to run the app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "10000"]
