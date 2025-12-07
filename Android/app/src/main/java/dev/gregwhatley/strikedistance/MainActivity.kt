package dev.gregwhatley.strikedistance

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.material3.ExperimentalMaterial3Api
import dev.gregwhatley.strikedistance.ui.information.SafetyAlert
import dev.gregwhatley.strikedistance.ui.results.CalculationResult
import dev.gregwhatley.strikedistance.ui.stopwatch.StopwatchField
import dev.gregwhatley.strikedistance.ui.stopwatch.StopwatchViewModel
import dev.gregwhatley.strikedistance.ui.temperature.LocationViewModel
import dev.gregwhatley.strikedistance.ui.temperature.TemperatureField
import dev.gregwhatley.strikedistance.ui.theme.StrikeDistanceScaffold

@OptIn(ExperimentalMaterial3Api::class)
class MainActivity : ComponentActivity() {
    val stopwatchViewModel: StopwatchViewModel by viewModels()
    val locationViewModel: LocationViewModel by viewModels {
        LocationViewModel.Factory(this)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge(statusBarStyle = SystemBarStyle.light(getColor(R.color.accentColor), getColor(android.R.color.black)))
        setContent {
            StrikeDistanceScaffold {
                SafetyAlert()

                TemperatureField(viewModel = locationViewModel)

                StopwatchField(viewModel = stopwatchViewModel)

                CalculationResult(stopwatchViewModel, locationViewModel)
            }
        }
    }
}