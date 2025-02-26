export interface ForecastData {
    day: string
    high: number
    low: number
    precip: number
    condition: string
    severe: boolean
}

export interface ThreatData {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        backgroundColor: string[]
        borderColor: string
        borderWidth: number
    }[]
}