package dev.gregwhatley.strikedistance.logic

import dev.gregwhatley.strikedistance.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

class WeatherFetcher {
    companion object {
        private const val API_URL = "https://api.openweathermap.org/data/2.5/weather"
        private const val API_KEY = BuildConfig.WEATHER_API_KEY

        // Optional: timeout values
        private const val CONNECT_TIMEOUT_MS = 10_000
        private const val READ_TIMEOUT_MS = 15_000
    }

    data class WeatherData(
        val temperature: Temperature,   // units depend on API (e.g., Kelvin/Celsius)
        val location: String,
        val country: String
    )

    suspend fun fetchWeather(lat: Double, lon: Double): WeatherData {
        return withContext(Dispatchers.IO) {
            var connection: HttpURLConnection? = null
            try {
                // Build URL with simple query params; encode as needed
                val query = "lat=${URLEncoder.encode(lat.toString(), "UTF-8")}" +
                        "&lon=${URLEncoder.encode(lon.toString(), "UTF-8")}" +
                        "&appid=${URLEncoder.encode(API_KEY, "UTF-8")}" +
                        "&units=metric"
                val fullUrl = "$API_URL?$query"

                val url = URL(fullUrl)
                connection = (url.openConnection() as HttpURLConnection).apply {
                    requestMethod = "GET"
                    connectTimeout = CONNECT_TIMEOUT_MS
                    readTimeout = READ_TIMEOUT_MS
                    doInput = true
                }

                val code = connection.responseCode
                val stream = if (code in 200..299) connection.inputStream else connection.errorStream
                val body = stream.bufferedReader().use { it.readText() }

                if (code !in 200..299) {
                    // Non-successful HTTP response
                    throw IOException("Weather request failed with code $code: $body")
                }

                // Parse JSON (basic parsing; adapt to API structure)
                val json = JSONObject(body)
                val main = json.getJSONObject("main")
                val temp = main.getDouble("temp")

                val location = json.getString("name")
                val country = json.getJSONObject("sys").getString("country")

                return@withContext WeatherData(
                    Temperature(temp, TempUnit.Celsius),
                    location,
                    country
                )
            } finally {
                connection?.disconnect()
            }
        }
    }
}