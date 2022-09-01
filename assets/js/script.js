//Todo: Add API key from Open Weather Map

var APIKEY = '60729b3ac3b4a0272d0eff20d53db5a2';
window.location.href = 'https://bslockhart.github.io/Weather-Dashboard-Outlook/?#';

//Todo: Extract Long/Lat of a city when searched. // Extracts the Longitude and Latitude of a city that the client searches up THEN execute the MAIN fetch function
var extractGeoData = async (searchedCity) => {
    try {
        //Todo: Update the URL with the searched city and include the API key
        var url = `http://api.openweathermap.org/geo/1.0/direct?q=${searchedCity}&limit=5&appid=${APIKEY}`;
        var res = await fetch(url);
        var location = await res.json();

        if (location.length == 0 || location == null || location == undefined) {
            alert('Please type a valid city');
        } else {
            //Todo: Make sure we ONLY store the valid data
            checkHistoryBtns(searchedCity);
            fetchWeather(location[0].lat, location[0].lon, location[0].name);
        }
        //Todo: If there is no network connection, execute the catch block function
    } catch (error) {
        alert('Failed to connect to API due to network issues');
    }
};

//Todo: Extract the MAIN weather data
var fetchWeather = async (lat, lon, location) => {
    var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${APIKEY}&units=imperial`;
    var res = await fetch(url);
    var weatherData = await res.json();
    extractedData(weatherData, location);
};

//Todo: Declare variables to hold required values
var extractedData = (weatherData, location) => {
    var feelsLike = weatherData.current.feels_like;
    var currentWeather = weatherData.current.temp;
    var humidity = weatherData.current.humidity;
    var windSpeed = weatherData.current.wind_speed;
    var uvIndex = weatherData.current.uvi;

    //Todo: Weather Icon display
    var extractedIcon = weatherData.current.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/wn/${extractedIcon}@2x.png`;

    //Todo: Update DOM elements using the above data
    updateEl(
        currentWeather,
        feelsLike,
        location,
        humidity,
        windSpeed,
        uvIndex,
        iconUrl
    );

    //Todo: The daily object contains the weather data for other days
    var forecastWeek = weatherData.daily;
    extractForecast(forecastWeek);
};

//Todo: Update DOM elements (textcontent) for the CURRENT DAY weather data
var updateEl = (
    currentWeather,
    feelsLike,
    location,
    humidity,
    windSpeed,
    uvIndex,
    iconUrl
) => {
    //Todo: Declare variables for HTML
    var citynameEl = document.getElementById('city-name');
    var currentWeatherEl = document.getElementById('current-weather');
    var feelslikeEl = document.getElementById('feels-like');
    var humidityEl = document.getElementById('humidity');
    var windspeedEl = document.getElementById('wind');
    var uvIndexEl = document.getElementById('uv-index');
    var weatherIconEl = document.getElementById('weather-icon');

    //Todo: Show the main data elements
    var currentTemp = document.getElementById('current-temp');
    var fiveDayForecastEl = document.getElementById('five-day-forecast');

    currentTemp.style.display = 'flex';
    resetBtn.style.display = 'unset';
    fiveDayForecastEl.style.display = 'unset';

    if (uvIndexEl <= 4) {
        uvIndexEl.style.color = 'black';
    }
    if (uvIndex >= 4) {
        uvIndexEl.style.color = 'white';
    }
    if (uvIndex <= 1) {
        uvIndexEl.style.backgroundColor = 'rgb(0, 255, 13)';
    } else if (uvIndex > 1 && uvIndex < 2) {
        uvIndexEl.style.backgroundColor = 'rgb(151, 221, 0)';
    } else if (uvIndex >= 2 && uvIndex <= 3) {
        uvIndexEl.style.backgroundColor = 'rgb(214, 221, 0)';
    } else if (uvIndex >= 3 && uvIndex <= 4) {
        uvIndexEl.style.backgroundColor = 'rgb(221, 173, 0)';
    } else if (uvIndex >= 4 && uvIndex <= 5) {
        uvIndexEl.style.backgroundColor = 'rgb(221, 136, 0)';
    } else if (uvIndex >= 5 && uvIndex <= 6) {
        uvIndexEl.style.backgroundColor = 'rgb(221, 92, 0)';
    } else if (uvIndex >= 6 && uvIndex <= 7) {
        uvIndexEl.style.backgroundColor = 'rgb(221, 0, 0)';
    } else if (uvIndex >= 7 && uvIndex <= 8) {
        uvIndexEl.style.backgroundColor = 'rgb(221, 0, 136)';
    } else if (uvIndex >= 8 && uvIndex <= 9) {
        uvIndexEl.style.backgroundColor = 'rgb(221, 0, 192)';
    } else if (uvIndex >= 9) {
        uvIndexEl.style.backgroundColor = 'rgb(199, 0, 221)';
    }

    //Todo: Variable to hold the current date "MM/DD/YYYY"
    var date = moment().format('(L)');

    //Todo: Apply extracted data to the appropriate elements
    citynameEl.textContent = `${location} ${date}`;
    currentWeatherEl.textContent = `${currentWeather}°F`;
    feelslikeEl.textContent = `${feelsLike}°F`;
    windspeedEl.textContent = `${windSpeed}mph`;
    humidityEl.textContent = `${humidity}%`;
    uvIndexEl.textContent = uvIndex;
    weatherIconEl.src = iconUrl;
    weatherIconEl.style.height = '40px';
    weatherIconEl.style.width = '40px';
    weatherIconEl.style.display = 'flex';
};

//Todo: Update DOM elements for the 5 DAY FORECAST data
var extractForecast = (weekData) => {
    //Todo: For Loop
    for (let i = 0; i < weekData.length; i++) {
        if (i !== 0) {
            var new_date = moment(moment(), 'L').add(i, 'days').format('L');
            var weatherEl = document.getElementById(`day${i}-weather`);
            var windEl = document.getElementById(`day${i}-wind`);
            var humidityEl = document.getElementById(`day${i}-humidity`);
            var dateEl = document.getElementById(`forecast-date${i}`);
            var weatherIconEl = document.getElementById(`weather-icon-day${i}`);

            //Todo: New date for each day
            dateEl.textContent = new_date;

            var extractedIcon = weekData[i].weather[0].icon;
            var iconUrl = `http://openweathermap.org/img/wn/${extractedIcon}@2x.png`;
            weatherIconEl.src = iconUrl;
            weatherIconEl.style.display = 'flex';
            weatherIconEl.style.height = '40px';
            weatherIconEl.style.width = '40px';

            //Todo: Add weather, wind, and humidity to the appropriate elements
            weatherEl.textContent = `${weekData[i].temp.max}/${weekData[i].temp.min}°F`;
            windEl.textContent = `${weekData[i].wind_speed}mph`;
            humidityEl.textContent = `${weekData[i].humidity}%`;
        }

        //Todo: Break the for loop at 5 iterations
        if (i == 5) {
            break;
        }
    }
};

//Todo: Reset button clears everything
var resetData = () => {
    location.reload();
};
var resetBtn = document.getElementById('reset');
resetBtn.addEventListener('click', resetData);

//Todo: History button clears the storage and reloads the application
var clearHistory = () => {
    localStorage.clear();
    location.reload();
};

var clearHistoryBtn = document.getElementById('clear-history');
clearHistoryBtn.addEventListener('click', clearHistory);
var historyContainer = document.getElementById('history-searches');
var localObject = localStorage.getItem('searchTerms');

if (localObject == null) {
    var searchHistory = [];
} else {

    //Todo: Parse the local data and update the above empty object with the data from local
    localObject = JSON.parse(localObject);
    searchHistory = localObject;
    searchHistory.forEach((item) => {
        var btn = document.createElement('button');
        btn.classList.add('search-btn');
        btn.textContent = item.searchTerm;
        btn.type = 'button';
        historyContainer.appendChild(btn);
    });
    clearHistoryBtn.style.display = 'unset';
}

//Todo: Function to check the buttons and ONLY generate the unique history buttons
var checkHistoryBtns = (label) => {
    var uniqueButton = true;

    var finalLabel = label[0].toUpperCase() + label.substring(1);

    //Todo: If the object length is 0
    if (searchHistory.length == 0) {
        clearHistoryBtn.style.display = 'unset';
        createButtons(finalLabel);
        storeLocally(searchHistory, finalLabel);
        uniqueButton = false;
        historyBtnEvent();
    } else {
        searchHistory.forEach((item) => {
            if (item.searchTerm == finalLabel) {
                uniqueButton = false;
            }
        });
    }

    if (uniqueButton) {
        createButtons(finalLabel);
        storeLocally(searchHistory, finalLabel);
        historyBtnEvent();
    }
};

//Todo: History search buttons
var createButtons = (finalLabel) => {
    var btn = document.createElement('button');
    btn.classList.add('search-btn');
    btn.textContent = finalLabel;
    btn.type = 'button';
    historyContainer.appendChild(btn);
};

//Todo: Stores object to local storage
var storeLocally = (object, label) => {
    var id = Math.floor(Math.random() * 10000);
    searchHistory.push({ searchTerm: label, id });
    localStorage.setItem('searchTerms', JSON.stringify(object));
};

//Todo: Event listener for active history buttons
const historyBtnEvent = () => {
    var historyBtns = document.getElementById('history-searches');
    Array.prototype.forEach.call(historyBtns.children, (child) => {
        child.addEventListener('click', () => {
            extractGeoData(child.innerText.toLowerCase());
        });
    });
};

historyBtnEvent();

//Todo: Convert ALL appropriate metrics
var switchMetric = () => {
    var currentWeatherEl = document.getElementById('current-weather');
    var feelslikeEl = document.getElementById('feels-like');
    var windspeedEl = document.getElementById('wind');

    if (windspeedEl.textContent.includes('mph')) {
        var activeWind = windspeedEl.innerText.split('mph')[0];
        var newWind = activeWind * 1.609344;
        windspeedEl.textContent = `${newWind.toFixed(2)}kmh`;
    } else {
        var activeWind = windspeedEl.innerText.split('kmh')[0];
        var newWind = activeWind / 1.609344;
        windspeedEl.textContent = `${newWind.toFixed(2)}mph`;
    }

    //Todo: Temperature Conversions
    if (
        currentWeatherEl.textContent.includes('°F') &&
        feelslikeEl.textContent.includes('°F')
    ) {
        var feelslikeCurrent = feelslikeEl.innerText.split('°F')[0];
        var newFeelsLike = ((feelslikeCurrent - 32) * 5) / 9;
        feelslikeEl.textContent = `${newFeelsLike.toFixed(2)}°C`;

        var activeCurrentWeather = currentWeatherEl.innerText.split('°F')[0];
        var newCurrentWeather = ((activeCurrentWeather - 32) * 5) / 9;
        currentWeatherEl.textContent = `${newCurrentWeather.toFixed(2)}°C`;
    } else {
        var feelslikeCurrent = feelslikeEl.innerText.split('°C')[0];
        var newFeelsLike = (feelslikeCurrent * 9) / 5 + 32;
        feelslikeEl.textContent = `${newFeelsLike.toFixed(2)}°F`;

        var activeCurrentWeather = currentWeatherEl.innerText.split('°C')[0];
        var newCurrentWeather = (activeCurrentWeather * 9) / 5 + 32;
        currentWeatherEl.textContent = `${newCurrentWeather.toFixed(2)}°F`;
    }

    var forecastWeatherEl = document.querySelectorAll('.forecast-temp');
    for (let i = 0; i < forecastWeatherEl.length; i++) {
        if (forecastWeatherEl[i].textContent.includes('°F')) {
            var currentForecastTemp = forecastWeatherEl[i].innerText.split('°F')[0];
            var currentTemp1 = currentForecastTemp.split('/')[0];
            var currentTemp2 = currentForecastTemp.split('/')[1];
            var newTemp1 = ((currentTemp1 - 32) * 5) / 9;
            var newTemp2 = ((currentTemp2 - 32) * 5) / 9;
            forecastWeatherEl[i].textContent = `${newTemp1.toFixed(
                2
            )}/${newTemp2.toFixed(2)}°C`;
        } else {
            var currentForecastTemp = forecastWeatherEl[i].innerText.split('°C')[0];
            var currentTemp1 = currentForecastTemp.split('/')[0];
            var currentTemp2 = currentForecastTemp.split('/')[1];
            var newTemp1 = (currentTemp1 * 9) / 5 + 32;
            var newTemp2 = (currentTemp2 * 9) / 5 + 32;
            forecastWeatherEl[i].textContent = `${newTemp1.toFixed(
                2
            )}/${newTemp2.toFixed(2)}°F`;
        }
    }

    var forecastWindEl = document.querySelectorAll('.forecast-wind');
    for (let i = 0; i < forecastWindEl.length; i++) {
        if (forecastWindEl[i].textContent.includes('mph')) {
            var currentForecastWind = forecastWindEl[i].innerText.split('mph')[0];
            var newForecastWind = currentForecastWind * 1.609344;
            forecastWindEl[i].textContent = `${newForecastWind.toFixed(2)}kmh`;
        } else {
            var currentForecastWind = forecastWindEl[i].innerText.split('kmh')[0];
            var newForecastWind = currentForecastWind / 1.609344;
            forecastWindEl[i].textContent = `${newForecastWind.toFixed(2)}mph`;
        }
    }
};

var metricBtn = document.getElementById('switch-metric');
metricBtn.addEventListener('click', switchMetric);

//Todo: Variables that hold the form and input field elements
var inputEl = document.getElementById('enter-city');
var formEl = document.getElementById('main-form');

formEl.addEventListener('submit', (e) => {
    e.preventDefault;
    if (inputEl.value) {
        extractGeoData(inputEl.value.toLowerCase());
    } else {
        alert('Please enter a city');
    }

    inputEl.value = '';
});