import { useState, useCallback, useEffect, useRef } from 'react';
import { getWeatherByCity } from '../api/weatherApi';

export const useWeather = (initialCity = 'London') => {
  const [city, setCity] = useState(initialCity);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchWeather = useCallback(async (searchCity) => {
    if (!searchCity || searchCity.trim() === '') {
      console.log('⚠️ Empty city name, skipping fetch');
      return;
    }

    console.log('🔍 Fetching weather for:', searchCity);
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const data = await getWeatherByCity(searchCity);
      console.log('✅ API returned data:', data);
      
      if (isMounted.current) {
        console.log('📊 Setting weather data...');
        setWeatherData(data);
        setCity(searchCity);
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      if (isMounted.current) {
        setError(err.message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        console.log('⏹️ Loading set to false');
      }
    }
  }, []);

  // Auto-fetch on initial load
  useEffect(() => {
    if (initialCity && !hasFetched.current) {
      console.log('🚀 Initial fetch for:', initialCity);
      hasFetched.current = true;
      fetchWeather(initialCity);
    }
  }, [initialCity, fetchWeather]);

  return { weatherData, loading, error, fetchWeather, city };
};