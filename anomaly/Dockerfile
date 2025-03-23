# Use a specific Python version base image
FROM python:3.9-slim

# Set a working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the anomaly detection script into the container
COPY anomaly_cleaner.py .

# Command to run the anomaly detection script
CMD ["python", "anomaly_cleaner.py"]
