
const city = document.getElementById('city-input');
const search = document.getElementById('search-btn');

// Recent Searches
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

// Search Button
search.addEventListener('click', function () {
    const cityName = city.value.trim();

    if (cityName === "") {
        alert("Please enter a city name");
        return;
    }

    getWeather(cityName);
});

// Main Weather Function
async function getWeather(cityName) {

    const errorMessage = document.getElementById('error-message');
    const loading = document.getElementById('loading');

    try {

        // API Key
        const apiKey = "cf93e4614bcb4d3d0d393ba441efd460";

        loading.style.display = 'block';
        errorMessage.style.display = 'none';

        // Current Weather API
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found or API request failed");
        }

        const data = await response.json();

        // Save Recent Search
        if (!recentCities.includes(data.name)) {
            recentCities.push(data.name);

            // Keep only last 10 cities
            recentCities = recentCities.slice(-10);

            localStorage.setItem(
                "recentCities",
                JSON.stringify(recentCities)
            );
        }

        displayRecentSearches();

        // Current Weather Display
        document.getElementById('city-name').textContent = data.name;

        document.getElementById('temperature').textContent =
            `${Math.round(data.main.temp)} °C`;

        document.getElementById('humidity').textContent =
            `${data.main.humidity}%`;

        document.getElementById('wind-speed').textContent =
            `${data.wind.speed} m/s`;

        document.getElementById('feels-like').textContent =
            `${Math.round(data.main.feels_like)} °C`;

        document.getElementById('weather-description').textContent =
            data.weather[0].description;

        document.getElementById('weather-icon').src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // Forecast API
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric`;

        const forecastResponse = await fetch(forecastUrl);

        if (!forecastResponse.ok) {
            throw new Error("Forecast data not found");
        }

        const forecastData = await forecastResponse.json();

        // Select 5 Unique Dates
        const dates = new Set();

        for (const item of forecastData.list) {

            const date = item.dt_txt.split(" ")[0];

            dates.add(date);

            if (dates.size === 5) {
                break;
            }
        }

        const forecastDates = Array.from(dates);

        // Forecast Container
        const forecastContainer =
            document.getElementById("forecast-container");

        forecastContainer.innerHTML = "";

        // Create Forecast Cards
        for (const selectedDate of forecastDates) {

            const item = forecastData.list.find(forecast => {
                return forecast.dt_txt.startsWith(selectedDate);
            });

            if (!item) continue;

            // Card
            const card = document.createElement("div");
            card.classList.add("forecast-card");

            // Date
            const dateText = document.createElement("p");
            dateText.textContent = selectedDate;

            // Weather Icon
            const weatherImg = document.createElement("img");

            weatherImg.src =
                `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

            weatherImg.alt = item.weather[0].description;
            weatherImg.style.width = "60px";

            // Temperature
            const temperatureText = document.createElement("h3");

            temperatureText.textContent =
                `${Math.round(item.main.temp)}°C`;

            // Description
            const description = document.createElement("p");

            description.textContent =
                item.weather[0].description;

            // Add Elements to Card
            card.appendChild(dateText);
            card.appendChild(weatherImg);
            card.appendChild(temperatureText);
            card.appendChild(description);

            // Add Card to Container
            forecastContainer.appendChild(card);
        }

        console.log("Current Weather:", data);
        console.log("Forecast Data:", forecastData);

    } catch (error) {

        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';

        console.log("Error:", error.message);

    } finally {

        loading.style.display = 'none';
    }
}


// Recent Searches Function
function displayRecentSearches() {

    const recentSearches =
        document.getElementById('recent-searches');

    recentSearches.innerHTML = "";

    recentCities.forEach(function (city) {

        const cityItem = document.createElement('ul');

        cityItem.textContent = city;

        cityItem.addEventListener('click', function () {
            getWeather(city);
        });

        recentSearches.appendChild(cityItem);

    });
}

// Load Recent Searches
displayRecentSearches();


// Dark Mode
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', function () {

    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

});

// Load Saved Theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
} else {
    document.body.classList.remove("dark-mode");
}


// Date Display
const dateElement = document.getElementById('date');

const today = new Date();

const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

dateElement.textContent =
    today.toLocaleDateString('en-US', options);
