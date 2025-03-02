import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Rectangle,
  Cell,
} from 'recharts'
import React, { useState } from 'react'
import { Tornado, Waves, CloudHail, Wind } from 'lucide-react'

const colorMapping: Record<number, string> = {
  1: '#84CC16',
  2: '#EAB308',
  3: '#F97316',
  4: '#EF4444',
}

const severityLabels: Record<string, number> = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  EXTREME: 4,
}

const categories: string[] = ['Tornadoes', 'Wind', 'Hail', 'Flooding']

const formatYAxis = (value: number) => {
  switch (value) {
    case 1:
      return 'LOW'
    case 2:
      return 'MEDIUM'
    case 3:
      return 'HIGH'
    case 4:
      return 'EXTREME'
    default:
      return ''
  }
}

const renderCustomAxisTick = ({ x, y, payload }) => {
  let icon = <></>
  switch (payload.value) {
    case 'Tornadoes':
      icon = <Tornado size={24} className='text-black' />
      break
    case 'Wind':
      icon = <Wind size={24} className='text-black' />
      break
    case 'Hail':
      icon = <CloudHail size={24} className='text-black' />
      break
    case 'Flooding':
      icon = <Waves size={24} className='text-black' />
      break
  }

  return <g transform={`translate(${x - 30}, ${y - 10})`}>{icon}</g>
}

const Threatcast: React.FC = ({ threatRef }) => {
  const [threatLevels, setThreatLevels] = useState({
    Tornadoes: 'NONE',
    Wind: 'NONE',
    Hail: 'NONE',
    Flooding: 'NONE',
  })

  // Generate the threatData dynamically based on threatLevels
  const generateThreatData = () => {
    return categories.map(category => ({
      name: category,
      uv: severityLabels[threatLevels[category]],
    }))
  }

  const handleChange = (category: string, value: string) => {
    setThreatLevels(prev => ({ ...prev, [category]: value }))
  }

  // Generate threat data whenever the threatLevels state changes
  const threatData = generateThreatData()

  return (
    <div className='flex flex-col items-center gap-6'>
      <div className='p-6 bg-blue-100 rounded-lg'>
        <h2 className='text-lg font-bold mb-4 text-black'>
          Threat Level Editor
        </h2>
        <div className='grid grid-cols-4 gap-4'>
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
        <ResponsiveContainer width='100%' height='100%'>
          <div>
            <h3 className='text-xl font-bold mb-4 text-black text-center'>
              Weather Hazards
            </h3>
            <BarChart
              width={650}
              height={400}
              layout='vertical'
              data={threatData}
              margin={{
                top: 15,
                right: 40,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                type='number'
                interval={0}
                tickCount={5}
                tickFormatter={formatYAxis}
                ticks={[]}
                allowDecimals={false}
              />
              <YAxis
                type='category'
                dataKey='name'
                tick={renderCustomAxisTick}
              />
              <Bar
                dataKey='uv'
                activeBar={<Rectangle fill='gold' stroke='purple' />}
              >
                {threatData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorMapping[entry.uv]} />
                ))}
              </Bar>
            </BarChart>
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Threatcast
