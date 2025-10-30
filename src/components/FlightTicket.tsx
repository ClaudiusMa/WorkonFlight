import { motion } from 'framer-motion';
import { Plane, MapPin, Clock, Ticket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Airport } from '@/types/airport';
import { formatDuration } from '@/lib/flightCalculator';
import { FocusTimeProgress } from './FocusTimeProgress';

interface FlightTicketProps {
  airport: Airport | null;
  userLocation: { latitude: number; longitude: number } | null;
  userCityName: string | null;
  flightDurationSeconds: number | null;
  focusTimeSeconds: number;
}

export function FlightTicket({
  airport,
  userLocation,
  userCityName,
  flightDurationSeconds,
  focusTimeSeconds,
}: FlightTicketProps) {
  // Don't render if no airport selected or no location
  if (!airport || !userLocation || !flightDurationSeconds) {
    return null;
  }

  const isExpired = flightDurationSeconds > 0 && focusTimeSeconds >= flightDurationSeconds;
  const ticketStatus = isExpired ? 'Expired' : 'Active';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            Flight Ticket
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ticket Status Badge */}
          <div className="flex justify-center">
            <Badge variant={isExpired ? 'destructive' : 'default'} className="text-sm px-4 py-1">
              {ticketStatus}
            </Badge>
          </div>

          {/* Origin and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Origin */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Origin</span>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold text-lg">
                  {userCityName || 'Your Location'}
                </p>
                {userCityName && (
                  <p className="text-sm text-muted-foreground">
                    {userLocation.latitude.toFixed(4)}°N, {Math.abs(userLocation.longitude).toFixed(4)}°W
                  </p>
                )}
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Plane className="w-4 h-4" />
                <span>Destination</span>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-semibold text-lg">{airport.name}</p>
                <p className="text-sm text-muted-foreground">
                  {airport.code} - {airport.location}, {airport.country}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Flight Duration */}
          <div className="flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Estimated Flight Duration</p>
              <p className="text-2xl font-bold">{formatDuration(flightDurationSeconds)}</p>
            </div>
          </div>

          <Separator />

          {/* Focus Time Progress */}
          <div className="pt-2">
            <FocusTimeProgress
              elapsedSeconds={focusTimeSeconds}
              totalSeconds={flightDurationSeconds}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

