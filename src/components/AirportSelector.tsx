import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Airport } from '@/types/airport';

interface AirportSelectorProps {
  airports: Airport[];
  selectedAirport: Airport | null;
  onAirportSelect: (airport: Airport) => void;
  isLoading?: boolean;
}

export function AirportSelector({ 
  airports, 
  selectedAirport, 
  onAirportSelect, 
  isLoading = false 
}: AirportSelectorProps) {
  const handleValueChange = (airportCode: string) => {
    const airport = airports.find(a => a.code === airportCode);
    if (airport) {
      onAirportSelect(airport);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="flex items-center gap-2 mb-4">
        <Plane className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Select Airport</h2>
      </div>
      
      <Select 
        value={selectedAirport?.code || ''} 
        onValueChange={handleValueChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full h-12 text-left">
          <SelectValue 
            placeholder={isLoading ? "Loading airports..." : "Choose an airport to listen to ATC"} 
          />
        </SelectTrigger>
        <SelectContent>
          {airports.map((airport) => (
            <SelectItem key={airport.code} value={airport.code}>
              <div className="flex flex-col items-start">
                <div className="font-semibold">
                  {airport.code} - {airport.name}
                </div>
                <div className="text-sm text-gray-500">
                  {airport.location}, {airport.country}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
}
