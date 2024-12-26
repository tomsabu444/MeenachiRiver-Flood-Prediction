# Automated Water Level Monitoring and Flood Prediction System for Meenachil River

The Automated River Monitoring and Flood Prediction System for the Meenachil River is a solution designed to continuously monitor water levels and predict potential flood events in real-time. This system aims to mitigate the risks of flooding by providing early warnings, enabling timely action to protect communities living along the river. The system integrates IoT sensors, machine learning models and web technologies to deliver accurate real-time predictions.

The project is splited into two parts:

Water Level Monitoring

Flood Prediction


# Features

# Real-time water level monitoring 
By using IoT devices deployed at multiple locations along the Meenachil River (Kidangoor, Poonjar, Pala, Kidangoor, and Erattupetta).

# Flood prediction 
By using time series models such as ARIMA, Prophet, and LSTM for short-term and long-term forecasts.

# Automated alert system 
To notify residents and authorities when critical water levels are reached.

# Web App 
For visualizing real-time data and predictions.


# Working

The system utilizes ultrasonic and DHT11 sensors deployed along the river to monitor real-time water levels, temperature, and humidity. This data is transmitted to the cloud using Wi-Fi modules (ESP8266/ESP32). The collected sensor data is then stored in a MongoDB database, where it is maintained as historical records and can be queried via the backend API to retrieve water levels for different locations. By collecting water level, temperature, and humidity data from specific locations such as Kidangoor, Poonjar, Pala, and Erattupetta, we can accurately predict when and at what level a flood is likely to occur at each point. Time series models such as ARIMA, Prophet, and LSTM are applied to the historical data to predict future water levels. If the predicted water levels exceed predefined safety thresholds, the system automatically triggers alerts. Additionally, users can access real-time water levels, historical trends, and future flood predictions through an interactive web application.
