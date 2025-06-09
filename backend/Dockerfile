FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libgl1-mesa-glx \
    libzbar0 \
 && rm -rf /var/lib/apt/lists/*

# Your usual setup, like copying code, installing requirements, etc.
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt

CMD ["uvicorn", "app:app", "--host=0.0.0.0", "--port=10000"]
