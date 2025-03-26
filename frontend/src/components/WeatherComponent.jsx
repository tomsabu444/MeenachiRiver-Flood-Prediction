import { useState, useEffect } from "react";
import useApiCalls from "../hooks/useApiCalls";

const Weather = ({ latitude, longitude }) => {
  const { fetchWeatherByCoords } = useApiCalls();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const getWeather = async () => {
      setLoading(true);
      try {
        const data = await fetchWeatherByCoords(latitude, longitude);
        setWeatherData(data);
      } catch (err) {
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, [latitude, longitude, fetchWeatherByCoords]);

  if (loading)
    return (
      <div className={` px-28 py-5 flex items-center justify-center`}>
        <div className="w-16 h-16 rounded-full border-t-4 border-l-4 border-gray-900 border-opacity-100 border-r-transparent animate-spin"></div>
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;
  if (!weatherData) return <p>No weather data available</p>;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Current Weather</h2>
      <div className="space-y-2">
        {/* <div className="flex justify-between">
          <span className="text-zinc-400">Location:</span>
          <span>{weatherData.location}</span>
        </div> */}
        <div className="flex justify-between">
          <span className="text-zinc-400">Temperature:</span>
          <span>{weatherData.currentWeather.temperature}°C</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Feels Like:</span>
          <span>{weatherData.currentWeather.feelsLike}°C</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Weather:</span>
          <span>{weatherData.currentWeather.weather}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Wind Speed:</span>
          <span>{weatherData.currentWeather.windSpeed} m/s</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Humidity:</span>
          <span>{weatherData.currentWeather.humidity}%</span>
        </div>
        {/* <div className="flex justify-between">
          <span className="text-zinc-400">Sunrise:</span>
          <span>{weatherData.currentWeather.sunrise}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Sunset:</span>
          <span>{weatherData.currentWeather.sunset}</span>
        </div> */}
      </div>
    </div>
  );
};

export default Weather;
