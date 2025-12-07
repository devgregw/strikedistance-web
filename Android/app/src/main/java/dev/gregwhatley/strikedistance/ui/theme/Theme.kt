package dev.gregwhatley.strikedistance.ui.theme

import android.content.Intent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.net.toUri
import dev.gregwhatley.strikedistance.R
import androidx.compose.ui.res.colorResource

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StrikeDistanceScaffold(
    content: @Composable () -> Unit
) {
    val ctx = LocalContext.current
    var showInfoSheet by rememberSaveable { mutableStateOf(false) }

    MaterialTheme(
        colorScheme = darkColorScheme(primary = colorResource(R.color.accentColor)),
        typography = Typography,
        content = {
            Scaffold(
                modifier = Modifier.fillMaxSize(),
                topBar = {
                    TopAppBar(
                        title = { Text("StrikeDistance", fontWeight = FontWeight.Medium) },
                        actions = {
                            IconButton(onClick = {
                                @Suppress("AssignedValueIsNeverRead")
                                showInfoSheet = true
                            }) {
                                Icon(Icons.Outlined.Info, contentDescription = "About")
                            }
                        },
                        colors = TopAppBarDefaults.topAppBarColors(
                            containerColor = colorResource(R.color.accentColor),
                            titleContentColor = Color.Black,
                            actionIconContentColor = Color.Black
                        )
                    )
                }
            ) { innerPadding ->
                Column(modifier = Modifier.padding(innerPadding).verticalScroll(rememberScrollState())) {
                    content()
                    if (showInfoSheet) {
                        ModalBottomSheet(
                            onDismissRequest = { showInfoSheet = false },
                            contentWindowInsets = { WindowInsets(32.dp, 48.dp, 32.dp, 48.dp) }
                        ) {
                            Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                                Text(
                                    "About StrikeDistance",
                                    style = MaterialTheme.typography.headlineSmall,
                                    fontWeight = FontWeight.Medium,
                                    modifier = Modifier.padding(16.dp)
                                )

                                Text(
                                    "StrikeDistance is a tool to estimate the distance to a lightning strike based on the time between seeing the lightning and hearing the thunder. This is a recreation of one of my earliest programming projects as a student.",
                                    style = MaterialTheme.typography.bodyMedium,
                                    modifier = Modifier.padding(16.dp)
                                )

                                Text(
                                    "This app is intended for educational purposes only and should not be relied upon for safety decisions.",
                                    style = MaterialTheme.typography.bodyMedium,
                                    modifier = Modifier.padding(16.dp)
                                )

                                TextButton(
                                    onClick = {
                                        ctx.startActivity(
                                            Intent(
                                                Intent.ACTION_VIEW,
                                                "https://www.github.com/devgregw/StrikeDistance".toUri()
                                            )
                                        )
                                    }
                                ) {
                                    Text("Source Code", color = colorResource(R.color.accentColor))
                                }

                                HorizontalDivider()

                                Text(
                                    "How It Works",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Medium,
                                    modifier = Modifier.padding(16.dp)
                                )

                                Text(
                                    "The speed of sound in air varies with temperature: v = 331.5 + 0.6T (where v is the speed of sound in meters per second and T is the ambient temperature in °C). The measured time between the lightning and thunder (in seconds) is combined with the speed of sound to estimate the distance in meters (d = vt). StrikeDistance can convert between units automatically, for example to show the result in miles.",
                                    style = MaterialTheme.typography.bodyMedium,
                                    modifier = Modifier.padding(16.dp)
                                )

                                TextButton(
                                    onClick = {
                                        ctx.startActivity(
                                            Intent(
                                                Intent.ACTION_VIEW,
                                                "https://www.desmos.com/3d/gr5wvtfxza".toUri()
                                            )
                                        )
                                    }
                                ) {
                                    Text("Explore on Desmos", color = colorResource(R.color.accentColor))
                                }
                            }
                        }
                    }
                }
            }
        }
    )
}