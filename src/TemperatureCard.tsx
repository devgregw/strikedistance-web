import { Button, Card, CardActions, CardContent, Divider, FilledInput, FormControl, FormHelperText, Grow, InputAdornment, InputLabel, Typography, useTheme, Snackbar, Alert } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton'
import BackspaceIcon from '@mui/icons-material/Backspace'
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { useEffect, useState } from "react";
import { UnitNames, useSettings } from "./SettingsProvider";
import Calculator from "./Calculator";
import OWM from "./OWM";

export default function TemperatureCard(props: {onChange: (newTemp: number | null) => void}) {
    const theme = useTheme()
    const {currentSettings, previousSettings} = useSettings()
    const defaultValue = Calculator.convert({type: 'temperature', value: 20, from: 'metric', to: currentSettings.temperatureUnit}).toFixed(2).toString()
    const [value, setValue] = useState(defaultValue)
    const [checkingWeather, setCheckingWeather] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState<{success: boolean, message: string} | null>(null)
    const [checkButtonText, setCheckButtonText] = useState("Check Weather")
    
    let parsed = parseFloat(value)
    let error = isNaN(parsed) || Calculator.convert({ type: 'temperature', value: parsed, from: currentSettings.temperatureUnit, to: 'metric-abs' }) < 0
    
    useEffect(() => {
        if (currentSettings.temperatureUnit !== previousSettings.temperatureUnit && !error)
            setValue(Calculator.convert({
                type: 'temperature',
                value: parseFloat(value),
                from: previousSettings.temperatureUnit,
                to: currentSettings.temperatureUnit
            }).toFixed(2).toString())
    }, [currentSettings, error, value, previousSettings])

    useEffect(() => {
        props.onChange(error ? null : parseFloat(value))
    }, [value, error, props])

    let symbol = UnitNames.temperature[currentSettings.temperatureUnit]

    const checkWeather = () => {
        if (navigator.geolocation) {
            setCheckButtonText('Getting Location...')
            setCheckingWeather(true)
            navigator.geolocation.getCurrentPosition(point => {
                setCheckButtonText('Checking Weather...')
                window.fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${point.coords.latitude}&lon=${point.coords.longitude}&appid=${OWM.key}&units=metric`, {
                    method: 'GET'
                }).then(r => r.json()).then(data => {
                    setCheckButtonText('Check Weather')
                    setCheckingWeather(false)
                    let temp = Calculator.convert({ type: 'temperature', value: parseFloat((data as any).main.temp.toString()), from: 'metric', to: currentSettings.temperatureUnit }).toFixed(2).toString()
                    setSnackbarMessage({ success: true, message: `Weather conditions loaded for ${(data as any).name}: ${temp} ${symbol}, ${(data as any).weather[0].description}` })
                    setValue(temp)
                }, err => {
                    setCheckButtonText('Check Weather')
                    setCheckingWeather(false)
                    setSnackbarMessage({ success: false, message: 'An error occurred while checking the weather: ' + err.toString() })
                })
            }, err => {
                setCheckButtonText('Check Weather')
                setCheckingWeather(false)
                setSnackbarMessage({ success: false, message: 'An error occurred while getting your location: ' + err.message})
            })
        } else
            setSnackbarMessage({ success: false, message: 'Your browser does not support geolocation. Enter the current temperature by checking your preferred weather service.'})
    }

    return <>
        {snackbarMessage ? <Snackbar TransitionComponent={Grow} open={!!snackbarMessage} autoHideDuration={6000} onClose={() => setSnackbarMessage(null)}>
            <Alert variant="filled" severity={snackbarMessage.success ? 'success' : 'error'} onClose={() => setSnackbarMessage(null)}>{snackbarMessage.message}</Alert>
        </Snackbar> : null}
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6">Current Temperature</Typography>
                <FormControl sx={{maxWidth: '50ch'}} variant="filled" error={error} disabled={checkingWeather}>
                    <InputLabel disabled={checkingWeather} error={error} htmlFor="form-temp">Temperature</InputLabel>
                    <FilledInput disabled={checkingWeather} id="form-temp" type="number" value={value} onBlur={() => !error && setValue(parsed.toFixed(2))} onChange={e => setValue(e.currentTarget.value)} required error={error} sx={{ mt: theme.spacing(1), maxWidth: '25ch' }} endAdornment={<InputAdornment position="end">{symbol}</InputAdornment>}/>
                    <FormHelperText error={error}>{ error ? `Temperature must be a number no less than absolute zero (${Calculator.convert({type: 'temperature', value: 0, from: 'metric-abs', to: currentSettings.temperatureUnit}).toFixed(2)} ${symbol}).` : 'Enter the current outdoor temperature. Click Check Weather to use your location to pull weather conditions from a weather service.'}</FormHelperText>
                </FormControl>
            </CardContent>
            <CardActions>
                <Button disabled={checkingWeather} onClick={() => setValue(defaultValue)} startIcon={<BackspaceIcon />} color='warning'>Clear</Button>
                <Divider sx={{ ml: theme.spacing(1) }} variant="middle" orientation="vertical" flexItem />
                <LoadingButton variant="contained" startIcon={<ThermostatIcon/>} loadingPosition="start" loading={checkingWeather} onClick={checkWeather}>{checkButtonText}</LoadingButton>
            </CardActions>
        </Card>
    </>
}