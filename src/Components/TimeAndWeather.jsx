import { useEffect, useState } from "react";

export default function TimeAndWeather() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState("Loading...");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch("https://wttr.in/?format=%t+%c"); // Temp and icon
        const data = await response.text();
        setWeather(data);
      } catch {
        setWeather("⚠️ Failed to load weather");
      }
    }

    fetchWeather();
  }, []);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div>{time.toLocaleTimeString()}</div>
      <div>{weather}</div>
    </div>
  );
}
