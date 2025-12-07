package dev.gregwhatley.strikedistance.logic

import java.math.RoundingMode

enum class TempUnit {
    Fahrenheit, Celsius, Kelvin;

    companion object {
        val allCases: Array<TempUnit> = arrayOf(Fahrenheit, Celsius, Kelvin)
    }

    val symbol: String
        get() = when (this) {
            Fahrenheit -> "°F"
            Celsius -> "°C"
            Kelvin -> "K"
        }
}

data class Temperature(val value: Double, val unit: TempUnit) {
    fun convert(newUnit: TempUnit): Temperature = when (unit) {
        TempUnit.Fahrenheit -> when (newUnit) {
            TempUnit.Fahrenheit -> this
            TempUnit.Celsius -> Temperature((value - 32.0) * (5.0 / 9.0), newUnit)
            TempUnit.Kelvin -> convert(TempUnit.Celsius).convert(TempUnit.Kelvin)
        }
        TempUnit.Celsius -> when (newUnit) {
            TempUnit.Fahrenheit -> Temperature((value * 1.8) + 32.0, newUnit)
            TempUnit.Kelvin -> Temperature(value + 273.15, newUnit)
            TempUnit.Celsius -> this
        }
        TempUnit.Kelvin -> when (newUnit) {
            TempUnit.Fahrenheit -> convert(TempUnit.Celsius).convert(TempUnit.Fahrenheit)
            TempUnit.Celsius -> Temperature(value - 273.15, newUnit)
            TempUnit.Kelvin -> this
        }
    }

    override fun equals(other: Any?): Boolean = other is Temperature && (other.unit == unit && other.value.equalsConsideringPrecision(value))

    override fun hashCode(): Int = intArrayOf(value.hashCode(), unit.hashCode()).hashCode()
}

enum class DistanceUnit {
    Feet, Miles, Meters, Kilometers
}

data class Distance(val value: Double, val unit: DistanceUnit) {
    fun convert(newUnit: DistanceUnit): Distance = when (unit) {
        DistanceUnit.Miles -> when (newUnit) {
            DistanceUnit.Miles -> this
            DistanceUnit.Feet -> Distance(value * 5280.0, newUnit)
            DistanceUnit.Kilometers -> Distance(value / 0.6214, newUnit)
            DistanceUnit.Meters -> convert(DistanceUnit.Kilometers).convert(DistanceUnit.Meters)
        }
        DistanceUnit.Kilometers -> when (newUnit) {
            DistanceUnit.Miles -> Distance(value * 0.6214, newUnit)
            DistanceUnit.Feet -> convert(DistanceUnit.Miles).convert(DistanceUnit.Feet)
            DistanceUnit.Kilometers -> this
            DistanceUnit.Meters -> Distance(value * 1000.0, newUnit)
        }
        DistanceUnit.Feet -> when (newUnit) {
            DistanceUnit.Miles -> Distance(value / 5280.0, newUnit)
            DistanceUnit.Feet -> this
            DistanceUnit.Kilometers -> convert(DistanceUnit.Miles).convert(DistanceUnit.Kilometers)
            DistanceUnit.Meters -> convert(DistanceUnit.Kilometers).convert(DistanceUnit.Meters)
        }
        DistanceUnit.Meters -> when(newUnit) {
            DistanceUnit.Miles -> convert(DistanceUnit.Kilometers).convert(DistanceUnit.Miles)
            DistanceUnit.Feet -> convert(DistanceUnit.Miles).convert(DistanceUnit.Feet)
            DistanceUnit.Kilometers -> Distance(value / 1000.0, newUnit)
            DistanceUnit.Meters -> this
        }
    }

    override fun equals(other: Any?): Boolean = other is Distance && (other.unit == unit && other.value.equalsConsideringPrecision(value))

    override fun hashCode(): Int = intArrayOf(value.hashCode(), unit.hashCode()).hashCode()
}

class Calculator {
    private fun speedOfSound(temperature: Temperature): Double = 331.5 + (0.6 * temperature.convert(TempUnit.Celsius).value)

    fun calculate(temperature: Temperature, time: Double, distanceUnit: DistanceUnit): Distance {
        val speed = speedOfSound(temperature) // m/s
        val dist = speed * time // m
        val outDistance = Distance(dist, DistanceUnit.Meters)
        return outDistance.convert(distanceUnit)
    }
}

fun Double.equalsConsideringPrecision(other: Double): Boolean {
    if (this == other) return true
    val bd1 = toBigDecimal().stripTrailingZeros()
    val bd2 = other.toBigDecimal().stripTrailingZeros()
    val minScale = minOf(bd1.scale(), bd2.scale()).coerceAtLeast(0)
    val rounded1 = bd1.setScale(minScale, RoundingMode.HALF_UP)
    val rounded2 = bd2.setScale(minScale, RoundingMode.HALF_UP)
    return rounded1 == rounded2
}
