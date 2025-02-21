# Use a specific Python version base image
FROM python:3.9-slim

# Set a working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the forecasting script into the container
COPY forecast.py .

# Optionally, copy other files if needed (e.g., configuration files)

# Command to run the forecasting script
CMD ["python", "forecast.py"]
