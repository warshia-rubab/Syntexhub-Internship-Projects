import React from 'react';
import { getTemperature, getWindSpeed } from '../../utils/unitConverters';
import { formatDate } from '../../utils/dateFormatters';
import { FaTemperatureHigh, FaTint, FaWind, FaCompressAlt, FaSun, FaCloudRain, FaUmbrella } from 'react-icons/fa';
import styles from './CurrentWeather.module.css';

const CurrentWeather = ({ data, unit, theme }) => {
  if (!data) return null;

  const {
    name,
    main: { temp, feels_like, humidity, pressure },
    weather: [weatherInfo],
    wind: { speed },
    sys: { country },
    dt,
  } = data;

  // Get weather icon class
  const getWeatherIcon = (condition) => {
    const cond = condition.toLowerCase();
    if (cond.includes('clear') || cond.includes('sun')) return '☀️';
    if (cond.includes('cloud')) return '⛅';
    if (cond.includes('rain')) return '🌧️';
    if (cond.includes('snow')) return '❄️';
    if (cond.includes('thunder')) return '⛈️';
    if (cond.includes('mist') || cond.includes('fog')) return '🌫️';
    return '🌤️';
  };

  const weatherIcon = getWeatherIcon(weatherInfo.main);

  // Get a friendly day name
  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className={styles.currentWeather}>
      <div className={styles.mainCard}>
        <div className={styles.citySection}>
          <h1 className={styles.cityName}>{name}</h1>
          <p className={styles.country}>{country}</p>
          <p className={styles.date}>{formatDate(dt)}</p>
        </div>

        <div className={styles.weatherMain}>
          <div className={styles.tempSection}>
            <span className={styles.weatherEmoji}>{weatherIcon}</span>
            <span className={styles.temperature}>{getTemperature(temp, unit)}°</span>
            <span className={styles.unitLabel}>{unit === 'metric' ? 'C' : 'F'}</span>
          </div>
          <div className={styles.conditionSection}>
            <p className={styles.condition}>{weatherInfo.description}</p>
            <p className={styles.dayName}>{getDayName(dt)}</p>
          </div>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <FaTemperatureHigh className={styles.detailIcon} />
            <span className={styles.detailLabel}>Feels Like</span>
            <span className={styles.detailValue}>{getTemperature(feels_like, unit)}°</span>
          </div>
          <div className={styles.detailCard}>
            <FaTint className={styles.detailIcon} />
            <span className={styles.detailLabel}>Humidity</span>
            <span className={styles.detailValue}>{humidity}%</span>
          </div>
          <div className={styles.detailCard}>
            <FaWind className={styles.detailIcon} />
            <span className={styles.detailLabel}>Wind</span>
            <span className={styles.detailValue}>{getWindSpeed(speed, unit)}</span>
          </div>
          <div className={styles.detailCard}>
            <FaCompressAlt className={styles.detailIcon} />
            <span className={styles.detailLabel}>Pressure</span>
            <span className={styles.detailValue}>{pressure} hPa</span>
          </div>
        </div>

        <div className={styles.extraDetails}>
          <div className={styles.extraCard}>
            <FaSun className={styles.extraIcon} />
            <span className={styles.extraLabel}>UV Index</span>
            <span className={styles.extraValue}>3</span>
          </div>
          <div className={styles.extraCard}>
            <FaCloudRain className={styles.extraIcon} />
            <span className={styles.extraLabel}>Chance of Rain</span>
            <span className={styles.extraValue}>0%</span>
          </div>
          <div className={styles.extraCard}>
            <FaUmbrella className={styles.extraIcon} />
            <span className={styles.extraLabel}>RealFeel</span>
            <span className={styles.extraValue}>{getTemperature(feels_like, unit)}°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CurrentWeather);