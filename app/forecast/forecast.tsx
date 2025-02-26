import { Sun, CloudRain, Cloud, CloudSun, Cloudy, CloudSnow, CloudLightning, Wind } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import yaml from "js-yaml";
import html2canvas from "html2canvas-pro";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

const colorMapping: Record<number, string> = {
  1: "#84CC16",
  2: "#EAB308",
  3: "#F97316",
  4: "#EF4444",
  5: "#EC4899",
};

const severityLabels: Record<number, string> = {
  1: "MRGL",
  2: "SLGT",
  3: "ENH",
  4: "MDT",
  5: "HIGH",
};

const getWeatherIcon = (condition: String) => {
  switch (condition) {
    case "sunny":
      return <Sun size={32} className="text-yellow-500" />;
    case "mostly sunny":
      return <div className="condition-icon mostly-sunny">
          <CloudSun size={32} />
        </div>;
    case "partly cloudy":
      return <Cloud size={32} className="text-gray-400" />;
    case "cloudy":
      return <Cloudy size={32} className="text-gray-400" />;
    case "rain":
      return <div className="condition-icon rain">
          <CloudRain size={32} />
        </div>;
    case "thunderstorm":
      return <div className="condition-icon thunderstorm">
          <CloudLightning size={32} />
        </div>
    case "windy":
      return <div className="condition-icon windy">
          <Wind size={32} />
        </div>;
    case "snow":
      return <div className="condition-icon snow">
          <CloudSnow size={32} />
        </div>
    default:
      return <Cloud size={32} className="text-gray-400" />;
  }
};

export const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [threatData, setThreatData] = useState<{
    labels: string[];
    datasets: { 
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string;
      borderWidth: number
    }[];
  } | null>(null);
  const forecastRef = useRef(null);
  const threatRef = useRef(null);

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

  const saveThreadPng = () => {
    if (threatRef.current) {
      html2canvas(threatRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = "threatcast.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  }

  useEffect(() => {
    fetch("./forecast.yaml")
      .then((response) => response.text())
      .then((yamlText) => {
        const parsedData = yaml.load(yamlText);
        setWeatherData(parsedData.forecast);
      })
      .catch((error) => console.error("Error loading YAML: ", error));

    fetch("./threats.yaml")
      .then((response) => response.text())
      .then((yamlText) => {
        const data = yaml.load(yamlText);
        if (data && data.weather_risks) {
          const labels = Object.keys(data.weather_risks);
          const values: number[] = Object.values(data.weather_risks);

          setThreatData({
            labels,
            datasets: [
              {
                label: "Severity (0-5)",
                data: values,
                backgroundColor: values.map((value) => colorMapping[value]),
                borderColor: "black",
                borderWidth: 0,
              },
            ],
          });
        }
      })
      .catch((error) => console.error("Error loading YAML: ", error));
    }, []);

  return (
    <div className="flex flex-col items-center">
      <div ref={forecastRef} className="flex gap-4 p-6 bg-blue-100 rounded-lg justify-center fixed-width">
        {weatherData.map(({ day, high, low, precip, condition, severe }) => (
          <div
            key={day}
            className={"flex flex-col items-center p-4 rounded-lg w-24 " + (severe ? "bg-red-200" : "bg-white")}
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
      <br/>
      <div ref={threatRef} className="flex gap-4 p-6 bg-blue-100 rounded-lg justify-center fixed-width">
        <div style={{ width: "700px" }} className="items-center p-4 rounded-lg bg-white">
          {threatData && (
            <Bar
              data={threatData}
              options={{
                indexAxis: 'y' as const,
                scales: {
                  x: {
                    position: 'top' as const,
                    min: 0,
                    max: 5,
                    ticks: {
                      stepSize: 1,
                      align: "center",
                      callback: (value) => {
                        const numericValue = Number(value);
                        return severityLabels[numericValue] || "";
                      },
                    },
                    grid: {
                      drawTicks: false,
                    }
                  },
                  y: {
                    grid: {
                      display: false
                    }
                  }
                },
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: false,
                  },
                  title: {
                    display: true,
                    text: "Hazards"
                  },
                },
              }}
            />
          )}
        </div>
      </div>
      <button onClick={saveThreadPng} className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
        Save as PNG
      </button>
    </div>
  );
};

