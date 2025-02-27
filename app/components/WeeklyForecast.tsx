import type { JSX } from 'react'
import type { ForecastData } from '../types/ForecastDataTypes'
import ConditionIcon from './ConditionIcon'

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
                            'flex flex-col items-center p-4 rounded-lg w-24 ' +
                            (severe ? 'bg-red-200' : 'bg-white')
                        }
                    >
                        <span
                            className={
                                'font-bold mb-4 text-lg ' +
                                (day === 'Sat' || day === 'Sun'
                                    ? 'text-red-400'
                                    : 'text-black')
                            }
                        >
                            {day}
                        </span>
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
