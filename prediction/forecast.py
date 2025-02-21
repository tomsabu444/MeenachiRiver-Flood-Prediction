import pandas as pd
from prophet import Prophet
from pymongo import MongoClient
from datetime import datetime, timedelta
import os
import sys

# --- Configuration ---
MONGODB_URL = os.environ.get("MONGODB_URL")
if not MONGODB_URL:
    print("Error: MONGODB_URL environment variable is not set.")
    sys.exit(1)

DB_NAME = "iot-data"  # Database name
NODE_ID = "kidangoor-004"  # Change this to the node ID you want to forecast

# --- Connect to MongoDB ---
client = MongoClient(MONGODB_URL)
db = client[DB_NAME]
node_data_collection = db['iotnodedatas']  # Ensure this matches your collection name
forecast_collection = db['predicted-datas']  # Collection to store forecast results

# --- Fetch Historical Data ---
# Fetch data from the last 30 days
start_date = datetime.utcnow() - timedelta(days=30)
cursor = node_data_collection.find({
    "nodeId": NODE_ID,
    "timestamp": {"$gte": start_date}
}).sort("timestamp", 1)

data = list(cursor)

if not data:
    print("No data found in the last 30 days. Fetching all available data...")
    cursor = node_data_collection.find({"nodeId": NODE_ID}).sort("timestamp", 1)
    data = list(cursor)
    if not data:
        print("No historical data found for forecasting.")
        print("Debug Info: Check if data exists in MongoDB")
        sys.exit(0)

# --- Prepare Data for Prophet ---
df = pd.DataFrame(data)
df['timestamp'] = pd.to_datetime(df['timestamp'])

# Ensure correct columns for Prophet
df = df.rename(columns={'timestamp': 'ds', 'waterLevel': 'y'})
df = df[['ds', 'y']]

# --- Fit Prophet Model ---
model = Prophet()
model.fit(df)

# --- Create Future DataFrame with 30-minute intervals ---
# Forecasting for the next 6 hours (12 intervals of 30 minutes each)
future = model.make_future_dataframe(periods=12, freq='30min')
forecast = model.predict(future)

# --- Filter Forecast for the Next 6 Hours ---
last_date = df['ds'].max()
forecast_future = forecast[forecast['ds'] > last_date]

# --- Delete Old Predictions for the Same Time Window ---
forecast_collection.delete_many({
    "nodeId": NODE_ID,
    "timestamp": {"$gt": last_date}  # Remove predictions beyond the latest real data timestamp
})

# --- Save New Forecast to MongoDB ---
for _, row in forecast_future.iterrows():
    record = {
        "nodeId": NODE_ID,
        "timestamp": row['ds'],
        "predictedWaterLevel": row['yhat'],
    }
    forecast_collection.replace_one(
        {"nodeId": NODE_ID, "timestamp": row['ds']},  # Ensure old entry is replaced
        record,
        upsert=True
    )

print("Forecast data updated successfully.")
