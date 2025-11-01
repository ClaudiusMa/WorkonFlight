/**
 * Reverse geocode coordinates to get city name
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */
export async function getCityName(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Fly/1.0',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch location data')
    }

    const data = await response.json()
    const address = data.address

    // Try to get city name from various fields
    const cityName =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.suburb ||
      address.county ||
      null

    if (cityName) {
      // Add state/country if available for better context
      const state = address.state || address.region || ''
      const country = address.country || ''

      if (state && country) {
        return `${cityName}, ${state}, ${country}`
      } else if (country) {
        return `${cityName}, ${country}`
      }

      return cityName
    }

    // Fallback: return coordinates if city not found
    return `${latitude.toFixed(4)}°N, ${Math.abs(longitude).toFixed(4)}°W`
  } catch (error) {
    console.error('Error reverse geocoding:', error)
    // Fallback to coordinates on error
    return `${latitude.toFixed(4)}°N, ${Math.abs(longitude).toFixed(4)}°W`
  }
}

