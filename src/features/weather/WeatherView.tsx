import React from 'react'
import { Cloud, CloudRain, Thermometer, MapPin } from 'lucide-react'
import { mockWeatherData } from '@/shared/mock-data/mockData'

const WeatherView: React.FC = () => {
  const data = mockWeatherData

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Cloud className="mr-2" size={24} />
        Weather
      </h1>

      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white overflow-hidden shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <MapPin size={18} className="mr-1" />
                <h2 className="text-xl font-semibold">{data.location}</h2>
              </div>
              <div className="text-6xl font-light mb-4">
                {data.temperature}°
              </div>
              <div className="text-xl">{data.condition}</div>
            </div>

            <div className="text-8xl opacity-30">
              {data.condition.includes('Cloud') ? <Cloud /> : <CloudRain />}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm opacity-75">High</div>
              <div className="font-medium">{data.high}°</div>
            </div>
            <div>
              <div className="text-sm opacity-75">Low</div>
              <div className="font-medium">{data.low}°</div>
            </div>
            <div>
              <div className="text-sm opacity-75">Precipitation</div>
              <div className="font-medium">{data.precipitation}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium mb-3">Hourly Forecast</h3>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>{`${10 + i}:00`}</div>
                <div className="flex items-center">
                  <Thermometer size={14} className="mr-1 text-gray-500" />
                  <span>
                    {Math.round(data.temperature + (Math.random() * 4 - 2))}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium mb-3">Weekly Forecast</h3>
          <div className="grid grid-cols-5 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
              <div key={i} className="text-center p-2">
                <div className="text-sm font-medium">{day}</div>
                <div className="my-2">
                  {i % 2 === 0 ? (
                    <Cloud size={20} className="mx-auto text-gray-500" />
                  ) : (
                    <CloudRain size={20} className="mx-auto text-gray-500" />
                  )}
                </div>
                <div className="text-sm">
                  {Math.round(data.temperature + (Math.random() * 6 - 3))}°
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherView
