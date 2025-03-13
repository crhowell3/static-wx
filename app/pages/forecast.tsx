import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas-pro'
import Threatcast from '../components/Threatcast'
import yaml from 'js-yaml'
import WeeklyForecast from '../components/WeeklyForecast'
import axios from 'axios'
import type { ForecastData } from '~/types/ForecastDataTypes'
import VersionTag from '~/components/VersionTag'

export const WeatherForecast = () => {
  const forecastRef = useRef<HTMLDivElement | null>(null)
  const threatRef = useRef<HTMLDivElement | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [zuluMOS, setZuluMOS] = useState('00z')

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

  const saveAsPng = () => {
    if (forecastRef.current) {
      html2canvas(forecastRef.current).then(canvas => {
        const link = document.createElement('a')
        link.download = 'weather-forecast.png'
        link.href = canvas.toDataURL('image/png')
        link.click()
      })
    }
  }

  const saveThreatPng = () => {
    if (threatRef.current) {
      html2canvas(threatRef.current).then(canvas => {
        const link = document.createElement('a')
        link.download = 'threatcast.png'
        link.href = canvas.toDataURL('image/png')
        link.click()
      })
    }
  }

  const handleZulu = (e: any) => {
    setZuluMOS(e.target.value)
  }

  const pullData = async () => {
    const mosURL =
      zuluMOS === '00z'
        ? 'https://www.weather.gov/source/mdl/MOS/GFSMEX.t00z'
        : 'https://www.weather.gov/source/mdl/MOS/GFSMEX.t12z'
    let khsv_items: string[] = []
    await axios.get(mosURL).then(function (response) {
      const start_idx = response.data.search(/KHSV/)
      const khsv_raw = response.data.substring(start_idx, start_idx + 1400)
      khsv_items = khsv_raw.split(/\||\n/)
      khsv_items.forEach((_part: unknown, index: number) => {
        khsv_items[index] = khsv_items[index].trim()
      })
      console.log(khsv_items)
    })
    // Parse days
    const days_raw = khsv_items.slice(9, 15 + 1)
    const days: string[] = []
    days_raw.forEach((_part: unknown, index: number) => {
      days.push(days_raw[index].substring(0, 3))
    })

    // Parse temps
    const temps_raw = khsv_items.slice(17, 23 + 1)
    const low_temps: string[] = []
    const high_temps: string[] = []
    temps_raw.forEach((_part: unknown, index: number) => {
      let start_idx = 0
      let stop_idx = 2
      if (index == 0) {
        start_idx = 5
        stop_idx = 7
      }
      low_temps.push(temps_raw[index].substring(start_idx, stop_idx))
      high_temps.push(temps_raw[index].substring(start_idx + 4, stop_idx + 4))
    })

    const mosForecastData: ForecastData[] = []
    for (let i = 0; i < 7; i++) {
      mosForecastData.push({
        day: days[i],
        high: Number(high_temps[i]),
        low: Number(low_temps[i]),
        precip: 0,
        condition: 'sunny',
        severe: false,
      })
    }

    setForecastData(mosForecastData)
  }

  return (
    <div className='flex flex-col items-center'>
      <div
        ref={forecastRef}
        className='flex flex-col p-4 bg-blue-100 rounded-lg justify-center fixed-width'
      >
        <div className='flex gap-4 p-6'>
          <WeeklyForecast forecastData={forecastData} />
        </div>
        <VersionTag />
      </div>

      <form>
        <div className='flex gap-4 mt-2'>
          <div className='flex gap-1'>
            <input
              type='radio'
              value='00z'
              id='00z'
              checked={zuluMOS === '00z'}
              onChange={handleZulu}
              name='00z'
            />
            <label for='00z'>00z</label>
          </div>
          <div className='flex gap-1'>
            <input
              type='radio'
              value='12z'
              id='12z'
              checked={zuluMOS === '12z'}
              onChange={handleZulu}
              name='12z'
            />
            <label for='12z'>12z</label>
          </div>
        </div>
      </form>

      {/* Save 7-day forecast infographic as a PNG */}
      <div className='row gap-4 flex'>
        <button
          onClick={pullData}
          className='mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700'
        >
          Pull {zuluMOS} Data
        </button>
        <button
          onClick={saveAsPng}
          className='mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700'
        >
          Save as PNG
        </button>
      </div>

      <br />
      <div className='flex gap-4 p-6 bg-blue-100 rounded-lg justify-center fixed-width'>
        <Threatcast threatRef={threatRef} />
      </div>

      <button
        onClick={saveThreatPng}
        className='mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700'
      >
        Save as PNG
      </button>
    </div>
  )
}
