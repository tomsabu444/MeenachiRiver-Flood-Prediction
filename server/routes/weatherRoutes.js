const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Function to fetch current weather
const fetchCurrentWeather = async (latitude, longitude) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    console.log(`Fetching current weather: ${url}`);

    const response = await axios.get(url);
    console.log("Current weather fetched successfully.");
    return response.data;
  } catch (error) {
    console.error("Error fetching current weather:", error.message);
    throw error;
  }
};

// Function to fetch next 24-hour weather forecast
const fetchHourlyForecast = async (latitude, longitude) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    console.log(`Fetching hourly forecast: ${url}`);

    const response = await axios.get(url);
    console.log("Hourly forecast fetched successfully.");

    // Extract next 24 hours forecast (API provides data every 3 hours)
    const next24Hours = response.data.list.slice(0, 8).map((hour) => ({
      time: new Date(hour.dt * 1000).toLocaleTimeString(),
      temperature: hour.main.temp,
      feelsLike: hour.main.feels_like,
      weather: hour.weather[0].description,
      cloudCover: hour.clouds.all,
      windSpeed: hour.wind.speed,
      windGusts: hour.wind.gust || "N/A",
      rainVolume: hour.rain?.["3h"] || "No rain",
      snowVolume: hour.snow?.["3h"] || "No snow",
    }));

    return next24Hours;
  } catch (error) {
    console.error("Error fetching hourly forecast:", error.message);
    throw error;
  }
};

// Route to get current weather and 24-hour forecast
router.get("/:lat/:lon", async (req, res) => {
  try {
    const { lat, lon } = req.params;
    console.log(`Received weather request - Lat: ${lat}, Lon: ${lon}`);

    // Fetch current weather and forecast
    const currentWeather = await fetchCurrentWeather(lat, lon);
    const next24Hours = await fetchHourlyForecast(lat, lon);

    // Structure response with additional details
    const weatherResponse = {
      location: currentWeather.name,
      currentWeather: {
        temperature: currentWeather.main.temp,
        feelsLike: currentWeather.main.feels_like,
        humidity: currentWeather.main.humidity,
        pressure: currentWeather.main.pressure,
        visibility: currentWeather.visibility,
        weather: currentWeather.weather[0].description,
        windSpeed: currentWeather.wind.speed,
        windGusts: currentWeather.wind.gust || "N/A",
        sunrise: new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString(),
      },
      next24Hours,
    };

    console.log("Weather data processed successfully.");
    res.json(weatherResponse);
  } catch (error) {
    console.error("Error processing weather request:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

module.exports = router;
    