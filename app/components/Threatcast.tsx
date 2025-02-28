import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import React, { useState } from 'react'
import { Tornado, Waves, CloudHail, Wind } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title)

const colorMapping: Record<number, string> = {
  1: '#84CC16',
  2: '#EAB308',
  3: '#F97316',
  4: '#EF4444',
  5: '#EC4899',
}

const severityLabels: Record<string, number> = {
  None: 0,
  MRGL: 1,
  SLGT: 2,
  ENH: 3,
  MDT: 4,
  HIGH: 5,
}

const categories: string[] = ['Tornadoes', 'Wind', 'Hail', 'Flooding']

type ThreatLevels = {
  Tornadoes: string
  Wind: string
  Hail: string
  Flooding: string
}

const options = {
  indexAxis: 'y' as const,
  scales: {
    x: {
      position: 'top' as const,
      min: 0,
      max: 5,
      ticks: {
        stepSize: 1,
        callback: value => {
          return (
            Object.keys(severityLabels).find(
              key => severityLabels[key] === value,
            ) || ''
          )
        },
      },
      grid: {
        drawTicks: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
  responsive: false,
  animation: false,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Hazards',
    },
  },
}

const Threatcast: React.FC = ({ threatRef }) => {
  const [threatLevels, setThreatLevels] = useState<ThreatLevels>({
    Tornadoes: 'None',
    Wind: 'None',
    Hail: 'None',
    Flooding: 'None',
  })

  const handleChange = (category: string, value: string) => {
    setThreatLevels(prev => ({ ...prev, [category]: value }))
  }

  const threatData = {
    labels: categories,
    datasets: [
      {
        label: 'Threatcast',
        data: categories.map(cat => severityLabels[threatLevels[cat]]),
        backgroundColor: categories.map(
          cat => colorMapping[severityLabels[threatLevels[cat]]] || '#ccc',
        ),
        borderColor: 'black',
        borderWidth: 0,
        barThickness: 50,
      },
    ],
  }

  return (
    <div className='flex flex-col items-center gap-6'>
      <div className='p-6 bg-blue-100 rounded-lg'>
        <h2 className='text-lg font-bold mb-4 text-black'>
          Threat Level Editor
        </h2>
        <div className='grid grid-cols-2 gap-4'>
          {categories.map(category => (
            <div key={category} className='flex flex-col items-center'>
              <label className='font-semibold text-black'>{category}</label>
              <select
                value={threatLevels[category]}
                onChange={e => handleChange(category, e.target.value)}
                className='mt-2 p-2 border rounded-lg text-black'
              >
                {Object.keys(severityLabels).map(label => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      <div
        ref={threatRef}
        className='p-6 rounded-lg bg-white flex justify-center items-center'
        style={{ width: '700px', height: '500px' }}
      >
        <Bar data={threatData} height='450px' width='650px' options={options} />
      </div>
    </div>
  )
}

export default Threatcast
