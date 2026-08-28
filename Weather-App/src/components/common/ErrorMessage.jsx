import React from 'react';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ message, onRetry }) => (
  <div className={styles.errorContainer}>
    <p className={styles.errorMessage}>⚠️ {message}</p>
    {onRetry && (
      <button className={styles.retryButton} onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);

export default ErrorMessage;