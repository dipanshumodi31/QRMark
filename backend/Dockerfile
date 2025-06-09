FROM python:3.11-slim

# Install libgl needed by OpenCV
RUN apt-get update && apt-get install -y libgl1-mesa-glx

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your app code
COPY . .

# Command to run your app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "10000"]
