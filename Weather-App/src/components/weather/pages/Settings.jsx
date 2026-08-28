import React, { useState } from 'react';
import styles from './Settings.module.css';

const Settings = ({ theme, toggleTheme }) => {
  const [language, setLanguage] = useState('en');

  return (
    <div className={styles.settingsPage}>
      <h2 className={styles.pageTitle}>⚙️ Settings</h2>
      
      {/* Language Settings */}
      <div className={styles.settingGroup}>
        <h3 className={styles.settingLabel}>🌐 Language</h3>
        <div className={styles.languageOptions}>
          <button 
            className={`${styles.langBtn} ${language === 'en' ? styles.activeLang : ''}`}
            onClick={() => setLanguage('en')}
          >
            English
          </button>
          <button 
            className={`${styles.langBtn} ${language === 'zh' ? styles.activeLang : ''}`}
            onClick={() => setLanguage('zh')}
          >
            中文 (Chinese)
          </button>
        </div>
        <p className={styles.settingHint}>Select your preferred language</p>
      </div>

      {/* Theme Settings */}
      <div className={styles.settingGroup}>
        <h3 className={styles.settingLabel}>🎨 Theme</h3>
        <div className={styles.themeOptions}>
          <button 
            className={`${styles.themeBtn} ${theme === 'light' ? styles.activeTheme : ''}`}
            onClick={toggleTheme}
          >
            ☀️ Light Mode
          </button>
          <button 
            className={`${styles.themeBtn} ${theme === 'dark' ? styles.activeTheme : ''}`}
            onClick={toggleTheme}
          >
            🌙 Dark Mode
          </button>
        </div>
        <p className={styles.settingHint}>Switch between light and dark themes</p>
      </div>

      {/* App Version */}
      <div className={styles.settingGroup}>
        <h3 className={styles.settingLabel}>📱 App Version</h3>
        <div className={styles.versionBox}>
          <span className={styles.versionNumber}>1.0.0</span>
          <span className={styles.versionStatus}>✅ Latest</span>
        </div>
        <p className={styles.settingHint}>Weather App - Built with React</p>
      </div>
    </div>
  );
};

export default Settings;