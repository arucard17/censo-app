export interface GpsReading {
  latitude: number
  longitude: number
  accuracy: number
  capturedAt: string
}

const DEFAULT_TIMEOUT_MS = 15_000

export async function captureGpsPosition(
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<GpsReading | null> {
  if (!navigator.geolocation) return null

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          capturedAt: new Date().toISOString(),
        })
      },
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 0,
      },
    )
  })
}
