import { Card, CardContent, InputAdornment, TextField, Typography, Fab, useTheme, Box } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { yellow } from '@mui/material/colors'
import SpatialAudioIcon from '@mui/icons-material/SpatialAudio';
import TimerIcon from '@mui/icons-material/Timer';
import TimerOffIcon from '@mui/icons-material/TimerOff';

export default function TimeField(props: {value: string, onSetValue: (newValue: string) => void}) {
    let [localValue, setLocalValue] = useState(props.value)
    let invalid = useMemo(() => isNaN(parseInt(localValue)) || parseInt(localValue) < 0, [localValue])
    let [timer, setTimer] = useState<number | false>(false)
    let [handle, setHandle] = useState<NodeJS.Timeout | null>(null)
    let theme = useTheme()
    let toggleStopwatch = useCallback(() => {
        if (!timer) {
            let now = Date.now()
            setTimer(now)
            setHandle(setInterval(start => {
                let delta = Date.now() - start
                setLocalValue((delta / 1000).toFixed(2).toString())
            }, 10, now))
        } else {
            setTimer(false)
            clearInterval(handle!)
            setHandle(null)
            let delta = Date.now() - (timer as number)
            setLocalValue((delta / 1000).toFixed(2).toString())
            props.onSetValue((delta / 1000).toFixed(2).toString())
        }
    }, [timer, handle, props])
    return <>
        <Card sx={{marginY: 3}}>
            <Typography sx={{margin: 1}} variant="h5" component="div">Time Between Lightning and Thunder</Typography>
            <Typography sx={{marginX: 2}} variant="subtitle2">When you see lightning, start counting or use the stopwatch to measure the time until you hear thunder.</Typography>
            <CardContent>
                <div>
                    <TextField sx={{ m: 1, maxWidth: '25ch' }} error={invalid} label="Time" helperText={invalid ? "Invalid time" : undefined}
                        value={localValue} type="number" variant="outlined"
                        inputProps={{ step: 0.1 }} onChange={e => {
                            let val = (e.target as HTMLInputElement).value
                            setLocalValue((e.target as HTMLInputElement).value)
                            props.onSetValue(val)
                        }}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><SpatialAudioIcon /></InputAdornment>),
                            endAdornment: (<InputAdornment position="end">s</InputAdornment>)
                        }}
                    />
                    <Box sx={{[theme.breakpoints.up('md')]: {display: 'none'}, display: 'block'}}/>
                    <Fab onClick={() => toggleStopwatch()} sx={{ [theme.breakpoints.up('md')]: { position: 'absolute', marginTop: 1 }, bgcolor: yellow[timer ? 700 : 500], '&:hover': { bgcolor: yellow[timer ? 900 : 700] } }}>{timer ? <TimerOffIcon /> : <TimerIcon />}</Fab>
                </div>
                <Box sx={{ marginTop: 0.5 }}>
                    <Typography color="rgba(255,255,255,0.35)" variant="caption">The time value is multiplied by the speed of sound to calculate an approximate distance.</Typography>
                </Box>
            </CardContent>
        </Card>
    </>
}
