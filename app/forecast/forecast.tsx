import { Sun, CloudRain, Cloud, CloudSun, Cloudy, CloudSnow, CloudLightning, Wind } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import yaml from "js-yaml";
import html2canvas from "html2canvas-pro";

const getWeatherIcon = (condition) => {
  switch (condition) {
    case "sunny":
      return <Sun size={32} className="text-yellow-500" />;
    case "mostly sunny":
      return <CloudSun size={32} className="text-gray-400" />;
    case "partly cloudy:
      return <Cloud size={32} className="text-gray-400" />;
    case "cloudy":
      return <Cloudy size={32} className="text-gray-400" />;
    case "rain":
      return <CloudRain size={32} className="text-blue-400" />;
    case "thunderstorm":
      return <CloudLightning size={32} className="text-purple-500" />;
    case "windy":
      return <Wind size={32} className="text-gray-500" />;
    case "snow":
      return <CloudSnow size={32} className="text-blue-200" />;
    default:
      return <Cloud size={32} className="text-gray-400" />;
  }
};

export const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState([]);
  const forecastRef = useRef(null);

  const saveAsPng = () => {
    if (forecastRef.current) {
      html2canvas(forecastRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = "weather-forecast.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  useEffect(() => {
    fetch("./forecast.yaml")
      .then((response) => response.text())
      .then((yamlText) => {
        const parsedData = yaml.load(yamlText);
        setWeatherData(parsedData.forecast);
      })
      .catch((error) => console.error("Error loading YAML: ", error));
    }, []);

  return (
    <div className="flex flex-col items-center">
      <div ref={forecastRef} className="flex gap-4 p-6 bg-blue-100 rounded-lg justify-center fixed-width">
        {weatherData.map(({ day, high, low, precip, condition }) => (
          <div
            key={day}
            className="flex flex-col items-center bg-white p-4 rounded-lg w-24"
          >
            <span className="font-bold text-lg text-black">{day}</span>
            {getWeatherIcon(condition)}
            <span className="text-md font-semibold mt-2 text-black">{precip}%</span>
            <span className="text-xl font-semibold mt-2 text-black">{high}°F</span>
            <span className="text-xl font-semibold mt-2 text-black">{low}°F</span>
          </div>
        ))}
      </div>
      <button onClick={saveAsPng} className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
        Save as PNG
      </button>
    </div>
  );
};

