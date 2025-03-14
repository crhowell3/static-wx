import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas-pro'
import Threatcast from '../components/Threatcast'
import WeeklyForecast from '../components/Forecast'
import axios from 'axios'
import type { ForecastData } from '~/types/ForecastDataTypes'
import VersionTag from '~/components/VersionTag'
import ForecastForm from '~/components/ForecastForm'

const defaultForecastData: ForecastData[] = [
  {
    day: 'SUN',
    high: 75,
    low: 65,
    precip: 0,
    condition: 'sunny',
    severe: false,
  },
  {
    day: 'MON',
    high: 75,
    low: 65,
    precip: 0,
    condition: 'sunny',
    severe: false,
  },
  {
    day: 'TUE',
    high: 75,
    low: 65,
    precip: 0,
    condition: 'sunny',
    severe: false,
  },
  {
    day: 'WED',
    high: 75,
    low: 65,
    precip: 0,
    condition: 'sunny',
    severe: false,
  },
  {
    day: 'THU',
    high: 75,
    low: 65,
    precip: 0,
    condition: 'sunny',
    severe: false,
  },
  {
    day: 'FRI',
    high: 75,
    low: 65,
    precip: 0,
    condition: 'sunny',
    severe: false,
  },
  {
    day: 'SAT',
    high: 75,
    low: 65,
    precip: 0,
    condition: 'sunny',
    severe: false,
  },
]

export const WeatherForecast = () => {
  const forecastRef = useRef<HTMLDivElement | null>(null)
  const threatRef = useRef<HTMLDivElement | null>(null)
  const [forecastData, setForecastData] = useState<ForecastData[]>(defaultForecastData)
  const [zuluMOS, setZuluMOS] = useState('00z')

  const updateData = (newData) => {
    setForecastData(newData)
  }

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

  const extractTemps = (data: string, is00z = false) => {
    const regex = is00z
      ? /(?<=X\/N\s)((?:\s*\d+\s*\|?)+)/g
      : /(?<=N\/X\s)((?:\s*\d+\s*\|?)+)/g

    const match = data.toString().match(regex)

    if (match) {
      const tempRow = match[0].trim()
      const tempValues = tempRow.split('|').map(value => value.trim())

      const lowTemps = []
      const highTemps = []

      if (is00z) {
        lowTemps.push(999)
        highTemps.push(Number(tempValues[0]))

        tempValues.slice(1).forEach(value => {
          const [low, high] = value.split(/\s+/)
          lowTemps.push(low)
          highTemps.push(high)
        })
      } else {
        tempValues.forEach(value => {
          const [low, high] = value.split(/\s+/)
          lowTemps.push(low)
          highTemps.push(high)
        })
      }

      // Remove last item because it is not valid temperature
      lowTemps.pop()
      highTemps.pop()
      return { lowTemps: lowTemps, highTemps: highTemps }
    }

    return null
  }

  const extractDays = (data: string) => {
    const regex = /\b(MON|TUE|WED|THU|FRI|SAT|SUN)\b/g

    const days = [...data.toString().matchAll(regex)].map(m => m[0])

    days.pop()

    return days
  }

  const extractPrecip = (data: string, is00z = false) => {
    const regex = /P24\s*(?:\|\s*)?([\d\s|]*)/

    const match = data.toString().match(regex)
    if (!match) return []

    const values = match[1].match(/\d{1,3}/g) || []
    if (is00z) {
      values.unshift(-1)
    }

    return values.map(Number)
  }

  const pullData = async () => {
    const is00z = zuluMOS === '00z'
    const mosURL = is00z
      ? 'https://www.weather.gov/source/mdl/MOS/GFSMEX.t00z'
      : 'https://www.weather.gov/source/mdl/MOS/GFSMEX.t12z'

    const conditionRegex =
      /CLD\s+[A-Z]{2}\s+([A-Z]{2})\|\s+[A-Z]{2}\s+([A-Z]{2})\|\s+[A-Z]{2}\s+([A-Z]{2})\|\s+[A-Z]{2}\s+([A-Z]{2})\|\s+[A-Z]{2}\s+([A-Z]{2})\|\s+[A-Z]{2}\s+([A-Z]{2})/

    let days: string[] | undefined = []
    let precip: number[] = []
    let temps: { lowTemps: number[]; highTemps: number[] } | null = {
      lowTemps: [],
      highTemps: [],
    }

    await axios.get(mosURL).then(function (response) {
      const khsv_raw: string = response.data.match(
        // eslint-disable-next-line no-useless-escape
        /KHSV\s+GFSX(?:.|\n)*?(?=\n[A-Z]{4}\s+GFSX|\Z)/,
      )

      temps = extractTemps(khsv_raw, is00z)
      days = extractDays(khsv_raw)
      precip = extractPrecip(khsv_raw, is00z)
    })

    const mosForecastData: ForecastData[] = []
    for (let i = 0; i < 7; i++) {
      mosForecastData.push({
        day: days[i],
        high: temps.highTemps[i],
        low: temps.lowTemps[i],
        precip: precip[i],
        condition: precip[i] > 20 ? 'rain' : 'sunny',
        severe: false,
      })
    }

    setForecastData(mosForecastData)
  }

  return (
    <div className='flex flex-col items-center'>
      <ForecastForm
        updateForecastData={updateData}
      />
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
            <label htmlFor='00z'>00z</label>
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
            <label htmlFor='12z'>12z</label>
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
