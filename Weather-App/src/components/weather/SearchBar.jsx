import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaHistory, FaBars, FaSun, FaMoon, FaTemperatureLow, FaTemperatureHigh } from 'react-icons/fa';
import styles from './SearchBar.module.css';

const popularCities = [
  { name: 'London' },
  { name: 'New York' },
  { name: 'Tokyo' },
  { name: 'Paris' },
  { name: 'Dubai' },
];

const SearchBar = ({ 
  onSearch, 
  inputRef, 
  isLoading, 
  unit,
  onToggleUnit,
  onToggleTheme,
  theme,
  onTogglePanel,
  searchHistory,
  isPanelOpen,
  hideSearch = false  // ✅ NEW: Controls if search bar is hidden
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setShowHistory(false);
    }
  };

  const handleCityClick = (city) => {
    setSearchTerm(city);
    onSearch(city);
    setShowHistory(false);
  };

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      alert('⚠️ Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        alert(`📍 Your location detected!\nLatitude: ${latitude}\nLongitude: ${longitude}`);
      },
      (error) => {
        let message = '❌ Error getting location: ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message += 'Location request timed out.';
            break;
          default:
            message += error.message;
        }
        alert(message);
      }
    );
  };

  // ✅ If hideSearch is true, only show header (menu + theme toggle)
  if (hideSearch) {
    return (
      <div className={styles.searchContainer}>
        <div className={styles.appHeader}>
          <div className={styles.headerLeft}>
            <button className={styles.hamburgerBtn} onClick={onTogglePanel} aria-label="Menu">
              <FaBars />
            </button>
          </div>
          <div className={styles.headerRight}>
            <button 
              className={styles.themeToggle} 
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.searchContainer}>
      {/* Header */}
      <div className={styles.appHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.hamburgerBtn} onClick={onTogglePanel} aria-label="Menu">
            <FaBars />
          </button>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.themeToggle} 
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      {/* Title */}
      <div className={styles.titleSection}>
        <div className={styles.titleWrapper}>
          <span className={styles.titleIcon}>🌤️</span>
          <h1 className={styles.mainTitle}>Weather Forecast</h1>
        </div>
      </div>

      {/* Search Form */}
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Enter a City or Country"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={inputRef}
            disabled={isLoading}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          />
          <button type="submit" className={styles.searchButton} disabled={isLoading}>
            <FaSearch />
            <span>Search</span>
          </button>
        </div>

        <div className={styles.rightActions}>
          <button 
            type="button" 
            className={styles.locationBtn} 
            onClick={handleGeoLocation}
            title="Use your current location"
          >
            <FaMapMarkerAlt />
            <span>Location</span>
          </button>
          <button 
            type="button" 
            className={styles.unitToggle} 
            onClick={onToggleUnit}
            title={`Switch to ${unit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
          >
            {unit === 'metric' ? <FaTemperatureLow /> : <FaTemperatureHigh />}
            <span>{unit === 'metric' ? '°C' : '°F'}</span>
          </button>
        </div>
      </form>

      {/* History Dropdown */}
      {showHistory && searchHistory && searchHistory.length > 0 && (
        <div className={styles.historyDropdown}>
          <div className={styles.historyHeader}>
            <span>Recent Searches</span>
            <button 
              className={styles.clearHistory}
              onClick={() => {
                localStorage.removeItem('weatherSearchHistory');
                window.location.reload();
              }}
            >
              Clear All
            </button>
          </div>
          {searchHistory.map((city, index) => (
            <button
              key={index}
              className={styles.historyItem}
              onClick={() => handleCityClick(city)}
            >
              <FaHistory className={styles.historyIcon} />
              {city}
            </button>
          ))}
        </div>
      )}

      {/* Popular Cities */}
      <div className={styles.popularSection}>
        <span className={styles.sectionLabel}>Popular Cities</span>
        <div className={styles.cityChips}>
          {popularCities.map((city) => (
            <button
              key={city.name}
              className={styles.cityChip}
              onClick={() => handleCityClick(city.name)}
              disabled={isLoading}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SearchBar);