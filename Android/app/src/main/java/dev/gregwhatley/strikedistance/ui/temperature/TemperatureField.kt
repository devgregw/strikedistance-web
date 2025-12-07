package dev.gregwhatley.strikedistance.ui.temperature

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.location.Location
import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import dev.gregwhatley.strikedistance.R
import dev.gregwhatley.strikedistance.logic.TempUnit
import dev.gregwhatley.strikedistance.logic.Temperature
import dev.gregwhatley.strikedistance.logic.WeatherFetcher
import kotlinx.coroutines.launch

@SuppressLint("MissingPermission") private suspend fun getLocation(viewModel: LocationViewModel): Location =
    viewModel.getLocation()

private suspend fun getWeather(location: Location): WeatherFetcher.WeatherData =
    WeatherFetcher().fetchWeather(location.latitude, location.longitude)

@Composable
fun TemperatureField(viewModel: LocationViewModel) {
    val ctx = LocalContext.current
    val tempValue by viewModel.tempValue.collectAsState()
    val tempUnit by viewModel.tempUnit.collectAsState()
    var tempUnitMenuExpanded by rememberSaveable { mutableStateOf(false) }
    var loading by rememberSaveable { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    TextField(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
            .onFocusChanged { if (!it.isFocused) viewModel.reformatTemp() },
        value = tempValue,
        onValueChange = { viewModel.setTempValue(it) },
        isError = tempValue.toDoubleOrNull() == null,
        readOnly = loading,
        label = { Text(stringResource(R.string.temperature)) },
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
        leadingIcon = {
            Icon(painterResource(R.drawable.outline_device_thermostat_24), contentDescription = stringResource(
                R.string.thermometer
            ))
        },
        trailingIcon = {
            Row {
                Button(
                    onClick = { tempUnitMenuExpanded = !tempUnitMenuExpanded },
                    modifier = Modifier
                        .padding(8.dp)
                        .height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = colorResource(R.color.accentColor))
                ) {
                    Text(
                        tempUnit.symbol,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                DropdownMenu(
                    expanded = tempUnitMenuExpanded,
                    onDismissRequest = { tempUnitMenuExpanded = false }) {
                    TempUnit.allCases.map { unit ->
                        DropdownMenuItem(
                            text = { Text("${unit.name} (${unit.symbol})") },
                            onClick = {
                                tempValue.toDoubleOrNull()?.let {
                                    val converted = Temperature(it, tempUnit).convert(unit)
                                    viewModel.setTempValue("%.2f".format(converted.value))
                                }
                                viewModel.setTempUnit(unit)
                                tempUnitMenuExpanded = false
                            }
                        )
                    }
                }
                Button(
                    onClick = {
                        scope.launch {
                            if (loading)
                                return@launch
                            loading = true

                            val location: Location
                            try {
                                location = getLocation(viewModel)
                            } catch (e: Exception) {
                                loading = false
                                Log.e("Location", "Failed to get location", e)
                                AlertDialog.Builder(ctx)
                                    .setTitle("Error")
                                    .setMessage("Failed to retrieve your current location. Please enter the outdoor ambient temperature manually.")
                                    .setPositiveButton("OK", null)
                                    .show()
                                return@launch
                            }

                            val weather: WeatherFetcher.WeatherData
                            try {
                                weather = getWeather(location)
                            } catch (e: Exception) {
                                Log.e("Weather", "Failed to get weather", e)
                                loading = false
                                AlertDialog.Builder(ctx)
                                    .setTitle("Error")
                                    .setMessage("Failed to retrieve current weather conditions. Please enter the outdoor ambient temperature manually.")
                                    .setPositiveButton("OK", null)
                                    .show()
                                return@launch
                            }

                            val temp = weather.temperature.convert(tempUnit)
                            viewModel.setTempValue("%.2f".format(temp.value))
                            loading = false
                            Toast.makeText(ctx, "Weather retrieved for ${weather.location}, ${weather.country}", Toast.LENGTH_SHORT).show()
                        }
                    },
                    modifier = Modifier
                        .padding(0.dp, 8.dp, 8.dp, 8.dp)
                        .height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = colorResource(R.color.accentColor))
                ) {
                    if (loading)
                        CircularProgressIndicator(
                            modifier = Modifier
                                .padding(vertical = 4.dp)
                                .fillMaxHeight()
                                .aspectRatio(1f),
                            color = Color.Black
                        )
                    else
                        Icon(
                            Icons.Default.LocationOn,
                            contentDescription = stringResource(R.string.use_current_location)
                        )
                }
            }
        },
        supportingText = { Text(stringResource(R.string.temp_help_text)) },
        singleLine = true
    )
}