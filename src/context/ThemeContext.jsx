// context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('light'); // Default theme

  useEffect(() => {
    // Set initial theme based on local storage or system preference
    const savedTheme =
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setThemeMode(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  const switchTheme = theme => {
    setThemeMode(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, switchTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
