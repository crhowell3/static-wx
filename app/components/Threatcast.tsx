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
import { Tornado, Waves, CloudHail, Wind } from 'lucide-react'

const colorMapping: Record<number, string> = {
  1: '#84CC16',
  2: '#EAB308',
  3: '#F97316',
  4: '#EF4444',
}

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

function Threatcast(props) {
  return (
    <div className='flex flex-col items-center gap-6'>
      <div
        className='p-6 rounded-lg bg-white flex justify-center items-center flex-col'
        style={{ width: '700px', height: '500px' }}
      >
        <ResponsiveContainer width='100%' height='100%'>
          <div>
            <h3 className='text-xl font-bold text-black text-center'>
              Hazards Outlook {props.city !== '' ? `for ${props.city}` : ''}
            </h3>
            <h4 className='text-md font-bold mb-4 text-black text-center'>
              SAT 12 AM - 7 AM
            </h4>
            <BarChart
              width={650}
              height={400}
              layout='vertical'
              data={props.threatData}
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
                {props.threatData.map((entry, index) => (
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
