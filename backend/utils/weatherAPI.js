import axios from 'axios';

export const getWeatherData = async (lat, lng) => {
  try {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`);
    const { main, weather, wind } = res.data;
    return {
      temperature: main.temp,
      windSpeed: wind.speed,
      description: weather[0].description
    };
  } catch (err) {
    console.error("Weather fetch failed:", err);
    return null;
  }
};
