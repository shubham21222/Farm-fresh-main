"use client";

import { useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react';
import Image from 'next/image';

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temp: 28,
    humidity: 65,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    forecast: [
      { day: 'Thu', temp: 29, icon: Sun },
      { day: 'Fri', temp: 27, icon: CloudRain },
      { day: 'Sat', temp: 26, icon: Cloud },
      { day: 'Sun', temp: 28, icon: Sun },
    ]
  });

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Weather Header with Background */}
      <div className="relative h-48">
        <Image
          src="https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&ixid=MnwxfDB8MXxyYW5kb218MHx8c3VubnksZmllbGR8fHx8fHwxNzA4NTAyNDAw&ixlib=rb-4.0.3&q=80&w=400"
          alt="Weather Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
        <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
          <h2 className="text-lg font-semibold">Weather Forecast</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Cloud className="h-8 w-8" />
                <span className="text-4xl font-bold">{weather.temp}°C</span>
              </div>
              <p className="text-white/90 mt-1">{weather.condition}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-white/90">
                <Droplets className="h-4 w-4 mr-2" />
                <span>Humidity: {weather.humidity}%</span>
              </div>
              <div className="flex items-center text-sm text-white/90">
                <Wind className="h-4 w-4 mr-2" />
                <span>Wind: {weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="p-6">
        <div className="grid grid-cols-4 gap-2">
          {weather.forecast.map((day, index) => (
            <div 
              key={index} 
              className="text-center p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <p className="text-sm font-medium text-gray-600 mb-2">{day.day}</p>
              <day.icon className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <p className="text-sm font-medium text-gray-900">{day.temp}°C</p>
            </div>
          ))}
        </div>

        {/* Farming Tips */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-800 mb-3">Farming Tips</h3>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8ZmFybWluZyx2ZWdldGFibGVzfHx8fHx8MTcwODUwMjQwMA&ixlib=rb-4.0.3&q=80&w=100"
                  alt="Farming Tip"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-blue-700">
                  Perfect conditions for watering plants in the evening. Humidity levels are moderate.
                </p>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2">
                  View More Tips →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget; 