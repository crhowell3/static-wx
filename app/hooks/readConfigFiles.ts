import { useState, useEffect } from 'react'
import yaml from 'js-yaml'
import { type ForecastData } from '../types/ForecastDataTypes'

const readConfigFiles = () => {
  const [forecastData, setForecastData] = useState<ForecastData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const forecastRes = await fetch('./forecast.yaml')
        const forecastText = await forecastRes.text()
        const forecastData = yaml.load(forecastText) as {
          forecast: ForecastData[]
        }
        setForecastData(forecastData.forecast)
      } catch (error) {
        console.error('Error loading YAML: ', error)
      }
    }
    fetchData()
  }, [])

  return { forecastData }
}

export default readConfigFiles
