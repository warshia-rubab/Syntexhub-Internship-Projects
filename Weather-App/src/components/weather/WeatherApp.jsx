import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { useTheme } from '../../context/ThemeContext';
import { useWeatherLogger } from '../../hooks/useWeatherLogger';
import WeatherBackground from '../../animations/WeatherBackground';
import SearchBar from './SearchBar';
import WeatherForecast from '../forecast/WeatherForecast';
import WeatherPage from './WeatherPage';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import SidePanel from './SidePanel';
import styles from './WeatherApp.module.css';

function WeatherApp() {
  const { weatherData, loading, error, fetchWeather, city } = useWeather(null);
  const [unit, setUnit] = useState('metric');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const inputRef = useRef(null);
  const { history, addToHistory } = useSearchHistory();
  const { theme, toggleTheme } = useTheme();
  const { logSearch } = useWeatherLogger();

  // ✅ Save to database when weather data is received
  useEffect(() => {
    if (weatherData && weatherData.current) {
      console.log('📝 Calling logSearch for:', weatherData.current.name);
      logSearch(weatherData.current, weatherData.current);
    }
  }, [weatherData, logSearch]);

  useEffect(() => {
    if (weatherData) {
      console.log('✅ Weather data received:', weatherData);
    }
    if (error) {
      console.log('❌ Error:', error);
    }
  }, [weatherData, error]);

  const handleSearch = useCallback((searchCity) => {
    console.log('🔍 Searching for:', searchCity);
    if (searchCity && searchCity.trim()) {
      fetchWeather(searchCity);
      addToHistory(searchCity);
      // ✅ Switch to Weather page when searching
      setActiveMenu('weather');
      if (window.innerWidth <= 768) {
        setIsPanelOpen(false);
      }
    }
  }, [fetchWeather, addToHistory]);

  const toggleUnit = useCallback(() => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  }, []);

  const togglePanel = useCallback(() => {
    setIsPanelOpen(!isPanelOpen);
  }, [isPanelOpen]);

  const handleMenuClick = useCallback((menuId) => {
    console.log('🔘 Menu clicked:', menuId);
    setActiveMenu(menuId);
    if (window.innerWidth <= 768) {
      setIsPanelOpen(false);
    }
  }, []);

  const weatherCondition = weatherData?.current?.weather?.[0]?.main || 'Clear';

  // ✅ Render content based on active menu
  const renderContent = () => {
    // DASHBOARD - Shows search bar + popular cities + welcome
    if (activeMenu === 'dashboard') {
      return (
        <div className={styles.dashboardContent}>
          {/* ✅ SearchBar with full features */}
          <SearchBar
            onSearch={handleSearch}
            inputRef={inputRef}
            isLoading={loading}
            unit={unit}
            onToggleUnit={toggleUnit}
            searchHistory={history}
            onToggleTheme={toggleTheme}
            theme={theme}
            onTogglePanel={togglePanel}
            isPanelOpen={isPanelOpen}
            hideSearch={false}
          />
          {!loading && !weatherData && !error && (
            <div className={styles.welcomeMessage}>
              <h2>Weather Dashboard</h2>
              <p>Search for a city or select a popular city to view weather details.</p>
            </div>
          )}
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onRetry={() => handleSearch(inputRef.current?.value || '')} />}
        </div>
      );
    }

    // WEATHER PAGE - Clean, only city details + forecast (NO search bar)
    if (activeMenu === 'weather') {
      return (
        <div className={styles.weatherPageContainer}>
          {/* ✅ SearchBar with hideSearch=true - only shows menu + theme toggle */}
          <SearchBar
            onSearch={handleSearch}
            inputRef={inputRef}
            isLoading={loading}
            unit={unit}
            onToggleUnit={toggleUnit}
            searchHistory={history}
            onToggleTheme={toggleTheme}
            theme={theme}
            onTogglePanel={togglePanel}
            isPanelOpen={isPanelOpen}
            hideSearch={true}
          />
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onRetry={() => handleSearch(inputRef.current?.value || '')} />}
          {weatherData ? (
            <>
              <WeatherPage data={weatherData.current} unit={unit} theme={theme} />
              <WeatherForecast data={weatherData.forecast} unit={unit} theme={theme} />
            </>
          ) : (
            <div className={styles.welcomeMessage}>
              <div className={styles.welcomeIcon}>🌤️</div>
              <h2>Weather Page</h2>
              <p>Go to Dashboard and search for a city to see weather details here.</p>
            </div>
          )}
        </div>
      );
    }

// In renderContent, update the Analytics section:
if (activeMenu === 'analytics') {
  return (
    <>
      <SearchBar
        onSearch={handleSearch}
        inputRef={inputRef}
        isLoading={loading}
        unit={unit}
        onToggleUnit={toggleUnit}
        searchHistory={history}
        onToggleTheme={toggleTheme}
        theme={theme}
        onTogglePanel={togglePanel}
        isPanelOpen={isPanelOpen}
        hideSearch={true}
      />
      <Analytics 
        weatherData={weatherData?.current} 
        unit={unit}
        forecastData={weatherData?.forecast}
      />
    </>
  );
}

    // SETTINGS PAGE
    if (activeMenu === 'settings') {
      return (
        <>
          <SearchBar
            onSearch={handleSearch}
            inputRef={inputRef}
            isLoading={loading}
            unit={unit}
            onToggleUnit={toggleUnit}
            searchHistory={history}
            onToggleTheme={toggleTheme}
            theme={theme}
            onTogglePanel={togglePanel}
            isPanelOpen={isPanelOpen}
            hideSearch={true}
          />
          <Settings theme={theme} toggleTheme={toggleTheme} />
        </>
      );
    }

    return null;
  };

  return (
    <>
      <WeatherBackground condition={weatherCondition} theme={theme} />
      <div className={styles.appContainer}>
        <SidePanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          theme={theme}
          onMenuClick={handleMenuClick}
          activeMenu={activeMenu}
        />

        <div className={`${styles.mainContent} ${isPanelOpen ? styles.blurred : ''}`}>
          {renderContent()}
        </div>
      </div>
    </>
  );
}

export default WeatherApp;