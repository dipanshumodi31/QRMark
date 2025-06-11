# Use an official Python runtime as a parent image
FROM python:3.11-slim-bookworm

# Set the working directory in the container
WORKDIR /app

# Install system dependencies needed by OpenCV and other libs
# libzbar0 is for pyzbar
RUN apt-get update && apt-get install -y \
    libzbar0 \
    # Add any other system dependencies if needed, e.g., for Pillow (libjpeg-dev, zlib1g-dev)
    # libgl1-mesa-glx # Sometimes needed for headless if OpenCV has a weird dependency
    # libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev # For video if you were doing that
    # libsm6 libxext6 libxrender-dev
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose the port that FastAPI will run on
EXPOSE 8000

# Command to run the application
# Railway typically injects $PORT, so use that
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
# Or, if your Railway start command uses $PORT:
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "$PORT"]
