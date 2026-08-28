import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import './WeatherBackground.css';

const WeatherBackground = ({ condition, theme }) => {
  const weatherType = useMemo(() => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('drizzle')) return 'rainy';
    if (cond.includes('cloud')) return 'cloudy';
    if (cond.includes('sun') || cond.includes('clear')) return 'sunny';
    if (cond.includes('snow')) return 'snowy';
    if (cond.includes('wind')) return 'windy';
    if (cond.includes('mist') || cond.includes('fog')) return 'misty';
    if (cond.includes('thunder')) return 'thunder';
    return 'default';
  }, [condition]);

  const particles = useMemo(() => {
    const count = weatherType === 'rainy' ? 80 : weatherType === 'snowy' ? 50 : weatherType === 'windy' ? 30 : 0;
    const isLight = theme === 'light';
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      size: weatherType === 'rainy' ? 2 : weatherType === 'snowy' ? 6 + Math.random() * 8 : 3 + Math.random() * 5,
      opacity: isLight ? 0.3 : 0.6,
      color: weatherType === 'rainy' ? '#4facfe' : weatherType === 'snowy' ? '#ffffff' : '#f0f0f0',
    }));
  }, [weatherType, theme]);

  const getBackground = () => {
    const isLight = theme === 'light';
    
    const gradients = {
      sunny: isLight 
        ? 'linear-gradient(135deg, #e8f0fe 0%, #d4e6f0 50%, #c5d9e8 100%)'
        : 'linear-gradient(135deg, #1a2a3a 0%, #2a4a6a 50%, #3a5a7a 100%)',
      rainy: isLight
        ? 'linear-gradient(135deg, #d5dde6 0%, #b8c8d8 50%, #9ab8cc 100%)'
        : 'linear-gradient(135deg, #0a1a2a 0%, #1a3a5a 50%, #2a4a6a 100%)',
      cloudy: isLight
        ? 'linear-gradient(135deg, #e0e4ea 0%, #c8d0da 50%, #b0bcca 100%)'
        : 'linear-gradient(135deg, #1a1a2a 0%, #2a2a3a 50%, #3a3a4a 100%)',
      snowy: isLight
        ? 'linear-gradient(135deg, #f0f4f8 0%, #e0e8f0 50%, #d0dce8 100%)'
        : 'linear-gradient(135deg, #1a2a3a 0%, #2a3a4a 50%, #3a4a5a 100%)',
      windy: isLight
        ? 'linear-gradient(135deg, #e8ecf2 0%, #d4dae4 50%, #c0c8d6 100%)'
        : 'linear-gradient(135deg, #1a1a2e 0%, #2a2a3e 50%, #3a3a4e 100%)',
      default: isLight
        ? 'linear-gradient(135deg, #e8edf5 0%, #d5dce6 50%, #c5cedb 100%)'
        : 'linear-gradient(135deg, #0a0e1a 0%, #141b2d 50%, #1a1a2e 100%)',
    };
    return gradients[weatherType] || gradients.default;
  };

  return (
    <div className="weather-background" style={{ background: getBackground() }}>
      {weatherType === 'rainy' && (
        <div className="rain-container">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="rain-drop"
              style={{
                left: p.left,
                width: '2px',
                height: `${15 + Math.random() * 20}px`,
                background: theme === 'light' ? 'rgba(79, 172, 254, 0.3)' : 'rgba(79, 172, 254, 0.5)',
              }}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: '100vh', opacity: [0, 1, 0] }}
              transition={{
                duration: p.animationDuration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {weatherType === 'snowy' && (
        <div className="snow-container">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="snow-flake"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                background: theme === 'light' ? 'rgba(200, 220, 240, 0.5)' : 'rgba(255,255,255,0.7)',
                borderRadius: '50%',
              }}
              initial={{ y: -50, x: 0 }}
              animate={{ 
                y: '100vh', 
                x: [0, 20, -20, 10, -10, 0],
              }}
              transition={{
                duration: p.animationDuration + 2,
                delay: p.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {weatherType === 'windy' && (
        <div className="wind-container">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="wind-particle"
              style={{
                left: '-20%',
                top: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 40}px`,
                height: '2px',
                background: theme === 'light' ? 'rgba(100, 150, 200, 0.15)' : 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
              }}
              animate={{ x: '120vw' }}
              transition={{
                duration: 3 + Math.random() * 4,
                delay: Math.random() * 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {weatherType === 'sunny' && (
        <div className="sunny-container">
          <motion.div
            className="sun-glow"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: '10%',
              right: '15%',
              width: '300px',
              height: '300px',
              background: theme === 'light' 
                ? 'radial-gradient(circle, rgba(79, 172, 254, 0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(79, 172, 254, 0.25) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
        </div>
      )}

      {weatherType === 'cloudy' && (
        <div className="cloud-container">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="cloud"
              style={{
                position: 'absolute',
                top: `${10 + i * 20}%`,
                left: `${-10 - i * 15}%`,
                width: `${120 + i * 40}px`,
                height: `${40 + i * 10}px`,
                background: theme === 'light'
                  ? 'rgba(180, 190, 200, 0.3)'
                  : 'rgba(255, 255, 255, 0.08)',
                borderRadius: '50px',
                filter: 'blur(2px)',
              }}
              animate={{
                x: '120vw',
                y: [0, -10, 0, 10, 0],
              }}
              transition={{
                duration: 15 + i * 5,
                delay: i * 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherBackground;