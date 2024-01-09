const searchButton = document.querySelector(".search-btn");
const historyButtonContainer = document.querySelector(".history-btns");
const cityInput = document.querySelector(".city-input");
const currentWeatherDiv = document.querySelector(".current-weather");
const forcastCardDiv = document.querySelector(".forcast-cards");

const apiKey = "329f03f3dd53cd0515673856c8dba1af";

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

function cityCoordinates() {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    const geoCodingApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},&appid=${apiKey}&limit=1`;

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

// Event listener for the click of the search button to call the city coordinate function
if (!searchButton.onclick) {
    searchButton.onclick = () => {
        cityCoordinates();
    };
}

function search() {
    cityCoordinates();
}