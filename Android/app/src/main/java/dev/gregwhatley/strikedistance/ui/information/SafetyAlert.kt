package dev.gregwhatley.strikedistance.ui.information

import android.content.Intent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.twotone.Warning
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.net.toUri
import dev.gregwhatley.strikedistance.R

@Preview
@Composable
fun SafetyAlert() {
    val ctx = LocalContext.current
    Card(
        onClick = {
            ctx.startActivity(
                Intent(
                    Intent.ACTION_VIEW,
                    "https://www.weather.gov/safety/lightning-tips".toUri()
                )
            )
        },
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(colorResource(R.color.warningBackground)),
        shape = RectangleShape,
    ) {
        Row(verticalAlignment = Alignment.Top) {
            Icon(
                Icons.TwoTone.Warning,
                contentDescription = stringResource(R.string.warning),
                tint = colorResource(R.color.accentColorDark),
                modifier = Modifier.padding(16.dp)
            )
            Column(modifier = Modifier.padding(top = 16.dp, bottom = 16.dp, end = 8.dp)) {
                Text(
                    stringResource(R.string.safety_message),
                    color = colorResource(R.color.warningForegroundPrimary)
                )
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(top = 4.dp)) {
                    Text(
                        stringResource(R.string.lightning_safety_from_the_nws),
                        color = colorResource(R.color.warningForegroundSecondary),
                    )
                    Icon(
                        painterResource(R.drawable.outline_open_in_new_24),
                        contentDescription = stringResource(R.string.open_in_browser),
                        tint = colorResource(R.color.warningForegroundSecondary),
                        modifier = Modifier
                            .padding(start = 4.dp)
                            .size(16.dp)
                    )
                }
            }
        }
    }
}