import { motion } from 'framer-motion';
import { MapPin, Radio, Globe, Plane } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Airport } from '@/types/airport';

interface AirportInfoProps {
  airport: Airport | null;
}

export function AirportInfo({ airport }: AirportInfoProps) {
  if (!airport) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-600" />
            Airport Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Airport Header */}
          <div className="text-center pb-4 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {airport.name}
            </h3>
            <div className="flex items-center justify-center gap-4 text-gray-600">
              <span className="text-lg font-semibold">{airport.code}</span>
              <span className="text-sm">•</span>
              <span className="text-sm">{airport.icao}</span>
            </div>
          </div>

          {/* Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">Location</h4>
                <p className="text-gray-600">{airport.location}</p>
                <p className="text-sm text-gray-500">{airport.country}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900">ICAO Code</h4>
                <p className="text-gray-600 font-mono text-lg">{airport.icao}</p>
              </div>
            </div>
          </div>

          {/* Radio Frequencies */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Radio className="w-5 h-5 text-purple-600" />
              Radio Frequencies
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Tower</p>
                <p className="font-mono font-semibold text-lg text-blue-700">
                  {airport.towerFrequency}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Ground</p>
                <p className="font-mono font-semibold text-lg text-green-700">
                  {airport.groundFrequency}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Approach</p>
                <p className="font-mono font-semibold text-lg text-purple-700">
                  {airport.approachFrequency}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">About this feed:</p>
            <p>
              This is a live audio stream from LiveATC.net providing real-time air traffic control 
              communications for {airport.name}. The feed typically includes tower, ground, and 
              approach control frequencies.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
