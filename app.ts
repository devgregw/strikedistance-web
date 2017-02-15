function getSpeedOfSound(t: number) {
    return 331.5 + 0.606 * t;
}

function convertTemperatureTwoStep(unitFrom: number, unitTo: number, unitThenTo: number, value: number): number {
    return convertTemperature(unitTo, unitThenTo, convertTemperature(unitFrom, unitTo, value));
}

function convertTemperature(unitFrom: number, unitTo: number, value: number): number {
    switch (unitFrom) {
        case TEMP_F:
            switch (unitTo) {
                case TEMP_F:
                    return value;
                case TEMP_C:
                    return 5 / 9 * (value - 32);
                case TEMP_K:
                    return convertTemperatureTwoStep(TEMP_F, TEMP_C, TEMP_K, value);
            }
            break;
        case TEMP_C:
            switch (unitTo) {
                case TEMP_F:
                    return (9 / 5 * value) + 32;
                case TEMP_C:
                    return value;
                case TEMP_K:
                    return value + 273.15;
            }
            break;
        case TEMP_K:
            switch (unitTo) {
                case TEMP_F:
                    return convertTemperatureTwoStep(TEMP_K, TEMP_C, TEMP_F, value);
                case TEMP_C:
                    return value - 273.15;
                case TEMP_K:
                    return value;
            }
    }
}

function convertDistance(unitFrom: number, unitTo: number, value: number): number {
    switch (unitFrom) {
        case DIST_FT:
            switch (unitTo) {
                case DIST_FT:
                    return value;
                case DIST_M:
                    return value * 0.3048;
            }
            break;
        case DIST_M:
            switch (unitTo) {
                case DIST_FT:
                return value / 0.3048;
                case DIST_M:
                return value;
            }
    }
}

function getDistance(speed: number, time: number): number {
    return speed * time;
}

const TEMP_F = 0;
const TEMP_C = 1;
const TEMP_K = 2;
const DIST_FT = 0;
const DIST_M = 1;

function setTopMessage(msg: string) {
    document.getElementById("topMsg").innerHTML = `<b>${msg}</b>`;
}

var stopwatchRunning = false, interval: number, offset: number, prevTempUnit: number, apiKey = "cc133d11fd509d4d";
window.onload = () => {
    prevTempUnit = TEMP_F;
    var tempInput = document.getElementById("temperature") as HTMLInputElement;
    var goButton = document.getElementById("button") as HTMLInputElement;
    var timeInput = document.getElementById("time") as HTMLInputElement;
    var stopwatchButton = document.getElementById("stopwatch") as HTMLInputElement;
    var locationButton = document.getElementById("location") as HTMLInputElement;
    var tempUnitSelect = document.getElementById("tempUnit") as HTMLSelectElement;
    tempUnitSelect.onchange =
        (e) => {
            var newUnit = Number(tempUnitSelect.value);
            tempInput.value = String(convertTemperature(prevTempUnit, newUnit, Number(tempInput.value)).toFixed(2));
            prevTempUnit = newUnit;
        };
    locationButton.onclick = () => {
        if (navigator.geolocation) {
            setTopMessage("Fetching current location...  You may be asked for permission.");
            navigator.geolocation.getCurrentPosition((p) => {
                setTopMessage("Fetching current weather conditions...");
                var settings = {
                    success(d, s, jq) {
                        setTopMessage("Current weather conditions fetched successfully!");
                        var tempC = Number(d.current_observation.temp_c);
                        tempInput.value = String(convertTemperature(TEMP_C, Number(tempUnitSelect.value), tempC));
                    },
                    error(jq, s, e) {
                        setTopMessage(`Current weather conditions could not be fetched:\n${e} (${s})`);
                    }
                };
                jQuery.ajax(`https://api.wunderground.com/api/${apiKey}/conditions/q/${p.coords.latitude},${p.coords.longitude}.json`, settings);
            }, (e) => {
                setTopMessage(`Could not fetch current location:\n${e.message}`);
            });
        }
    };
    stopwatchButton.onclick = () => {
        if (stopwatchRunning) { // stop it
            stopwatchButton.value = "Stopwatch";
            clearInterval(interval);
        } else { // start it
            stopwatchButton.value = "Stop";
            offset = Date.now();
            timeInput.value = "0";
            interval = setInterval(() => {
                var now = Date.now(),
                    delta = now - offset;
                timeInput.value = String(((Number(timeInput.value) + delta) / 1000).toFixed(2));
            });
        }
        stopwatchRunning = !stopwatchRunning;
    };
    goButton.onclick = () => {
        var tempUnit = Number(tempUnitSelect.value);
        var distUnit = Number((document.getElementById("distUnit") as HTMLSelectElement).value);
        var tempCelsius = convertTemperature(tempUnit, TEMP_C, Number(tempInput.value));
        var distanceMeters = getDistance(getSpeedOfSound(tempCelsius), Number(timeInput.value));
        var distanceConverted = convertDistance(DIST_M, distUnit, distanceMeters);
        var finalAnswer: number, finalUnit: string;
        if (distUnit === DIST_FT) {
            finalAnswer = distanceConverted >= 1056 ? distanceConverted / 5280 : distanceConverted;
            finalUnit = distanceConverted >= 1056 ? "miles" : "feet";
        } else {
            finalAnswer = distanceConverted >= 500 ? distanceConverted / 1000 : distanceConverted;
            finalUnit = distanceConverted >= 500 ? "kilometers" : "meters";
        }
        alert(`The lightning struck approximately ${finalAnswer.toFixed(2)} ${finalUnit} away`);
    };
};