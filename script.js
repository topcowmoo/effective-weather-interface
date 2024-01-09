const searchButton = document.querySelector(".search-btn");
const historyButtonContainer = document.querySelector(".history-btns");
const cityInput = document.querySelector(".city-input");
const currentWeatherDiv = document.querySelector(".current-weather");
const forcastCardDiv = document.querySelector(".forcast-cards");

const apiKey = "329f03f3dd53cd0515673856c8dba1af";

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