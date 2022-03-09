import { createContext, ReactElement, useContext, useEffect, useRef, useState } from "react";

type System = 'imperial' | 'metric'
export type TemperatureUnit = System | 'metric-abs' | 'imperial-abs'
export type DistanceUnit = System

type Mappings = {
    temperature: {[system in TemperatureUnit]: string},
    distance: { [system in DistanceUnit]: string }
}

export const UnitNames: Mappings = {
    temperature: {
        'metric': '°C',
        'imperial': '°F',
        'metric-abs': 'K',
        'imperial-abs': '°R'
    },
    distance: {
        'metric': 'm or km',
        'imperial': 'ft or mi'
    }
}

export type Settings = {
    temperatureUnit: TemperatureUnit
    distanceUnit: DistanceUnit
    showCalculations: boolean
}

const savedSettings = localStorage.getItem('sd-settings')
console.debug('Loading settings', savedSettings)
let defaultSettings: Settings = savedSettings !== null ? JSON.parse(savedSettings) as Settings : {
    temperatureUnit: 'metric',
    distanceUnit: 'metric',
    showCalculations: false
}

if (!['metric', 'imperial', 'metric-abs', 'imperial-abs'].includes(defaultSettings.temperatureUnit)
    || !['metric', 'imperial'].includes(defaultSettings.distanceUnit)
    || typeof defaultSettings.showCalculations !== 'boolean') {
        console.warn('Resetting settings - validation failed')
    defaultSettings = {
        temperatureUnit: 'metric',
        distanceUnit: 'metric',
        showCalculations: false
    }
    localStorage.setItem('sd-settings', JSON.stringify(defaultSettings))
}

const SettingsContext = createContext<{ currentSettings: Readonly<Settings>, previousSettings: Readonly<Settings>, updateSettings: React.Dispatch<React.SetStateAction<Settings>>}>({
    currentSettings: defaultSettings,
    previousSettings: defaultSettings,
    updateSettings: (_) => {}
})

export const useSettings = () => useContext(SettingsContext)

export default function SettingsProvider(props: {children: ReactElement}) {
    const [currentSettings, updateSettings] = useState(defaultSettings)
    const previousRef = useRef(defaultSettings)
    useEffect(() => {
        previousRef.current = currentSettings
    }, [currentSettings])
    return <>
        <SettingsContext.Provider value={{currentSettings, previousSettings: previousRef.current, updateSettings}}>
            {props.children}
        </SettingsContext.Provider>
    </>
}
