import { Card, CardContent, FormControl, MenuItem, InputAdornment, Select, TextField, Typography, Snackbar, Alert, Box } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { convertTemperature, TempDisplayNames, type TempUnit } from "./Calculator";
import { yellow } from '@mui/material/colors'
import LoadingButton from "@mui/lab/LoadingButton";
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { getWeatherConditions } from "./API";

export default function TemperatureField(props: {value: {temp: string, unit: TempUnit}, onSetValue: (newValue: string) => void, onSetUnit: (newUnit: TempUnit) => void}) {
    let invalid = useMemo(() => isNaN(parseInt(props.value.temp)) || convertTemperature(parseInt(props.value.temp), props.value.unit, 'k') < 0, [props.value])
    let [loading, setLoading] = useState(false)
    let [errorMessage, setErrorMessage] = useState('')
    let [successMessage, setSuccessMessage] = useState('')
    let getWeather = useCallback(() => {
        if (navigator.geolocation) {
            setLoading(true)
            navigator.geolocation.getCurrentPosition(pos => {
                getWeatherConditions(pos.coords)
                    .then(r => {
                        setLoading(false)
                        // SET VALUE AND CONVERT
                        let converted = convertTemperature(r.tempC, 'c', props.value.unit).toFixed(2).toString()
                        props.onSetValue(converted)
                        //props.onSetUnit('c')
                        setSuccessMessage(`Weather conditions: ${converted} ${TempDisplayNames[props.value.unit]} in ${r.location.name}, ${r.location.country}`)
                    })
                    .catch(e => {
                        console.error(e)
                        setLoading(false)
                        setErrorMessage('Network error: ' + e.toString().split(': ')[1])
                    })
            }, err => {
                setLoading(false)
                console.log(err)
                setErrorMessage(`Geolocation error: ${err.message}`)
            })
        } else {
            setErrorMessage('Your browser does not appear to support geolocation services.')
        }
    }, [props])
    return <>
        <Card>
            <Typography sx={{margin: 1}} variant="h5" component="div">Outside Temperature</Typography>
            <Typography sx={{marginX: 2}} variant="subtitle2">Enter the current ambient temperature or use the location button to check it automatically.</Typography>
            <CardContent>
                <div>
                    <TextField sx={{ m: 1, maxWidth: '25ch' }} error={invalid} label="Temperature" helperText={invalid ? "Invalid temperature" : undefined}
                        value={props.value.temp} type="number" variant="outlined"
                        inputProps={{ step: 0.1 }} onChange={e => props.onSetValue((e.target as HTMLInputElement).value)}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><DeviceThermostatIcon /></InputAdornment>),
                            endAdornment: (<InputAdornment position="end">
                                <FormControl size="small">
                                    <Select value={props.value.unit} onChange={e => props.onSetUnit((e.target as HTMLSelectElement).value as TempUnit)}>
                                        <MenuItem value="f">°F</MenuItem>
                                        <MenuItem value="c">°C</MenuItem>
                                        <MenuItem value="k">K</MenuItem>
                                    </Select>
                                </FormControl>
                            </InputAdornment>)
                        }}
                    />
                </div>
                <LoadingButton variant="contained" onClick={() => getWeather()} loading={loading} loadingPosition="start" startIcon={<MyLocationIcon/>}
                    sx={{ bgcolor: yellow[500], '&:hover': { bgcolor: yellow[700] }, '&[disabled]': { bgcolor: t => t.palette.action.disabledBackground } }}>
                        Use Location
                </LoadingButton>
                <Box sx={{marginTop: 0.5}}>
                    <Typography color="rgba(255,255,255,0.35)" variant="caption">The speed of sound in air varies slightly depending on the temperature.</Typography>
                </Box>
            </CardContent>
        </Card>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={errorMessage.length > 0} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
            <Alert variant="filled" onClose={() => setErrorMessage('')} severity="error" sx={{width: '100%'}}>
                {errorMessage}
            </Alert>
        </Snackbar>
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={successMessage.length > 0} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
            <Alert variant="filled" onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
                {successMessage}
            </Alert>
        </Snackbar>
    </>
}