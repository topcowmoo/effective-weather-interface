// Activating HTML elements
const searchButton = document.querySelector(".search-btn");
const historyButtonContainer = document.querySelector(".history-btns");
const cityInput = document.querySelector(".city-input");
const currentWeatherDiv = document.querySelector(".current-weather");
const forcastCardDiv = document.querySelector(".forcast-cards");
const apiKey = "329f03f3dd53cd0515673856c8dba1af";

// Function to print current weather to page
function printCurrentWeatherCard(cityName, weatherData) {
    const date = new Date(weatherData.dt * 1000);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);

    currentWeatherDiv.innerHTML =
        `<div class="results">
            <img src=" https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png">
            <h2> ${cityName} (${formattedDate})</h2>
            <h3>Temp: ${weatherData.main.temp.toFixed(0)} °C</h3>
            <h3>Wind: ${weatherData.wind.speed} km/h</h3>
            <h3>Humidity: ${weatherData.main.humidity} %</h3>
        </div>`;
}

// Function to get current weather data for API
function getCurrentWeatherData(name, lon, lat) {
    const currentWeatherDataApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherDataApiUrl)
        .then(res => res.json())
        .then(currentData => {
            console.log("current day weather data", currentData);
            printCurrentWeatherCard(name, currentData);
            addToHistory(name); // Add to history after displaying results
        })
        .catch((error) => {
            console.error("failed to fetch current weather data", error);
        });
}

// Function to add history search list to local storage
function addToHistory(cityName) {
    const historyList = document.querySelector(".history-btns");
    let history = loadFromLocalStorage();

    // Check if the city is already in the history
    const existingCities = history.map(entry => entry.trim());

    if (!existingCities.includes(cityName)) {
        const listItem = document.createElement('li');
        listItem.textContent = cityName;

        listItem.addEventListener('click', function () {
            // When history item is clicked, set the search input to that term
            cityInput.value = cityName;
            setTimeout(() => {
                cityCoordinates();
            }, 0);
        });

        historyList.appendChild(listItem);

        // Save only unique cities and the latest search to local storage
        history = [cityName, ...history.filter(entry => entry !== cityName)];
        saveToLocalStorage(history);
    }
}

// Load history from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.querySelector(".history-btns");
    const history = loadFromLocalStorage();

    // Clear existing history list
    historyList.innerHTML = '';

    history.forEach(cityName => {
        const listItem = document.createElement('li');
        listItem.textContent = cityName;

        listItem.addEventListener('click', function () {
            cityInput.value = cityName;
            setTimeout(() => {
                cityCoordinates();
            }, 0);
        });

        historyList.appendChild(listItem);
    });

    // Event listener for the click of the search button to call the city coordinate function
    searchButton.onclick = () => {
        cityCoordinates();
    };

    // Call the function to load the last searched city weather
    loadLastSearchedCityWeather();
});

const forecastList = document.getElementById("forecastList");

// Function to print five day forecast data to page
function printfiveDayForecast(cityName, dailyForecasts) {
    if (!forecastList) {
        console.error("Forecast list element not found");
        return;
    }

    forecastList.innerHTML = '';
    if (Array.isArray(dailyForecasts)) {
        dailyForecasts.forEach(entry => {
            const date = new Date(entry.dt * 1000);
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
            });

            const listItem = document.createElement('li');
            listItem.className = 'cards';
            listItem.innerHTML =
                `<div>
                    <h3>${formattedDate}</h3>
                    <img class="icon" src="https://openweathermap.org/img/wn/${entry.weather[0].icon}.png" alt="${entry.weather[0].description}">
                    <h3>Temp: ${entry.main.temp.toFixed(0)} °C</h3>
                    <h3>Wind: ${entry.wind.speed} km/h</h3>
                    <h3>Humidity: ${entry.main.humidity} %</h3>
                </div>`;

            forecastList.appendChild(listItem);
        });
    } else {
        console.error("Invalid daily forecast data format");
    }
}

// Function to obtain five day forecast data
function getFiveDayForecast(name, lon, lat) {
    const fiveDayForecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(fiveDayForecastApiUrl)
        .then(res => res.json())
        .then(forecastData => {
            console.log("5-day forecast data:", forecastData);

            if (forecastData.list && forecastData.list.length > 0) {
                const dailyForecasts = forecastData.list.filter(entry => entry.dt_txt.includes('12:00:00'));

                if (dailyForecasts.length > 0) {
                    console.log("Filtered 5-day forecast data:", dailyForecasts);
                    printfiveDayForecast(name, dailyForecasts);
                } else {
                    console.error("No daily forecasts available for the next 5 days");
                }
            } else {
                console.error("No forecast data available");
            }
        })
        .catch((error) => {
            console.error("Failed to fetch five-day forecast", error);
        });
}

// Function to create cityCoordinates
function cityCoordinates() {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const geoCodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},&appid=${apiKey}&limit=1`;

    fetch(geoCodingApiUrl)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const { name, lon, lat } = data[0];
            getCurrentWeatherData(name, lon, lat);
            getFiveDayForecast(name, lon, lat);
            addToHistory(name);
        })
        .catch((error) => {
            console.error("failed to fetch coordinates", error);
        })
        .finally(() => {
            cityInput.value = ''; // Only clear input if it was not set by clicking history
        });

}
// Function to clear search history
function clearHistory() {
    const historyList = document.querySelector(".history-btns");
    historyList.innerHTML = '';
}

// Function to save search history to local storage
function saveToLocalStorage(history) {
    localStorage.setItem('weatherHistory', JSON.stringify(history));
}

// Function to load search history from local storage
function loadFromLocalStorage() {
    const storedHistory = localStorage.getItem('weatherHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
}

// Function to load last searched city weather
function loadLastSearchedCityWeather() {
    const lastSearchedCity = loadFromLocalStorage()[0];
    if (lastSearchedCity) {
        cityInput.value = lastSearchedCity;
        cityCoordinates();
    }
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', () => {
    loadLastSearchedCityWeather();
});

// Call cityCoordinates function
function search() {
    cityCoordinates();
}
