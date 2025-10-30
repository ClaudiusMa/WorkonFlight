export interface Airport {
  code: string;
  icao: string;
  name: string;
  location: string;
  country: string;
  towerFrequency: string;
  groundFrequency: string;
  approachFrequency: string;
  audioUrl: string;
}

export interface AirportSelection {
  airport: Airport | null;
  isLoading: boolean;
  error: string | null;
}
