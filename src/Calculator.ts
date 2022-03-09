import { DistanceUnit, Settings, TemperatureUnit, UnitNames } from "./SettingsProvider"

type OptionsBase<typeName, unitType> = {
    type: typeName,
    value: number,
    from: unitType,
    to: unitType
}

type ConversionOptions = OptionsBase<'temperature', TemperatureUnit> | OptionsBase<'distance', DistanceUnit>

function convertTemperature(options: Omit<OptionsBase<'temperature', TemperatureUnit>, 'type'>): number | undefined {
    switch (options.from) {
        case 'imperial':
            switch (options.to) {
                case 'imperial-abs': return options.value + 459.67
                case 'metric': return (options.value - 32) * 5/9
                case 'metric-abs': return convertTemperature({ value: convertTemperature({ ...options, to: 'metric' })!, from: 'metric', to: 'metric-abs'})
                default: return undefined
            }
        case 'imperial-abs':
            switch (options.to) {
                case 'imperial': return options.value - 459.67
                case 'metric': return convertTemperature({ value: convertTemperature({ ...options, to: 'imperial' })!, from: 'imperial', to: 'metric'})
                case 'metric-abs': return convertTemperature({ value: convertTemperature({ ...options, to: 'metric' })!, from: 'metric', to: 'metric-abs'})
                default: return undefined
            }
        case 'metric':
            switch (options.to) {
                case 'metric-abs': return options.value + 273.15
                case 'imperial': return options.value * 1.8 + 32
                case 'imperial-abs': return convertTemperature({ value: convertTemperature({ ...options, to: 'imperial' })!, from: 'imperial', to: 'imperial-abs'})
                default: return undefined
            }
        case 'metric-abs':
            switch (options.to) {
                case 'metric': return options.value - 273.15
                case 'imperial': return convertTemperature({ value: convertTemperature({ ...options, to: 'metric' })!, from: 'metric', to: 'imperial'})
                case 'imperial-abs': return convertTemperature({value: convertTemperature({...options, to: 'imperial'})!, from: 'imperial', to: 'imperial-abs'})
                default: return undefined
            }
    }
}

function convertDistance(options: Omit<OptionsBase<'distance', DistanceUnit>, 'type'>): number | undefined {
    switch (options.from) {
        case 'imperial': return options.value * (381/1250)
        case 'metric': return options.value * (1250/381)
    }
}

const temperatureConversionFormulae = {
    'imperial': {
        'metric': '\\frac{({{X}} - 32) \\times 5}{9}',
        'imperial-abs': '{{X}} + 459.67'
    },
    'metric': {
        'imperial': '{{X}} \\times 1.8 + 32',
        'metric-abs': '{{X}} + 273.15'
    },
    'imperial-abs': {
        'imperial': '{{X}} - 459.67'
    },
    'metric-abs': {
        'metric': '{{X}} - 273.15'
    }
}

type IntermediateCalculation = {
    key: string,
    name: string,
    formula: string,
    symbol: string,
    answer: string,
    unit: string
}

const Calculator = {
    convert(options: ConversionOptions) {
        if (options.from === options.to)
            return options.value
        switch (options.type) {
            case 'temperature': return convertTemperature(options)!
            case 'distance': return convertDistance(options)!
        }
    },
    calculate(settings: Settings, temperature: number, time: number) {
        let intermediateSteps: IntermediateCalculation[] = []
        let convTemp = temperature
        if (settings.temperatureUnit !== 'metric') {
            convTemp = Calculator.convert({type: 'temperature', value: temperature, from: settings.temperatureUnit, to: 'metric'})
            if (settings.temperatureUnit === 'imperial-abs') {
                let T_F = Calculator.convert({ type: 'temperature', value: temperature, from: 'imperial-abs', to: 'imperial' })
                intermediateSteps.push({
                    key: 'convert-1',
                    name: `Convert ${temperature} ${UnitNames.temperature["imperial-abs"]} to ${UnitNames.temperature.imperial}`,
                    answer: T_F.toFixed(2),
                    unit: UnitNames.temperature.imperial,
                    symbol: 'T_F',
                    formula: temperatureConversionFormulae["imperial-abs"].imperial.replace('{{X}}', temperature.toString())
                }, {
                    key: 'convert-2',
                    name: `Convert ${T_F.toFixed(2)} ${UnitNames.temperature["imperial"]} to ${UnitNames.temperature.metric}`,
                    answer: convTemp.toFixed(2),
                    unit: UnitNames.temperature.metric,
                    symbol: 'T_C',
                    formula: temperatureConversionFormulae["imperial"].metric.replace('{{X}}', T_F.toFixed(2))
                })
            } else
                intermediateSteps.push({
                    key: 'convert-1',
                    name: `Convert ${temperature} ${UnitNames.temperature[settings.temperatureUnit]} to ${UnitNames.temperature.metric}`,
                    answer: convTemp.toFixed(2),
                    unit: UnitNames.temperature.metric,
                    symbol: 'T_C',
                    formula: temperatureConversionFormulae[settings.temperatureUnit].metric.replace('{{X}}', temperature.toString())
                })
        }

        let speed = 331.5 + 0.6 * convTemp
        intermediateSteps.push({
            key: 'speed-of-sound',
            name: `Calculate speed of sound in air at ${convTemp.toFixed(2)} ${UnitNames.temperature.metric}`,
            answer: speed.toFixed(2),
            unit: '\\frac{m}{s}',
            symbol: 's',
            formula: `331.5 + 0.60 \\times ${convTemp.toFixed(2)}`
        })

        let distance = speed * time
        intermediateSteps.push({
            key: 'distance',
            name: `Calculate distance traveled in ${time} s at ${speed.toFixed(2)} m/s`,
            answer: distance.toFixed(2),
            unit: 'm',
            symbol: 'd',
            formula: `${speed.toFixed(2)} \\times ${time}`
        })

        let finalDistance = 0, largeUnit = false

        if (settings.distanceUnit === 'metric') {
            if (distance <= 3)
                finalDistance = 0
            else if (distance >= 500) {
                largeUnit = true
                finalDistance = distance / 1000
                intermediateSteps.push({
                    key: 'largeUnit',
                    name: `Convert ${distance.toFixed(2)} m to km`,
                    answer: finalDistance.toFixed(2),
                    unit: 'km',
                    symbol: 'd',
                    formula: `\\frac{${distance.toFixed(2)}}{1000}`
                })
            } else 
                finalDistance = distance
        } else {
            finalDistance = Calculator.convert({type: 'distance', value: distance, from: 'metric', to: 'imperial'})
            intermediateSteps.push({
                key: 'm-to-ft',
                name: `Convert ${distance.toFixed(2)} m to ft`,
                answer: finalDistance.toFixed(2),
                unit: 'ft',
                symbol: 'd',
                formula: `${distance.toFixed(2)} \\times \\frac{1250}{381}`
            })

            if (distance <= 10)
                finalDistance = 0
            else if (finalDistance >= 1320) {
                largeUnit = true
                finalDistance /= 5280
                intermediateSteps.push({
                    key: 'largeUnit',
                    name: `Convert ${finalDistance.toFixed(2)} ft to mi`,
                    answer: finalDistance.toFixed(2),
                    unit: 'mi',
                    symbol: 'd',
                    formula: `\\frac{${(finalDistance*5280).toFixed(2)}}{5280}`
                })
            }
        }

        return {
            finalDistance: finalDistance,
            largeUnit: largeUnit,
            steps: intermediateSteps
        }
    }
}

export default Calculator