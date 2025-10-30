import { Airport } from '../types/airport';

export const airports: Airport[] = [
  {
    code: 'JFK',
    icao: 'KJFK',
    name: 'John F. Kennedy International Airport',
    location: 'New York',
    country: 'United States',
    latitude: 40.6413,
    longitude: -73.7781,
    towerFrequency: '119.1 MHz',
    groundFrequency: '121.9 MHz',
    approachFrequency: '119.1 MHz',
    audioUrl: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://s1-fmt2.liveatc.net/kjfk_twr')
  },
  {
    code: 'LAX',
    icao: 'KLAX',
    name: 'Los Angeles International Airport',
    location: 'Los Angeles',
    country: 'United States',
    latitude: 33.9425,
    longitude: -118.4081,
    towerFrequency: '133.9 MHz',
    groundFrequency: '121.65 MHz',
    approachFrequency: '119.5 MHz',
    audioUrl: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://s1-fmt2.liveatc.net/klax_twr')
  },
  {
    code: 'ORD',
    icao: 'KORD',
    name: "O'Hare International Airport",
    location: 'Chicago',
    country: 'United States',
    latitude: 41.9786,
    longitude: -87.9048,
    towerFrequency: '119.1 MHz',
    groundFrequency: '121.9 MHz',
    approachFrequency: '119.1 MHz',
    audioUrl: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://s1-fmt2.liveatc.net/kord_twr')
  },
  {
    code: 'ATL',
    icao: 'KATL',
    name: 'Hartsfield-Jackson Atlanta International Airport',
    location: 'Atlanta',
    country: 'United States',
    latitude: 33.6407,
    longitude: -84.4277,
    towerFrequency: '119.1 MHz',
    groundFrequency: '121.9 MHz',
    approachFrequency: '119.1 MHz',
    audioUrl: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://s1-fmt2.liveatc.net/katl_twr')
  },
  {
    code: 'LHR',
    icao: 'EGLL',
    name: 'London Heathrow Airport',
    location: 'London',
    country: 'United Kingdom',
    latitude: 51.4700,
    longitude: -0.4543,
    towerFrequency: '118.5 MHz',
    groundFrequency: '121.9 MHz',
    approachFrequency: '119.1 MHz',
    audioUrl: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://s1-fmt2.liveatc.net/egll_twr')
  }
];

export const getAirportByCode = (code: string): Airport | undefined => {
  return airports.find(airport => airport.code === code);
};
