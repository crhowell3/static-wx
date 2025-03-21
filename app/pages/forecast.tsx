import { useRef, useState } from 'react'
import html2canvas from 'html2canvas-pro'
import Threatcast from '../components/Threatcast'
import WeeklyForecast from '../components/Forecast'
import axios from 'axios'
import type { ForecastData } from '~/types/ForecastDataTypes'
import VersionTag from '~/components/VersionTag'
import ForecastForm from '~/components/ForecastForm'
import ThreatcastForm from '~/components/ThreatcastForm'

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

const categories: string[] = ['Tornadoes', 'Wind', 'Hail', 'Flooding']

const severityLabels: Record<string, number> = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  EXTREME: 4,
}

const defaultFormData = {
  day1high: 0,
  day1low: 0,
  day1precip: 0,
  day1condition: 'sunny',
  day1severe: false,
  day2high: 0,
  day2low: 0,
  day2precip: 0,
  day2condition: 'sunny',
  day2severe: false,
  day3high: 0,
  day3low: 0,
  day3precip: 0,
  day3condition: 'sunny',
  day3severe: false,
  day4high: 0,
  day4low: 0,
  day4precip: 0,
  day4condition: 'sunny',
  day4severe: false,
  day5high: 0,
  day5low: 0,
  day5precip: 0,
  day5condition: 'sunny',
  day5severe: false,
  day6high: 0,
  day6low: 0,
  day6precip: 0,
  day6condition: 'sunny',
  day6severe: false,
  day7high: 0,
  day7low: 0,
  day7precip: 0,
  day7condition: 'sunny',
  day7severe: false,
}

export const WeatherForecast = () => {
  const forecastRef = useRef<HTMLDivElement | null>(null)
  const threatRef = useRef<HTMLDivElement | null>(null)
  const [forecastData, setForecastData] =
    useState<ForecastData[]>(defaultForecastData)
  const [zuluMOS, setZuluMOS] = useState('00z')
  const [threatLevels, setThreatLevels] = useState({
    Tornadoes: 'NONE',
    Wind: 'NONE',
    Hail: 'NONE',
    Flooding: 'NONE',
  })
  const [city, setCity] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [formData, setFormData] = useState(defaultFormData)

  // Generate the threatData dynamically based on threatLevels
  const generateThreatData = () => {
    return categories.map(category => ({
      name: category,
      uv: severityLabels[threatLevels[category]],
    }))
  }

  const updateCityFromForm = newData => {
    setCity(newData)
  }

  const updateThreatLevelsFromForm = newData => {
    setThreatLevels(newData)
  }

  const updateTimeframeFromForm = newData => {
    setTimeframe(newData)
  }

  const updateData = newData => {
    setForecastData(newData)
  }

  // Generate threat data whenever the threatLevels state changes
  const threatData = generateThreatData()

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
      setFormData(prev => ({
        ...prev,
        [`day${i + 1}high`]: temps?.highTemps[i],
        [`day${i + 1}low`]: temps?.lowTemps[i],
        [`day${i + 1}precip`]: precip[i],
        [`day${i + 1}condition`]: precip[i] > 20 ? 'rain' : 'sunny',
        [`day${i + 1}severe`]: false,
      }))
    }

    setForecastData(mosForecastData)
  }

  return (
    <div className='flex flex-col items-center'>
      <ForecastForm
        updateForecastData={updateData}
        formData={formData}
        setFormData={setFormData}
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
      <ThreatcastForm
        setCity={updateCityFromForm}
        threatLevels={threatLevels}
        setThreatLevels={updateThreatLevelsFromForm}
        categories={categories}
        severityLabels={severityLabels}
        setTimeframe={updateTimeframeFromForm}
      />
      <div
        ref={threatRef}
        className='flex flex-col p-4 bg-white rounded-lg justify-center fixed-width'
      >
        <div className='flex p-2'>
          <Threatcast
            threatData={threatData}
            city={city}
            timeframe={timeframe}
          />
        </div>
        <VersionTag />
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
