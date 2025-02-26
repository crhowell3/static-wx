import { Bar } from 'react-chartjs-2'
import { type JSX } from 'react'
import type { ChartOptions } from 'chart.js'
import { type ThreatData } from '../types/ForecastDataTypes'
import { severityLabels } from '../utils/Constants'

interface ThreatDataProps {
    threatData: ThreatData | null
}

const Threatcast = ({ threatData }: ThreatDataProps): JSX.Element => {
    const options: ChartOptions = {
        indexAxis: 'y' as const,
        scales: {
            x: {
                position: 'top' as const,
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1,
                    align: 'center',
                    callback: (value) => {
                        const numericValue = Number(value)
                        return severityLabels[numericValue] || ''
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
