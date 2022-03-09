import { Card, CardContent, Divider, Paper, Typography, useTheme } from "@mui/material";
import { UnitNames, useSettings } from "./SettingsProvider";

import MathJax from 'react-mathjax'
import Calculator from "./Calculator";
function Formula(props: { f: string, block?: boolean }) {
    return <MathJax.Node inline={props.block === undefined ? true : !props.block} formula={props.f} />
}

export default function ResultsCard(props: {temperature: number | null, time: number | null}) {
    const theme = useTheme()
    const {currentSettings} = useSettings()
    let result = props.temperature === null || props.time === null ? null : Calculator.calculate(currentSettings, props.temperature, props.time)
    console.log(result)
    return <>
        <MathJax.Provider>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5">Results</Typography>
                    <Typography variant="body1">
                        {result === null ? 'Current temperature and/or time have invalid values. Enter valid values to see the results here.'
                            : <>
                                At a temperature of {props.temperature} {UnitNames.temperature[currentSettings.temperatureUnit]}
                                {' '}and lightning-thunder time of {props.time} s, the lightning struck {result.finalDistance === 0 ? 'right next to you' : `approximately ${result.finalDistance.toFixed(2)} ${UnitNames.distance[currentSettings.distanceUnit].split(' or ')[result.largeUnit ? 1 : 0]} away`}.
                            </>}
                    </Typography>
                    {currentSettings.showCalculations && result !== null ? <>
                        <Divider sx={{ marginY: theme.spacing(1) }} />
                        <Typography variant="h6">Step-by-Step Calculations</Typography>
                        {result.steps.map(s => <>
                            <Paper key={s.key} elevation={2} sx={{ paddingY: theme.spacing(1), paddingX: theme.spacing(2), margin: theme.spacing(2) }}>
                                <Typography>{s.name}:</Typography>
                                <Formula block f={`${s.symbol} = ${s.formula} = ${s.answer} ${s.unit}`} />
                            </Paper>
                        </>
                        )}
                    </> : null}
                </CardContent>
            </Card>
        </MathJax.Provider>
    </>
}