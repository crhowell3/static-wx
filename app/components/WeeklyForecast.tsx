import type { JSX } from 'react'
import type { ForecastData } from '../types/ForecastDataTypes'
import ConditionIcon from './ConditionIcon'
import { TriangleAlert } from 'lucide-react'

interface ForecastDataProps {
    forecastData: ForecastData[]
}

const WeeklyForecast = ({ forecastData }: ForecastDataProps): JSX.Element => {
    return (
        <>
            {forecastData.map(
                ({ day, high, low, precip, condition, severe }) => (
                    <div
                        key={day}
                        className={
                            'flex flex-col items-center p-4 rounded-lg w-24 bg-white'
                        }
                    >
                        <span
                            className={
                                'font-bold text-lg ' +
                                (day === 'Sat' || day === 'Sun'
                                    ? 'text-red-400 '
                                    : 'text-black ') + (severe ? '' : 'mb-5')
                            }
                        >
                            {day}
                        </span>
                        {severe ? (
                            <TriangleAlert
                                size={20}
                                className="text-red-600"
                            />
                        ) : (
                            <></>
                        )}
                        <ConditionIcon condition={condition} />
                        <span className="text-sm font-semibold mt-4 text-black">
                            {precip}%
                        </span>
                        <span className="text-xl font-semibold mt-2 text-black">
                            {high}°F
                        </span>
                        <span className="text-l font-semibold text-gray-500">
                            {low}°F
                        </span>
                    </div>
                )
            )}
        </>
    )
}

export default WeeklyForecast
