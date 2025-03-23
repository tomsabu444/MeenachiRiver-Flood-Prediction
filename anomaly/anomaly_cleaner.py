import pandas as pd
import statistics
from pymongo import MongoClient , UpdateOne
import os
import sys

# --- Configuration ---
MONGODB_URL = os.environ.get("MONGODB_URL")
if not MONGODB_URL:
    print("Error: MONGODB_URL environment variable is not set.")
    sys.exit(1)

DB_NAME = "iot-data"
NODES = ["poonjar-003"]  # Add node IDs you want to process
MIN_READINGS_AFTER_ANOMALY = 5
SURROUNDING_COUNT = 10  # Number of neighboring values for median calculation

# --- Connect to MongoDB ---
print("Connecting to MongoDB...")
client = MongoClient(MONGODB_URL)
db = client[DB_NAME]
collection = db["iotnodedatas"]


# --- Fetch Historical Data ---
start_date = pd.Timestamp.utcnow() - pd.Timedelta(days=30)
query = {"nodeId": {"$in": NODES}, "timestamp": {"$gte": start_date}}
cursor = collection.find(query).sort("timestamp", 1)
data = list(cursor)

if not data:
    print("No historical data found.")
    sys.exit(0)

print(f"Fetched {len(data)} records from MongoDB.")

# --- Convert Data to DataFrame ---
df = pd.DataFrame(data)
df["timestamp"] = pd.to_datetime(df["timestamp"])

# --- Function to Clean Anomalies ---
def clean_water_level_data(df, node_id):
    print(f"Processing node: {node_id}")
    
    node_df = df[df["nodeId"] == node_id].copy()
    node_df = node_df.sort_values(by="timestamp").reset_index(drop=True)
    
    last_anomaly_found = False
    readings_since_last_anomaly = 0
    updates = []  # Batch updates list

    for i in range(len(node_df)):
        start_idx = max(0, i - SURROUNDING_COUNT)
        end_idx = min(len(node_df), i + SURROUNDING_COUNT + 1)

        surrounding_values = node_df.loc[start_idx:i, "waterLevel"].tolist() + \
                             node_df.loc[i+1:end_idx, "waterLevel"].tolist()

        if len(surrounding_values) < SURROUNDING_COUNT * 2:
            continue

        median = statistics.median(surrounding_values)
        current_value = node_df.loc[i, "waterLevel"]
        deviation_percent = abs((current_value - median) / median * 100)
        is_anomaly = deviation_percent > 50

        if is_anomaly:
            print(f"Anomaly detected at {node_df.loc[i, 'timestamp']} (Node: {node_id})")
            node_df.loc[i, "original_value"] = node_df.loc[i, "waterLevel"]
            node_df.loc[i, "waterLevel"] = median
            node_df.loc[i, "cleaned"] = True
            last_anomaly_found = True
            readings_since_last_anomaly = 0
        else:
            if last_anomaly_found:
                readings_since_last_anomaly += 1
                if readings_since_last_anomaly >= MIN_READINGS_AFTER_ANOMALY:
                    last_anomaly_found = False
                    readings_since_last_anomaly = 0

        updates.append({
            "filter": {"nodeId": node_id, "timestamp": node_df.loc[i, "timestamp"]},
            "update": {
                "$set": {
                    "waterLevel": node_df.loc[i, "waterLevel"],
                    "original_value": node_df.loc[i, "original_value"] if "original_value" in node_df else node_df.loc[i, "waterLevel"],
                    "cleaned": node_df.loc[i, "cleaned"] if "cleaned" in node_df else False
                }
            }
        })

    return updates

# --- Clean Data for Each Node and Batch Update MongoDB ---
for node_id in NODES:
    update_operations = clean_water_level_data(df, node_id)

    if update_operations:
        print(f"Updating {len(update_operations)} records in MongoDB for node {node_id}...")
        collection.bulk_write([UpdateOne(op["filter"], op["update"], upsert=True) for op in update_operations])
    else:
        print(f"No updates needed for node {node_id}.")

print("Anomaly cleaning completed for all nodes.")
