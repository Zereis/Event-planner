import React, { useState, useEffect } from 'react';
import ReactSwitch from "react-switch";
import '../styles/toggle.css';

export default function Toggle() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <div className="toggle-container">
      <ReactSwitch
        onChange={toggleTheme}
        checked={darkMode}
        checkedIcon={<span style={{ paddingLeft: "4px" }}>🌙</span>}
        uncheckedIcon={<span style={{ paddingLeft: "4px" }}>☀️</span>}
        offColor="#ccc"
        onColor="rgb(113, 121, 126)"
      />
    </div>
  );
}
