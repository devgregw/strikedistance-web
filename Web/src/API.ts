export function getWeatherConditions(coords: GeolocationCoordinates): Promise<{ tempC: number, location: { name: string, country: string } }> {
    const key = import.meta.env.VITE_WEATHER_API_KEY
    return window.fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${key}&units=metric`)
        .then(r => r.json())
        .then(json => ({tempC: json.main.temp, location: {name: json.name, country: json.sys.country}}))
}
