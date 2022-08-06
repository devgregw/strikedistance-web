import { Card, CardContent, Typography, Button, Grow, Box, FormControl, MenuItem, Select } from "@mui/material";
import { calculate, type DistanceUnit, type TempUnit } from "./Calculator";
import { yellow } from '@mui/material/colors'
import CalculateIcon from '@mui/icons-material/Calculate';
import { useState } from "react";

export default function ResultCard(props: { temperature: [number, TempUnit], time: number }) {
    let [result, setResult] = useState<string | false>(false)
    let [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('mi')
    return <>
        <Card sx={{ marginTop: 3, marginBottom: 12 }}>
            <Typography sx={{ margin: 1 }} variant="h5" component="div">Results</Typography>
            <Typography sx={{ marginX: 2 }} variant="subtitle2">Click Calculate to find how far away the lightning struck from you.</Typography>
            <CardContent>
                <Grow in={result !== false}>
                    <Box sx={{ height: 80 }}>
                        <Typography variant="overline">The lightning struck approximately</Typography>
                        <Typography variant="h5" component="p">{result}</Typography>
                    </Box>
                </Grow>
                <Box>
                    <Button onClick={() => {
                        setResult(false)
                        setTimeout(() => {
                            setResult(calculate({...props, distanceUnit}))
                        }, 250)
                    }} sx={{ bgcolor: yellow[500], '&:hover': { bgcolor: yellow[700] } }} variant="contained" startIcon={<CalculateIcon />}>Calculate</Button>
                    <FormControl sx={{position: 'absolute', marginLeft: 1, transform: 'translateY(-2px)' }} size="small">
                        <Select defaultValue='mi' onChange={e => setDistanceUnit((e.target as HTMLSelectElement).value as DistanceUnit)}>
                            <MenuItem value="mi">mi/ft</MenuItem>
                            <MenuItem value="km">km/m</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                
            </CardContent>
        </Card>
    </>
}