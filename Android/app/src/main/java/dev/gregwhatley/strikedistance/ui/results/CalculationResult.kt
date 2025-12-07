package dev.gregwhatley.strikedistance.ui.results

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import dev.gregwhatley.strikedistance.R
import dev.gregwhatley.strikedistance.logic.Calculator
import dev.gregwhatley.strikedistance.logic.DistanceUnit
import dev.gregwhatley.strikedistance.logic.Temperature
import dev.gregwhatley.strikedistance.ui.stopwatch.StopwatchViewModel
import dev.gregwhatley.strikedistance.ui.temperature.LocationViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CalculationResult(stopwatchViewModel: StopwatchViewModel, locationViewModel: LocationViewModel) {
    val tempValue = locationViewModel.tempValue.collectAsState().value.toDoubleOrNull()
    val timeValue = stopwatchViewModel.stopwatch.collectAsState().value.toDoubleOrNull()?.takeIf { it >= 0 }
    var result by rememberSaveable { mutableStateOf<String?>(null) }
    var distanceUnitMenuExpanded by rememberSaveable { mutableStateOf(false) }
    var metricDistance by rememberSaveable { mutableStateOf(true) }
    LaunchedEffect(metricDistance) {
        distanceUnitMenuExpanded = false
    }
    Column(
        modifier = Modifier.padding(top = 16.dp)
    ) {
        result?.let {
            ModalBottomSheet(
                onDismissRequest = { result = null },
                sheetState = rememberModalBottomSheetState(),
                contentWindowInsets = { WindowInsets(32.dp, 48.dp, 32.dp, 48.dp) }
            ) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("The lightning struck approximately", textAlign = TextAlign.Center)
                    Text(it, fontWeight = FontWeight.Medium, fontSize = 24.sp, textAlign = TextAlign.Center, modifier = Modifier.padding(8.dp))
                }
            }
        }
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            Button(
                modifier = Modifier
                    .padding(8.dp)
                    .height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = colorResource(R.color.accentColor)),
                onClick = {
                    if (tempValue == null || timeValue == null) {
                        return@Button
                    }
                    val temp = Temperature(tempValue, locationViewModel.tempUnit.value)
                    val meters = Calculator().calculate(temp, timeValue, DistanceUnit.Meters)
                    if (meters.value == 0.0) {
                        result = "right next to you"
                    } else if (metricDistance) {
                        if (meters.value >= 500.0) {
                            val kilometers = meters.convert(DistanceUnit.Kilometers)
                            result = "%.2f kilometers away".format(kilometers.value)
                        } else {
                            result = "%.2f meters away".format(meters.value)
                        }
                    } else {
                        val feet = meters.convert(DistanceUnit.Feet)
                        if (feet.value > 2640.0) {
                            val miles = feet.convert(DistanceUnit.Miles)
                            result = "%.2f miles away".format(miles.value)
                        } else {
                            result = "%.2f feet away".format(feet.value)
                        }
                    }
                },
                enabled = tempValue != null && timeValue != null
            ) {
                Text("Calculate", fontWeight = FontWeight.Bold, fontSize = 18.sp)
            }
            Button(
                onClick = { distanceUnitMenuExpanded = !distanceUnitMenuExpanded },
                modifier = Modifier
                    .padding(8.dp)
                    .height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = colorResource(R.color.accentColor))
            ) {
                Text(
                    if (metricDistance) "m/km" else "ft/mi",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                DropdownMenu(
                    expanded = distanceUnitMenuExpanded,
                    onDismissRequest = { distanceUnitMenuExpanded = false }
                ) {
                    DropdownMenuItem(
                        text = { Text("Metric (m/km)") },
                        onClick = { metricDistance = true }
                    )
                    DropdownMenuItem(
                        text = { Text("Imperial (ft/mi)") },
                        onClick = { metricDistance = false }
                    )
                }
            }
        }
    }
}