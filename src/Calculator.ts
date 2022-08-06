export type TempUnit = 'f' | 'c' | 'k'
export type DistanceUnit = 'mi' | 'km'

export const TempDisplayNames: {[k in TempUnit]: string} = {
    'c': '°C', 'f': '°F', 'k': 'K'
}

export function convertTemperature(value: number, unit: TempUnit, to: TempUnit): number {
    switch (unit) {
        case 'f': {
            switch (to) {
                case 'c': return (value - 32) * 5/9
                case 'k': {
                    let c = convertTemperature(value, unit, 'c')
                    return convertTemperature(c, 'c', 'k')
                }
                default: return value
            }
        }
        case 'c': {
            switch (to) {
                case 'f': return value * 1.8 + 32
                case 'k': return value + 273.15
                default: return value
            }
        }
        case 'k': {
            switch (to) {
                case 'c': return value - 273.15
                case 'f': {
                    let c = convertTemperature(value, unit, 'c')
                    return convertTemperature(c, 'c', 'f')
                }
                default: return value
            }
        }
    }
}

export function convertDistance(value: number, unit: DistanceUnit, to: DistanceUnit): number {
    if (unit === to) return value
    else if (unit === 'mi') return value / 0.6214
    else if (unit === 'km') return value * 0.6214
    else throw new Error('')
}

// meters per second
export function getSpeedOfSound(tempC: number): number {
    return 331.5 + 0.6 * tempC
}

type CalculatorOptions = {
    temperature: [number, TempUnit],
    time: number
    distanceUnit: DistanceUnit
}
export function calculate(options: CalculatorOptions) {
    let [inTemp, inTempUnit] = options.temperature
    let tempC = convertTemperature(inTemp, inTempUnit, 'c')
    let speed = getSpeedOfSound(tempC)
    let distanceM = speed * options.time
    let outDistance = convertDistance(distanceM / 1000, 'km', options.distanceUnit)
    let outDistanceUnit = 'kilometer'
    if (options.distanceUnit === 'km') {
        if (outDistance <= 0.015) // 15 meters
            outDistance = 0
        else if (outDistance < 0.5) {
            outDistance *= 1000 // km -> m
            outDistanceUnit = 'meter'
        }
    } else if (options.distanceUnit === 'mi') {
        if (outDistance <= 0.0095) // ~50 feet
            outDistance = 0
        else if (outDistance < 0.25) {
            outDistance *= 5280 // mi -> ft
            outDistanceUnit = 'feet'
        } else
            outDistanceUnit = 'mile'
    }

    if (outDistance === 0)
        return 'right next to you'

    let singular = outDistance.toFixed(2) === '1.00'
    if (singular && outDistanceUnit === 'feet')
        outDistanceUnit = 'foot'

    return `${outDistance.toFixed(2)} ${outDistanceUnit}${singular || outDistanceUnit[0] === 'f' ? '' : 's'} away`
}