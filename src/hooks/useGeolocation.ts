import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    // Optional: Set to false to disable geolocation completely and suppress console warnings
    const ENABLE_GEOLOCATION = true;

    if (!ENABLE_GEOLOCATION || !navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        error: ENABLE_GEOLOCATION 
          ? 'Geolocation is not supported by your browser' 
          : null, // Suppress error if intentionally disabled
        loading: false,
      });
      return;
    }

    let retryCount = 0;
    const maxRetries = 2;

    const attemptGetLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
            loading: false,
          });
        },
        (error) => {
          // Suppress console warnings from CoreLocation on macOS
          let errorMessage = 'Unable to retrieve your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              // Retry with less accurate settings if first attempt fails
              if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(() => {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        error: null,
                        loading: false,
                      });
                    },
                    () => {
                      setState({
                        latitude: null,
                        longitude: null,
                        error: 'Location information unavailable. You can still use the app by selecting an airport.',
                        loading: false,
                      });
                    },
                    {
                      enableHighAccuracy: false,
                      timeout: 15000,
                      maximumAge: 300000, // 5 minutes
                    }
                  );
                }, 1000);
                return;
              }
              errorMessage = 'Location information unavailable. You can still use the app by selecting an airport.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. You can still use the app by selecting an airport.';
              break;
          }

          setState({
            latitude: null,
            longitude: null,
            error: errorMessage,
            loading: false,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    attemptGetLocation();
  }, []);

  return state;
}

