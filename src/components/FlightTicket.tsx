import { motion } from 'framer-motion'
import {
  Plane,
  MapPin,
  Clock,
  Ticket,
  Play,
  Pause,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Airport } from '@/types/airport'
import { formatDuration } from '@/lib/flightCalculator'
import { FocusTimeProgress } from './FocusTimeProgress'

interface FlightTicketProps {
  airport: Airport | null
  userLocation: { latitude: number; longitude: number } | null
  userCityName: string | null
  flightDurationSeconds: number | null
  focusTimeSeconds: number
  isPlaying: boolean
  isLoading: boolean
  bothAvailable: boolean
  onPlayPause: () => void
}

export function FlightTicket({
  airport,
  userLocation,
  userCityName,
  flightDurationSeconds,
  focusTimeSeconds,
  isPlaying,
  isLoading,
  bothAvailable,
  onPlayPause,
}: FlightTicketProps) {
  // Don't render if no airport selected or no location
  if (!airport || !userLocation || !flightDurationSeconds) {
    return null
  }

  const isExpired =
    flightDurationSeconds > 0 && focusTimeSeconds >= flightDurationSeconds
  const ticketStatus = isExpired ? 'Expired' : 'Active'
  const formatCoordinate = (
    value: number,
    positiveSuffix: string,
    negativeSuffix: string
  ) => {
    const suffix = value >= 0 ? positiveSuffix : negativeSuffix
    return `${Math.abs(value).toFixed(4)}°${suffix}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto w-full max-w-4xl"
    >
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            Flight Ticket
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ticket Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant={isExpired ? 'destructive' : 'default'}
              className="px-4 py-1 text-sm"
            >
              {ticketStatus}
            </Badge>
          </div>

          {/* Origin and Destination */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Origin */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Origin</span>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-lg font-semibold">
                  {userCityName || 'Your Location'}
                </p>
                {userCityName && (
                  <p className="text-sm text-muted-foreground">
                    {formatCoordinate(userLocation.latitude, 'N', 'S')},{' '}
                    {formatCoordinate(userLocation.longitude, 'E', 'W')}
                  </p>
                )}
              </div>
            </div>

            {/* Destination */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Plane className="h-4 w-4" />
                <span>Destination</span>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-lg font-semibold">{airport.name}</p>
                <p className="text-sm text-muted-foreground">
                  {airport.code} - {airport.location}, {airport.country}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Flight Duration */}
          <div className="flex items-center justify-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Estimated Flight Duration
              </p>
              <p className="text-2xl font-bold">
                {formatDuration(flightDurationSeconds)}
              </p>
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

          <Separator />

          {/* Start/Pause Button */}
          <div className="flex justify-center pt-2">
            <Button
              onClick={onPlayPause}
              disabled={isLoading || !bothAvailable}
              size="lg"
              className="w-32"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
              <span className="ml-2">
                {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Start'}
              </span>
            </Button>
          </div>
          {!bothAvailable && (
            <p className="pt-2 text-center text-sm text-muted-foreground">
              {!airport ? 'Select an airport' : 'One audio source unavailable'}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
