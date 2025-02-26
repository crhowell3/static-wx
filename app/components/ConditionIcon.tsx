import {
    Sun,
    CloudRain,
    Cloud,
    CloudSun,
    Cloudy,
    CloudSnow,
    CloudLightning,
    Wind,
} from 'lucide-react'
import type { JSX } from 'react'

type ConditionIconProps = {
    condition: string
}

const ConditionIcon = ({ condition }: ConditionIconProps): JSX.Element => {
    const icons: Record<string, JSX.Element> = {
        sunny: <Sun size={32} className="text-yellow-500" />,
        'mostly sunny': (
            <div className="condition-icon mostly-sunny">
                <CloudSun size={32} />
            </div>
        ),
        'partly cloudy': <Cloud size={32} className="text-gray-400" />,
        cloudy: <Cloudy size={32} className="text-gray-400" />,
        rain: (
            <div className="condition-icon rain">
                <CloudRain size={32} />
            </div>
        ),
        thunderstorm: (
            <div className="condition-icon thunderstorm">
                <CloudLightning size={32} />
            </div>
        ),
        windy: (
            <div className="condition-icon windy">
                <Wind size={32} />
            </div>
        ),
        snow: (
            <div className="condition-icon snow">
                <CloudSnow size={32} />
            </div>
        ),
    }
    return icons[condition] || <Cloud size={32} className="text-gray-400" />
}

export default ConditionIcon
