import React from 'react';
import { FaCloudSun, FaChartBar, FaCog, FaTimes, FaHome } from 'react-icons/fa';
import styles from './SidePanel.module.css';

const SidePanel = ({ isOpen, onClose, theme, onMenuClick, activeMenu }) => {
  const menuItems = [
    { id: 'dashboard', icon: <FaHome />, label: 'Dashboard' },
    { id: 'weather', icon: <FaCloudSun />, label: 'Weather' },
    { id: 'analytics', icon: <FaChartBar />, label: 'Analytics' },
    { id: 'settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <>
      <div className={`${styles.overlay} ${isOpen ? styles.active : ''}`} onClick={onClose} />
      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.panelHeader}>
          <h2>☀️ Menu</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className={styles.panelContent}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.menuItem} ${activeMenu === item.id ? styles.activeMenuItem : ''}`}
              onClick={() => {
                console.log('🔘 Menu item clicked:', item.id);
                onMenuClick(item.id);
              }}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SidePanel;