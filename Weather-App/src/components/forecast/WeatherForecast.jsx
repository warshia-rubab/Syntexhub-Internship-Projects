import React, { useMemo } from 'react';
import { getTemperature } from '../../utils/unitConverters';
import styles from './WeatherForecast.module.css';

const WeatherForecast = ({ data, unit, theme }) => {
  const forecastList = useMemo(() => {
    if (!data || !data.list) return [];
    const uniqueDays = {};
    data.list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!uniqueDays[date] && item.dt_txt.includes('12:00:00')) {
        uniqueDays[date] = item;
      }
    });
    return Object.values(uniqueDays);
  }, [data]);

  if (forecastList.length === 0) return null;

  const getWeatherEmoji = (condition) => {
    const cond = condition.toLowerCase();
    if (cond.includes('clear') || cond.includes('sun')) return '☀️';
    if (cond.includes('cloud')) return '⛅';
    if (cond.includes('rain')) return '🌧️';
    if (cond.includes('snow')) return '❄️';
    if (cond.includes('thunder')) return '⛈️';
    if (cond.includes('mist') || cond.includes('fog')) return '🌫️';
    return '🌤️';
  };

  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className={styles.forecastContainer}>
      {/* ✅ 5-DAY FORECAST */}
      <h3 className={styles.forecastTitle}>5-DAY FORECAST</h3>
      <div className={styles.forecastList}>
        {forecastList.map((item) => (
          <div key={item.dt} className={styles.forecastCard}>
            <p className={styles.forecastDay}>{getDayName(item.dt)}</p>
            <span className={styles.forecastEmoji}>
              {getWeatherEmoji(item.weather[0].main)}
            </span>
            <div className={styles.forecastTemps}>
              <span className={styles.forecastHigh}>
                {getTemperature(item.main.temp_max, unit)}°
              </span>
              <span className={styles.forecastLow}>
                {getTemperature(item.main.temp_min, unit)}°
              </span>
            </div>
            <p className={styles.forecastDesc}>
              {item.weather[0].description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(WeatherForecast);