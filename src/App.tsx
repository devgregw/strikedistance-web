import { Box, Card, CardContent, Divider, Grid, Paper, Typography, useTheme } from '@mui/material';
import MathJax from 'react-mathjax'
import { useState } from 'react';
import './App.css';
import TitleBar from './TitleBar';
import TemperatureCard from './TemperatureCard';
import TimeCard from './TimeCard';
import ResultsCard from './ResultsCard';

function Formula(props: {f: string, block?: boolean}) {
  return <MathJax.Node inline={props.block === undefined ? true : !props.block} formula={props.f}/>
}

function App() {
  const theme = useTheme()
  let [temp, setTemp] = useState<number | null>(null)
  let [time, setTime] = useState<number | null>(null)
  return (
    <Paper square elevation={0}>
      <TitleBar/>
      <Box sx={{
        padding: theme.spacing(3)
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant='body1'>
                  StrikeDistance became the first app I ever wrote after learning about the speed of sound around 9th grade. My family had taught me a general rule that for every 4-5 seconds since a flash of lightning, it struck 1 mile away. I wrote StrikeDistance originally for Windows Phone to more accurately calculate the distance using the speed of sound in air at a specified temperature.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Card>
              <CardContent>
                <MathJax.Provider>
                  <Typography variant='body1'>
                    Speed of sound in air <div style={{display: 'inline-block'}}>{<Formula f='s' />} ({<Formula f={'m \\over s'} />})</div> given temperature <div style={{display: 'inline-block'}}>{<Formula f='T_C' />} ({<Formula f={'°C'} />})</div>:
                    <Formula block f="s = {331.5+0.60T_C}" />
                  </Typography>
                  <Divider sx={{ marginY: theme.spacing(1) }} />
                  <Typography variant='body1'>
                    Distance traveled <div style={{ display: 'inline-block' }}>{<Formula f='d' />} ({<Formula f={'m'} />})</div> given speed <div style={{ display: 'inline-block' }}>{<Formula f='s' />} ({<Formula f={'m \\over s'} />})</div> and time <div style={{ display: 'inline-block' }}>{<Formula f='t' />} ({<Formula f={'s'} />})</div>:
                    <Formula block f="d = {st}" />
                  </Typography>
                </MathJax.Provider>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <Card>
              <CardContent>
                  <Typography variant='body1'>
                    StrikeDistance automatically converts units to and from SI base units. You can choose your preferred units in Settings. For example, you can enter temperatures in degrees Fahrenheit and receive answers in miles or feet.
                  </Typography>
                  <Divider sx={{marginY: theme.spacing(1)}}/>
                <Typography variant='body1'>
                  The app can access your location contact a weather service for current conditions and has a built-in stopwatch.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}><Divider/></Grid>
          <Grid item xs={12} sm={8} md={6}>
            <TemperatureCard onChange={t => setTemp(t)}/>
          </Grid>
          <Grid item xs={12} sm={8} md={6}>
            <TimeCard onChange={t => setTime(t)}/>
          </Grid>
          <Grid item xs={12} sm={8} md={6}>
            <ResultsCard temperature={temp} time={time} />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default App;
