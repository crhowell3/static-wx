import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { type JSX } from 'react'
import { type ThreatData } from '../types/ForecastDataTypes'
import { Tornado, Waves, CloudHail, Wind } from 'lucide-react'

interface ThreatDataProps {
    threatData: ThreatData | null
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title)

const options = {
    indexAxis: 'y' as const,
    elements: {
        bar: {
            innerWidth: 22,
        },
    },
    scales: {
        x: {
            position: 'top' as const,
            min: 0,
            max: 5,
            ticks: {
                stepSize: 1,
                align: 'center',
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
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: false,
        },
        title: {
            display: true,
            text: 'Hazards',
        },
    },
}

const labels = ['Wind', 'Tornadoes', 'Hail', 'Flooding']

const Threatcast = ({ threatData }: ThreatDataProps): JSX.Element => {
    return (
        <div
            style={{ width: '700px' }}
            className="items-center p-4 rounded-lg bg-white"
        >
            {threatData && <Bar data={threatData} options={options} />}
        </div>
    )
}

export default Threatcast
