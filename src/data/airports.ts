import { Airport } from '../types/airport';

export const airports: Airport[] = [
  {
    code: 'JFK',
    icao: 'KJFK',
    name: 'John F. Kennedy International Airport',
    location: 'New York',
    country: 'United States',
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
    towerFrequency: '118.5 MHz',
    groundFrequency: '121.9 MHz',
    approachFrequency: '119.1 MHz',
    audioUrl: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://s1-fmt2.liveatc.net/egll_twr')
  }
];

export const getAirportByCode = (code: string): Airport | undefined => {
  return airports.find(airport => airport.code === code);
};
