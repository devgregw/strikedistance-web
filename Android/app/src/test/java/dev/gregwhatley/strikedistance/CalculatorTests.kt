package dev.gregwhatley.strikedistance

import dev.gregwhatley.strikedistance.logic.TempUnit
import dev.gregwhatley.strikedistance.logic.Temperature
import dev.gregwhatley.strikedistance.logic.Distance
import dev.gregwhatley.strikedistance.logic.DistanceUnit
import org.junit.Test

import org.junit.Assert.*

class CalculatorTests {
    @Test
    fun temperatureConversion() {
        val zeroC = Temperature(0.0, TempUnit.Celsius)
        val minusFortyF = Temperature(-40.0, TempUnit.Fahrenheit)
        assertEquals(Temperature(32.0, TempUnit.Fahrenheit), zeroC.convert(TempUnit.Fahrenheit))
        assertEquals(Temperature(273.15, TempUnit.Kelvin), zeroC.convert(TempUnit.Kelvin))
        assertEquals(Temperature(-40.0, TempUnit.Celsius), minusFortyF.convert(TempUnit.Celsius))
    }

    @Test
    fun distanceConversion() {
        val oneMile = Distance(1.0, DistanceUnit.Miles)
        val fiveThousandFeet = Distance(5000.0, DistanceUnit.Feet)
        assertEquals(Distance(5280.0, DistanceUnit.Feet), oneMile.convert(
            DistanceUnit.Feet))
        assertEquals(Distance(1.6093, DistanceUnit.Kilometers), oneMile.convert(
            DistanceUnit.Kilometers))
        assertEquals(Distance(0.94697, DistanceUnit.Miles), fiveThousandFeet.convert(
            DistanceUnit.Miles))
    }
}