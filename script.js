const searchButton = document.querySelector(".search-btn");
const historyButtonContainer = document.querySelector(".history-btns");
const cityInput = document.querySelector(".city-input");
const currentWeatherDiv = document.querySelector(".current-weather");
const forcastCardDiv = document.querySelector(".forcast-cards");

const apiKey = "329f03f3dd53cd0515673856c8dba1af";

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

function search() {
    cityCoordinates();
}