import { useEffect, useState } from 'react'
import type { ForecastData } from '~/types/ForecastDataTypes'

const daysOfTheWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const conditions = [
  'sunny',
  'mostly sunny',
  'partly cloudy',
  'cloudy',
  'rain',
  'windy',
  'thunderstorm',
  'snow',
]

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

function ForecastForm(props): JSX.Element {
  const [degreeUnits, setDegreeUnits] = useState('Fahrenheit')
  const [formData, setFormData] = useState(defaultFormData)
  const [firstDay, setFirstDay] = useState('SUN')

  const handleFormChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxUpdate = e => {
    setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.checked
    }))
  }

  const handleFirstDay = e => {
    setFirstDay(e.target.value)
  }

  const handleFormSubmit = e => {
    e.preventDefault()
    const newData: ForecastData[] = []
    const dayIdx = daysOfTheWeek.indexOf(firstDay)
    for (let i = 0; i < 7; i++) {
      newData.push({
        day: daysOfTheWeek[(dayIdx + i) % 7],
        high: formData[`day${i + 1}high`],
        low: formData[`day${i + 1}low`],
        precip: formData[`day${i + 1}precip`],
        condition: formData[`day${i + 1}condition`],
        severe: Boolean(formData[`day${i + 1}severe`]),
      })
    }
    props.updateForecastData(newData)
  }

  const handleDegrees = e => {
    setDegreeUnits(e.target.value)
  }

  return (
    <div
      className='flex flex-col mb-10 justify-center items-center'
      style={{ width: '700px' }}
    >
      <h1 className='text-xl mt-5 mb-5'>Manual Forecast Data Entry</h1>
      <form
        onSubmit={handleFormSubmit}
        className='flex flex-col justify-center items-center'
        style={{ width: '700px' }}
      >
        <div className='flex flex-row gap-10'>
          <div className='flex flex-col justify-center items-center'>
            <label className='font-semibold text-white'>Forecast Start</label>
            <select
              className='mt-2 mb-2 p-2 border rounded-lg text-white'
              style={{ width: '100px' }}
              value={firstDay}
              onChange={handleFirstDay}
            >
              {daysOfTheWeek.map(day => (
                <option key={day} value={day} className='text-black'>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <label className='font-semibold text-white'>Units</label>
            <select
              className='mt-2 mb-2 p-2 border rounded-lg text-white'
              onChange={handleDegrees}
              style={{ width: '150px' }}
            >
              <option className='text-black'>Fahrenheit</option>
              <option className='text-black'>Celcius</option>
            </select>
          </div>
        </div>
        <div className='flex flex-row gap-4 mt-5'>
          <p className='mt-10' style={{ width: '75px' }}>
            High
          </p>
          {daysOfTheWeek.map((_day, i) => (
            <div className='flex flex-col justify-center items-center'>
              <label className='font-semibold text-white'>Day {i + 1}</label>
              <div className='input-icon input-icon-right'>
                <input
                  type='number'
                  id={`day${i + 1}high`}
                  name={`day${i + 1}high`}
                  value={formData[`day${i + 1}high`]}
                  className='mt-2 p-2 border rounded-lg text-white'
                  style={{ width: '100px' }}
                  placeholder='0'
                  onChange={handleFormChange}
                  required
                />
                <i>°{degreeUnits === 'Fahrenheit' ? 'F' : 'C'}</i>
              </div>
            </div>
          ))}
        </div>
        <div className='flex flex-row gap-4 mt-5'>
          <p className='mt-4' style={{ width: '75px' }}>
            Low
          </p>
          {daysOfTheWeek.map((_day, i) => (
            <div className='input-icon input-icon-right'>
              <input
                type='number'
                id={`day${i + 1}low`}
                name={`day${i + 1}low`}
                value={formData[`day${i + 1}low`]}
                className='mt-2 p-2 border rounded-lg text-white'
                style={{ width: '100px' }}
                placeholder='0'
                onChange={handleFormChange}
                required
              />
              <i>°{degreeUnits === 'Fahrenheit' ? 'F' : 'C'}</i>
            </div>
          ))}
        </div>
        <div className='flex flex-row gap-4 mt-5'>
          <p className='mt-4' style={{ width: '75px' }}>
            Precip
          </p>
          {daysOfTheWeek.map((_day, i) => (
            <div className='input-icon input-icon-right'>
              <input
                type='number'
                id={`day${i + 1}precip`}
                name={`day${i + 1}precip`}
                min='0'
                max='100'
                value={formData[`day${i + 1}precip`]}
                className='mt-2 p-2 border rounded-lg text-white'
                style={{ width: '100px' }}
                placeholder='0'
                onChange={handleFormChange}
                required
              />
              <i>%</i>
            </div>
          ))}
        </div>
        <div className='flex flex-row gap-4 mt-5'>
          <p className='mt-4' style={{ width: '75px' }}>
            Condition
          </p>
          {daysOfTheWeek.map((_day, i) => (
            <select
              id={`day${i + 1}condition`}
              name={`day${i + 1}condition`}
              className='mt-2 p-2 border rounded-lg text-white'
              style={{ width: '100px' }}
              onChange={handleFormChange}
              value={formData[`day${i + 1}condition`]}
            >
              {conditions.map(condition => (
                <option value={condition} className='text-black'>
                  {condition}
                </option>
              ))}
            </select>
          ))}
        </div>
        <div className='flex flex-row gap-4 mt-5'>
          <p className='mt-4' style={{ width: '75px' }}>
            Severe
          </p>
          {daysOfTheWeek.map((_day, i) => (
            <input
              type='checkbox'
              id={`day${i + 1}severe`}
              name={`day${i + 1}severe`}
              className='mt-2 p-2 border rounded-lg text-white'
              style={{ width: '100px' }}
              onChange={handleCheckboxUpdate}
              value={formData[`day${i + 1}severe`]}
            ></input>
          ))}
        </div>
        <input
          className='mt-10 p-2 border rounded-lg text-white'
          type='submit'
          value='Generate'
        />
      </form>
    </div>
  )
}

export default ForecastForm
