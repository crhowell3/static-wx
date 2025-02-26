import { useState, useEffect } from "react";
import yaml from "js-yaml";
import { type ThreatData, type ForecastData } from "../types/ForecastDataTypes";
import { colorMapping } from "../utils/Constants";

const readConfigFiles = () => {
    const [forecastData, setForecastData] = useState<ForecastData[]>([]);
    const [threatData, setThreatData] = useState<ThreatData | null>(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const forecastRes = await fetch('./forecast.yaml')
                const forecastText = await forecastRes.text()
                const forecastData = yaml.load(forecastText) as {
                    forecast: ForecastData[]
                }
                setForecastData(forecastData.forecast)

                const threatsRes = await fetch('./threats.yaml')
                const threatsText = await threatsRes.text()
                const threatData = yaml.load(threatsText) as {
                    weather_risks: Record<string, number>
                }

                if (threatData?.weather_risks) {
                    const labels = Object.keys(threatData.weather_risks)
                    const values = Object.values(threatData.weather_risks)
                    setThreatData({
                        labels,
                        datasets: [
                            {
                                label: 'Severity (0-5)',
                                data: values,
                                backgroundColor: values.map(
                                    (value) => colorMapping[value]
                                ),
                                borderColor: 'black',
                                borderWidth: 0,
                            },
                        ],
                    })
                }
            } catch (error) {
                console.error('Error loading YAML: ', error)
            }
        }
        fetchData()
    }, []);

    return { forecastData, threatData };
}

export default readConfigFiles;