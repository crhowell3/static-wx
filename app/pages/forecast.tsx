import { useRef } from 'react'
import html2canvas from 'html2canvas-pro'
import Threatcast from '../components/Threatcast'
import readConfigFiles from '../hooks/readConfigFiles'
import WeeklyForecast from '../components/WeeklyForecast'

export const WeatherForecast = () => {
  const forecastRef = useRef<HTMLDivElement | null>(null)
  const threatRef = useRef<HTMLDivElement | null>(null)
  const { forecastData } = readConfigFiles()

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

  return (
    <div className='flex flex-col items-center'>
      <div
        ref={forecastRef}
        className='flex gap-4 p-6 bg-blue-100 rounded-lg justify-center fixed-width'
      >
        <WeeklyForecast forecastData={forecastData} />
      </div>

      {/* Save 7-day forecast infographic as a PNG */}
      <button
        onClick={saveAsPng}
        className='mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700'
      >
        Save as PNG
      </button>

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
