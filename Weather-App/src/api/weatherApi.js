import axios from 'axios';

// ✅ Use environment variable
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric',
  },
});

export const getWeatherByCity = async (city) => {
  try {
    console.log('📡 Calling API for:', city);
    
    const [weatherResponse, forecastResponse] = await Promise.all([
      weatherApi.get('/weather', { params: { q: city } }),
      weatherApi.get('/forecast', { params: { q: city } }),
    ]);

    console.log('📊 Weather response:', weatherResponse.data);

    return {
      current: weatherResponse.data,
      forecast: forecastResponse.data,
    };
  } catch (error) {
    console.error('❌ API Error:', error);
    if (error.response) {
      throw new Error(
        `API Error (${error.response.status}): ${error.response.data.message}`
      );
    } else if (error.request) {
      throw new Error('Network error: Could not reach the weather service.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }
};

