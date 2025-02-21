import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor
import requests
from datetime import datetime, timedelta
import os
import json
import sys
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class WaterLevelPredictor:
    def __init__(self, sequence_length=12):
        """
        Initialize the WaterLevelPredictor with the given sequence length.
        
        Args:
            sequence_length (int): Number of time steps to use for prediction
        """
        self.sequence_length = sequence_length
        self.water_scaler = MinMaxScaler()
        self.weather_scaler = MinMaxScaler()
        self.model = RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            n_jobs=-1  # Use all available CPU cores
        )
        self.location = {
            'name': 'Kidangoor',
            'lat': 9.6489,
            'lon': 76.6221
        }
        
        # Set up file paths
        self.data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        self.historic_file = os.path.join(self.data_dir, 'Historic.csv')
        self.current_file = os.path.join(self.data_dir, 'current.csv')
        self.prediction_file = os.path.join(self.data_dir, 'predictions.json')

    def get_weather_forecast(self, api_key):
        """
        Fetch weather forecast from WeatherAPI.com
        
        Args:
            api_key (str): API key for WeatherAPI.com
            
        Returns:
            pandas.DataFrame: Weather forecast data
        """
        base_url = "http://api.weatherapi.com/v1/forecast.json"
        location = f"{self.location['lat']},{self.location['lon']}"
        
        params = {
            'key': api_key,
            'q': location,
            'days': 1,
            'aqi': 'no'
        }
        
        try:
            response = requests.get(base_url, params=params, timeout=10)
            response.raise_for_status()  # Raise exception for bad status codes
            data = response.json()
            
            forecasts = []
            for hour in data['forecast']['forecastday'][0]['hour']:
                forecast = {
                    'timestamp': hour['time'],
                    'temp': hour['temp_c'],
                    'humidity': hour['humidity'],
                    'wind_speed': hour['wind_kph'],
                    'clouds_all': hour['cloud'],
                    'precip_mm': hour['precip_mm']
                }
                forecasts.append(forecast)
            
            df = pd.DataFrame(forecasts)
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            return df
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching weather forecast: {str(e)}")
            return None

    def load_current_water_level(self, file_path):
        """
        Load current water level data from CSV file
        
        Args:
            file_path (str): Path to the CSV file
            
        Returns:
            pandas.DataFrame: Water level data
        """
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"Water level data file not found: {file_path}")
                
            df = pd.read_csv(file_path)
            required_columns = ['Date and Time', 'Water Lev']
            
            if not all(col in df.columns for col in required_columns):
                raise ValueError(f"Missing required columns. Expected: {required_columns}")

            # Clean and prepare the data
            df = df.rename(columns={'Water Lev': 'Water Level'})
            df['Date and Time'] = pd.to_datetime(df['Date and Time'], format='%d-%m-%Y %H:%M')
            
            # Remove any duplicate timestamps
            df = df.drop_duplicates(subset=['Date and Time'])
            
            # Sort by timestamp and get the most recent records
            return df.sort_values('Date and Time').tail(self.sequence_length)
            
        except Exception as e:
            logger.error(f"Error loading current water level: {str(e)}")
            return None

    def prepare_features(self, water_levels, weather_data):
        """
        Prepare features for the model by combining weather and water level data
        
        Args:
            water_levels (numpy.ndarray): Array of water level values
            weather_data (pandas.DataFrame): Weather forecast data
            
        Returns:
            tuple: (X, y) feature matrix and target values
        """
        try:
            # Scale weather features
            weather_features = weather_data[['temp', 'humidity', 'wind_speed', 'clouds_all']].values
            scaled_weather = self.weather_scaler.fit_transform(weather_features)
            
            # Scale water levels
            scaled_water = self.water_scaler.fit_transform(water_levels.reshape(-1, 1))
            
            # Create sequences
            X = []
            y = []
            
            for i in range(len(scaled_water) - self.sequence_length):
                sequence = np.column_stack((
                    scaled_weather[i:i + self.sequence_length],
                    scaled_water[i:i + self.sequence_length]
                ))
                X.append(sequence.flatten())
                y.append(scaled_water[i + self.sequence_length])
                
            return np.array(X), np.array(y)
            
        except Exception as e:
            logger.error(f"Error preparing features: {str(e)}")
            return None, None

    def train_model(self, historical_data_path):
        """
        Train the model using historical data
        
        Args:
            historical_data_path (str): Path to historical data CSV file
        """
        try:
            if not os.path.exists(historical_data_path):
                raise FileNotFoundError(f"Historical data file not found: {historical_data_path}")
                
            logger.info("Loading historical data...")
            df = pd.read_csv(historical_data_path)
            df['Date and Time'] = pd.to_datetime(df['Date and Time'])
            
            # Extract and validate features
            required_columns = ['temp', 'humidity', 'wind_speed', 'clouds_all', 'Water Level']
            if not all(col in df.columns for col in required_columns):
                raise ValueError(f"Missing required columns in historical data: {required_columns}")
            
            weather_features = df[['temp', 'humidity', 'wind_speed', 'clouds_all']].values
            water_levels = df['Water Level'].values
            
            # Prepare sequences for training
            logger.info("Preparing training data...")
            X, y = self.prepare_features(
                water_levels,
                pd.DataFrame(weather_features, columns=['temp', 'humidity', 'wind_speed', 'clouds_all'])
            )
            
            if X is None or y is None:
                raise ValueError("Failed to prepare training features")
            
            # Train model
            logger.info("Training model...")
            self.model.fit(X, y)
            logger.info("Model training completed")
            
        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            raise

    def predict_next_hours(self, current_water_path, api_key, hours=6):
        """
        Predict water levels for the next specified hours
        
        Args:
            current_water_path (str): Path to current water level data
            api_key (str): Weather API key
            hours (int): Number of hours to predict
            
        Returns:
            tuple: (predictions, timestamps) or (None, None) if prediction fails
        """
        try:
            # Load current water level data
            current_data = self.load_current_water_level(current_water_path)
            if current_data is None:
                raise ValueError("Failed to load current water level data")
            
            # Get weather forecast
            weather_forecast = self.get_weather_forecast(api_key)
            if weather_forecast is None:
                raise ValueError("Failed to get weather forecast")
            
            # Prepare data for prediction
            current_water_levels = current_data['Water Level'].values
            
            # Handle insufficient data
            if len(current_water_levels) < self.sequence_length:
                logger.warning(f"Insufficient data: Expected {self.sequence_length}, got {len(current_water_levels)}")
                padding = np.zeros(self.sequence_length - len(current_water_levels))
                current_water_levels = np.concatenate((padding, current_water_levels))
            
            # Scale the data
            weather_features = weather_forecast[['temp', 'humidity', 'wind_speed', 'clouds_all']].values
            scaled_weather = self.weather_scaler.fit_transform(weather_features)
            scaled_water = self.water_scaler.fit_transform(current_water_levels.reshape(-1, 1))
            
            # Create prediction sequence
            sequence = np.column_stack((
                scaled_weather[:self.sequence_length],
                scaled_water
            )).flatten().reshape(1, -1)
            
            # Make prediction
            scaled_prediction = self.model.predict(sequence)
            predictions = self.water_scaler.inverse_transform(scaled_prediction.reshape(-1, 1))
            
            # Generate future timestamps
            last_timestamp = current_data['Date and Time'].iloc[-1]
            future_timestamps = [last_timestamp + timedelta(hours=i) for i in range(1, hours+1)]
            
            return predictions, future_timestamps
            
        except Exception as e:
            logger.error(f"Error making predictions: {str(e)}")
            return None, None

    def save_predictions(self, predictions, timestamps):
        """
        Save predictions to a JSON file
        
        Args:
            predictions (numpy.ndarray): Predicted water levels
            timestamps (list): List of prediction timestamps
            
        Returns:
            dict: Prediction data
        """
        try:
            prediction_data = {
                'predictions': [
                    {
                        'timestamp': ts.strftime('%Y-%m-%d %H:%M:%S'),
                        'water_level': float(level[0]),
                        'confidence': float(self.model.predict_proba(level.reshape(1, -1))[0][0])
                        if hasattr(self.model, 'predict_proba') else None
                    }
                    for ts, level in zip(timestamps, predictions)
                ],
                'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'model_info': {
                    'sequence_length': self.sequence_length,
                    'location': self.location
                }
            }
            
            with open(self.prediction_file, 'w') as f:
                json.dump(prediction_data, f, indent=2)
            
            return prediction_data
            
        except Exception as e:
            logger.error(f"Error saving predictions: {str(e)}")
            return None

def main():
    """Main function to run the prediction model"""
    try:
        # Get API key from command line or environment
        api_key = "d9250169ed6c4eed995162953251601"
        
        if not api_key:
            raise ValueError("No Weather API key provided")
        
        logger.info("Initializing Water Level Predictor...")
        predictor = WaterLevelPredictor()
        
        logger.info("Training model with historical data...")
        predictor.train_model(predictor.historic_file)
        
        logger.info("Making predictions...")
        predictions, timestamps = predictor.predict_next_hours(
            predictor.current_file, 
            api_key
        )
        
        if predictions is not None and timestamps is not None:
            logger.info("Saving predictions...")
            prediction_data = predictor.save_predictions(predictions, timestamps)
            if prediction_data:
                print(json.dumps(prediction_data))
                sys.exit(0)
            else:
                raise ValueError("Failed to save predictions")
        else:
            raise ValueError("Prediction failed")
            
    except Exception as e:
        error_data = {
            'error': str(e),
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        print(json.dumps(error_data), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()