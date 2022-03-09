import { Button, Card, CardActions, CardContent, Divider, FilledInput, FormControl, FormHelperText, InputAdornment, InputLabel, Typography, useTheme } from "@mui/material";
import BackspaceIcon from '@mui/icons-material/Backspace'
import TimerIcon from '@mui/icons-material/Timer';
import { useEffect, useState } from "react";

export default function TimeCard(props: {onChange: (newTime: number | null) => void}) {
    const theme = useTheme()
    const [value, setValue] = useState("0")

    let parsed = parseFloat(value)
    let error = isNaN(parsed) || parsed < 0

    useEffect(() => {
        props.onChange(error ? null : parseFloat(value))
    }, [value, parsed, error, props])

    return <>
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6">Time</Typography>
                <FormControl sx={{ maxWidth: '50ch' }} variant="filled" error={error}>
                    <InputLabel error={error} htmlFor="form-temp">Time</InputLabel>
                    <FilledInput id="form-temp" type="number" value={value} onChange={e => setValue(e.currentTarget.value)} required error={error} sx={{ mt: theme.spacing(1), maxWidth: '25ch' }} endAdornment={<InputAdornment position="end">s</InputAdornment>} />
                    <FormHelperText error={error}>{ error ? 'Time must be a nonnegative number.' : 'Enter the time (in seconds) between the lightning and thunder. Click Stopwatch to use the built-in stopwatch tool.' }</FormHelperText>
                </FormControl>
            </CardContent>
            <CardActions>
                <Button onClick={() => setValue("0")} startIcon={<BackspaceIcon />} color='warning'>Clear</Button>
                <Divider sx={{ ml: theme.spacing(1) }} variant="middle" orientation="vertical" flexItem />
                <Button startIcon={<TimerIcon />} variant='contained'>Stopwatch</Button>
            </CardActions>
        </Card>
    </>
}