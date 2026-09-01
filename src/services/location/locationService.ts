import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder-reborn';

export interface LocationCoords {
  readonly lat: number;
  readonly lng: number;
}

export const locationService = {
  /**
   * Fetches the device's current location.
   * Resolves to coordinates if successful, or null if it fails (e.g., timeout, disabled).
   */
  getCurrentPosition(): Promise<LocationCoords | null> {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          // Failure to get coordinates shouldn't crash the wizard.
          // eslint-disable-next-line no-console
          console.log('[locationService] getCurrentPosition failed:', error.message);
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    });
  },

  /**
   * Reverse geocodes the coordinates into a city-level label (e.g. "Mumbai").
   * Resolves to a string if successful, or null if the geocoder fails or finds nothing.
   */
  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const results = await Geocoder.geocodePosition({ lat, lng });
      if (results && results.length > 0) {
        // Prefer locality (city) or subAdminArea (district).
        const match = results[0];
        if (match) {
          const label = match.locality || match.subAdminArea || match.adminArea || null;
          return label;
        }
      }
      return null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('[locationService] reverseGeocode failed:', error);
      return null;
    }
  },
};
