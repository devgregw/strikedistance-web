package dev.gregwhatley.strikedistance.ui.stopwatch

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class StopwatchViewModel : ViewModel() {
    private val _stopwatch = MutableStateFlow("0")
    val stopwatch = _stopwatch.asStateFlow()
    private val _active = MutableStateFlow(false)
    val active = _active.asStateFlow()

    private var stopwatchJob: Job? = null

    fun start() {
        stopwatchJob?.cancel()
        _stopwatch.value = "0"
        _active.value = true
        stopwatchJob = viewModelScope.launch {
            while (true) {
                delay(10)
                _stopwatch.value = "%.2f".format((_stopwatch.value.toDouble() + 0.01))
            }
        }
    }

    fun stop() {
        _active.value = false
        stopwatchJob?.cancel()
    }

    override fun onCleared() {
        super.onCleared()
        stopwatchJob?.cancel()
    }

    fun setTimeValue(value: String) {
        _stopwatch.value = value
    }

    fun reformatTime() {
        _stopwatch.value.toDoubleOrNull()?.let {
            _stopwatch.value = "%.2f".format(it)
        }
    }
}