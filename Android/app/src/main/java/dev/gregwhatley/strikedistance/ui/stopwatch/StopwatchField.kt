package dev.gregwhatley.strikedistance.ui.stopwatch

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import dev.gregwhatley.strikedistance.R

@Composable
fun StopwatchField(viewModel: StopwatchViewModel) {
    val value by viewModel.stopwatch.collectAsState()
    val active by viewModel.active.collectAsState()
    TextField(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
            .onFocusChanged { if (!it.isFocused) viewModel.reformatTime() },
        value = value,
        onValueChange = { viewModel.setTimeValue(it) },
        isError = value.toDoubleOrNull()?.takeIf { it >= 0 } == null,
        readOnly = active,
        label = { Text(stringResource(R.string.time)) },
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
        leadingIcon = {
            Icon(painterResource(R.drawable.outline_spatial_audio_24), contentDescription = stringResource(
                R.string.sound
            ))
        },
        trailingIcon = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    "sec",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(16.dp)
                )
                Button(
                    onClick = { if (active) viewModel.stop() else viewModel.start() },
                    modifier = Modifier
                        .padding(0.dp, 8.dp, 8.dp, 8.dp)
                        .height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = if (active) colorResource(R.color.accentColorDark) else colorResource(R.color.accentColor))
                ) {
                    Icon(
                        painterResource(if (active) R.drawable.outline_timer_pause_24 else R.drawable.outline_timer_play_24),
                        contentDescription = stringResource(R.string.timer)
                    )
                }
            }
        },
        supportingText = { Text(stringResource(R.string.time_help_text)) },
        singleLine = true
    )
}