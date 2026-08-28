import { useState, useEffect } from 'react';

export const useSearchHistory = (maxItems = 5) => {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('weatherSearchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (city) => {
    if (!city || !city.trim()) return;
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== city.toLowerCase());
      return [city, ...filtered].slice(0, maxItems);
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('weatherSearchHistory');
  };

  return { history, addToHistory, clearHistory };
};