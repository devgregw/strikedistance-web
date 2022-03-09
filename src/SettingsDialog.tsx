import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, Grow, InputLabel, MenuItem, Select, Switch, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { DistanceUnit, TemperatureUnit, UnitNames, useSettings } from "./SettingsProvider";

export default function SettingsDialog(props: { open: boolean, onClose: () => void }) {
    const saveThenClose = () => {
        let values = {
            temperatureUnit: tempUnit,
            distanceUnit: distUnit,
            showCalculations: showCalc
        }
        localStorage.setItem('sd-settings', JSON.stringify(values))
        updateSettings(values)
        props.onClose()
    }
    const defaults = () => {
        [setTempUnit, setDistUnit].forEach(s => s('metric'))
        setShowCalc(false)
    }

    const { currentSettings, updateSettings } = useSettings()

    const [tempUnit, setTempUnit] = useState(currentSettings.temperatureUnit)
    const [distUnit, setDistUnit] = useState(currentSettings.distanceUnit)
    const [showCalc, setShowCalc] = useState(currentSettings.showCalculations)

    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    return <Dialog {...props} TransitionComponent={Grow} fullScreen={fullScreen}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
            <Box sx={{ padding: theme.spacing(1), mb: theme.spacing(2) }}>
                <FormControl fullWidth>
                    <InputLabel id="l-temp">Temperature Unit</InputLabel>
                    <Select onChange={e => setTempUnit(e.target.value as TemperatureUnit)} label="Temperature Unit" labelId="l-temp" id="temp" value={tempUnit}>
                        <MenuItem value="metric">{UnitNames.temperature.metric} (metric, default)</MenuItem>
                        <MenuItem value="imperial">{UnitNames.temperature.imperial} (imperial)</MenuItem>
                        <Divider sx={{ my: 0.5 }} />
                        <MenuItem value="metric-abs">{UnitNames.temperature["metric-abs"]} (metric, absolute)</MenuItem>
                        <MenuItem value="imperial-abs">{UnitNames.temperature["imperial-abs"]} (imperial, absolute)</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ padding: theme.spacing(1), mb: theme.spacing(2) }}>
                <FormControl fullWidth>
                    <InputLabel id="l-dist">Distance Unit</InputLabel>
                    <Select onChange={e => setDistUnit(e.target.value as DistanceUnit)} label="Distance Unit" labelId="l-dist" id="dist" value={distUnit}>
                        <MenuItem value="metric">{UnitNames.distance.metric} (metric, default)</MenuItem>
                        <MenuItem value="imperial">{UnitNames.distance.imperial} (imperial)</MenuItem>
                    </Select>
                    <FormHelperText>StrikeDistance will determine the best unit to use from your selected system.</FormHelperText>
                </FormControl>
            </Box>
            <Box sx={{ padding: theme.spacing(1), mb: theme.spacing(2) }}>
                <FormControl>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={showCalc} onChange={e => setShowCalc(e.target.checked)} />} label="Show Calculations" />
                        <FormHelperText>When this is turned on, StrikeDistance will show intermediate calculations.</FormHelperText>
                    </FormGroup>
                </FormControl>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={defaults} color="warning">Defaults</Button>
            <Divider sx={{ml: theme.spacing(1)}} variant="middle" orientation="vertical" flexItem/>
            <Button onClick={props.onClose} color="secondary">Cancel</Button>
            <Button variant="contained" onClick={saveThenClose}>Save</Button>
        </DialogActions>
    </Dialog>
}