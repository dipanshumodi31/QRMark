FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libgl1-mesa-glx \
    libzbar0 \
 && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy source code
COPY . /app

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expose port (optional, but good practice)
EXPOSE 10000

# Start FastAPI app with uvicorn
CMD ["uvicorn", "app:app", "--host=0.0.0.0", "--port=10000"]
