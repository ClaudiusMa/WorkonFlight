import { motion } from 'framer-motion';
import { MapPin, Radio, Globe, Plane } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-primary" />
            Airport Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Airport Header */}
          <div className="pb-4 text-center">
            <h3 className="mb-2 text-2xl font-bold text-foreground">
              {airport.name}
            </h3>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="default">{airport.code}</Badge>
              <Separator orientation="vertical" className="h-4" />
              <Badge variant="outline">{airport.icao}</Badge>
            </div>
          </div>

          {/* Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground">Location</h4>
                <p className="text-muted-foreground">{airport.location}</p>
                <p className="text-sm text-muted-foreground">{airport.country}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground">ICAO Code</h4>
                <p className="text-muted-foreground font-mono text-lg">{airport.icao}</p>
              </div>
            </div>
          </div>

          {/* Radio Frequencies */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Radio className="w-5 h-5 text-primary" />
              Radio Frequencies
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Tower</p>
                <Badge variant="secondary" className="font-mono text-lg">
                  {airport.towerFrequency}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Ground</p>
                <Badge variant="secondary" className="font-mono text-lg">
                  {airport.groundFrequency}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Approach</p>
                <Badge variant="secondary" className="font-mono text-lg">
                  {airport.approachFrequency}
                </Badge>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <p className="font-medium mb-1 text-foreground">About this feed:</p>
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
