import React, { type ReactNode, useMemo, useState } from 'react';
import './App.css';
import { Alert, Button, Chip, Container, Divider, Typography } from '@mui/material';
import TemperatureField from './TemperatureField';
import { convertTemperature, type TempUnit } from './Calculator';
import TimeField from './TimeField';
import ResultCard from './ResultCard';
import { orange } from '@mui/material/colors';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const Glitch = (props: { children: ReactNode }) => <Typography className='glitch' variant='h2'>{props.children}</Typography>

function App() {
  let [temp, setTemp] = useState("70")
  let tempAsNumber = useMemo(() => parseInt(temp), [temp])
  let [tempUnit, setTempUnit] = useState<TempUnit>('f')
  let [time, setTime] = useState('0')
  let timeAsNumber = useMemo(() => parseInt(time), [time])
  return (
    <div className="App">
      <header style={{marginTop: '1rem'}}>
        <div><Glitch>Strike{' '}Distance</Glitch></div>
        <Chip label="Web" id="web" />
      </header>
      <Divider sx={{margin: 4}}/>
      <Container maxWidth="sm">
        <main>
          <Alert sx={{ textAlign: 'start', marginBottom: 3 }} severity='warning' className="warning" action={<Button rel='noopener noreferrer' target='_blank' href='https://www.weather.gov/media/safety/Lightning-Brochure18.pdf' sx={{color: orange[500]}} endIcon={<OpenInNewIcon/>}>More</Button>}>
            <Typography variant='body2'>Always be cautious when dealing with lightning. Stay indoors and away from windows if at all possible. Avoid trees, open areas, and metal objects.</Typography>
          </Alert>
          <TemperatureField value={{temp, unit: tempUnit}} onSetValue={setTemp} onSetUnit={u => {
            if (!isNaN(tempAsNumber))
              setTemp(convertTemperature(tempAsNumber, tempUnit, u).toFixed(3).toString())
            setTempUnit(u)
          }} />
          <TimeField value={time} onSetValue={setTime}/>
          <Divider/>
          <ResultCard temperature={[tempAsNumber, tempUnit]} time={timeAsNumber}/>
        </main>
      </Container>
    </div>
  );
}

export default App;
