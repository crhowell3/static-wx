import type { Route } from './+types/home'
import { WeatherForecast } from '../pages/forecast'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'static-wx' },
    {
      name: 'description',
      content: 'Create and download weather infographics!',
    },
  ]
}

export default function Home() {
  return <WeatherForecast />
}
